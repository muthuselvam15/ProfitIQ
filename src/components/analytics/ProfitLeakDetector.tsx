import React from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { MOCK_PROFIT_LEAKS } from '../../services/mockData';
import { AlertTriangle, ChevronRight } from 'lucide-react';

export const ProfitLeakDetector: React.FC = () => {
  const { setActiveView } = useBusiness();

  const totalLeakImpact = MOCK_PROFIT_LEAKS.reduce((sum, leak) => sum + leak.impactAmount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-400" /> Profit Leak Detector™
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated detection of operational cost inefficiencies, locked capital, and overdue receivables.
          </p>
        </div>

        <div className="glass-panel px-4 py-2 rounded-xl border border-rose-500/40 bg-rose-500/10 text-right">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Potential Monthly Impact</div>
          <div className="text-xl font-extrabold text-rose-400">₹{totalLeakImpact.toLocaleString()} / mo</div>
        </div>
      </div>

      {/* Intro Notice */}
      <div className="p-4 rounded-xl bg-navy-850 border border-white/10 text-xs text-slate-300 leading-relaxed">
        <span className="font-bold text-white">Methodology Notice: </span>
        Profit Leak Detector highlights <em>potential optimization opportunities</em> calculated mathematically from variance against your trailing 3-month baseline. Review each opportunity before making vendor or pricing adjustments.
      </div>

      {/* Leaks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_PROFIT_LEAKS.map((leak) => (
          <div
            key={leak.id}
            className="glass-panel p-6 rounded-2xl border border-rose-500/30 bg-gradient-to-b from-navy-850 to-navy-950 flex flex-col justify-between space-y-4 hover:border-rose-500/60 transition"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">{leak.category}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {leak.changePct}
                </span>
              </div>

              <div className="my-2">
                <div className="text-xs text-slate-400">Potential Monthly Impact</div>
                <div className="text-2xl font-extrabold text-white mt-0.5">
                  ₹{leak.impactAmount.toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-navy-950 border border-white/5 space-y-2 text-xs my-3">
                <div>
                  <span className="font-bold text-slate-300">Root Reason: </span>
                  <span className="text-slate-400">{leak.reason}</span>
                </div>
                <div className="pt-2 border-t border-white/5">
                  <span className="font-bold text-emerald-400">AI Recommendation: </span>
                  <span className="text-slate-300">{leak.recommendation}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (leak.category.includes('Transportation')) setActiveView('expenses');
                else if (leak.category.includes('Stock')) setActiveView('inventory');
                else setActiveView('invoices');
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-400 transition flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/20"
            >
              <span>Investigate Leak</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
