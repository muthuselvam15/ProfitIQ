import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import type { SubscriptionTier, UserRole } from '../../types';
import { Crown, Check, UserCheck } from 'lucide-react';

type PaidTier = Exclude<SubscriptionTier, 'FREE'>;
type RazorpayPaymentResult = {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
};
type RazorpayCheckoutOptions = {
  key: string;
  subscription_id: string;
  name: string;
  description: string;
  handler: (result: RazorpayPaymentResult) => void | Promise<void>;
  modal: { ondismiss: () => void };
  theme: { color: string };
};
type RazorpayCheckout = {
  open: () => void;
  on: (event: string, handler: (result: { error?: { description?: string } }) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckout;
  }
}

const API_BASE_URL = 'http://localhost:8000/api';

const loadRazorpayScript = () => new Promise<boolean>((resolve) => {
  if (window.Razorpay) {
    resolve(true);
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

export const SubscriptionPage: React.FC = () => {
  const {
    subscriptionTier,
    userRole,
    setUserRole,
    subscriptionStatus,
    subscriptionCancelScheduled,
    refreshSubscription
  } = useBusiness();
  const [checkoutTier, setCheckoutTier] = useState<PaidTier | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutMessage, setCheckoutMessage] = useState('');

  const clearPendingCheckout = async () => {
    const response = await fetch(`${API_BASE_URL}/subscription/cancel`, { method: 'POST' });
    if (response.ok) await refreshSubscription();
  };

  const startCheckout = async (tier: PaidTier) => {
    setCheckoutTier(tier);
    setCheckoutError('');
    setCheckoutMessage('');
    let paymentCallbackStarted = false;
    let pendingSubscriptionCreated = false;

    try {
      const orderResponse = await fetch(`${API_BASE_URL}/subscription/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier })
      });
      const order = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(order.detail || 'Could not start checkout.');
      pendingSubscriptionCreated = true;

      if (!await loadRazorpayScript() || !window.Razorpay) {
        throw new Error('Razorpay Checkout could not be loaded. Check your connection and try again.');
      }

      const checkout = new window.Razorpay({
        key: order.key_id,
        subscription_id: order.subscription_id,
        name: 'ProfitIQ',
        description: `${tier} plan, billed monthly for 12 cycles`,
        handler: async (payment) => {
          paymentCallbackStarted = true;
          try {
            const verifyResponse = await fetch(`${API_BASE_URL}/subscription/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tier, ...payment })
            });
            const verification = await verifyResponse.json();
            if (!verifyResponse.ok) throw new Error(verification.detail || 'Payment verification failed.');
            await refreshSubscription();
            setCheckoutMessage(`${tier} subscription activated.`);
          } catch (error) {
            setCheckoutError(error instanceof Error ? error.message : 'Payment verification failed.');
          } finally {
            setCheckoutTier(null);
          }
        },
        modal: {
          ondismiss: () => {
            setCheckoutTier(null);
            if (!paymentCallbackStarted && pendingSubscriptionCreated) {
              pendingSubscriptionCreated = false;
              void clearPendingCheckout();
            }
          }
        },
        theme: { color: '#24a8e0' }
      });

      checkout.on('payment.failed', (result) => {
        setCheckoutError(result.error?.description || 'Payment failed. Please try again.');
        setCheckoutTier(null);
        if (pendingSubscriptionCreated) {
          pendingSubscriptionCreated = false;
          void clearPendingCheckout();
        }
      });
      checkout.open();
    } catch (error) {
      if (pendingSubscriptionCreated) void clearPendingCheckout();
      setCheckoutError(error instanceof Error ? error.message : 'Could not start Razorpay Checkout.');
      setCheckoutTier(null);
    }
  };

  const cancelSubscription = async () => {
    setIsCanceling(true);
    setCheckoutError('');
    setCheckoutMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/subscription/cancel`, { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || 'Could not cancel subscription.');
      await refreshSubscription();
      setCheckoutMessage(result.cancel_scheduled
        ? 'Cancellation is scheduled for the end of the current billing cycle.'
        : 'Pending checkout canceled.');
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Could not cancel subscription.');
    } finally {
      setIsCanceling(false);
    }
  };

  const renderPaidPlanButton = (tier: PaidTier) => {
    const isActive = subscriptionTier === tier;
    const anotherPaidPlanIsActive = subscriptionTier !== 'FREE' && !isActive;
    const isBusy = checkoutTier !== null || isCanceling;
    const disabled = isBusy || subscriptionCancelScheduled || anotherPaidPlanIsActive || isActive;
    const label = isActive
      ? subscriptionCancelScheduled ? 'Cancellation Scheduled' : 'Active Plan'
      : anotherPaidPlanIsActive ? 'Cancel Current Plan First'
        : checkoutTier === tier ? 'Opening Checkout...'
          : 'Subscribe with Razorpay';

    return (
      <button
        onClick={() => void startCheckout(tier)}
        disabled={disabled}
        className={`w-full py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-60 ${tier === 'PRO'
          ? 'bg-gradient-to-r from-electric-500 to-electric-400 text-white'
          : 'bg-gradient-to-r from-amber-500 to-amber-400 text-white'
          }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2">
          <Crown className="w-7 h-7 text-amber-400" /> Subscription Plans & Role Access
        </h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Manage your ProfitIQ plan. Paid subscriptions are billed monthly for 12 cycles through Razorpay.
        </p>
      </div>

      {(checkoutError || checkoutMessage) && (
        <div
          role={checkoutError ? 'alert' : 'status'}
          className={`rounded-xl border px-4 py-3 text-sm ${checkoutError ? 'border-rose-400/30 bg-rose-500/10 text-rose-200' : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'}`}
        >
          {checkoutError || checkoutMessage}
        </div>
      )}

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
            onClick={() => void cancelSubscription()}
            disabled={isCanceling || subscriptionCancelScheduled || (subscriptionTier === 'FREE' && subscriptionStatus !== 'created')}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-60 ${subscriptionTier === 'FREE' ? 'bg-emerald-500 text-white' : 'bg-navy-800 text-slate-300 hover:text-white'
              }`}
          >
            {subscriptionTier === 'FREE'
              ? subscriptionStatus === 'created' ? 'Cancel Pending Checkout' : 'Active Tier'
              : subscriptionCancelScheduled ? 'Cancellation Scheduled' : 'Cancel at Period End'}
          </button>
        </div>

        {/* PRO */}
        <div className={`glass-panel p-6 rounded-2xl border flex flex-col justify-between ${subscriptionTier === 'PRO' ? 'border-electric-500 bg-electric-500/10 shadow-xl' : 'border-white/10'
          }`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-electric-400">PRO TIER</span>
            <h3 className="text-xl font-bold text-white mt-1 mb-2">Pro Plan</h3>
            <div className="text-2xl font-extrabold text-white mb-4">₹399 <span className="text-xs font-normal text-slate-400">/ mo, 12 cycles</span></div>

            <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Full ProfitIQ Copilot</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 30-Day Demand Forecasting</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Invoice Generator & Management</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Profit Leak Detector™</li>
            </ul>
          </div>

          {renderPaidPlanButton('PRO')}
        </div>

        {/* PREMIUM */}
        <div className={`glass-panel p-6 rounded-2xl border flex flex-col justify-between ${subscriptionTier === 'PREMIUM' ? 'border-amber-400 bg-amber-500/10 shadow-xl' : 'border-ai-purple/40'
          }`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">PREMIUM TIER</span>
            <h3 className="text-xl font-bold text-white mt-1 mb-2">Premium Plan</h3>
            <div className="text-2xl font-extrabold text-white mb-4">₹799 <span className="text-xs font-normal text-slate-400">/ mo, 12 cycles</span></div>

            <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> "What If?" Scenario Simulator</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Customer & Product Radar</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Intelligence Timeline Real-time Stream</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Multi-User Role Access</li>
            </ul>
          </div>

          {renderPaidPlanButton('PREMIUM')}
        </div>
      </div>
    </div>
  );
};
