import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import {
  Package,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export const InventoryIntelligence: React.FC = () => {
  const { products, setProducts } = useBusiness();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Beverages', 'Bakery', 'Dairy & Alternatives', 'Supplies'];

  const filteredProducts = products.filter(p => filterCategory === 'ALL' || p.category === filterCategory);

  const restockItem = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const added = p.suggestedReorderQty || 30;
        const newStock = p.currentStock + added;
        return {
          ...p,
          currentStock: newStock,
          daysRemaining: Math.round(newStock / (p.avgDailySales || 1.0)),
          status: 'HEALTHY'
        };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-400" /> Smart Inventory Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time stock velocity, lead-time timelines, stockout date predictions, and automated reorder calculations.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-navy-950 p-1.5 rounded-xl border border-white/10 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterCategory === cat ? 'bg-amber-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-navy-850 via-navy-900 to-navy-950 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">5 SKUs Require Immediate Safety Stock Restock</h3>
            <p className="text-xs text-slate-300">
              Weekend demand velocity will deplete Coffee Beans Powder and Green Tea prior to supplier lead time windows.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            products.forEach(p => {
              if (p.status === 'CRITICAL' || p.status === 'LOW_STOCK') restockItem(p.id);
            });
          }}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 transition shadow-lg shadow-amber-500/20 shrink-0 flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" /> Trigger All Reorders Now
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((prod) => {
          const isCritical = prod.status === 'CRITICAL';
          const isLow = prod.status === 'LOW_STOCK';
          const isOverstocked = prod.status === 'OVERSTOCKED';

          return (
            <div
              key={prod.id}
              className={`glass-panel p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all duration-300 ${
                isCritical ? 'border-rose-500/50 bg-rose-500/5' :
                isLow ? 'border-amber-500/40 bg-amber-500/5' :
                isOverstocked ? 'border-purple-500/30' :
                'border-white/10'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">{prod.sku} • {prod.category}</span>
                    <h3 className="text-base font-bold text-white mt-0.5 leading-snug">{prod.name}</h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${
                    isCritical ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                    isLow ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                    isOverstocked ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {isCritical ? 'RESTOCK NOW' : isLow ? 'LOW SAFETY STOCK' : isOverstocked ? 'OVERSTOCKED' : 'HEALTHY'}
                  </span>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-3 gap-2 bg-navy-950/80 p-3 rounded-xl border border-white/5 my-3 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400">Current Stock</div>
                    <div className="font-extrabold text-white text-sm">{prod.currentStock} units</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Daily Sales</div>
                    <div className="font-semibold text-slate-200">{prod.avgDailySales} / day</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Days Left</div>
                    <div className={`font-extrabold text-sm ${isCritical ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {prod.daysRemaining} days
                    </div>
                  </div>
                </div>

                {/* Stockout Timeline Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Forecasted Stockout: <strong className="text-white">{prod.forecastedStockoutDate}</strong></span>
                    <span>Supplier Lead Time: {prod.supplierLeadTimeDays} days</span>
                  </div>

                  <div className="w-full h-2 bg-navy-950 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full ${isCritical ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, (prod.daysRemaining / 15) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Action Box */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Suggested Reorder</div>
                  <div className="font-bold text-slate-200">+{prod.suggestedReorderQty} units</div>
                </div>

                <button
                  onClick={() => restockItem(prod.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition flex items-center gap-1 ${
                    isCritical
                      ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-md shadow-rose-500/20'
                      : 'bg-navy-800 hover:bg-navy-700 text-slate-200 border border-white/10'
                  }`}
                >
                  <RefreshCw className="w-3 h-3" /> Restock
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
