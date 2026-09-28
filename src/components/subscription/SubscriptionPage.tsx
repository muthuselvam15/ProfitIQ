import React from 'react';
import { useBusiness } from '../../context/BusinessContext';
import type { UserRole } from '../../types';
import { Crown, Check, UserCheck } from 'lucide-react';

export const SubscriptionPage: React.FC = () => {
  const { subscriptionTier, setSubscriptionTier, userRole, setUserRole } = useBusiness();

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2">
          <Crown className="w-7 h-7 text-amber-400" /> Subscription Plans & Role Access
        </h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Manage your active ProfitIQ intelligence tier and test Role-Based Access Control permissions.
        </p>
      </div>

      {/* Active Role Selector Box */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-electric-500/20 border border-electric-500/30 text-electric-300">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Active Role Context Simulator</div>
            <div className="text-[11px] text-slate-400">Current Role: {userRole}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-navy-950 p-1.5 rounded-xl border border-white/10 text-xs font-semibold">
          {(['OWNER', 'MANAGER', 'STAFF'] as UserRole[]).map(role => (
            <button
              key={role}
              onClick={() => setUserRole(role)}
              className={`px-3 py-1.5 rounded-lg transition ${userRole === role ? 'bg-electric-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FREE */}
        <div className={`glass-panel p-6 rounded-2xl border flex flex-col justify-between ${subscriptionTier === 'FREE' ? 'border-electric-500 bg-electric-500/5' : 'border-white/10'
          }`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">FREE TIER</span>
            <h3 className="text-xl font-bold text-white mt-1 mb-2">Free Plan</h3>
            <div className="text-2xl font-extrabold text-white mb-4">₹0 <span className="text-xs font-normal text-slate-400">/ forever</span></div>

            <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Basic Dashboard</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Sales & Expense Tracking</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Limited AI Queries</li>
            </ul>
          </div>

          <button
            onClick={() => setSubscriptionTier('FREE')}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition ${subscriptionTier === 'FREE' ? 'bg-emerald-500 text-white' : 'bg-navy-800 text-slate-300 hover:text-white'
              }`}
          >
            {subscriptionTier === 'FREE' ? 'Active Tier' : 'Switch to Free'}
          </button>
        </div>

        {/* PRO */}
        <div className={`glass-panel p-6 rounded-2xl border flex flex-col justify-between ${subscriptionTier === 'PRO' ? 'border-electric-500 bg-electric-500/10 shadow-xl' : 'border-white/10'
          }`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-electric-400">PRO TIER</span>
            <h3 className="text-xl font-bold text-white mt-1 mb-2">Pro Plan</h3>
            <div className="text-2xl font-extrabold text-white mb-4">₹399 <span className="text-xs font-normal text-slate-400">/ mo</span></div>

            <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Full ProfitIQ Copilot</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 30-Day Demand Forecasting</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Invoice Generator & Management</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Profit Leak Detector™</li>
            </ul>
          </div>

          <button
            onClick={() => setSubscriptionTier('PRO')}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition ${subscriptionTier === 'PRO' ? 'bg-electric-500 text-white' : 'bg-gradient-to-r from-electric-500 to-electric-400 text-white'
              }`}
          >
            {subscriptionTier === 'PRO' ? 'Active Tier' : 'Upgrade to Pro'}
          </button>
        </div>

        {/* PREMIUM */}
        <div className={`glass-panel p-6 rounded-2xl border flex flex-col justify-between ${subscriptionTier === 'PREMIUM' ? 'border-amber-400 bg-amber-500/10 shadow-xl' : 'border-ai-purple/40'
          }`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">PREMIUM TIER</span>
            <h3 className="text-xl font-bold text-white mt-1 mb-2">Premium Plan</h3>
            <div className="text-2xl font-extrabold text-white mb-4">₹799 <span className="text-xs font-normal text-slate-400">/ mo</span></div>

            <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> "What If?" Scenario Simulator</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Customer & Product Radar</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Intelligence Timeline Real-time Stream</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Multi-User Role Access</li>
            </ul>
          </div>

          <button
            onClick={() => setSubscriptionTier('PREMIUM')}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition ${subscriptionTier === 'PREMIUM' ? 'bg-amber-500 text-white' : 'bg-gradient-to-r from-amber-500 to-amber-400 text-white'
              }`}
          >
            {subscriptionTier === 'PREMIUM' ? 'Active Tier' : 'Upgrade to Premium'}
          </button>
        </div>
      </div>
    </div>
  );
};
