import React from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { Users, Sparkles, ArrowRight } from 'lucide-react';

export const CustomerRadar: React.FC = () => {
  const { customers, setActiveView } = useBusiness();
  const inactiveCount = customers.filter(customer => customer.segment === 'Inactive').length;

  const segments = [
    { label: 'Frequent Champions', count: customers.filter(customer => customer.segment === 'Frequent').length, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { label: 'High-Value VIPs', count: customers.filter(customer => customer.segment === 'High-Value').length, color: 'text-electric-400 bg-electric-500/10 border-electric-500/30' },
    { label: 'Returning Customers', count: customers.filter(customer => customer.segment === 'Returning').length, color: 'text-slate-300 bg-navy-800 border-white/10' },
    { label: 'Inactive (60+ Days)', count: inactiveCount, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { label: 'Overdue Balance', count: customers.filter(customer => customer.outstandingBalance > 0).length, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-ai-glow" /> Customer Radar™
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Activity segmentation based on actual transaction behavior, purchase recency, and outstanding balance status.
          </p>
        </div>
      </div>

      {/* Segment Badges */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {segments.map((seg, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${seg.color} text-center space-y-1`}>
            <div className="text-2xl font-extrabold text-white">{seg.count}</div>
            <div className="text-xs font-semibold">{seg.label}</div>
          </div>
        ))}
      </div>

      {/* Re-engagement Opportunity Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-ai-purple/40 bg-gradient-to-r from-navy-850 via-navy-900 to-navy-950 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-ai-purple/20 border border-ai-purple/40 text-ai-glow">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{inactiveCount} Customers inactive for over 60 days</h3>
            <p className="text-xs text-slate-300">
              Suggested action: Dispatch an automated 10% win-back promotional offer to re-activate these accounts.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('copilot')}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-ai-purple hover:bg-ai-glow transition shadow-lg shadow-ai-purple/20 shrink-0 flex items-center gap-1.5"
        >
          Draft Campaign with Copilot <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Customer Directory Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 font-bold text-sm text-white">
          Active Customer Directory & Segment Analysis
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 font-mono border-b border-white/10">
              <tr>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Segment</th>
                <th className="px-5 py-3">Total Spent</th>
                <th className="px-5 py-3">Orders</th>
                <th className="px-5 py-3">Outstanding Balance</th>
                <th className="px-5 py-3">Last Purchase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-navy-800/40 transition">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-white">{cust.name}</div>
                    <div className="text-[11px] text-slate-400">{cust.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${cust.segment === 'High-Value' ? 'bg-electric-500/20 text-electric-300 border-electric-500/30' :
                        cust.segment === 'Frequent' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          cust.segment === 'Inactive' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                            'bg-navy-800 text-slate-300 border-white/10'
                      }`}>
                      {cust.segment}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-white">₹{cust.totalSpent.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-slate-300">{cust.totalOrders} orders</td>
                  <td className="px-5 py-3.5">
                    {cust.outstandingBalance > 0 ? (
                      <span className="font-bold text-rose-400">₹{cust.outstandingBalance.toLocaleString()} Overdue</span>
                    ) : (
                      <span className="text-emerald-400 font-semibold">₹0 Clear</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono">{cust.lastPurchaseDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
