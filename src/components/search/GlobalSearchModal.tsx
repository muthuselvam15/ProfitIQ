import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { Search, X, Sparkles, CornerDownLeft } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setActiveView } = useBusiness();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const sampleQueries = [
    'Show products that may run out this week',
    'Which expenses increased the most?',
    'Show customers with outstanding payments',
    'What were my top products last month?',
    'Compare this month with last month'
  ];

  const handleExecuteSearch = (qText: string) => {
    const q = qText.toLowerCase();
    setIsSearchOpen(false);
    setQuery('');

    if (q.includes('run out') || q.includes('product') || q.includes('stock')) {
      setActiveView('inventory');
    } else if (q.includes('expense') || q.includes('spend')) {
      setActiveView('expenses');
    } else if (q.includes('customer') || q.includes('outstanding') || q.includes('overdue')) {
      setActiveView('invoices');
    } else {
      setActiveView('copilot');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl glass-panel rounded-2xl border border-electric-500/40 p-4 shadow-2xl bg-navy-900 space-y-4">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 bg-navy-950 px-4 py-3 rounded-xl border border-white/10">
          <Search className="w-5 h-5 text-electric-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) handleExecuteSearch(query);
            }}
            placeholder="Ask ProfitIQ anything in natural language..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button onClick={() => setIsSearchOpen(false)} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sample Suggestions */}
        <div className="space-y-2 pt-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-2">
            <Sparkles className="w-3.5 h-3.5 text-ai-glow" /> Natural Language Suggestions:
          </div>

          <div className="space-y-1">
            {sampleQueries.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => handleExecuteSearch(sq)}
                className="w-full text-left p-3 rounded-xl hover:bg-navy-800 transition flex items-center justify-between text-xs text-slate-200 hover:text-white group border border-transparent hover:border-white/10"
              >
                <span>{sq}</span>
                <CornerDownLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-electric-400 transition" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
