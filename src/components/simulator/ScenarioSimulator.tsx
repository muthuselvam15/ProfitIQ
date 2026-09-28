import React, { useState, useEffect } from 'react';
import { runScenarioSimulation } from '../../services/api';
import type { ScenarioResult } from '../../types';
import { Sliders, Sparkles, Info, RefreshCw, Crown } from 'lucide-react';

export const ScenarioSimulator: React.FC = () => {

  const [priceChange, setPriceChange] = useState<number>(5);
  const [expenseRed, setExpenseRed] = useState<number>(10);
  const [supplierCost, setSupplierCost] = useState<number>(0);

  const [result, setResult] = useState<ScenarioResult>({
    projectedRevenue: 506625,
    projectedCosts: 327600,
    projectedProfit: 179025,
    profitChangeAmount: 60525,
    projectedMarginPct: 35.3
  });

  useEffect(() => {
    runScenarioSimulation({
      priceChangePct: priceChange,
      expenseReductionPct: expenseRed,
      supplierCostPct: supplierCost
    }).then(res => setResult(res));
  }, [priceChange, expenseRed, supplierCost]);

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-emerald-400" /> "What If?" Scenario Business Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate dynamic business parameter adjustments before committing real capital or vendor changes.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Crown className="w-4 h-4 text-amber-400" /> PREMIUM SIMULATOR UNLOCKED
        </div>
      </div>

      {/* Notice */}
      <div className="p-3.5 rounded-xl bg-navy-850 border border-white/10 text-xs text-slate-300 flex items-center gap-2">
        <Info className="w-4 h-4 text-electric-400 shrink-0" />
        <span>
          <strong className="text-white">Notice: </strong>
          All values rendered below are mathematical scenario estimates based on baseline data.
        </span>
      </div>

      {/* Simulator Interface Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Controls */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
          <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
            Adjust Business Variables
          </h3>

          {/* Slider 1: Price Change */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-200">Product Price Adjustment (%):</label>
              <span className={`font-mono font-bold ${priceChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {priceChange >= 0 ? `+${priceChange}%` : `${priceChange}%`}
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="30"
              value={priceChange}
              onChange={(e) => setPriceChange(Number(e.target.value))}
              className="w-full accent-electric-500"
            />
          </div>

          {/* Slider 2: Expense Reduction */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-200">Operating Expense Reduction (%):</label>
              <span className="font-mono font-bold text-emerald-400">-{expenseRed}% Cut</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={expenseRed}
              onChange={(e) => setExpenseRed(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Slider 3: Supplier Cost Inflation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-200">Supplier Wholesale Price Shift (%):</label>
              <span className={`font-mono font-bold ${supplierCost <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {supplierCost >= 0 ? `+${supplierCost}%` : `${supplierCost}%`}
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="30"
              value={supplierCost}
              onChange={(e) => setSupplierCost(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>

          <button
            onClick={() => {
              setPriceChange(0);
              setExpenseRed(0);
              setSupplierCost(0);
            }}
            className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 text-xs font-semibold border border-white/10 transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset to Baseline
          </button>
        </div>

        {/* Right Calculated Projections */}
        <div className="glass-panel p-6 rounded-2xl border border-electric-500/30 bg-gradient-to-b from-navy-850 to-navy-950 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ai-glow" /> Projected Financial Impact
            </h3>

            <div className="space-y-4 my-4">
              <div className="p-3.5 rounded-xl bg-navy-950 border border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400">Projected Revenue</span>
                <span className="text-lg font-extrabold text-white">₹{result.projectedRevenue.toLocaleString()}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-navy-950 border border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400">Projected Costs</span>
                <span className="text-lg font-extrabold text-slate-200">₹{result.projectedCosts.toLocaleString()}</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400">Projected Net Profit</span>
                  <div className="text-xs text-slate-300">Projected Margin: {result.projectedMarginPct}%</div>
                </div>
                <span className="text-2xl font-extrabold text-emerald-400">₹{result.projectedProfit.toLocaleString()}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-navy-900 border border-white/10 text-xs flex items-center justify-between">
                <span className="text-slate-300 font-semibold">Net Profit Delta vs Baseline:</span>
                <span className={`font-extrabold text-sm ${result.profitChangeAmount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {result.profitChangeAmount >= 0 ? `+₹${result.profitChangeAmount.toLocaleString()}` : `-₹${Math.abs(result.profitChangeAmount).toLocaleString()}`}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-ai-purple/10 border border-ai-purple/20 text-xs text-slate-300">
            <span className="font-bold text-ai-glow">IQ Summary: </span>
            A {priceChange}% price increase paired with a {expenseRed}% expense reduction increases net monthly margin to {result.projectedMarginPct}%.
          </div>
        </div>
      </div>
    </div>
  );
};
