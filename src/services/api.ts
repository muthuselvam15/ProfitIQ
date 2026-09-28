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

export async function queryProfitIQCopilot(query: string, tier: string = 'PRO'): Promise<CopilotResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/ai/copilot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, tier })
    });
  } catch {
    throw new Error('Could not connect to ProfitIQ Copilot. Check that the backend is running and retry.');
  }

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.detail || `Copilot request failed with status ${response.status}.`);
  }
  const data = result as Record<string, unknown>;
  return {
    intent: String(data.intent || 'GENERAL_SUMMARY'),
    answer: String(data.answer || ''),
    data: data.data as Record<string, any> | undefined,
    reason: String(data.reason || ''),
    recommendedAction: String(data.recommendedAction || data.recommended_action || ''),
    actionTarget: String(data.actionTarget || data.action_target || ''),
    tierRestricted: Boolean(data.tierRestricted ?? data.tier_restricted),
    requiredTier: (data.requiredTier || data.required_tier) as CopilotResponse['requiredTier'],
    usedFallbackEngine: Boolean(data.usedFallbackEngine ?? data.used_fallback_engine),
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
