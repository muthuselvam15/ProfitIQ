import React, { useState } from 'react';
import { HeroInteractiveDemo } from './HeroInteractiveDemo';
import { Logo } from '../brand/Logo';
import { useBusiness } from '../../context/BusinessContext';
import {
  Sparkles,
  AlertTriangle,
  Package,
  ShieldCheck,
  Check,
  ChevronDown,
  ArrowRight,
  BarChart3,
  Bot,
  Sliders,
  FileSpreadsheet,
  Lock
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView, toggleDemoMode } = useBusiness();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is ProfitIQ?',
      a: 'ProfitIQ is an AI-powered business intelligence platform built specifically for small businesses. It connects sales, inventory, expenses, and customer data to deliver explainable analytics and automated action recommendations.'
    },
    {
      q: 'Who is ProfitIQ for?',
      a: 'Retailers, restaurants, cafes, e-commerce stores, local service providers, and growing SMB brands looking for digital business co-pilot capabilities without expensive enterprise software.'
    },
    {
      q: 'Does ProfitIQ replace accounting software?',
      a: 'ProfitIQ works alongside existing billing or accounting setups. While accounting tracks historical ledgers, ProfitIQ focuses on real-time intelligence, stockout forecasting, profit leak detection, and daily co-pilot recommendations.'
    },
    {
      q: 'How does the AI generate insights?',
      a: 'ProfitIQ uses a controlled tool-calling architecture. Financial metrics are computed deterministically by backend analytical engines first, and the AI co-pilot translates these validated numbers into clear, simple human business actions.'
    },
    {
      q: 'Can I import existing business data?',
      a: 'Yes! You can upload CSV, Excel files, or connect directly via API endpoints during onboarding or anytime in your settings.'
    },
    {
      q: 'Is my business data secure?',
      a: 'Absolutely. We enforce strict multi-tenant database isolation, AES-256 encryption at rest, HTTPS, role-based access control, and strict privacy boundaries.'
    },
    {
      q: 'Can multiple employees use it?',
      a: 'Yes! ProfitIQ supports Role-Based Access Control (Owner, Manager, Staff), allowing staff to record sales or check inventory without exposing high-level financial profit reports.'
    },
    {
      q: 'Can I export reports?',
      a: 'Yes! You can download automated Monthly Business Intelligence Reports in clean PDF format or export raw data tables to CSV.'
    }
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dff6ff_0%,_#9bd7ff_18%,_#0f172a_55%,_#020817_100%)] text-slate-100 flex flex-col font-sans selection:bg-sky-400/30 selection:text-sky-100">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 glass-panel border-b border-sky-300/20 px-6 py-4 flex items-center justify-between">
        <Logo size="md" />

        <nav className="hidden md:flex items-center gap-6 text-[11px] font-medium text-slate-200">
          <a href="#features" className="hover:text-sky-300 transition">Features</a>
          <a href="#pulse" className="hover:text-sky-300 transition">Business Pulse™</a>
          <a href="#simulator" className="hover:text-sky-300 transition">What-If Simulator</a>
          <a href="#pricing" className="hover:text-sky-300 transition">Pricing</a>
          <a href="#faq" className="hover:text-sky-300 transition">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              toggleDemoMode();
              setActiveView('dashboard');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-900/70 hover:bg-slate-800 border border-sky-300/20 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            Explore Demo
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-sky-300 to-cyan-400 hover:from-sky-200 hover:to-cyan-300 transition shadow-lg shadow-sky-500/30 flex items-center gap-1.5"
          >
            Start Free <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-6 max-w-6xl mx-auto text-center overflow-hidden">
        {/* Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-400/20 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-cyan-300/20 rounded-full filter blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/70 border border-sky-300/30 text-xs font-semibold text-sky-200 mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-sky-300" />
          <span>ProfitIQ — AI-Powered Small Business Intelligence Co-Pilot</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          <span className="text-slate-950">Know Your Business.</span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-cyan-700 to-sky-950">
            Predict Your Next Move.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
          ProfitIQ transforms sales, inventory, expenses, and customer data into clear AI-powered decisions for growing businesses.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveView('dashboard')}
            className="px-8 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-sky-300 to-cyan-400 hover:from-sky-200 hover:to-cyan-300 transition shadow-xl shadow-sky-500/30 flex items-center gap-2 scale-105"
          >
            Start Free Now <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              toggleDemoMode();
              setActiveView('dashboard');
            }}
            className="px-7 py-3.5 rounded-xl text-sm font-semibold text-slate-200 hover:text-white glass-panel glass-panel-hover transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-ai-glow" />
            Explore Interactive Demo
          </button>
        </div>

        {/* Trust Statement */}
        <p className="text-xs font-medium text-slate-700 tracking-wide uppercase">
          Built for retailers, restaurants, cafes, service businesses & local growing brands.
        </p>

        {/* Interactive Hero Component */}
        <HeroInteractiveDemo />
      </section>

      {/* Core Principle / Concept Section */}
      <section className="py-12 bg-navy-900/60 border-y border-white/5 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-xs font-bold text-electric-400 uppercase tracking-widest mb-2">
            The ProfitIQ Methodology
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-white mb-8">
            DATA → INTELLIGENCE → PREDICTION → ACTION
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/5 text-left">
              <div className="w-10 h-10 rounded-xl bg-electric-500/10 border border-electric-500/20 flex items-center justify-center text-electric-400 mb-4 font-mono font-bold">
                01
              </div>
              <h3 className="text-base font-bold text-white mb-2">1. Connect Data</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Seamlessly record daily sales, inventory transactions, operational expenses, and invoices.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 text-left">
              <div className="w-10 h-10 rounded-xl bg-ai-purple/20 border border-ai-purple/30 flex items-center justify-center text-ai-glow mb-4 font-mono font-bold">
                02
              </div>
              <h3 className="text-base font-bold text-white mb-2">2. Business Pulse™</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates internal health indicators across 5 core business signals without subjective noise.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 font-mono font-bold">
                03
              </div>
              <h3 className="text-base font-bold text-white mb-2">3. Demand Forecast</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Predict stockout dates 30 days ahead based on velocity, lead time, and seasonal weekend surges.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 font-mono font-bold">
                04
              </div>
              <h3 className="text-base font-bold text-white mb-2">4. Daily Actions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Translates analytics into a clear prioritized action list: Restock, Review Leaks, Follow Up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-ai-glow px-3 py-1 rounded-full bg-ai-purple/20 border border-ai-purple/30">
            ENGINEERED FOR SMALL BUSINESSES
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 mb-4">
            Intelligence without the corporate dashboard noise.
          </h2>
          <p className="text-slate-700 max-w-2xl mx-auto text-sm">
            ProfitIQ is designed like a modern AI co-pilot startup. Explainable metrics, zero invented numbers, and instant decision recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10">
            <div className="p-3 rounded-xl bg-electric-500/10 border border-electric-500/20 text-electric-400 w-fit mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Business Pulse™</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Consolidates Sales, Profit, Inventory, Customer, and Expense health into an internal mathematical index (e.g. 82/100).
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10">
            <div className="p-3 rounded-xl bg-ai-purple/20 border border-ai-purple/30 text-ai-glow w-fit mb-4">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">ProfitIQ Copilot</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Ask natural language business questions. Get direct answers backed by backend calculations, reasons, and recommended actions.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 w-fit mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Profit Leak Detector™</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Flags hidden profit drainers like rising freight costs, slow-moving deadstock, and overdue customer invoices.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 w-fit mb-4">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Smart Inventory Engine</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Monitors sales velocity, supplier lead times, and projected stockout dates so you never run out of top sellers.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit mb-4">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">"What If?" Simulator</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Simulate price increases (+5%), supplier cost shifts (+8%), or expense cuts before executing in the real world.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10">
            <div className="p-3 rounded-xl bg-electric-500/10 border border-electric-500/20 text-electric-300 w-fit mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Monthly AI Intelligence Report</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Generates executive summary reports with key metrics, next-month focus areas, PDF download, and CSV export.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section id="pricing" className="py-20 px-6 bg-navy-900/40 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-electric-400 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20">
              TRANSPARENT PRICING
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 mb-4">
              Select the plan that fits your business stage.
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              No hidden fees. Free plan to get started, upgrade as your intelligence requirements grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* FREE Plan */}
            <div className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">FREE TIER</span>
                <h3 className="text-2xl font-bold text-white mt-1 mb-2">Free</h3>
                <p className="text-xs text-slate-400 mb-6">For small businesses getting started with digital intelligence.</p>
                <div className="text-3xl font-extrabold text-white mb-6">₹0 <span className="text-xs font-normal text-slate-400">/ forever</span></div>

                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Basic Business Dashboard</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Product & Sales Tracking</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Expense Recording</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Limited AI Copilot queries</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Basic Alert Center</li>
                </ul>
              </div>

              <button
                onClick={() => setActiveView('dashboard')}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-navy-800 hover:bg-navy-700 border border-white/10 transition"
              >
                Get Started Free
              </button>
            </div>

            {/* PRO Plan (Recommended) */}
            <div className="glass-panel p-8 rounded-2xl border-2 border-electric-500 flex flex-col justify-between relative shadow-xl shadow-electric-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-electric-500 text-white text-[10px] font-extrabold tracking-wider uppercase">
                MOST POPULAR
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-electric-400">PRO TIER</span>
                <h3 className="text-2xl font-bold text-white mt-1 mb-2">Pro</h3>
                <p className="text-xs text-slate-400 mb-6">For growing businesses needing AI recommendations and forecasting.</p>
                <div className="text-3xl font-extrabold text-white mb-6">₹399 <span className="text-xs font-normal text-slate-400">/ month</span></div>

                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Everything in Free</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Full ProfitIQ Copilot AI Access</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 30-Day Demand Forecasting</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Smart Inventory & Stockout Predictions</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Invoice Generator & Management</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Profit Leak Detector™</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> PDF Monthly Reports Export</li>
                </ul>
              </div>

              <button
                onClick={() => setActiveView('dashboard')}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-electric-500 to-electric-400 hover:from-electric-400 hover:to-electric-300 transition shadow-lg shadow-electric-500/25"
              >
                Start 14-Day Free Pro Trial
              </button>
            </div>

            {/* PREMIUM Plan */}
            <div className="glass-panel p-8 rounded-2xl border border-ai-purple/40 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ai-glow">PREMIUM TIER</span>
                <h3 className="text-2xl font-bold text-white mt-1 mb-2">Premium</h3>
                <p className="text-xs text-slate-400 mb-6">For established businesses requiring scenario simulations & multi-user role access.</p>
                <div className="text-3xl font-extrabold text-white mb-6">₹799 <span className="text-xs font-normal text-slate-400">/ month</span></div>

                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Everything in Pro</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> "What If?" Scenario Business Simulator</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Customer & Product Radar Deep-Dives</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Multi-User Role Access (Owner, Manager, Staff)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Intelligence Timeline Real-time Stream</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Priority Processing & Dedicated Support</li>
                </ul>
              </div>

              <button
                onClick={() => setActiveView('dashboard')}
                className="w-full py-3 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-navy-800 hover:bg-navy-700 border border-ai-purple/30 transition"
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center gap-8">
          <div className="p-4 rounded-2xl bg-electric-500/10 border border-electric-500/20 text-electric-400 shrink-0">
            <Lock className="w-12 h-12" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Bank-Grade Security & Strict Tenant Privacy</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Your financial data belongs exclusively to your business. We enforce multi-tenant database isolation, AES-256 encryption, role-based permissions, and strict API key sanitization. Raw business metrics are never shared with public third-party LLMs.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Multi-Tenant Isolation</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Encrypted Credentials</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Role-Based Control</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white mb-3">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-xs">Everything you need to know about ProfitIQ platform and security.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="glass-panel rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between font-semibold text-sm text-white hover:text-electric-300 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-4 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <div className="glass-panel p-12 rounded-3xl border border-electric-500/30 relative overflow-hidden bg-gradient-to-b from-navy-850 to-navy-950">
          <div className="absolute inset-0 bg-gradient-to-r from-electric-500/10 via-ai-purple/10 to-emerald-500/10 pointer-events-none" />

          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 relative z-10">
            Stop guessing. Start understanding your business.
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8 relative z-10">
            Join thousands of small business owners turning sales, inventory, and expense data into clear AI co-pilot actions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <button
              onClick={() => setActiveView('dashboard')}
              className="px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-electric-500 to-electric-400 hover:from-electric-400 hover:to-electric-300 transition shadow-xl shadow-electric-500/30"
            >
              Start Using ProfitIQ
            </button>
            <button
              onClick={() => {
                toggleDemoMode();
                setActiveView('dashboard');
              }}
              className="px-8 py-3.5 rounded-xl text-sm font-semibold text-slate-200 hover:text-white glass-panel transition"
            >
              Explore Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 glass-panel px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <Logo size="sm" />
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
          <div>
            © {new Date().getFullYear()} ProfitIQ Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
