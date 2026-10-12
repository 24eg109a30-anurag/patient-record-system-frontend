import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, Copy, Check, ShieldCheck, Lightbulb } from 'lucide-react';
import { EhrApi } from '../../api/client';
import { ClinicalQueryResponse, Citation } from '../../types';

interface AiClinicalAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: Citation[];
  latency?: number;
}

const QUICK_PROMPTS = [
  { label: 'Summarize cardiac complaints and stent history', hint: 'Catch up in seconds' },
  { label: 'Check potential drug interactions', hint: 'Stay safe' },
  { label: 'List abnormal or critical lab values', hint: 'What needs attention' },
];

function renderFriendly(text: string): React.ReactNode {
  return text.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      return <h4 key={i} className="font-display font-bold text-slate-900 text-[13px] mt-1 mb-1">{trimmed.slice(4)}</h4>;
    }
    if (/^\d+\.\s+\*\*.+\*\*/.test(trimmed)) {
      return <p key={i} className="font-semibold text-slate-800 mt-2">{trimmed.replace(/\*\*/g, '')}</p>;
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      return <li key={i} className="ml-4 list-disc marker:text-teal-500">{trimmed.slice(2).replace(/\*\*/g, '')}</li>;
    }
    if (!trimmed) return <div key={i} className="h-1.5" />;
    return <p key={i} className="leading-relaxed">{trimmed.replace(/\*\*/g, '')}</p>;
  });
}

export const AiClinicalAssistantDrawer: React.FC<AiClinicalAssistantDrawerProps> = ({
  isOpen,
  onClose,
  patientId,
  patientName,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hi there! I've read through ${patientName}'s visits, labs, and medicines so you don't have to. Ask me anything — like a catch-up summary or what to double-check.`,
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && typeof el.scrollTo === 'function') {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (queryText: string) => {
    const textToSend = queryText.trim();
    if (!textToSend || isLoading) return;

    setMessages((prev) => [...prev, { id: 'msg-' + Date.now(), sender: 'user', text: textToSend }]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response: ClinicalQueryResponse = await EhrApi.queryClinicalAssistant(patientId, textToSend);
      setMessages((prev) => [
        ...prev,
        { id: 'msg-' + (Date.now() + 1), sender: 'assistant', text: response.answer, citations: response.citations, latency: response.processingTimeMs },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: 'err-' + Date.now(), sender: 'assistant', text: 'Sorry — I couldn\'t pull the records just now. Please try again in a moment.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end animate-fade" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-[#FBFCFB] h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slide-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 bg-white border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900">AI Clinical Assistant</h3>
              <p className="text-xs text-slate-400">Reading {patientName}&apos;s chart · answers with sources</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition" aria-label="Close assistant">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 py-3 bg-white border-b border-slate-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5" /> Try asking
          </p>
          <div className="flex flex-col gap-1.5">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt.label}
                onClick={() => handleSend(prompt.label)}
                disabled={isLoading}
                className="text-left text-xs bg-slate-50 hover:bg-teal-50 hover:border-teal-200 border border-slate-200 px-3 py-2.5 rounded-xl text-slate-700 transition disabled:opacity-50"
              >
                <span className="font-semibold block">{prompt.label}</span>
                <span className="text-[11px] text-slate-400">{prompt.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`max-w-[86%] rounded-2xl p-3.5 text-[13px] leading-relaxed ${msg.sender === 'user' ? 'bg-teal-600 text-white rounded-br-md' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm'}`}>
                <div>{renderFriendly(msg.text)}</div>
                {msg.sender === 'assistant' && msg.id !== 'init-1' && (
                  <button
                    onClick={() => copyText(msg.id, msg.text)}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-teal-700 transition"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === msg.id ? 'Copied!' : 'Copy summary'}
                  </button>
                )}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Where this came from</span>
                    {msg.citations.map((c, i) => (
                      <div key={i} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-xs text-slate-800">{c.documentName}</span>
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-full shrink-0">
                            {(c.similarityScore * 100).toFixed(0)}% match
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">“{c.excerpt}”</p>
                        <p className="text-[10px] text-slate-400 mt-1">{c.encounterDate}</p>
                      </div>
                    ))}
                    {typeof msg.latency === 'number' && (
                      <p className="text-[10px] text-slate-400">Answered in {(msg.latency / 1000).toFixed(1)}s from the chart</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center">
              <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2 shadow-sm">
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                <span className="text-xs text-slate-500 ml-1">Reading the chart…</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-3.5 bg-white border-t border-slate-200/80">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(inputQuery); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about visits, medicines, labs…"
              className="input-friendly"
            />
            <button type="submit" disabled={isLoading || !inputQuery.trim()} className="btn-primary !px-3.5" aria-label="Send question">
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 justify-center">
            <ShieldCheck className="w-3 h-3" /> AI summaries help — your doctor makes the final call.
          </p>
        </div>
      </div>
    </div>
  );
};
