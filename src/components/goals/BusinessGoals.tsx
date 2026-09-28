import React, { useState } from 'react';
import { MOCK_GOALS } from '../../services/mockData';
import { Target, Sparkles } from 'lucide-react';

export const BusinessGoals: React.FC = () => {
  const [goals] = useState(MOCK_GOALS);

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-electric-400" /> Business Goals Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Set quantitative financial & operational milestones. Track progress against real-time backend calculations.
          </p>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-5">
        {goals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

          return (
            <div key={goal.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-electric-400 px-2 py-0.5 rounded bg-electric-500/10 border border-electric-500/20">
                    {goal.category} Goal
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{goal.title}</h3>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Deadline: {goal.deadline}</div>
                  <div className="text-lg font-extrabold text-white mt-0.5">{pct}%</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                  <span>Current: ₹{goal.currentAmount.toLocaleString()}</span>
                  <span>Target: ₹{goal.targetAmount.toLocaleString()}</span>
                </div>

                <div className="w-full h-3 bg-navy-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-electric-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* AI Status Box */}
              <div className="p-3.5 rounded-xl bg-ai-purple/10 border border-ai-purple/20 text-xs text-slate-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-ai-glow shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-ai-glow">AI STATUS ASSESSMENT: </span>
                  {goal.aiStatus}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
