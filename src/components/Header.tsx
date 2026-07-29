import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Sparkles,
  Heart,
  Scale,
  PlusCircle,
  User,
  ChevronDown,
  PhoneCall,
  ShieldCheck,
  Search,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import { Role } from '../types';

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  selectedCity: string;
  onCitySelect: (city: string) => void;
  savedCount: number;
  compareCount: number;
  onOpenWishlist: () => void;
  onOpenCompare: () => void;
  onOpenPostProperty: () => void;
  onOpenAISearch: () => void;
  onOpenEMICalculator: () => void;
  onOpenDashboard: () => void;
  onOpenMessages: () => void;
  onNavigateHome: () => void;
  onNavigateSearch: (purpose?: 'sale' | 'rent') => void;
  onNavigateProjects: () => void;
}

const CITIES = ['Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad', 'Pune', 'Goa'];

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  selectedCity,
  onCitySelect,
  savedCount,
  compareCount,
  onOpenWishlist,
  onOpenCompare,
  onOpenPostProperty,
  onOpenAISearch,
  onOpenEMICalculator,
  onOpenDashboard,
  onOpenMessages,
  onNavigateHome,
  onNavigateSearch,
  onNavigateProjects
}) => {
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Banner Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-4">
          <span className="flex items-center text-blue-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 mr-1 animate-pulse" />
            RERA Verified Marketplace
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300">
            0% Brokerage on Owner Listings
          </span>
        </div>
        <div className="flex items-center space-x-5">
          <button
            onClick={onOpenEMICalculator}
            className="hover:text-blue-400 transition-colors flex items-center cursor-pointer"
          >
            EMI Calculator
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={onOpenMessages}
            className="hover:text-blue-400 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            <span>Messages</span>
          </button>
          <span className="text-slate-700">|</span>
          {/* Role Switcher pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 px-2.5 py-0.5 rounded-full font-medium transition-all cursor-pointer"
            >
              <User className="w-3 h-3" />
              <span className="capitalize">{currentRole} Mode</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Role
                </div>
                {(['buyer', 'owner', 'broker', 'builder', 'admin'] as Role[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleChange(role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-blue-50 hover:text-blue-700 cursor-pointer ${
                      currentRole === role ? 'bg-blue-50 text-blue-700 font-bold' : ''
                    }`}
                  >
                    <span className="capitalize">{role}</span>
                    {currentRole === role && <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo & City Selector */}
        <div className="flex items-center space-x-6">
          <button
            onClick={onNavigateHome}
            className="flex items-center space-x-2.5 text-left group cursor-pointer focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Shine <span className="text-blue-600 font-serif italic">Native</span>
              </span>
              <span className="block text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                Real Estate Marketplace
              </span>
            </div>
          </button>

          {/* City Selector Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{selectedCity}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {showCityDropdown && (
              <div className="absolute left-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase">
                  Select Location
                </div>
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      onCitySelect(city);
                      setShowCityDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-slate-50 flex items-center justify-between cursor-pointer ${
                      selectedCity === city ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{city}</span>
                    {selectedCity === city && <MapPin className="w-3 h-3 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center space-x-1 text-sm font-semibold text-slate-700">
          <button
            onClick={() => onNavigateSearch('sale')}
            className="px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Buy
          </button>
          <button
            onClick={() => onNavigateSearch('rent')}
            className="px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Rent
          </button>
          <button
            onClick={onNavigateProjects}
            className="px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-all cursor-pointer"
          >
            New Projects
          </button>
          <button
            onClick={onOpenAISearch}
            className="px-3 py-2 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 flex items-center space-x-1.5 font-bold transition-all border border-blue-200/60 shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI Advisor</span>
          </button>
        </nav>

        {/* Right Action Icons & Buttons */}
        <div className="flex items-center space-x-3">
          {/* Wishlist Heart */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-all cursor-pointer"
            title="Saved Wishlist"
          >
            <Heart className="w-5 h-5" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white">
                {savedCount}
              </span>
            )}
          </button>

          {/* Compare Scale */}
          <button
            onClick={onOpenCompare}
            className="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-all cursor-pointer"
            title="Compare Properties"
          >
            <Scale className="w-5 h-5" />
            {compareCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white">
                {compareCount}
              </span>
            )}
          </button>

          {/* Dashboard Button */}
          <button
            onClick={onOpenDashboard}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 font-semibold text-xs transition-all cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <span>Dashboard</span>
          </button>

          {/* Post Property FREE Button */}
          <button
            onClick={onOpenPostProperty}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/25 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Post Property</span>
            <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-md font-extrabold">
              FREE
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
