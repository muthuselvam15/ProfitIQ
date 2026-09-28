import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { Bell, Clock, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export const AlertCenter: React.FC = () => {
  const { alerts, setAlerts, markAlertRead } = useBusiness();
  const [filter, setFilter] = useState<string>('ALL');

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'RESOLVED' } : a));
  };

  const snoozeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'SNOOZED' } : a));
  };

  const filtered = alerts.filter(a => filter === 'ALL' || a.type === filter);

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-electric-400" /> Smart Alert Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Categorized notifications and operational business alerts. Mark read, resolved, or snooze.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-navy-950 p-1 rounded-xl border border-white/10 text-xs">
          {['ALL', 'ACTION_REQUIRED', 'ATTENTION', 'POSITIVE', 'AI_INSIGHT'].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filter === t ? 'bg-electric-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t === 'ALL' ? 'ALL' : t === 'ACTION_REQUIRED' ? '🔴 Action' : t === 'ATTENTION' ? '🟡 Attention' : t === 'POSITIVE' ? '🟢 Positive' : '🔵 AI'}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-4">
        {filtered.map((alt) => {
          const isRed = alt.type === 'ACTION_REQUIRED';
          const isYellow = alt.type === 'ATTENTION';
          const isGreen = alt.type === 'POSITIVE';
          const isBlue = alt.type === 'AI_INSIGHT';

          return (
            <div
              key={alt.id}
              className={`glass-panel p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                alt.status === 'READ' ? 'opacity-70' : ''
              } ${
                isRed ? 'border-rose-500/40 bg-rose-500/5' :
                isYellow ? 'border-amber-500/40 bg-amber-500/5' :
                isGreen ? 'border-emerald-500/40 bg-emerald-500/5' :
                'border-ai-purple/40 bg-ai-purple/5'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  isRed ? 'bg-rose-500/20 text-rose-400' :
                  isYellow ? 'bg-amber-500/20 text-amber-400' :
                  isGreen ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-ai-purple/20 text-ai-glow'
                }`}>
                  {isRed && <AlertTriangle className="w-5 h-5" />}
                  {isYellow && <Clock className="w-5 h-5" />}
                  {isGreen && <CheckCircle2 className="w-5 h-5" />}
                  {isBlue && <Sparkles className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white">{alt.title}</h3>
                    <span className="text-[10px] font-mono text-slate-400">{alt.timestamp}</span>
                    {alt.status === 'UNREAD' && (
                      <span className="w-2 h-2 rounded-full bg-electric-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300">{alt.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
                {alt.status !== 'READ' && (
                  <button
                    onClick={() => markAlertRead(alt.id)}
                    className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 text-xs font-semibold border border-white/10 transition"
                  >
                    Mark Read
                  </button>
                )}

                <button
                  onClick={() => snoozeAlert(alt.id)}
                  className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 text-xs font-semibold border border-white/10 transition"
                >
                  Snooze
                </button>

                <button
                  onClick={() => resolveAlert(alt.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition"
                >
                  Resolve
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
