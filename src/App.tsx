import React from 'react';
import { BusinessProvider, useBusiness } from './context/BusinessContext';
import { Logo } from './components/brand/Logo';
import { LandingPage } from './components/landing/LandingPage';
import { BusinessPulseDashboard } from './components/dashboard/BusinessPulseDashboard';
import { MetricWhyModal } from './components/dashboard/MetricWhyModal';
import { ProfitIQCopilot } from './components/ai/ProfitIQCopilot';
import { InventoryIntelligence } from './components/inventory/InventoryIntelligence';
import { DemandForecast } from './components/forecasting/DemandForecast';
import { ProfitLeakDetector } from './components/analytics/ProfitLeakDetector';
import { ProductIntelligence } from './components/intelligence/ProductIntelligence';
import { CustomerRadar } from './components/intelligence/CustomerRadar';
import { ExpenseRadar } from './components/expenses/ExpenseRadar';
import { InvoiceManager } from './components/invoices/InvoiceManager';
import { IntelligenceTimeline } from './components/timeline/IntelligenceTimeline';
import { ScenarioSimulator } from './components/simulator/ScenarioSimulator';
import { BusinessGoals } from './components/goals/BusinessGoals';
import { MonthlyReportGenerator } from './components/reports/MonthlyReportGenerator';
import { AlertCenter } from './components/alerts/AlertCenter';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { SubscriptionPage } from './components/subscription/SubscriptionPage';

import {
  LayoutDashboard,
  Sparkles,
  Package,
  CreditCard,
  FileText,
  Bell,
  Search
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeView,
    setActiveView,
    setIsSearchOpen,
    alerts
  } = useBusiness();

  const unreadAlertCount = alerts.filter(a => a.status === 'UNREAD').length;

  if (activeView === 'landing') {
    return <LandingPage />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Business Pulse™', icon: LayoutDashboard },
    { id: 'copilot', label: 'ProfitIQ Copilot', icon: Sparkles, badge: 'AI' },
    { id: 'inventory', label: 'Smart Inventory', icon: Package, badge: '5 Low' },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'expenses', label: 'Expense Radar', icon: CreditCard },
    { id: 'alerts', label: 'Alert Center', icon: Bell, alertCount: unreadAlertCount }
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dff6ff_0%,_#99d8ff_20%,_#0f172a_58%,_#020817_100%)] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-sky-400/30 selection:text-sky-100">
      {/* Desktop Navigation Sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-white/10 shrink-0 p-5 space-y-6 sticky top-0 h-screen overflow-y-auto">
        {/* Logo */}
        <button onClick={() => setActiveView('landing')} className="text-left">
          <Logo size="md" />
        </button>

        {/* Search Input Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-xs text-slate-400 hover:text-white hover:border-electric-500/50 transition"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-electric-400" />
            <span>Ask ProfitIQ...</span>
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-navy-900 border border-white/10 text-[10px] font-mono text-slate-400">⌘K</kbd>
        </button>

        {/* Nav Links */}
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${isActive
                  ? 'bg-gradient-to-r from-electric-500 to-electric-400 text-white shadow-md shadow-electric-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-electric-500/20 text-electric-300'
                    }`}>
                    {item.badge}
                  </span>
                )}

                {item.alertCount ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white">
                    {item.alertCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

      </aside>

      {/* Main App Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 glass-panel border-b border-white/10 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-950 border border-white/10 text-xs text-slate-400 hover:text-white"
            >
              <Search className="w-3.5 h-3.5 text-electric-400" />
              <span>Natural Language Search...</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Alert Center Trigger */}
            <button
              onClick={() => setActiveView('alerts')}
              className="relative p-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 border border-white/10 transition"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadAlertCount}
                </span>
              )}
            </button>

            {/* AI Copilot Quick Button */}
            <button
              onClick={() => setActiveView('copilot')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-ai-purple/80 to-electric-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-ai-purple/20"
            >
              <Sparkles className="w-3.5 h-3.5" /> ProfitIQ Copilot
            </button>
          </div>
        </header>

        {/* Dynamic Screen Renderer */}
        <div className="p-6 flex-1 overflow-y-auto">
          {activeView === 'dashboard' && <BusinessPulseDashboard />}
          {activeView === 'copilot' && <ProfitIQCopilot />}
          {activeView === 'inventory' && <InventoryIntelligence />}
          {activeView === 'forecasting' && <DemandForecast />}
          {activeView === 'profit-leaks' && <ProfitLeakDetector />}
          {activeView === 'products' && <ProductIntelligence />}
          {activeView === 'customers' && <CustomerRadar />}
          {activeView === 'expenses' && <ExpenseRadar />}
          {activeView === 'invoices' && <InvoiceManager />}
          {activeView === 'timeline' && <IntelligenceTimeline />}
          {activeView === 'simulator' && <ScenarioSimulator />}
          {activeView === 'goals' && <BusinessGoals />}
          {activeView === 'reports' && <MonthlyReportGenerator />}
          {activeView === 'alerts' && <AlertCenter />}
          {activeView === 'subscription' && <SubscriptionPage />}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 px-4 py-2 flex items-center justify-around bg-navy-950/95">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${activeView === 'dashboard' ? 'text-electric-400' : 'text-slate-400'
            }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </button>

        <button
          onClick={() => setActiveView('copilot')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${activeView === 'copilot' ? 'text-ai-glow' : 'text-slate-400'
            }`}
        >
          <Sparkles className="w-4 h-4" /> AI Copilot
        </button>

        <button
          onClick={() => setActiveView('inventory')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${activeView === 'inventory' ? 'text-amber-400' : 'text-slate-400'
            }`}
        >
          <Package className="w-4 h-4" /> Inventory
        </button>

        <button
          onClick={() => setActiveView('invoices')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${activeView === 'invoices' ? 'text-amber-400' : 'text-slate-400'
            }`}
        >
          <FileText className="w-4 h-4" /> Invoices
        </button>

        <button
          onClick={() => setActiveView('alerts')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${activeView === 'alerts' ? 'text-electric-400' : 'text-slate-400'
            }`}
        >
          <Bell className="w-4 h-4" /> Alerts
        </button>
      </nav>

      {/* Global Modals */}
      <MetricWhyModal />
      <GlobalSearchModal />
      <OnboardingModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BusinessProvider>
      <AppContent />
    </BusinessProvider>
  );
};

export default App;
