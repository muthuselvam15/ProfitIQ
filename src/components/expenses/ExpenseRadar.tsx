import React from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { CreditCard, AlertTriangle, ArrowUpRight } from 'lucide-react';

export const ExpenseRadar: React.FC = () => {
  const { expenses, openWhyModal } = useBusiness();

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-rose-400" /> Expense Radar
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Category distributions, monthly cost variances, largest vendor payouts, and expense anomalies.
          </p>
        </div>

        <div className="glass-panel px-4 py-2 rounded-xl border border-white/10 text-right">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Monthly Expenses</div>
          <div className="text-xl font-extrabold text-white">₹{totalExpense.toLocaleString()}</div>
        </div>
      </div>

      {/* Anomaly Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-rose-500/40 bg-gradient-to-r from-navy-850 via-navy-900 to-navy-950 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">ANOMALY DETECTED</span>
              <span className="text-xs text-slate-400">Transportation Freight</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Transportation expenses increased +23.5% (₹18,400) this month.
            </h3>
          </div>
        </div>

        <button
          onClick={() => openWhyModal('expenses')}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-400 transition shadow-lg shadow-rose-500/20 shrink-0"
        >
          Investigate Anomaly
        </button>
      </div>

      {/* Expense List Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 font-bold text-sm text-white">
          Logged Expense Transactions
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 font-mono border-b border-white/10">
              <tr>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Vendor / Recipient</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Variance</th>
                <th className="px-5 py-3">Notes</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-navy-800/40 transition">
                  <td className="px-5 py-3.5 font-bold text-white">{exp.category}</td>
                  <td className="px-5 py-3.5 text-slate-300">{exp.vendor}</td>
                  <td className="px-5 py-3.5 font-bold text-white">₹{exp.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    {exp.changePct > 0 ? (
                      <span className="text-rose-400 font-semibold flex items-center gap-0.5">
                        <ArrowUpRight className="w-3.5 h-3.5" /> +{exp.changePct}%
                      </span>
                    ) : (
                      <span className="text-slate-400">Stable</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 max-w-xs truncate">{exp.notes || '-'}</td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono">{exp.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
