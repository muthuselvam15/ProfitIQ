import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import {
  TrendingUp,
  CreditCard,
  Package,
  Users,
  HelpCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ChevronRight,
  FileText,
  BarChart3,
  Layers
} from 'lucide-react';

export const BusinessPulseDashboard: React.FC = () => {
  const {
    pulseData,
    openWhyModal,
    setActiveView,
    addSale,
    addProduct,
    addExpense,
    addInvoice,
    userRole,
    isDemoMode
  } = useBusiness();

  const [activeSignalTab, setActiveSignalTab] = useState<string | null>(null);

  // Quick Action Modal states
  const [modalType, setModalType] = useState<'sale' | 'product' | 'expense' | 'invoice' | null>(null);
  
  // Quick Form inputs
  const [saleCustomer, setSaleCustomer] = useState('');
  const [saleAmount, setSaleAmount] = useState('');
  
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCost, setProdCost] = useState('');
  const [prodStock, setProdStock] = useState('');

  const [expCategory, setExpCategory] = useState<'Transportation' | 'Supplies' | 'Rent' | 'Utilities' | 'Salaries'>('Supplies');
  const [expAmount, setExpAmount] = useState('');
  const [expVendor, setExpVendor] = useState('');

  const [invCustomer, setInvCustomer] = useState('');
  const [invAmount, setInvAmount] = useState('');

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleAmount) return;
    addSale({
      customerName: saleCustomer || 'Walk-in Customer',
      totalAmount: parseFloat(saleAmount),
      paymentMethod: 'UPI'
    });
    setModalType(null);
    setSaleCustomer('');
    setSaleAmount('');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice) return;
    addProduct({
      name: prodName,
      sellingPrice: parseFloat(prodPrice),
      costPrice: parseFloat(prodCost || '100'),
      currentStock: parseInt(prodStock || '50')
    });
    setModalType(null);
    setProdName('');
    setProdPrice('');
    setProdCost('');
    setProdStock('');
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expAmount) return;
    addExpense({
      category: expCategory,
      amount: parseFloat(expAmount),
      vendor: expVendor || 'Supplier'
    });
    setModalType(null);
    setExpAmount('');
    setExpVendor('');
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invCustomer || !invAmount) return;
    addInvoice({
      customerName: invCustomer,
      amount: parseFloat(invAmount),
      dueDate: '2026-10-30'
    });
    setModalType(null);
    setInvCustomer('');
    setInvAmount('');
  };

  const signalKeys = [
    { key: 'sales', label: 'Sales Health', icon: TrendingUp, color: 'text-emerald-400', barBg: 'bg-emerald-500' },
    { key: 'profit', label: 'Profit Health', icon: BarChart3, color: 'text-electric-400', barBg: 'bg-electric-500' },
    { key: 'inventory', label: 'Inventory Health', icon: Package, color: 'text-amber-400', barBg: 'bg-amber-500' },
    { key: 'customers', label: 'Customer Health', icon: Users, color: 'text-ai-glow', barBg: 'bg-ai-purple' },
    { key: 'expenses', label: 'Expense Health', icon: CreditCard, color: 'text-rose-400', barBg: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">Business Intelligence Overview</h1>
            {isDemoMode && (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 uppercase tracking-wider">
                Apex Retail & Café (Demo)
              </span>
            )}
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-navy-800 border border-white/10 text-slate-300">
              Role: {userRole}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time business pulse, explainable analytics, and daily prioritized co-pilot actions.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setModalType('sale')}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> + Add Sale
          </button>
          <button
            onClick={() => setModalType('product')}
            className="px-3 py-1.5 rounded-xl bg-electric-500/20 hover:bg-electric-500/30 border border-electric-500/40 text-electric-300 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> + Add Product
          </button>
          <button
            onClick={() => setModalType('expense')}
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> + Add Expense
          </button>
          <button
            onClick={() => setModalType('invoice')}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" /> Create Invoice
          </button>
          <button
            onClick={() => setActiveView('copilot')}
            className="px-3.5 py-1.5 rounded-xl bg-ai-purple/30 hover:bg-ai-purple/40 border border-ai-purple/50 text-ai-glow text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-ai-purple/20"
          >
            <Sparkles className="w-3.5 h-3.5" /> Ask AI
          </button>
        </div>
      </div>

      {/* BUSINESS PULSE™ FEATURE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Business Pulse Gauge Card */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-2xl border border-electric-500/30 relative overflow-hidden bg-gradient-to-br from-navy-850 via-navy-900 to-navy-950 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest uppercase text-electric-400">BUSINESS PULSE™</span>
              <span className="text-[10px] font-mono text-slate-400">Internal Indicator</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              {pulseData.status}
            </span>
          </div>

          <div className="my-4 text-center">
            <div className="relative inline-flex items-center justify-center">
              {/* Outer score circle */}
              <div className="w-36 h-36 rounded-full border-4 border-navy-800 flex flex-col items-center justify-center bg-navy-900 shadow-2xl relative">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-electric-500 border-r-emerald-400 animate-pulse-subtle opacity-80" />
                <span className="text-5xl font-extrabold text-white tracking-tight">{pulseData.score}</span>
                <span className="text-xs font-semibold text-slate-400 mt-0.5">/ 100 Index</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-4 leading-relaxed max-w-xs mx-auto">
              Calculated from sales growth, gross profit margins, stock velocity, customer retention, and expense anomaly signals.
            </p>
          </div>

          <button
            onClick={() => setActiveView('copilot')}
            className="w-full py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 border border-white/10 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-ai-glow" />
            Ask Copilot Pulse Explanation
          </button>
        </div>

        {/* 5 Business Signals Breakdown Bars */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-electric-400" />
              Core Signal Breakdown
            </h3>
            <span className="text-xs text-slate-400">Click any signal to inspect underlying metrics</span>
          </div>

          <div className="space-y-3.5">
            {signalKeys.map((sig) => {
              const signalData = (pulseData.signals as any)[sig.key];
              const Icon = sig.icon;
              const isSelected = activeSignalTab === sig.key;

              return (
                <div
                  key={sig.key}
                  onClick={() => setActiveSignalTab(isSelected ? null : sig.key)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-navy-800 border-electric-500/50 shadow-md'
                      : 'bg-navy-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${sig.color}`} />
                      <span className="font-semibold text-white">{sig.label}</span>
                      <span className="text-[11px] text-slate-400">({signalData.status})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-300 font-semibold">{signalData.keyMetric}</span>
                      <span className="font-bold text-white w-8 text-right">{signalData.score}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-navy-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${sig.barBg} transition-all duration-500 rounded-full`}
                      style={{ width: `${signalData.score}%` }}
                    />
                  </div>

                  {/* Expanded Signal Details */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-300 space-y-2 animate-fade-in">
                      <div className="flex items-center justify-between text-emerald-400 font-medium">
                        <span>Signal Trend: {signalData.change}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openWhyModal(sig.key === 'sales' ? 'revenue' : sig.key === 'profit' ? 'netProfit' : sig.key === 'inventory' ? 'inventoryTurnover' : 'expenses');
                          }}
                          className="text-[11px] font-bold text-electric-300 hover:text-white underline flex items-center gap-1"
                        >
                          <HelpCircle className="w-3 h-3" /> Why? Explanation
                        </button>
                      </div>
                      <p className="text-slate-300 bg-navy-950/60 p-2.5 rounded-lg border border-white/5">
                        {signalData.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TOP 4 METRIC CARDS WITH "WHY?" BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Revenue */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Monthly Revenue</span>
            <button
              onClick={() => openWhyModal('revenue')}
              className="px-2 py-0.5 rounded bg-electric-500/20 hover:bg-electric-500/30 text-electric-300 text-[11px] font-bold border border-electric-500/30 transition flex items-center gap-1"
            >
              Why?
            </button>
          </div>
          <div className="text-2xl font-extrabold text-white mb-1">₹4,82,500</div>
          <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-white/5">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12.4% vs last mo
            </span>
            <span className="text-slate-400">Target: ₹5.0L</span>
          </div>
        </div>

        {/* Card 2: Net Profit */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Net Profit</span>
            <button
              onClick={() => openWhyModal('netProfit')}
              className="px-2 py-0.5 rounded bg-electric-500/20 hover:bg-electric-500/30 text-electric-300 text-[11px] font-bold border border-electric-500/30 transition flex items-center gap-1"
            >
              Why?
            </button>
          </div>
          <div className="text-2xl font-extrabold text-white mb-1">₹1,18,500</div>
          <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-white/5">
            <span className="text-rose-400 font-semibold flex items-center gap-1">
              <ArrowDownRight className="w-3.5 h-3.5" /> -7.4% margin compression
            </span>
            <span className="text-slate-400">Margin: 24.8%</span>
          </div>
        </div>

        {/* Card 3: Inventory Health */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Inventory Velocity</span>
            <button
              onClick={() => openWhyModal('inventoryTurnover')}
              className="px-2 py-0.5 rounded bg-electric-500/20 hover:bg-electric-500/30 text-electric-300 text-[11px] font-bold border border-electric-500/30 transition flex items-center gap-1"
            >
              Why?
            </button>
          </div>
          <div className="text-2xl font-extrabold text-white mb-1">91 / 100</div>
          <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-white/5">
            <span className="text-amber-400 font-semibold">5 SKUs Low Stock</span>
            <span className="text-slate-400">4.2x Turnover</span>
          </div>
        </div>

        {/* Card 4: Expenses */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Operating Expenses</span>
            <button
              onClick={() => openWhyModal('expenses')}
              className="px-2 py-0.5 rounded bg-electric-500/20 hover:bg-electric-500/30 text-electric-300 text-[11px] font-bold border border-electric-500/30 transition flex items-center gap-1"
            >
              Why?
            </button>
          </div>
          <div className="text-2xl font-extrabold text-white mb-1">₹68,500</div>
          <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-white/5">
            <span className="text-rose-400 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% Anomaly
            </span>
            <span className="text-slate-400">Transport Spike</span>
          </div>
        </div>
      </div>

      {/* "WHAT SHOULD I DO TODAY?" PRIORITIZED ACTIONS SECTION */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest uppercase text-ai-glow px-2.5 py-0.5 rounded bg-ai-purple/20 border border-ai-purple/30">
                DAILY AI PRIORITIES
              </span>
              <h2 className="text-lg font-extrabold text-white">What Should I Do Today?</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              ProfitIQ prioritizes your daily operations so you take action instead of deciphering raw numbers.
            </p>
          </div>
          <button
            onClick={() => setActiveView('timeline')}
            className="text-xs font-semibold text-electric-300 hover:text-white flex items-center gap-1 shrink-0"
          >
            View Full Timeline <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Action Item 01 */}
          <div className="glass-panel p-4 rounded-xl border border-amber-500/30 bg-gradient-to-r from-navy-850 to-navy-900 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-extrabold text-amber-400 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                  01
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Restock High-Velocity Items</h4>
                  <span className="text-[11px] text-amber-400 font-semibold">Priority: HIGH • Restock</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              5 products are below safety reorder thresholds. Coffee Powder (18 units) & Green Tea (8 units) depleting 23% faster than weekday average.
            </p>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-emerald-400 font-medium">Prevents ₹12,400 lost sales</span>
              <button
                onClick={() => setActiveView('inventory')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-500 hover:bg-amber-400 transition flex items-center gap-1 shadow"
              >
                View Products & Restock <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Item 02 */}
          <div className="glass-panel p-4 rounded-xl border border-rose-500/30 bg-gradient-to-r from-navy-850 to-navy-900 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-extrabold text-rose-400 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20">
                  02
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Review Transportation Freight Anomaly</h4>
                  <span className="text-[11px] text-rose-400 font-semibold">Priority: HIGH • Review Expense</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Freight expenses jumped +23.5% this month to ₹18,400 due to multiple split courier deliveries triggered by late reordering.
            </p>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-emerald-400 font-medium">Est. saving: ~₹4,500/mo</span>
              <button
                onClick={() => setActiveView('expenses')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-500 hover:bg-rose-400 transition flex items-center gap-1 shadow"
              >
                Investigate Expense Radar <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Item 03 */}
          <div className="glass-panel p-4 rounded-xl border border-electric-500/30 bg-gradient-to-r from-navy-850 to-navy-900 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-extrabold text-electric-400 px-2 py-1 rounded bg-electric-500/10 border border-electric-500/20">
                  03
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Follow Up Overdue Customer Invoices</h4>
                  <span className="text-[11px] text-electric-400 font-semibold">Priority: MEDIUM • Follow Up</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              7 customer invoices totalling ₹14,500 are past 30-day payment terms without automated reminders.
            </p>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-emerald-400 font-medium">Recovers ₹14,500 cash flow</span>
              <button
                onClick={() => setActiveView('invoices')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-electric-500 hover:bg-electric-400 transition flex items-center gap-1 shadow"
              >
                Send Invoice Reminders <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Item 04 */}
          <div className="glass-panel p-4 rounded-xl border border-ai-purple/40 bg-gradient-to-r from-navy-850 to-navy-900 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-extrabold text-ai-glow px-2 py-1 rounded bg-ai-purple/20 border border-ai-purple/30">
                  04
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Re-engage Inactive Customer Segment</h4>
                  <span className="text-[11px] text-ai-glow font-semibold">Priority: MEDIUM • Customer Opportunity</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              18 high-value repeat customers have not made a purchase in 60+ days. Suitable for automated win-back discount offer.
            </p>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-emerald-400 font-medium">Est. revenue: ₹18,000</span>
              <button
                onClick={() => setActiveView('customers')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-ai-purple hover:bg-ai-glow transition flex items-center gap-1 shadow"
              >
                View Customer Radar <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK MODALS FOR +Add Sale, +Add Product, +Add Expense, Create Invoice */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel rounded-2xl border border-white/20 p-6 bg-navy-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white capitalize">
                {modalType === 'sale' && 'Record New Sale'}
                {modalType === 'product' && 'Add New Product SKU'}
                {modalType === 'expense' && 'Log Operational Expense'}
                {modalType === 'invoice' && 'Generate Customer Invoice'}
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            {/* Sale Form */}
            {modalType === 'sale' && (
              <form onSubmit={handleCreateSale} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Customer Name (Optional)</label>
                  <input
                    type="text"
                    value={saleCustomer}
                    onChange={(e) => setSaleCustomer(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white focus:outline-none focus:border-electric-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Total Amount (₹)*</label>
                  <input
                    type="number"
                    required
                    value={saleAmount}
                    onChange={(e) => setSaleAmount(e.target.value)}
                    placeholder="e.g. 1850"
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white focus:outline-none focus:border-electric-500"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-400 transition mt-2">
                  Save Sale Entry
                </button>
              </form>
            )}

            {/* Product Form */}
            {modalType === 'product' && (
              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Product Name*</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Organic Matcha Powder (100g)"
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white focus:outline-none focus:border-electric-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 mb-1">Selling Price (₹)*</label>
                    <input
                      type="number"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      placeholder="450"
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white focus:outline-none focus:border-electric-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Cost Price (₹)</label>
                    <input
                      type="number"
                      value={prodCost}
                      onChange={(e) => setProdCost(e.target.value)}
                      placeholder="280"
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white focus:outline-none focus:border-electric-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Initial Stock Quantity</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    placeholder="50"
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white focus:outline-none focus:border-electric-500"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl bg-electric-500 text-white font-bold hover:bg-electric-400 transition mt-2">
                  Add Product SKU
                </button>
              </form>
            )}

            {/* Expense Form */}
            {modalType === 'expense' && (
              <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select
                    value={expCategory}
                    onChange={(e: any) => setExpCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white focus:outline-none focus:border-electric-500"
                  >
                    <option value="Supplies">Supplies & Packaging</option>
                    <option value="Transportation">Transportation & Logistics</option>
                    <option value="Rent">Premises Rent</option>
                    <option value="Utilities">Utilities & Power</option>
                    <option value="Salaries">Staff Salaries</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Vendor Name</label>
                  <input
                    type="text"
                    value={expVendor}
                    onChange={(e) => setExpVendor(e.target.value)}
                    placeholder="e.g. Express Courier Services"
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white focus:outline-none focus:border-electric-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Amount (₹)*</label>
                  <input
                    type="number"
                    required
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    placeholder="e.g. 4500"
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white focus:outline-none focus:border-electric-500"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-400 transition mt-2">
                  Record Expense
                </button>
              </form>
            )}

            {/* Invoice Form */}
            {modalType === 'invoice' && (
              <form onSubmit={handleCreateInvoice} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Client/Customer Name*</label>
                  <input
                    type="text"
                    required
                    value={invCustomer}
                    onChange={(e) => setInvCustomer(e.target.value)}
                    placeholder="e.g. Metro Catering Services"
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white focus:outline-none focus:border-electric-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Invoice Amount (₹)*</label>
                  <input
                    type="number"
                    required
                    value={invAmount}
                    onChange={(e) => setInvAmount(e.target.value)}
                    placeholder="e.g. 12500"
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white focus:outline-none focus:border-electric-500"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-400 transition mt-2">
                  Generate Invoice
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
