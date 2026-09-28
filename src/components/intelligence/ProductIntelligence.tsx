import React from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { Package, Sparkles } from 'lucide-react';

export const ProductIntelligence: React.FC = () => {
  const { products } = useBusiness();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-electric-400" /> Product Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Individual SKU sales performance, margin contributions, and demand velocity analysis.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((prod) => (
          <div key={prod.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400">{prod.sku} • {prod.category}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{prod.name}</h3>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Monthly Revenue</div>
                <div className="text-lg font-extrabold text-white">₹{prod.revenue.toLocaleString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-navy-950 p-3 rounded-xl text-xs border border-white/5">
              <div>
                <div className="text-[10px] text-slate-400">Selling Price</div>
                <div className="font-bold text-white">₹{prod.sellingPrice}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Cost Price</div>
                <div className="font-bold text-slate-300">₹{prod.costPrice}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Gross Margin</div>
                <div className="font-extrabold text-emerald-400">{prod.marginPct}%</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-electric-500/10 border border-electric-500/20 text-xs space-y-1">
              <div className="font-bold text-electric-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> IQ INSIGHT
              </div>
              <p className="text-slate-300 leading-relaxed">
                Demand has consistently increased over the last 4 weeks. High gross margin ({prod.marginPct}%) provides room for promotional bundling.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
