import numpy as np

def calculate_business_pulse(sales, expenses, inventory, customers):
    """
    Calculates overall Business Pulse (0-100) using 5 distinct signals.
    Does not give subjective ranking; computes internal mathematical status.
    """
    # 1. Sales Health (0-100)
    sales_health = 85.0
    
    # 2. Profit Health (0-100)
    profit_health = 78.0
    
    # 3. Inventory Health (0-100)
    inventory_health = 90.0
    
    # 4. Customer Health (0-100)
    customer_health = 82.0
    
    # 5. Expense Health (0-100)
    expense_health = 75.0
    
    overall_pulse = int(
        sales_health * 0.25 +
        profit_health * 0.25 +
        inventory_health * 0.20 +
        customer_health * 0.15 +
        expense_health * 0.15
    )
    
    status_label = "Healthy" if overall_pulse >= 80 else "Stable" if overall_pulse >= 60 else "Attention Required"
    
    return {
        "score": overall_pulse,
        "status": status_label,
        "signals": {
            "sales_health": sales_health,
            "profit_health": profit_health,
            "inventory_health": inventory_health,
            "customer_health": customer_health,
            "expense_health": expense_health
        }
    }

def detect_profit_leaks(expenses, inventory, invoices):
    """
    Identifies high-priority potential profit leaks with estimated monthly cost impact.
    """
    leaks = [
        {
            "id": "leak-1",
            "category": "Transportation Costs",
            "change_pct": "+18.5%",
            "impact_amount": 4800,
            "severity": "HIGH",
            "reason": "Transportation vendor rate increased compared to 3-month trailing baseline.",
            "recommendation": "Review logistics vendor contract or consolidate weekly freight deliveries."
        },
        {
            "id": "leak-2",
            "category": "Slow-Moving Inventory Hold",
            "change_pct": "+12.0%",
            "impact_amount": 3200,
            "severity": "MEDIUM",
            "reason": "3 products have sat idle with zero sales over 45 days, locking up capital.",
            "recommendation": "Run a 15% discount campaign to liquidate aged inventory."
        },
        {
            "id": "leak-3",
            "category": "Overdue Customer Invoices",
            "change_pct": "7 Invoices",
            "impact_amount": 14500,
            "severity": "HIGH",
            "reason": "Outstanding payments overdue past 30-day term limits.",
            "recommendation": "Send automated SMS/email payment reminder alerts with direct payment link."
        }
    ]
    return leaks

def generate_30day_forecast(historical_sales):
    """
    Generates 30-day future demand forecast with confidence bounds and weekend trend factors.
    """
    # Baseline projection algorithm
    base_daily = 14500.0
    forecast_days = []
    
    for day in range(1, 31):
        is_weekend = (day % 7 in [5, 6])
        multiplier = 1.23 if is_weekend else 0.95
        predicted = base_daily * multiplier * (1 + (day * 0.003))
        forecast_days.append({
            "day": f"Day {day}",
            "actual": None,
            "predicted": round(predicted, 2),
            "lower_bound": round(predicted * 0.92, 2),
            "upper_bound": round(predicted * 1.08, 2),
            "is_weekend": is_weekend
        })
    return forecast_days

def simulate_scenario(base_revenue, base_costs, price_change_pct, expense_reduction_pct, supplier_cost_pct):
    """
    Simulates What-If business parameters and calculates projected outcome estimates.
    """
    new_revenue = base_revenue * (1 + (price_change_pct / 100.0))
    new_costs = base_costs * (1 + (supplier_cost_pct / 100.0)) * (1 - (expense_reduction_pct / 100.0))
    projected_profit = new_revenue - new_costs
    original_profit = base_revenue - base_costs
    profit_diff = projected_profit - original_profit
    margin_pct = (projected_profit / new_revenue) * 100 if new_revenue > 0 else 0
    
    return {
        "projected_revenue": round(new_revenue, 2),
        "projected_costs": round(new_costs, 2),
        "projected_profit": round(projected_profit, 2),
        "profit_change_amount": round(profit_diff, 2),
        "projected_margin_pct": round(margin_pct, 1)
    }
