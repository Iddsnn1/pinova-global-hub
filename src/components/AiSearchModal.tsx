import React, { useState } from 'react';
import { X, Sparkles, Search, ArrowRight, Loader2, Bot, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface AiSearchModalProps {
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const AiSearchModal: React.FC<AiSearchModalProps> = ({
  onClose,
  products,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    aiInsights: string;
    recommendedProductIds: string[];
    suggestedCategory?: string;
  } | null>(null);

  const suggestionChips = [
    'Find high-rated physical tech under 40 Pi',
    'Instant mobile airtime top-up for MTN Nigeria',
    'Digital downloads & SaaS source code scripts',
    'Utility electricity tokens and water bills',
    'Amazon and Gaming Gift Cards in Pi Coin'
  ];

  const handleAiSearch = async (searchPrompt: string) => {
    if (!searchPrompt.trim()) return;
    setQuery(searchPrompt);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchPrompt, catalog: products })
      });
      const data = await res.json();
      setAiResult(data);
    } catch (err) {
      console.error('AI Search client error:', err);
    } finally {
      setLoading(false);
    }
  };

  const matchedProducts = aiResult
    ? products.filter((p) => aiResult.recommendedProductIds.includes(p.id))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header Bar */}
        <div className="p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between border-b border-purple-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-400/30">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-none text-white">Gemini AI Shopping Concierge</h2>
              <p className="text-xs text-purple-300 mt-1 font-medium">Ask in natural language for instant product matching in Pi Coin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Box */}
        <div className="p-6 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. 'I want to buy a hardware crypto wallet or airtime under 30 Pi...'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiSearch(query)}
              className="w-full pl-11 pr-28 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-2xl border border-slate-300 dark:border-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <button
              onClick={() => handleAiSearch(query)}
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Ask AI</span>}
            </button>
          </div>

          {/* Prompt Suggestion Chips */}
          <div className="flex flex-wrap gap-1.5">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleAiSearch(chip)}
                className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/80 border border-purple-200 dark:border-purple-800/60 text-[11px] font-semibold transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* AI Result Area */}
          {loading && (
            <div className="py-8 flex flex-col items-center justify-center space-y-2 text-slate-500">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
              <p className="text-xs font-semibold">Gemini AI is scanning the PiNova Catalog...</p>
            </div>
          )}

          {aiResult && !loading && (
            <div className="mt-4 space-y-4 max-h-[45vh] overflow-y-auto pr-1">
              {/* AI Insights Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-800/60 flex items-start gap-3">
                <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-purple-900 dark:text-purple-200 uppercase tracking-wider">AI Shopping Recommendation</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{aiResult.aiInsights}</p>
                </div>
              </div>

              {/* Matched Products List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Matched Products ({matchedProducts.length})
                </h4>

                {matchedProducts.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No exact products found for this prompt. Try one of the suggestions above!</p>
                ) : (
                  matchedProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-purple-500 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt={p.title} referrerPolicy="no-referrer" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">{p.title}</h5>
                          <p className="text-[11px] text-slate-400">{p.sellerName} • {p.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-black text-amber-500 text-sm">{p.pricePi.toFixed(2)} π</span>
                        <ArrowRight className="w-4 h-4 text-purple-500" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
