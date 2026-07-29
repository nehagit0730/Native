import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Building2,
  Sparkles,
  SlidersHorizontal,
  Home,
  CheckCircle,
  Key,
  Briefcase,
  Landmark,
  ChevronRight
} from 'lucide-react';
import { PropertyPurpose, PropertyCategory } from '../types';

interface HeroProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  onSearchSubmit: (filters: {
    query: string;
    city: string;
    purpose: PropertyPurpose;
    category: PropertyCategory | 'all';
    bedrooms: number[];
  }) => void;
  onOpenAISearch: () => void;
  onOpenPostProperty: () => void;
}

const CITIES = ['Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad', 'Pune', 'Goa'];

export const Hero: React.FC<HeroProps> = ({
  selectedCity,
  onCityChange,
  onSearchSubmit,
  onOpenAISearch,
  onOpenPostProperty
}) => {
  const [activeTab, setActiveTab] = useState<'sale' | 'rent' | 'projects' | 'commercial' | 'plots'>('sale');
  const [query, setQuery] = useState('');
  const [selectedBHKs, setSelectedBHKs] = useState<number[]>([]);

  const toggleBHK = (bhk: number) => {
    if (selectedBHKs.includes(bhk)) {
      setSelectedBHKs(selectedBHKs.filter(b => b !== bhk));
    } else {
      setSelectedBHKs([...selectedBHKs, bhk]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let purpose: PropertyPurpose = 'sale';
    let category: PropertyCategory | 'all' = 'all';

    if (activeTab === 'rent') purpose = 'rent';
    if (activeTab === 'commercial') category = 'commercial';
    if (activeTab === 'plots') category = 'plots';

    onSearchSubmit({
      query,
      city: selectedCity,
      purpose,
      category,
      bedrooms: selectedBHKs
    });
  };

  return (
    <div className="relative bg-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Hero Wallpaper Image with Soft Blur & Gradient Overlay */}
      <div className="absolute inset-0 z-0 opacity-30">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop"
          alt="Shine Native Luxury Real Estate"
          className="w-full h-full object-cover filter brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/90" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
        {/* Top Eyebrow Tag */}
        <div className="inline-flex items-center space-x-2 bg-slate-800/80 backdrop-blur-md border border-blue-500/30 px-4 py-1.5 rounded-full text-blue-400 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>India’s Most Trusted Real Estate Discovery Engine</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
          Find a Home You’ll <span className="text-blue-400 font-serif italic">Love</span> Native
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Over 100,000+ RERA verified properties, direct owner flats, luxury sea-view residences, and commercial workspaces across India.
        </p>

        {/* Main Search Card */}
        <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-3xl shadow-2xl text-slate-900 border border-white/20 text-left max-w-4xl mx-auto mt-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 pb-4 border-b border-slate-200/80 overflow-x-auto no-scrollbar">
            {[
              { id: 'sale', label: 'Buy Properties', icon: Home },
              { id: 'rent', label: 'Rent Homes', icon: Key },
              { id: 'projects', label: 'New Projects', icon: Building2 },
              { id: 'commercial', label: 'Commercial', icon: Briefcase },
              { id: 'plots', label: 'Plots & Land', icon: Landmark }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Controls */}
          <form onSubmit={handleSearch} className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* City Dropdown */}
              <div className="md:col-span-3 relative">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-blue-600 absolute left-3 top-3.5" />
                  <select
                    value={selectedCity}
                    onChange={(e) => onCityChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location or Keyword Search Bar */}
              <div className="md:col-span-6 relative">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Location / Locality / Landmark
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Bandra West, Whitefield, Golf Course Rd..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Submit Search Button */}
              <div className="md:col-span-3 flex items-end">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Properties</span>
                </button>
              </div>
            </div>

            {/* Quick BHK Filter Pills */}
            {activeTab !== 'plots' && activeTab !== 'commercial' && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 font-semibold text-[11px]">BHK Type:</span>
                  {[1, 2, 3, 4].map((bhk) => (
                    <button
                      key={bhk}
                      type="button"
                      onClick={() => toggleBHK(bhk)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedBHKs.includes(bhk)
                          ? 'bg-slate-900 text-blue-400'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {bhk} BHK
                    </button>
                  ))}
                </div>

                {/* AI Advisor Modal Launcher */}
                <button
                  type="button"
                  onClick={onOpenAISearch}
                  className="text-blue-600 hover:text-blue-700 font-extrabold text-xs flex items-center space-x-1 group cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 group-hover:rotate-12 transition-transform" />
                  <span>Try AI Natural Language Advisor</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Quick Highlights Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-4xl mx-auto text-xs text-slate-300">
          <div className="bg-slate-800/40 backdrop-blur-md p-3 rounded-2xl border border-slate-700/40 text-center">
            <span className="text-blue-400 font-extrabold text-base block">100,000+</span>
            <span className="text-slate-400">Verified Properties</span>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-md p-3 rounded-2xl border border-slate-700/40 text-center">
            <span className="text-blue-400 font-extrabold text-base block">0% Brokerage</span>
            <span className="text-slate-400">Direct Owners</span>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-md p-3 rounded-2xl border border-slate-700/40 text-center">
            <span className="text-blue-400 font-extrabold text-base block">100% RERA</span>
            <span className="text-slate-400">Checked Developers</span>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-md p-3 rounded-2xl border border-slate-700/40 text-center">
            <span className="text-blue-400 font-extrabold text-base block">Instant Call</span>
            <span className="text-slate-400">Direct Owner Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};
