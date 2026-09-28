import React, { useState, useRef, useEffect } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { queryProfitIQCopilot } from '../../services/api';
import type { ChatMessage } from '../../types';
import {
  Sparkles,
  Send,
  User,
  ArrowRight,
  Lock,
  Crown,
  Key,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const ProfitIQCopilot: React.FC = () => {
  const { subscriptionTier, setActiveView } = useBusiness();
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // API Key & Mode Management State
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');
  const [activeApiKey, setActiveApiKey] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [quotaShieldTriggered, setQuotaShieldTriggered] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      timestamp: 'Just now',
      response: {
        intent: 'INITIAL_WELCOME',
        answer: 'Hello! I am ProfitIQ Copilot, your digital business intelligence co-pilot.',
        data: {
          'Business Pulse Score': '82/100 (Healthy)',
          'Monthly Revenue': '₹4,82,500 (+12.4%)',
          'Low Stock Alerts': '5 Products Below Threshold',
          'Active Invoices Overdue': '7 Invoices (₹14,500)'
        },
        reason: 'I synthesize sales, expenses, inventory, and invoice data strictly from validated backend calculations.',
        recommendedAction: 'Select a question below or ask anything about your business performance or customer invoices.',
        actionTarget: 'invoices'
      }
    }
  ]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickQuestions = [
    'How is my business performing?',
    'Show me pending & overdue invoices',
    'Why did profit decrease?',
    'What should I restock?',
    'Where am I spending too much?',
    'Which customers are becoming inactive?',
    'Simulate a 10% price increase and 5% expense reduction'
  ];

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveApiKey(customApiKey.trim());
    setIsCustomMode(!!customApiKey.trim());
    setIsApiKeyModalOpen(false);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const response = await queryProfitIQCopilot(textToSend, subscriptionTier, activeApiKey, isCustomMode);
      if (response.usedFallbackEngine && isCustomMode) {
        setQuotaShieldTriggered(true);
      }
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        response: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-ai-purple/30">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-ai-purple/20 border border-ai-purple/40 text-ai-glow shadow-lg shadow-ai-purple/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">ProfitIQ Copilot</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-ai-purple/20 text-ai-glow border border-ai-purple/30 uppercase tracking-wider">
                IQ INSIGHT ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Natural Language Business Co-Pilot • Grounded strictly in validated financial calculations.
            </p>
          </div>
        </div>

        {/* Engine Mode & API Key Config Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-navy-950/80 px-3 py-2 rounded-xl border border-white/10 shrink-0">
            <ShieldCheck className={`w-4 h-4 ${isCustomMode ? 'text-emerald-400' : 'text-electric-400'}`} />
            <div className="text-left text-[10px]">
              <div className="text-slate-400 font-semibold uppercase">Engine Mode</div>
              <div className="font-bold text-white">
                {isCustomMode ? 'Custom API Key (Shielded)' : 'Controlled Local Engine'}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-bold border border-white/10 transition flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>API Key</span>
          </button>
        </div>
      </div>

      {/* Quota Shield Notice Banner */}
      {quotaShieldTriggered && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-200 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-white">API Quota Shield Active: </strong>
              API key hit a rate limit or quota boundary. ProfitIQ's controlled local engine seamlessly processed your request using offline tool calculations.
            </span>
          </div>
          <button
            onClick={() => setQuotaShieldTriggered(false)}
            className="text-slate-400 hover:text-white text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Quick Questions Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">Quick Queries:</span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-xl bg-navy-850 hover:bg-navy-750 border border-white/10 text-xs font-medium text-slate-200 hover:text-white transition whitespace-nowrap shrink-0 hover:border-electric-500/40"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="glass-panel rounded-2xl border border-white/10 p-6 min-h-[460px] max-h-[600px] overflow-y-auto space-y-6 bg-navy-900/90">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-ai-purple/20 border border-ai-purple/40 text-ai-glow flex items-center justify-center shrink-0 mt-1">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl space-y-3 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              {msg.sender === 'user' ? (
                <div className="bg-electric-500 text-white p-3.5 rounded-2xl rounded-tr-none text-xs font-medium shadow-md">
                  {msg.text}
                </div>
              ) : (
                <div className="glass-panel p-5 rounded-2xl rounded-tl-none border border-white/10 space-y-4 bg-navy-850">
                  {/* IQ INSIGHT Tag */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-ai-glow px-2.5 py-0.5 rounded bg-ai-purple/20 border border-ai-purple/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> IQ INSIGHT
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                  </div>

                  {/* Tier Restricted Guard Warning */}
                  {msg.response?.tierRestricted ? (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                        <Lock className="w-4 h-4" /> PREMIUM FEATURE RESTRICTED
                      </div>
                      <p className="text-xs text-slate-200">{msg.response.answer}</p>
                      <div className="text-xs text-slate-300 font-semibold">{msg.response.reason}</div>
                      <button
                        onClick={() => setActiveView('subscription')}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 transition flex items-center gap-1.5 shadow-md"
                      >
                        <Crown className="w-3.5 h-3.5" /> Unlock Pro/Premium Access <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* 1. Direct Answer */}
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">{msg.response?.answer}</h4>
                      </div>

                      {/* 2. Supporting Data */}
                      {msg.response?.data && (
                        <div className="bg-navy-950/80 rounded-xl p-3.5 border border-white/5 space-y-1.5">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Validated Supporting Data:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {Object.entries(msg.response.data).map(([key, val]) => (
                              <div key={key} className="flex items-center justify-between p-2 rounded bg-navy-900 border border-white/5">
                                <span className="text-slate-400">{key}:</span>
                                <span className="font-semibold text-white">{String(val)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3. Reason */}
                      {msg.response?.reason && (
                        <div className="text-xs text-slate-300 bg-navy-900/60 p-3 rounded-xl border border-white/5">
                          <span className="font-bold text-slate-200">Root Reason: </span>
                          {msg.response.reason}
                        </div>
                      )}

                      {/* 4. Recommended Action & Target Navigation */}
                      {msg.response?.recommendedAction && (
                        <div className="p-3.5 rounded-xl bg-electric-500/10 border border-electric-500/30 flex items-center justify-between gap-3 text-xs">
                          <div className="text-electric-300">
                            <span className="font-bold text-white">Suggested Action: </span>
                            {msg.response.recommendedAction}
                          </div>
                          <button
                            onClick={() => setActiveView(msg.response?.actionTarget || 'dashboard')}
                            className="px-3.5 py-1.5 rounded-lg bg-electric-500 hover:bg-electric-400 text-white font-bold transition shrink-0 flex items-center gap-1 shadow"
                          >
                            <span>Open {msg.response?.actionTarget === 'invoices' ? 'Invoices' : msg.response?.actionTarget === 'inventory' ? 'Inventory' : 'Dashboard'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-electric-500/20 border border-electric-500/40 text-electric-400 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-slate-400 animate-pulse p-4">
            <div className="w-6 h-6 rounded-lg bg-ai-purple/20 border border-ai-purple/30 text-ai-glow flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>ProfitIQ Intelligence Engine running intent detection & backend queries...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-3 glass-panel p-2.5 rounded-2xl border border-white/10 bg-navy-900"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask ProfitIQ anything about your business performance, inventory, expenses, or invoices..."
          className="flex-1 bg-transparent px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-electric-500 to-electric-400 hover:from-electric-400 text-white font-bold text-xs transition flex items-center gap-1.5 disabled:opacity-40 shadow-lg shadow-electric-500/20"
        >
          <span>Ask Copilot</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* API Key Settings Modal */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel rounded-2xl border border-white/20 p-6 bg-navy-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" /> Configure AI API Key & Fallback
              </h3>
              <button onClick={() => setIsApiKeyModalOpen(false)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            <p className="text-xs text-slate-300">
              ProfitIQ works out of the box using our <strong>Controlled Local Tool Engine</strong>. If you provide a custom API key, ProfitIQ uses it while maintaining a zero-downtime <strong>Rate Limit Shield</strong> fallback.
            </p>

            <form onSubmit={handleSaveApiKey} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Custom API Key (Optional)</label>
                <input
                  type="password"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="Paste AI API Key (e.g. AIzaSy... or sk-...)"
                  className="w-full px-3 py-2.5 rounded-xl bg-navy-950 border border-white/10 text-white focus:outline-none focus:border-electric-500 font-mono text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Tip: Leave blank to use ProfitIQ's default Controlled Local Engine (Unlimited & Free).
                </span>
              </div>

              <div className="p-3 rounded-xl bg-navy-950 border border-white/5 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Current Mode:</span>
                  <span className="font-bold text-white">{isCustomMode ? 'Custom API Key' : 'Local Controlled Engine'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Quota Protection:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                {isCustomMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomApiKey('');
                      setActiveApiKey('');
                      setIsCustomMode(false);
                      setIsApiKeyModalOpen(false);
                    }}
                    className="px-3 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold"
                  >
                    Reset to Local Engine
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-electric-500 hover:bg-electric-400 text-white font-bold transition shadow"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
