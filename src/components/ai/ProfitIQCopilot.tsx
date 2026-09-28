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
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const ProfitIQCopilot: React.FC = () => {
  const { subscriptionTier, setActiveView } = useBusiness();
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [failedQuery, setFailedQuery] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      timestamp: 'Just now',
      response: {
        intent: 'INITIAL_WELCOME',
        answer: 'Hello! I’m ProfitIQ Copilot. I can answer questions from the records saved for your business.',
        reason: 'Answers use saved sales, inventory, customer, invoice, and expense data. I’ll say when a record or comparison is unavailable.',
        recommendedAction: 'Ask about sales, profit margin, inventory, customers, invoices, expenses, or a scenario.',
        actionTarget: 'dashboard',
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

  const handleSend = async (queryText?: string, retry = false) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    if (!retry) {
      const userMsg: ChatMessage = {
        id: `usr-${Date.now()}`,
        sender: 'user',
        text: textToSend,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, userMsg]);
    }
    if (!queryText) setInputQuery('');
    setRequestError('');
    setLoading(true);

    try {
      const response = await queryProfitIQCopilot(textToSend, subscriptionTier);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        response: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setFailedQuery('');
    } catch (err) {
      setFailedQuery(textToSend);
      setRequestError(err instanceof Error ? err.message : 'The Copilot could not reach the business data service.');
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

        <div className="flex items-center gap-2 bg-navy-950/80 px-3 py-2 rounded-xl border border-white/10 shrink-0">
          <ShieldCheck className="w-4 h-4 text-electric-400" />
          <div className="text-left text-[10px]">
            <div className="text-slate-400 font-semibold uppercase">Data Source</div>
            <div className="font-bold text-white">Saved Business Records</div>
          </div>
        </div>
      </div>

      {requestError && (
        <div role="alert" className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{requestError}</span>
          </div>
          <button onClick={() => void handleSend(failedQuery, true)} disabled={loading || !failedQuery} className="text-amber-200 hover:text-white text-xs font-bold disabled:opacity-50">Retry</button>
        </div>
      )}

      {/* Quick Questions Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">Quick Queries:</span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-navy-850 hover:bg-navy-750 border border-white/10 text-xs font-medium text-slate-200 hover:text-white transition whitespace-nowrap shrink-0 hover:border-electric-500/40 disabled:opacity-50"
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
        <textarea
          rows={1}
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void handleSend();
            }
          }}
          placeholder="Ask about your saved sales, inventory, expenses, customers, or invoices..."
          className="flex-1 bg-transparent px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none resize-y min-h-10 max-h-32"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-electric-500 to-electric-400 hover:from-electric-400 text-white font-bold text-xs transition flex items-center gap-1.5 disabled:opacity-40 shadow-lg shadow-electric-500/20"
        >
          <span>{loading ? 'Thinking...' : 'Ask Copilot'}</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
};
