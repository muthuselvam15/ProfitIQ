import React from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { MOCK_TIMELINE_EVENTS } from '../../services/mockData';
import { Clock, ChevronRight } from 'lucide-react';

export const IntelligenceTimeline: React.FC = () => {
  const { setActiveView } = useBusiness();

  const grouped = {
    TODAY: MOCK_TIMELINE_EVENTS.filter(e => e.dateGroup === 'TODAY'),
    YESTERDAY: MOCK_TIMELINE_EVENTS.filter(e => e.dateGroup === 'YESTERDAY'),
    THIS_WEEK: MOCK_TIMELINE_EVENTS.filter(e => e.dateGroup === 'THIS_WEEK'),
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-electric-400" /> Intelligence Timeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Chronological stream of business intelligence events, stock alerts, expense hikes, and AI recommendations.
          </p>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-8">
        {(Object.keys(grouped) as Array<keyof typeof grouped>).map((groupKey) => (
          <div key={groupKey} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 px-2.5 py-0.5 rounded bg-navy-800 border border-white/10">
                {groupKey}
              </span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <div className="space-y-3 pl-4 border-l-2 border-electric-500/30">
              {grouped[groupKey].map((ev) => (
                <div key={ev.id} className="glass-panel p-4 rounded-xl border border-white/10 space-y-2 relative bg-navy-850">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-electric-500/20 text-electric-300 border border-electric-500/30">
                        {ev.type}
                      </span>
                      <h4 className="text-sm font-bold text-white">{ev.title}</h4>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{ev.time}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{ev.description}</p>

                  {ev.actionText && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          if (ev.type.includes('Inventory')) setActiveView('inventory');
                          else if (ev.type.includes('Sales')) setActiveView('dashboard');
                          else if (ev.type.includes('Expense')) setActiveView('expenses');
                          else setActiveView('copilot');
                        }}
                        className="text-xs font-bold text-electric-400 hover:text-white flex items-center gap-1"
                      >
                        {ev.actionText} <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
