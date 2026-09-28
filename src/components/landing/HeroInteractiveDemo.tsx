import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, CreditCard, Users, Sparkles, ArrowRight, CheckCircle2, Play } from 'lucide-react';

export const HeroInteractiveDemo: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(4); // 0..5
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStage(prev => (prev + 1) % 6);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const stages = [
    {
      id: 0,
      label: 'Sales Stream',
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30',
      data: '₹4,82,500 (+12.4% Weekend Peak)'
    },
    {
      id: 1,
      label: 'Inventory Stream',
      icon: Package,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/30',
      data: '5 SKUs Below Lead-Time Safety Stock'
    },
    {
      id: 2,
      label: 'Expense Stream',
      icon: CreditCard,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/30',
      data: 'Freight Transport +23.5% Anomaly'
    },
    {
      id: 3,
      label: 'Customer Stream',
      icon: Users,
      color: 'text-electric-400',
      bgColor: 'bg-electric-500/10 border-electric-500/30',
      data: '342 Active • 18 Inactive Re-engagement'
    },
    {
      id: 4,
      label: 'AI Engine Analysis',
      icon: Sparkles,
      color: 'text-ai-glow',
      bgColor: 'bg-ai-purple/20 border-ai-purple/40',
      data: 'Processing 1,420 signal data points...'
    },
    {
      id: 5,
      label: 'Business Actions',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20 border-emerald-500/40',
      data: 'Restock PO Generated • 4 Actions Ready'
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl glass-panel p-6 border border-white/10 shadow-2xl relative overflow-hidden my-8">
      {/* Background Particle Animation Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-electric-500/5 via-ai-purple/5 to-transparent pointer-events-none" />
      
      {/* Top Controls */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs text-slate-400 font-mono ml-2">profitiq-intelligence-engine // live-stream</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-navy-800 text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition"
          >
            <Play className={`w-3 h-3 ${isPlaying ? 'fill-electric-400 text-electric-400' : ''}`} />
            {isPlaying ? 'Pause Simulation' : 'Play Simulation'}
          </button>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE SIMULATION
          </span>
        </div>
      </div>

      {/* Interactive Data Stream Flow Visualizer */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        {stages.map((stg) => {
          const Icon = stg.icon;
          const isActive = activeStage === stg.id;
          return (
            <button
              key={stg.id}
              onClick={() => {
                setActiveStage(stg.id);
                setIsPlaying(false);
              }}
              className={`p-3 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between h-24 ${
                isActive
                  ? `${stg.bgColor} ring-2 ring-electric-500/50 scale-[1.03] shadow-lg`
                  : 'bg-navy-900/60 border-white/5 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Icon className={`w-5 h-5 ${stg.color}`} />
                <span className="text-[10px] font-mono text-slate-400">0{stg.id + 1}</span>
              </div>
              <div className="text-xs font-semibold text-slate-200 leading-tight">
                {stg.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Data Stream Particle Line */}
      <div className="relative w-full h-1 bg-navy-900 rounded-full mb-6 overflow-hidden">
        <div
          className="absolute top-0 bottom-0 bg-gradient-to-r from-electric-500 via-ai-purple to-emerald-400 rounded-full transition-all duration-500"
          style={{
            left: `${(activeStage / 6) * 100}%`,
            width: '33%'
          }}
        />
      </div>

      {/* AI Insight Highlight Card */}
      <div className="rounded-xl bg-gradient-to-r from-navy-900/90 via-navy-850 to-navy-900 border border-ai-purple/30 p-5 relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-ai-purple/20 border border-ai-purple/40 text-ai-glow mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-ai-glow px-2 py-0.5 rounded bg-ai-purple/20 border border-ai-purple/30">
                  IQ INSIGHT DETECTED
                </span>
                <span className="text-xs text-slate-400 font-mono">Stream Signal #482</span>
              </div>
              <h4 className="text-base font-semibold text-white mb-1">
                Weekend sales are 23% higher than weekday sales.
              </h4>
              <p className="text-sm text-slate-300">
                Current inventory depleted 1.8 days earlier than predicted. Safety stock threshold reached for 5 items.
              </p>
            </div>
          </div>
        </div>

        {/* Action Recommendation Box */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-electric-500/10 p-3.5 rounded-lg border border-electric-500/20">
          <div className="flex items-center gap-2 text-sm text-electric-300">
            <span className="font-semibold text-white">Recommended Action:</span>
            <span>Increase weekend inventory safety stock by approximately 15%.</span>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-bold text-white bg-electric-500 hover:bg-electric-400 px-3.5 py-1.5 rounded-lg transition shadow-md shadow-electric-500/20 shrink-0">
            Auto-Generate PO <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
