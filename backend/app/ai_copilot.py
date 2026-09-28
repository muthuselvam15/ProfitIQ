"""Database-grounded local business insights for the ProfitIQ Copilot."""

import re
from typing import Any


def _currency(value: float) -> str:
    return f"₹{value:,.0f}"


def _response(
    intent: str,
    answer: str,
    data: dict[str, Any],
    reason: str,
    action: str,
    target: str,
) -> dict[str, Any]:
    return {
        "intent": intent,
        "tier_restricted": False,
        "answer": answer,
        "data": data,
        "reason": reason,
        "recommended_action": action,
        "action_target": target,
    }


def _percentage(query: str, label: str) -> float:
    match = re.search(rf"(\d+(?:\.\d+)?)\s*%\s*(?:\w+\s*){{0,2}}{label}", query)
    if not match:
        match = re.search(rf"{label}\D{{0,24}}(\d+(?:\.\d+)?)\s*%", query)
    return float(match.group(1)) if match else 0.0


def execute_copilot_query(
    query: str,
    tier: str = "PRO",
    business_data: dict[str, Any] | None = None,
) -> dict[str, Any]:
    normalized_query = " ".join(query.lower().split())
    data = business_data or {}
    products = data.get("products", [])
    sales = data.get("sales", [])
    customers = data.get("customers", [])
    expenses = data.get("expenses", [])
    invoices = data.get("invoices", [])

    if any(term in normalized_query for term in ("simulate", "what if", "scenario")):
        if tier == "FREE":
            return {
                "intent": "SCENARIO_SIMULATOR",
                "tier_restricted": True,
                "required_tier": "PRO",
                "answer": "Scenario simulations require ProfitIQ Pro or Premium.",
                "data": None,
                "reason": "Upgrade to use business scenario analysis.",
                "recommended_action": "Choose a paid plan to unlock scenario simulation.",
                "action_target": "subscription",
            }

        revenue = sum(float(sale.get("total_amount", 0)) for sale in sales)
        margin = sum(float(sale.get("margin_amount", 0)) for sale in sales)
        expenses_total = sum(float(expense.get("amount", 0)) for expense in expenses)
        price_change = _percentage(normalized_query, r"(?:price|pricing)")
        expense_reduction = _percentage(normalized_query, r"(?:expense|expenses|costs?)")
        baseline_costs = max(0.0, revenue - margin) + expenses_total
        projected_revenue = revenue * (1 + price_change / 100)
        projected_costs = baseline_costs * (1 - expense_reduction / 100)
        projected_profit = projected_revenue - projected_costs

        return _response(
            "SCENARIO_SIMULATION",
            "Here is an estimate based on your saved sales and expenses." if sales or expenses else "There is not enough saved sales or expense data for a useful simulation yet.",
            {
                "Recorded Sales": len(sales),
                "Baseline Revenue": _currency(revenue),
                "Recorded Expenses": _currency(expenses_total),
                "Price Change": f"{price_change:g}%",
                "Expense Reduction": f"{expense_reduction:g}%",
                "Estimated Revenue": _currency(projected_revenue),
                "Estimated Profit Before Expenses": _currency(projected_profit),
            },
            "This estimate assumes sales volume and product costs remain unchanged; it uses recorded sales margins and expenses only.",
            "Review the assumptions in the Scenario Simulator before acting on this estimate.",
            "simulator",
        )

    if any(term in normalized_query for term in ("invoice", "overdue", "unpaid", "receivable")):
        outstanding = [invoice for invoice in invoices if invoice.get("status", "").upper() in {"PENDING", "OVERDUE"}]
        amount = sum(float(invoice.get("amount", 0)) + float(invoice.get("tax_amount", 0)) for invoice in outstanding)
        answer = (
            f"You have {len(outstanding)} pending or overdue invoices totaling {_currency(amount)}."
            if outstanding else "There are no pending or overdue invoices in your saved records."
        )
        return _response(
            "INVOICE_ANALYSIS", answer,
            {"Outstanding Invoices": len(outstanding), "Outstanding Amount": _currency(amount)},
            "This summary uses invoices saved for your business.",
            "Open Invoice Manager to review invoice statuses.",
            "invoices",
        )

    if "profit" in normalized_query or "margin" in normalized_query:
        revenue = sum(float(sale.get("total_amount", 0)) for sale in sales)
        margin = sum(float(sale.get("margin_amount", 0)) for sale in sales)
        margin_pct = (margin / revenue * 100) if revenue else 0
        answer = (
            f"Your saved sales total {_currency(revenue)} with {_currency(margin)} in recorded margin."
            if sales else "No sales are recorded yet, so I can’t calculate a business profit trend."
        )
        return _response(
            "PROFIT_ANALYSIS", answer,
            {"Recorded Sales": len(sales), "Revenue": _currency(revenue), "Recorded Margin": _currency(margin), "Margin Rate": f"{margin_pct:.1f}%"},
            "The database has no period-over-period cost history, so this reports recorded sales and margin rather than inventing a reason for a trend.",
            "Review sales and expense records to compare periods.",
            "reports",
        )

    if any(term in normalized_query for term in ("restock", "inventory", "stock", "product")):
        low_stock = [product for product in products if int(product.get("stock_quantity", 0)) <= int(product.get("minimum_stock", 0))]
        low_stock.sort(key=lambda product: int(product.get("stock_quantity", 0)) - int(product.get("minimum_stock", 0)))
        product_data = {
            product.get("name", "Unnamed product"): f"{product.get('stock_quantity', 0)} in stock; minimum {product.get('minimum_stock', 0)}"
            for product in low_stock[:6]
        }
        answer = (
            f"{len(low_stock)} of your {len(products)} saved products are at or below their minimum stock level."
            if low_stock else f"None of your {len(products)} saved products are below their minimum stock level."
        )
        return _response(
            "RESTOCK_RECOMMENDATION", answer,
            product_data or {"Products Checked": len(products)},
            "The stock list is calculated from each saved product’s current quantity and minimum-stock threshold.",
            "Open inventory to review stock levels and plan replenishment.",
            "inventory",
        )

    if "customer" in normalized_query or "inactive" in normalized_query:
        inactive = [customer for customer in customers if customer.get("segment", "").lower() == "inactive"]
        outstanding = sum(float(customer.get("outstanding_balance", 0)) for customer in customers)
        return _response(
            "CUSTOMER_INSIGHTS",
            f"You have {len(customers)} saved customers, including {len(inactive)} marked inactive, with {_currency(outstanding)} in outstanding balances.",
            {"Customers": len(customers), "Inactive Customers": len(inactive), "Outstanding Balances": _currency(outstanding)},
            "Customer counts and balances come from the saved customer records; inactivity follows each record’s segment.",
            "Open Customer Radar to review customer segments and balances.",
            "customers",
        )

    if any(term in normalized_query for term in ("spend", "expense", "cost")):
        total = sum(float(expense.get("amount", 0)) for expense in expenses)
        by_category: dict[str, float] = {}
        for expense in expenses:
            category = expense.get("category", "Other")
            by_category[category] = by_category.get(category, 0) + float(expense.get("amount", 0))
        expense_data = {category: _currency(amount) for category, amount in sorted(by_category.items(), key=lambda entry: entry[1], reverse=True)[:5]}
        expense_data["Saved Expense Total"] = _currency(total)
        return _response(
            "EXPENSE_ANALYSIS",
            f"Your saved expenses total {_currency(total)} across {len(expenses)} records." if expenses else "There are no expenses saved in the database yet, so I can’t identify a spending trend.",
            expense_data,
            "This summary only includes expenses persisted for your business.",
            "Open Expense Radar to review recorded operating costs.",
            "expenses",
        )

    revenue = sum(float(sale.get("total_amount", 0)) for sale in sales)
    margin = sum(float(sale.get("margin_amount", 0)) for sale in sales)
    low_stock_count = sum(
        int(product.get("stock_quantity", 0)) <= int(product.get("minimum_stock", 0))
        for product in products
    )
    return _response(
        "GENERAL_SUMMARY",
        f"Your records contain {len(sales)} sales totaling {_currency(revenue)} and {len(customers)} customers.",
        {
            "Saved Products": len(products),
            "Low-Stock Products": low_stock_count,
            "Recorded Sales": len(sales),
            "Recorded Revenue": _currency(revenue),
            "Recorded Margin": _currency(margin),
            "Customers": len(customers),
            "Saved Invoices": len(invoices),
        },
        "This overview is calculated from data currently saved for your business; empty categories are not filled with sample values.",
        "Ask about sales, margin, inventory, customers, invoices, expenses, or a scenario.",
        "dashboard",
    )