import React from 'react';
import { Building2, ShieldCheck, PhoneCall, Mail, MapPin, Sparkles, Send, Award } from 'lucide-react';

interface FooterProps {
  onSelectCity: (city: string) => void;
  onNavigateCategory: (category: string) => void;
  onOpenEMICalculator: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCity, onNavigateCategory, onOpenEMICalculator }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Banner Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center space-x-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">100,000+</p>
              <p className="text-xs text-slate-400">Verified Property Listings</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">100% RERA</p>
              <p className="text-xs text-slate-400">Audited Builder Projects</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">0% Brokerage</p>
              <p className="text-xs text-slate-400">Direct Owner Contact</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">AI Assistant</p>
              <p className="text-xs text-slate-400">Smart Property Matcher</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
                <Building2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-extrabold text-white">
                Shine <span className="text-blue-500 font-serif italic">Native</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Shine Native is India’s premier next-generation real estate marketplace. Explore verified flats, luxury villas, commercial IT parks, and plot developments with complete transparency and zero stress.
            </p>
            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-blue-500" />
                <span>24/7 Helpline: +91 1800 266 8899</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>support@shinenative.com</span>
              </div>
            </div>
          </div>

          {/* Col 1: Popular Cities */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-blue-400">
              Popular Cities
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {['Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad', 'Pune', 'Goa'].map((city) => (
                <li key={city}>
                  <button
                    onClick={() => onSelectCity(city)}
                    className="hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    Properties in {city}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Categories & Tools */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-blue-400">
              Property Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigateCategory('luxury')} className="hover:text-blue-400 cursor-pointer">
                  Luxury Sea View Apartments
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateCategory('residential')} className="hover:text-blue-400 cursor-pointer">
                  Flats for Sale & Rent
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateCategory('commercial')} className="hover:text-blue-400 cursor-pointer">
                  Commercial Offices & Retail
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateCategory('plots')} className="hover:text-blue-400 cursor-pointer">
                  Residential Plots & Land
                </button>
              </li>
              <li>
                <button onClick={onOpenEMICalculator} className="hover:text-blue-400 font-semibold text-blue-400 cursor-pointer">
                  Home Loan EMI Calculator
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Newsletter & App */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-blue-400">
              Stay Informed
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to weekly price trend alerts and exclusive pre-launch builder deals.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to Shine Native Newsletter!'); }} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-hidden focus:border-blue-500 placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Shine Native Marketplace Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">RERA Guidelines</span>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer transition-all"
            >
              Clear Cache / Reset Storage
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
