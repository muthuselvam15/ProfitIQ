from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from app.analytics import calculate_business_pulse, detect_profit_leaks, generate_30day_forecast, simulate_scenario
from app.ai_copilot import execute_copilot_query

app = FastAPI(
    title="ProfitIQ API",
    description="AI-Powered Small Business Intelligence Assistant Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
