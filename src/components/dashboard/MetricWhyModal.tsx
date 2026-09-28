import React from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { HelpCircle, X, Sparkles, ArrowRight, Lightbulb } from 'lucide-react';

export const MetricWhyModal: React.FC = () => {
  const { activeWhyMetric, setActiveWhyMetric, setActiveView } = useBusiness();

  if (!activeWhyMetric) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-panel rounded-2xl border border-ai-purple/40 p-6 shadow-2xl relative bg-navy-900/95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-ai-purple/20 border border-ai-purple/40 text-ai-glow">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-ai-glow px-2 py-0.5 rounded bg-ai-purple/20 border border-ai-purple/30">
                IQ EXPLAINABLE ANALYTICS
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Why is this happening?
              </h3>
            </div>
          </div>
          <button
            onClick={() => setActiveWhyMetric(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-navy-800/80 border border-white/10 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Target Metric</span>
            <div className="text-right">
              <div className="text-sm font-bold text-white">{activeWhyMetric.title}</div>
              <div className="text-xs font-semibold text-emerald-400">{activeWhyMetric.change}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-ai-purple/10 border border-ai-purple/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-ai-glow">
              <Sparkles className="w-4 h-4" /> Root Cause Explanation
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {activeWhyMetric.explanation}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-800/60 border border-white/5 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400">Business Impact</div>
            <div className="text-xs text-slate-300">{activeWhyMetric.impact}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-electric-500/10 border border-electric-500/30 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-electric-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-electric-300">Suggested Co-Pilot Action</div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {activeWhyMetric.suggestedAction}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            onClick={() => setActiveWhyMetric(null)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-navy-800 hover:bg-navy-700 transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              setActiveWhyMetric(null);
              setActiveView('copilot');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-electric-500 to-electric-400 hover:from-electric-400 transition flex items-center gap-1.5 shadow-lg shadow-electric-500/20"
          >
            Ask Copilot Deep-Dive <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
