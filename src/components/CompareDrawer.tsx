import React, { useState } from 'react';
import { X, Scale, Check, Trash2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Property } from '../types';

interface CompareDrawerProps {
  comparedProperties: Property[];
  onRemoveCompare: (id: string) => void;
  onClearCompare: () => void;
  onSelectProperty: (property: Property) => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  comparedProperties,
  onRemoveCompare,
  onClearCompare,
  onSelectProperty
}) => {
  const [showFullModal, setShowFullModal] = useState(false);

  if (comparedProperties.length === 0) return null;

  return (
    <>
      {/* Bottom Sticky Drawer Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 p-3 sm:px-6 flex items-center justify-between gap-4 max-w-2xl w-[92%] animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center space-x-3 overflow-x-auto py-1">
          <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs shrink-0">
            <Scale className="w-4 h-4" />
            <span>Compare ({comparedProperties.length}/3):</span>
          </div>

          <div className="flex items-center space-x-2">
            {comparedProperties.map((p) => (
              <div key={p.id} className="relative group shrink-0">
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-600"
                />
                <button
                  onClick={() => onRemoveCompare(p.id)}
                  className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white p-0.5 rounded-full text-[10px] shadow-md hover:scale-110 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setShowFullModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClearCompare}
            className="p-2 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Full Screen Comparison Matrix Modal */}
      {showFullModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Side-by-Side Property Comparison</h2>
                  <p className="text-xs text-slate-400">Comparing {comparedProperties.length} selected listings</p>
                </div>
              </div>
              <button
                onClick={() => setShowFullModal(false)}
                className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Matrix Table */}
            <div className="p-6 overflow-x-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 bg-slate-50 font-bold text-slate-500 w-44">Feature</th>
                    {comparedProperties.map((p) => (
                      <th key={p.id} className="p-3 min-w-[220px]">
                        <div className="space-y-2">
                          <img src={p.images[0]} alt={p.title} className="w-full h-32 object-cover rounded-xl" />
                          <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{p.title}</h4>
                          <p className="text-blue-600 font-extrabold text-base">{p.priceFormatted}</p>
                          <button
                            onClick={() => {
                              setShowFullModal(false);
                              onSelectProperty(p);
                            }}
                            className="w-full bg-slate-900 text-white font-bold py-1.5 rounded-lg text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            View Full Listing
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50">Locality & City</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 text-slate-800 font-medium">{p.locality}, {p.city}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50">Config (BHK)</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 text-slate-800 font-bold">{p.bedrooms} BHK ({p.bathrooms} Baths)</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50">Super Builtup Area</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 text-slate-800 font-bold">{p.areaSqft} sqft</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50">Price / Sqft</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 text-slate-800 font-semibold">₹ {p.pricePerSqft.toLocaleString('en-IN')}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50">Status & Age</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 text-slate-800 capitalize">{p.status.replace('_', ' ')} ({p.constructionAgeYears} yrs)</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50">Locality Rating</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3 text-emerald-600 font-extrabold">{p.localityRating} / 5.0 ⭐</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50">Verification</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-3">
                        {p.verified ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-4 h-4" /> RERA Verified
                          </span>
                        ) : 'Standard'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
