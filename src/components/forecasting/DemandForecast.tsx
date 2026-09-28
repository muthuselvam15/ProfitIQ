import React from 'react';
import { MOCK_FORECAST_DATA } from '../../services/mockData';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { TrendingUp, Sparkles, Info } from 'lucide-react';

export const DemandForecast: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" /> Sales & Demand Forecast — Next 30 Days
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Predictive demand modeling combining historical daily sales velocity, seasonal weekend surges, and confidence bands.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-ai-purple/20 border border-ai-purple/30 text-ai-glow text-xs font-semibold">
          <Sparkles className="w-4 h-4" /> AI Confidence Band: 94.2%
        </div>
      </div>

      {/* Insight Highlight Alert Box */}
      <div className="glass-panel p-5 rounded-2xl border border-electric-500/30 bg-gradient-to-r from-navy-850 via-navy-900 to-navy-950 flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-electric-500/20 border border-electric-500/40 text-electric-300 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <div className="font-bold text-white flex items-center gap-2">
            <span>IQ PATTERN DETECTED: Weekend Demand Surge</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
              +23.5% Weekend Boost
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Historical sales patterns indicate weekend sales consistently outperform weekday baselines. Predictions account for upcoming weekend peaks on Oct 05, Oct 20, and Oct 30.
          </p>
          <div className="text-slate-400 font-mono text-[11px] pt-1">
            * Note: All future values are statistical scenario estimates, not guaranteed contract commitments.
          </div>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-3 rounded-sm bg-emerald-400" /> Past Actual Sales
            </span>
            <span className="flex items-center gap-1.5 text-electric-400">
              <span className="w-3 h-3 rounded-sm bg-electric-400" /> AI Forecast (Predicted)
            </span>
            <span className="flex items-center gap-1.5 text-ai-glow">
              <span className="w-3 h-3 rounded-sm bg-ai-purple/40" /> Confidence Range
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Past 30 Days ──────── NOW ──────── Next 30 Days</span>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={MOCK_FORECAST_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8A2BE2" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8A2BE2" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(val) => `₹${val/1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B132B',
                  borderColor: 'rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
              />
              <Area type="monotone" dataKey="upperBound" stroke="none" fill="url(#forecastArea)" name="Upper Confidence" />
              <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} name="Actual Sales" />
              <Line type="monotone" dataKey="predicted" stroke="#3385FF" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} name="Predicted Sales" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forecast Breakdown Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase">Projected 30-Day Revenue</div>
          <div className="text-2xl font-extrabold text-white">₹5,42,000</div>
          <div className="text-xs text-emerald-400 font-semibold">+12.3% growth vs trailing 30 days</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase">Peak Demand Days</div>
          <div className="text-2xl font-extrabold text-white">Saturdays & Sundays</div>
          <div className="text-xs text-electric-300 font-semibold">Est. ₹22,500 daily weekend average</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase">Recommended Stock Target</div>
          <div className="text-2xl font-extrabold text-white">1,250 Units Total</div>
          <div className="text-xs text-amber-400 font-semibold">Prevent stockouts on top 5 SKUs</div>
        </div>
      </div>
    </div>
  );
};
