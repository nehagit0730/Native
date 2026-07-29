import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2, ArrowRight } from 'lucide-react';
import { Property } from '../types';
import { askGeminiPropertyAdvisor } from '../services/api';
import { PropertyCard } from './PropertyCard';

interface AISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedIds: string[];
  comparedIds: string[];
  onToggleSave: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onContactClick: (property: Property, type: 'call' | 'whatsapp') => void;
}

const SAMPLE_PROMPTS = [
  'Find me a sea facing 4 BHK residence in Mumbai under 9 Cr with private pool',
  'Looking for a 2 BHK fully furnished flat for rent in Gachibowli Hyderabad under 50k',
  'Show me luxury 3 BHK villas in Assagao Goa with garden',
  'Commercial IT park office space in Pune with 100+ seats'
];

export const AISearchModal: React.FC<AISearchModalProps> = ({
  isOpen,
  onClose,
  savedIds,
  comparedIds,
  onToggleSave,
  onToggleCompare,
  onSelectProperty,
  onContactClick
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [results, setResults] = useState<Property[]>([]);

  if (!isOpen) return null;

  const handleAsk = async (userPrompt: string) => {
    if (!userPrompt.trim()) return;
    setLoading(true);
    setExplanation(null);
    try {
      const data = await askGeminiPropertyAdvisor(userPrompt);
      setExplanation(data.explanation);
      setResults(data.properties);
    } catch (err) {
      setExplanation('Unable to contact AI advisor at this moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 flex items-center justify-between relative">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-400/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                Shine Native AI Property Advisor
              </h2>
              <p className="text-xs text-blue-300/80">
                Powered by Gemini AI • Describe your dream property in plain English
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input area */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(prompt);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Need a luxury 3 BHK near Metro in Whitefield with swimming pool under 2 Cr..."
              className="flex-1 bg-white border border-slate-300 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-hidden focus:border-blue-500 shadow-xs"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <>
                  <span>Match</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sample prompts */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Try asking:</span>
            {SAMPLE_PROMPTS.map((sp) => (
              <button
                key={sp}
                onClick={() => {
                  setPrompt(sp);
                  handleAsk(sp);
                }}
                className="bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 hover:border-blue-300 px-3 py-1 rounded-xl transition-all cursor-pointer truncate max-w-xs"
              >
                "{sp}"
              </button>
            ))}
          </div>
        </div>

        {/* Output section */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {explanation && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-slate-800 text-sm space-y-2">
              <div className="flex items-center space-x-2 text-blue-900 font-bold">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AI Recommendation Insight</span>
              </div>
              <p className="text-slate-700 leading-relaxed">{explanation}</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Recommended Properties ({results.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    isSaved={savedIds.includes(prop.id)}
                    isCompared={comparedIds.includes(prop.id)}
                    onToggleSave={onToggleSave}
                    onToggleCompare={onToggleCompare}
                    onSelectProperty={(p) => {
                      onClose();
                      onSelectProperty(p);
                    }}
                    onContactClick={onContactClick}
                  />
                ))}
              </div>
            </div>
          )}

          {!explanation && !loading && (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Sparkles className="w-12 h-12 mx-auto text-blue-400/50" />
              <p className="text-sm font-medium">
                Enter your real estate preferences above and let Gemini AI curate matching listings instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
