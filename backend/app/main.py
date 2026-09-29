import csv
import hashlib
import hmac
import json
import os
from datetime import date, datetime
from io import BytesIO
from pathlib import Path
from typing import Literal, Optional

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import razorpay
from fastapi import FastAPI, HTTPException, Depends, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session
from matplotlib.ticker import FuncFormatter
from fastapi.responses import StreamingResponse

from app.analytics import calculate_business_pulse, detect_profit_leaks, generate_30day_forecast, simulate_scenario
from app.ai_copilot import execute_copilot_query
from app.models import Business, Customer, Expense, Invoice, Product, Sale
from app.schemas import (
    CustomerCreate,
    CustomerResponse,
    CustomerUpdate,
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    SaleCreate,
    SaleResponse,
    SaleUpdate,
)
from database import Base, SessionLocal, engine, get_db

Base.metadata.create_all(bind=engine)

with engine.begin() as connection:
    connection.execute(text("ALTER TABLE businesses ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR NOT NULL DEFAULT 'FREE'"))
    connection.execute(text("ALTER TABLE businesses ADD COLUMN IF NOT EXISTS razorpay_subscription_id VARCHAR"))
    connection.execute(text("ALTER TABLE businesses ADD COLUMN IF NOT EXISTS subscription_status VARCHAR NOT NULL DEFAULT 'inactive'"))
    connection.execute(text("ALTER TABLE sales ADD COLUMN IF NOT EXISTS invoice_number VARCHAR"))
    connection.execute(text("ALTER TABLE sales ADD COLUMN IF NOT EXISTS items_json JSON NOT NULL DEFAULT '[]'"))


def ensure_default_business() -> None:
    db = SessionLocal()
    try:
        exists = db.query(Business).filter(Business.id == "default-business").first()
        if not exists:
            db.add(Business(
                id="default-business",
                name="Default Business",
                industry="General",
                currency="₹",
                location="Local"
            ))
            db.commit()
    finally:
        db.close()


ensure_default_business()

app = FastAPI(
    title="ProfitIQ API",
    description="AI-Powered Small Business Intelligence Assistant Backend",
    version="1.0.0"
)

allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://profit-iq-blue.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CopilotQueryRequest(BaseModel):
    query: str
    tier: Optional[str] = "PRO"


class ScenarioRequest(BaseModel):
    base_revenue: float = 482500.0
    base_costs: float = 362000.0
    price_change_pct: float = 0.0
    expense_reduction_pct: float = 0.0
    supplier_cost_pct: float = 0.0


class SubscriptionCheckoutRequest(BaseModel):
    tier: Literal["PRO", "PREMIUM"]


class SubscriptionVerificationRequest(BaseModel):
    tier: Literal["PRO", "PREMIUM"]
    razorpay_payment_id: str
    razorpay_subscription_id: str
    razorpay_signature: str


SUBSCRIPTION_PLAN_IDS = {
    "PRO": "RAZORPAY_PRO_PLAN_ID",
    "PREMIUM": "RAZORPAY_PREMIUM_PLAN_ID",
}
SUBSCRIPTION_AMOUNTS = {"PRO": 39900, "PREMIUM": 79900}
SUBSCRIPTION_CYCLES = 12


def get_razorpay_client():
    key_id = os.getenv("RAZORPAY_KEY_ID")
    key_secret = os.getenv("RAZORPAY_KEY_SECRET")
    if not key_id or not key_secret:
        raise HTTPException(status_code=503, detail="Razorpay is not configured")
    return razorpay.Client(auth=(key_id, key_secret)), key_id, key_secret


@app.get("/")
def root():
    return {
        "product": "ProfitIQ",
        "tagline": "Know Your Business. Predict Your Next Move.",
        "status": "online"
    }


@app.get("/api/analytics/business-pulse")
def get_business_pulse():
    return calculate_business_pulse(None, None, None, None)


@app.get("/api/analytics/profit-leaks")
def get_profit_leaks():
    return detect_profit_leaks(None, None, None)


@app.get("/api/analytics/forecast")
def get_sales_forecast():
    return generate_30day_forecast(None)


@app.get("/api/analytics/monthly-item-sales.png")
def get_monthly_item_sales_chart(
    db: Session = Depends(get_db),
    months: int = Query(default=12, ge=1, le=48),
    metric: Literal["revenue", "units"] = Query(default="revenue"),
    source: Literal["supermart", "business"] = Query(default="supermart"),
):
    records: list[tuple[date, str, float, float]] = []
    if source == "supermart":
        if metric == "units":
            raise HTTPException(status_code=400, detail="The Supermart dataset does not include unit quantities")
        dataset_path = Path(__file__).resolve().parent.parent / "data" / "Supermart Grocery Sales - Retail Analytics Dataset.csv"
        if not dataset_path.is_file():
            raise HTTPException(status_code=503, detail="Supermart sales dataset is not installed")
        with dataset_path.open(encoding="utf-8-sig", newline="") as dataset_file:
            for row in csv.DictReader(dataset_file):
                raw_date = row.get("Order Date", "").strip()
                parsed_date = None
                for date_format in ("%d-%m-%Y", "%m/%d/%Y"):
                    try:
                        parsed_date = datetime.strptime(raw_date, date_format).date()
                        break
                    except ValueError:
                        continue
                if parsed_date is None:
                    continue
                records.append((
                    parsed_date,
                    row.get("Sub Category", "Unspecified item").strip() or "Unspecified item",
                    float(row.get("Sales", "0").replace(",", "")),
                    0.0,
                ))
        if not records:
            raise HTTPException(status_code=503, detail="Supermart sales dataset contains no valid order rows")
        last_month = max(record[0] for record in records).replace(day=1)
    else:
        current_month = date.today().replace(day=1)
        sales = (
            db.query(Sale)
            .filter(Sale.business_id == "default-business", Sale.created_at >= datetime.min)
            .all()
        )
        for sale in sales:
            for item in sale.items_json or []:
                if not isinstance(item, dict):
                    continue
                quantity = float(item.get("quantity") or 0)
                item_name = str(item.get("productName") or item.get("product_name") or "Unspecified item")
                revenue = float(item.get("total") or (quantity * float(item.get("unitPrice") or 0)))
                records.append((sale.created_at.date(), item_name, revenue, quantity))
        last_month = current_month

    start_index = last_month.year * 12 + last_month.month - 1 - months + 1
    start_year, start_month_index = divmod(start_index, 12)
    first_month = date(start_year, start_month_index + 1, 1)

    month_labels = []
    for offset in range(months):
        month_index = start_index + offset
        year, month_index = divmod(month_index, 12)
        month_labels.append(date(year, month_index + 1, 1).strftime("%b %Y"))

    item_totals: dict[str, list[float]] = {}
    for record_date, item_name, revenue, quantity in records:
        month_offset = (record_date.year - first_month.year) * 12 + record_date.month - first_month.month
        if not 0 <= month_offset < months:
            continue
        value = quantity if metric == "units" else revenue
        item_totals.setdefault(item_name, [0.0] * months)[month_offset] += value

    figure, axis = plt.subplots(figsize=(10, 4.5), dpi=140)
    figure.patch.set_facecolor("#0f172a")
    axis.set_facecolor("#0f172a")
    colors = ["#38bdf8", "#34d399", "#fbbf24", "#fb7185", "#a78bfa", "#22d3ee", "#f472b6"]

    if item_totals:
        totals = sorted(item_totals.items(), key=lambda entry: sum(entry[1]), reverse=True)
        visible_items = totals[:6]
        if len(totals) > 6:
            other_values = [sum(values[index] for _, values in totals[6:]) for index in range(months)]
            visible_items.append(("Other items", other_values))
        for index, (item_name, values) in enumerate(visible_items):
            axis.plot(month_labels, values, marker="o", linewidth=2.2, markersize=4, color=colors[index % len(colors)], label=item_name)
        axis.legend(loc="upper left", bbox_to_anchor=(1.01, 1), frameon=False, labelcolor="#e2e8f0", fontsize=8)
        axis.set_ylabel("Units sold" if metric == "units" else "Sales revenue", color="#cbd5e1", fontsize=9)
        if metric == "revenue":
            axis.yaxis.set_major_formatter(FuncFormatter(lambda value, _: f"₹{value:,.0f}"))
    else:
        axis.text(0.5, 0.5, "No itemized sales recorded for this period", ha="center", va="center", color="#94a3b8", fontsize=11, transform=axis.transAxes)
        axis.set_yticks([])

    chart_title = "Supermart Grocery Sales" if source == "supermart" else "Live Business Item Sales"
    axis.set_title(chart_title, loc="left", color="#f8fafc", fontsize=14, fontweight="bold", pad=16)
    axis.set_xticks(range(months), month_labels, rotation=35, ha="right", color="#94a3b8", fontsize=7 if months > 24 else 8)
    axis.tick_params(axis="y", colors="#94a3b8", labelsize=8)
    axis.grid(axis="y", color="#334155", alpha=0.55, linewidth=0.8)
    axis.spines["top"].set_visible(False)
    axis.spines["right"].set_visible(False)
    axis.spines["left"].set_color("#334155")
    axis.spines["bottom"].set_color("#334155")
    figure.tight_layout()

    image = BytesIO()
    figure.savefig(image, format="png", bbox_inches="tight", facecolor=figure.get_facecolor())
    plt.close(figure)
    image.seek(0)
    return StreamingResponse(image, media_type="image/png", headers={"Cache-Control": "no-store"})


@app.post("/api/analytics/simulate")
def post_scenario_simulate(req: ScenarioRequest):
    return simulate_scenario(
        req.base_revenue,
        req.base_costs,
        req.price_change_pct,
        req.expense_reduction_pct,
        req.supplier_cost_pct
    )


@app.post("/api/ai/copilot")
def post_ai_copilot(req: CopilotQueryRequest, db: Session = Depends(get_db)):
    business_id = "default-business"
    business = db.query(Business).filter(Business.id == business_id).first()
    tier = business.subscription_tier if business else "FREE"
    business_data = {
        "products": [
            {"name": item.name, "stock_quantity": item.stock_quantity, "minimum_stock": item.minimum_stock}
            for item in db.query(Product).filter(Product.business_id == business_id).all()
        ],
        "sales": [
            {"customer_name": item.customer_name, "total_amount": item.total_amount, "margin_amount": item.margin_amount}
            for item in db.query(Sale).filter(Sale.business_id == business_id).all()
        ],
        "customers": [
            {"name": item.name, "segment": item.segment, "outstanding_balance": item.outstanding_balance}
            for item in db.query(Customer).filter(Customer.business_id == business_id).all()
        ],
        "expenses": [
            {"category": item.category, "amount": item.amount}
            for item in db.query(Expense).filter(Expense.business_id == business_id).all()
        ],
        "invoices": [
            {"status": item.status, "amount": item.amount, "tax_amount": item.tax_amount or 0}
            for item in db.query(Invoice).filter(Invoice.business_id == business_id).all()
        ],
    }
    return execute_copilot_query(req.query, tier, business_data)


@app.get("/api/subscription")
def get_subscription(db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == "default-business").first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    return {
        "tier": business.subscription_tier,
        "status": business.subscription_status,
        "cancel_scheduled": business.subscription_status == "cancel_scheduled",
    }


@app.post("/api/subscription/checkout")
def create_subscription_checkout(payload: SubscriptionCheckoutRequest, db: Session = Depends(get_db)):
    client, key_id, _ = get_razorpay_client()
    plan_id = os.getenv(SUBSCRIPTION_PLAN_IDS[payload.tier])
    if not plan_id:
        raise HTTPException(status_code=503, detail=f"Razorpay {payload.tier} plan is not configured")

    business = db.query(Business).filter(Business.id == "default-business").first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    if business.subscription_status in {"active", "authenticated", "cancel_scheduled"}:
        raise HTTPException(status_code=409, detail="A paid subscription is already active")
    if business.razorpay_subscription_id and business.subscription_status == "created":
        try:
            client.subscription.cancel(business.razorpay_subscription_id, {"cancel_at_cycle_end": 0})
        except Exception as error:
            raise HTTPException(status_code=502, detail="Could not clear the previous Razorpay checkout") from error

    try:
        plan = client.plan.fetch(plan_id)
    except Exception as error:
        raise HTTPException(status_code=502, detail="Could not validate the configured Razorpay plan") from error

    item = plan.get("item", {})
    if (
        item.get("amount") != SUBSCRIPTION_AMOUNTS[payload.tier]
        or item.get("currency") != "INR"
        or plan.get("period") != "monthly"
        or plan.get("interval") != 1
    ):
        raise HTTPException(status_code=503, detail="Razorpay plan amount or billing period does not match pricing")

    try:
        subscription = client.subscription.create({
            "plan_id": plan_id,
            "total_count": SUBSCRIPTION_CYCLES,
            "customer_notify": 1,
            "notes": {"business_id": business.id, "tier": payload.tier},
        })
    except Exception as error:
        raise HTTPException(status_code=502, detail="Could not create Razorpay subscription") from error

    business.razorpay_subscription_id = subscription["id"]
    business.subscription_status = "created"
    db.commit()
    return {
        "key_id": key_id,
        "subscription_id": subscription["id"],
        "amount": SUBSCRIPTION_AMOUNTS[payload.tier],
        "currency": "INR",
        "tier": payload.tier,
        "total_count": SUBSCRIPTION_CYCLES,
    }


@app.post("/api/subscription/verify")
def verify_subscription_payment(payload: SubscriptionVerificationRequest, db: Session = Depends(get_db)):
    client, _, key_secret = get_razorpay_client()
    expected_signature = hmac.new(
        key_secret.encode(),
        f"{payload.razorpay_payment_id}|{payload.razorpay_subscription_id}".encode(),
        hashlib.sha256,
    ).hexdigest()
    if not hmac.compare_digest(expected_signature, payload.razorpay_signature):
        raise HTTPException(status_code=400, detail="Payment signature verification failed")

    try:
        subscription = client.subscription.fetch(payload.razorpay_subscription_id)
    except Exception as error:
        raise HTTPException(status_code=502, detail="Could not verify Razorpay subscription") from error

    plan_id = os.getenv(SUBSCRIPTION_PLAN_IDS[payload.tier])
    notes = subscription.get("notes", {})
    if (
        subscription.get("plan_id") != plan_id
        or notes.get("business_id") != "default-business"
        or notes.get("tier") != payload.tier
        or subscription.get("status") not in {"active", "authenticated"}
    ):
        raise HTTPException(status_code=400, detail="Razorpay subscription does not match the selected plan")

    business = db.query(Business).filter(Business.id == "default-business").first()
    if not business or business.razorpay_subscription_id != payload.razorpay_subscription_id:
        raise HTTPException(status_code=400, detail="Razorpay subscription was not created for this business")
    business.subscription_tier = payload.tier
    business.subscription_status = subscription["status"]
    db.commit()
    return {"tier": business.subscription_tier, "status": business.subscription_status}


@app.post("/api/subscription/cancel")
def cancel_subscription(db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == "default-business").first()
    if not business or not business.razorpay_subscription_id:
        raise HTTPException(status_code=404, detail="No Razorpay subscription found")
    if business.subscription_status == "cancel_scheduled":
        return {"status": business.subscription_status, "cancel_scheduled": True}

    client, _, _ = get_razorpay_client()
    cancel_at_cycle_end = business.subscription_status != "created"
    try:
        client.subscription.cancel(
            business.razorpay_subscription_id,
            {"cancel_at_cycle_end": int(cancel_at_cycle_end)},
        )
    except Exception as error:
        raise HTTPException(status_code=502, detail="Could not cancel Razorpay subscription") from error

    if cancel_at_cycle_end:
        business.subscription_status = "cancel_scheduled"
    else:
        business.subscription_status = "inactive"
        business.razorpay_subscription_id = None
    db.commit()
    return {"status": business.subscription_status, "cancel_scheduled": cancel_at_cycle_end}


@app.post("/api/subscription/webhook")
async def subscription_webhook(request: Request, db: Session = Depends(get_db)):
    webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET")
    if not webhook_secret:
        raise HTTPException(status_code=503, detail="Razorpay webhook is not configured")
    body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")
    expected_signature = hmac.new(webhook_secret.encode(), body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected_signature, signature):
        raise HTTPException(status_code=400, detail="Webhook signature verification failed")

    try:
        event = json.loads(body)
    except json.JSONDecodeError as error:
        raise HTTPException(status_code=400, detail="Invalid webhook body") from error

    subscription = event.get("payload", {}).get("subscription", {}).get("entity", {})
    subscription_id = subscription.get("id")
    business = db.query(Business).filter(Business.razorpay_subscription_id == subscription_id).first()
    if not business:
        return {"received": True}

    if event.get("event") in {"subscription.activated", "subscription.charged"}:
        tier = subscription.get("notes", {}).get("tier")
        if tier in {"PRO", "PREMIUM"}:
            business.subscription_tier = tier
            business.subscription_status = "active"
    elif event.get("event") in {"subscription.cancelled", "subscription.completed", "subscription.halted"}:
        business.subscription_tier = "FREE"
        business.subscription_status = "inactive"
        business.razorpay_subscription_id = None
    db.commit()
    return {"received": True}


@app.get("/api/products", response_model=list[ProductResponse])
def list_products(
    db: Session = Depends(get_db),
    business_id: Optional[str] = Query(default=None)
):
    query = db.query(Product)
    if business_id:
        query = query.filter(Product.business_id == business_id)
    products = query.order_by(Product.created_at.desc()).all()
    return products


@app.get("/api/products/low-stock", response_model=list[ProductResponse])
def get_low_stock_products(db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.stock_quantity <= Product.minimum_stock).order_by(Product.stock_quantity.asc()).all()
    return products


@app.get("/api/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.post("/api/products", response_model=ProductResponse, status_code=201)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@app.put("/api/products/{product_id}", response_model=ProductResponse)
def update_product(product_id: str, payload: ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(product, field, value)

    product.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(product)
    return product


@app.delete("/api/products/{product_id}", status_code=204)
def delete_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return None


@app.get("/api/sales", response_model=list[SaleResponse])
def list_sales(
    db: Session = Depends(get_db),
    business_id: Optional[str] = Query(default=None)
):
    query = db.query(Sale)
    if business_id:
        query = query.filter(Sale.business_id == business_id)
    sales = query.order_by(Sale.created_at.desc()).all()
    return sales


@app.get("/api/sales/{sale_id}", response_model=SaleResponse)
def get_sale(sale_id: str, db: Session = Depends(get_db)):
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale


@app.post("/api/sales", response_model=SaleResponse, status_code=201)
def create_sale(payload: SaleCreate, db: Session = Depends(get_db)):
    sale = Sale(
        business_id=payload.business_id,
        customer_name=payload.customer_name,
        total_amount=payload.total_amount,
        margin_amount=payload.margin_amount,
        payment_method=payload.payment_method,
        invoice_number=payload.invoice_number,
        items_json=[item.model_dump(mode='json') for item in payload.items],
    )
    db.add(sale)
    db.commit()
    db.refresh(sale)
    return sale


@app.put("/api/sales/{sale_id}", response_model=SaleResponse)
def update_sale(sale_id: str, payload: SaleUpdate, db: Session = Depends(get_db)):
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        if value is not None:
            if field == 'items':
                setattr(sale, 'items_json', [item.model_dump(mode='json') for item in value])
            else:
                setattr(sale, field, value)

    db.commit()
    db.refresh(sale)
    return sale


@app.delete("/api/sales/{sale_id}", status_code=204)
def delete_sale(sale_id: str, db: Session = Depends(get_db)):
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    db.delete(sale)
    db.commit()
    return None


@app.get("/api/customers", response_model=list[CustomerResponse])
def list_customers(
    db: Session = Depends(get_db),
    business_id: Optional[str] = Query(default=None)
):
    query = db.query(Customer)
    if business_id:
        query = query.filter(Customer.business_id == business_id)
    customers = query.order_by(Customer.name.asc()).all()
    return customers


@app.get("/api/customers/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: str, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@app.post("/api/customers", response_model=CustomerResponse, status_code=201)
def create_customer(payload: CustomerCreate, db: Session = Depends(get_db)):
    customer = Customer(**payload.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


@app.put("/api/customers/{customer_id}", response_model=CustomerResponse)
def update_customer(customer_id: str, payload: CustomerUpdate, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(customer, field, value)

    db.commit()
    db.refresh(customer)
    return customer


@app.delete("/api/customers/{customer_id}", status_code=204)
def delete_customer(customer_id: str, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    db.delete(customer)
    db.commit()
    return None
