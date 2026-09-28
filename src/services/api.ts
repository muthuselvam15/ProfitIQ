import type {
  BusinessPulseData,
  CopilotResponse,
  ScenarioParams,
  ScenarioResult
} from '../types';

import { INITIAL_PULSE_DATA } from './mockData';

const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchBusinessPulse(): Promise<BusinessPulseData> {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics/business-pulse`);
    if (res.ok) return await res.json();
  } catch (err) {
    // Fallback
  }
  return INITIAL_PULSE_DATA;
}

export async function queryProfitIQCopilot(
  query: string,
  tier: string = 'PRO',
  apiKey?: string,
  isCustomKeyMode?: boolean
): Promise<CopilotResponse> {
  let isRateLimited = false;

  // Attempt backend API fetch
  try {
    const res = await fetch(`${API_BASE_URL}/ai/copilot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'X-API-Key': apiKey } : {})
      },
      body: JSON.stringify({ query, tier })
    });

    if (res.status === 429 || res.status === 403) {
      isRateLimited = true;
    } else if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    // Graceful offline fallback
  }

  // Simulated Rate limit check for test keys containing 'limited' or 'exceeded'
  if (apiKey && (apiKey.toLowerCase().includes('limit') || apiKey.toLowerCase().includes('exhaust'))) {
    isRateLimited = true;
  }

  const q = query.toLowerCase();

  // 1. Scenario Simulation Guard
  if ((q.includes('simulate') || q.includes('what if') || q.includes('scenario')) && tier === 'FREE') {
    return {
      intent: 'SCENARIO_SIMULATOR',
      answer: 'Scenario Simulation requires ProfitIQ PRO or PREMIUM tier.',
      reason: 'What-If simulations analyze dynamic pricing and cost models restricted to Pro/Premium plans.',
      recommendedAction: 'Upgrade to ProfitIQ Pro or Premium to unlock real-time business scenario modeling.',
      actionTarget: 'subscription',
      tierRestricted: true,
      requiredTier: 'PRO',
      usedFallbackEngine: isRateLimited || isCustomKeyMode
    };
  }

  // 2. Invoices & Receivables Query
  if (q.includes('invoice') || q.includes('overdue') || q.includes('unpaid') || q.includes('receivable') || q.includes('bill')) {
    return {
      intent: 'INVOICE_ANALYSIS',
      answer: 'You have 7 overdue customer invoices totaling ₹14,500 in outstanding receivables.',
      data: {
        'Total Outstanding Receivables': '₹14,500',
        'Overdue Invoices Count': '7 Invoices',
        'Oldest Overdue Account': 'Metro Catering (INV-2026-042, 34 Days Overdue)',
        'Suggested Remedy': 'Automated SMS / Email Payment Reminder'
      },
      reason: 'Clients have exceeded the standard net-30 payment due date without automated payment follow-up.',
      recommendedAction: 'Open the Invoice Manager to dispatch payment reminders or generate a new invoice.',
      actionTarget: 'invoices',
      usedFallbackEngine: isRateLimited || isCustomKeyMode
    };
  }

  // 3. Profit Decrease Query
  if (q.includes('profit') && (q.includes('drop') || q.includes('why') || q.includes('decrease'))) {
    return {
      intent: 'WHY_PROFIT_DROPPED',
      answer: 'Net profit decreased 7.4% this month despite a 4.2% revenue increase.',
      data: {
        'Revenue Change': '+4.2% (₹4,82,500)',
        'Supplier Costs': '+14.0% (₹2,10,000)',
        'Transportation': '+11.0% (₹18,400)',
        'Average Order Value': '-4.0% (₹850)'
      },
      reason: 'The primary drivers are rising supplier wholesale prices (+14%) and freight transportation costs (+11%), which compressed gross profit margins.',
      recommendedAction: 'Review top 3 vendor agreements for bulk renegotiation before applying end-consumer price adjustments.',
      actionTarget: 'profit-leaks',
      usedFallbackEngine: isRateLimited || isCustomKeyMode
    };
  }

  // 4. Restock & Inventory Query
  if (q.includes('restock') || q.includes('inventory') || q.includes('stock')) {
    return {
      intent: 'RESTOCK_RECOMMENDATION',
      answer: 'You have 5 products currently below their minimum safety stock threshold.',
      data: {
        'Coffee Beans Powder (500g)': '18 units left (3.6 days remaining)',
        'Organic Green Tea (250g)': '8 units left (2.0 days remaining)',
        'Cold Brew Bottles (500ml)': '12 units left (4.1 days remaining)',
        'Almond Milk Pack (1L)': '5 units left (1.5 days remaining)'
      },
      reason: 'Sales velocity increased 23% during weekend peaks, accelerating stock depletion faster than regular lead times.',
      recommendedAction: 'Trigger automated restock POs for Coffee Powder (+50 units) and Green Tea (+40 units) today.',
      actionTarget: 'inventory',
      usedFallbackEngine: isRateLimited || isCustomKeyMode
    };
  }

  // 5. Expense Analysis Query
  if (q.includes('spend') || q.includes('expense') || q.includes('cost')) {
    return {
      intent: 'EXPENSE_ANALYSIS',
      answer: 'Total operating expenses rose 14.2% to ₹68,500 this month.',
      data: {
        'Transportation': '₹18,400 (+23.5% vs last month)',
        'Supplies & Packaging': '₹22,100 (+8.2% vs last month)',
        'Utilities': '₹12,000 (+4.0% vs last month)'
      },
      reason: 'Transportation saw an anomalous hike due to split deliveries and emergency restocking shipments.',
      recommendedAction: 'Consolidate inventory orders into single weekly delivery runs to cut freight expenses by ~₹4,500/mo.',
      actionTarget: 'expenses',
      usedFallbackEngine: isRateLimited || isCustomKeyMode
    };
  }

  // Default General Summary
  return {
    intent: 'GENERAL_SUMMARY',
    answer: 'Overall Business Health is currently rated Healthy at 82/100.',
    data: {
      'Monthly Revenue': '₹4,82,500 (+12.4%)',
      'Net Profit Margin': '24.8%',
      'Active Customers': '342',
      'Pending Invoices': '₹14,500 (7 Accounts)'
    },
    reason: 'Strong weekend sales momentum compensated for moderate supplier price increases.',
    recommendedAction: 'Focus on clearing the 5 low-stock alerts and following up on overdue customer invoices today.',
    actionTarget: 'dashboard',
    usedFallbackEngine: isRateLimited || isCustomKeyMode
  };
}

export async function runScenarioSimulation(params: ScenarioParams): Promise<ScenarioResult> {
  const baseRevenue = 482500;
  const baseCosts = 364000;
  
  const projectedRevenue = baseRevenue * (1 + params.priceChangePct / 100);
  const projectedCosts = baseCosts * (1 + params.supplierCostPct / 100) * (1 - params.expenseReductionPct / 100);
  const projectedProfit = projectedRevenue - projectedCosts;
  const originalProfit = baseRevenue - baseCosts;
  const profitChangeAmount = projectedProfit - originalProfit;
  const projectedMarginPct = (projectedProfit / projectedRevenue) * 100;

  return {
    projectedRevenue: Math.round(projectedRevenue),
    projectedCosts: Math.round(projectedCosts),
    projectedProfit: Math.round(projectedProfit),
    profitChangeAmount: Math.round(profitChangeAmount),
    projectedMarginPct: Number(projectedMarginPct.toFixed(1))
  };
}
