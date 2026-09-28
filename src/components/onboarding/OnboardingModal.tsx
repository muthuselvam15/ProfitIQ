import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { Sparkles, Upload, ArrowRight, CheckCircle2 } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { activeView, setActiveView } = useBusiness();
  const [step, setStep] = useState<number>(1);

  const [bizName, setBizName] = useState('Apex Retail & Café');
  const [bizType, setBizType] = useState('Retail Cafe');
  const [goals, setGoals] = useState<string[]>(['Increase sales', 'Manage inventory']);

  if (activeView !== 'onboarding') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl glass-panel rounded-2xl border border-electric-500/40 p-8 shadow-2xl bg-navy-900 space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-electric-500/20 text-electric-300 border border-electric-500/30">
              STEP 0{step} OF 04
            </span>
            <span className="text-sm font-bold text-white">
              {step === 1 && 'Tell Us About Your Business'}
              {step === 2 && 'What Do You Want To Improve?'}
              {step === 3 && 'Import Business Data'}
              {step === 4 && 'Meet Your AI Copilot'}
            </span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`w-3 h-1.5 rounded-full ${s <= step ? 'bg-electric-500' : 'bg-navy-800'}`} />
            ))}
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1">Business Name*</label>
              <input
                type="text"
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-white/10 text-white focus:outline-none focus:border-electric-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Business Type*</label>
              <select
                value={bizType}
                onChange={(e) => setBizType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-white/10 text-white focus:outline-none focus:border-electric-500"
              >
                <option value="Retail Store">Retail Store</option>
                <option value="Retail Cafe">Retail Cafe / Restaurant</option>
                <option value="Services">Local Service Provider</option>
                <option value="E-Commerce">E-Commerce Brand</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-300">Select all areas you want ProfitIQ to prioritize for your business:</p>
            {['Increase sales', 'Control expenses', 'Manage inventory & stockouts', 'Understand customer retention', 'Improve profit margins'].map((g) => (
              <label key={g} className="flex items-center gap-2.5 p-3 rounded-xl bg-navy-950 border border-white/10 cursor-pointer hover:border-electric-500/50">
                <input
                  type="checkbox"
                  checked={goals.includes(g)}
                  onChange={() => {
                    setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
                  }}
                  className="accent-electric-500"
                />
                <span className="text-slate-200 font-semibold">{g}</span>
              </label>
            ))}
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4 text-xs text-center">
            <div className="p-8 rounded-2xl border-2 border-dashed border-white/20 bg-navy-950 space-y-3">
              <Upload className="w-8 h-8 text-electric-400 mx-auto" />
              <div className="text-sm font-bold text-white">Upload Sales or Product CSV / Excel</div>
              <p className="text-slate-400 max-w-xs mx-auto">Drag & drop your files or click to browse. Demo data is pre-loaded by default.</p>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-4 text-xs">
            <div className="p-5 rounded-2xl bg-ai-purple/10 border border-ai-purple/30 space-y-3">
              <div className="flex items-center gap-2 text-ai-glow font-bold text-sm">
                <Sparkles className="w-5 h-5" /> Your First ProfitIQ Summary Is Ready!
              </div>
              <p className="text-slate-200 leading-relaxed">
                ProfitIQ has analyzed baseline metrics for <strong>{bizName}</strong>. Your Business Pulse™ index is calculated at <strong>82/100 (Healthy)</strong> with 4 prioritized daily actions generated.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 text-xs font-semibold"
            >
              Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 rounded-xl bg-electric-500 hover:bg-electric-400 text-white font-bold text-xs transition flex items-center gap-1.5"
            >
              Next Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setActiveView('dashboard')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-electric-500 to-electric-400 text-white font-extrabold text-xs transition shadow-lg shadow-electric-500/25 flex items-center gap-1.5"
            >
              Enter Business Intelligence Dashboard <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
