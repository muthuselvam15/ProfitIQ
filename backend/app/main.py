import os
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.analytics import calculate_business_pulse, detect_profit_leaks, generate_30day_forecast, simulate_scenario
from app.ai_copilot import execute_copilot_query
from app.models import Business, Customer, Product, Sale
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
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
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
def post_ai_copilot(req: CopilotQueryRequest):
    return execute_copilot_query(req.query, req.tier)


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
