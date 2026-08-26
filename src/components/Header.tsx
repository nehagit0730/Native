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
  ShieldCheck,
  MessageSquare,
  BarChart3,
  LogOut,
  CheckCircle2,
  Menu,
  X,
  Calculator,
  Compass
} from 'lucide-react';
import { Role, GoogleAuthUser } from '../types';
import { ALL_INDIAN_CITIES } from '../data/mockData';

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  selectedCity: string;
  onCitySelect: (city: string) => void;
  savedCount: number;
  compareCount: number;
  googleUser?: GoogleAuthUser | null;
  onOpenGoogleAuth?: (role?: Role | 'admin', mode?: 'login' | 'signup') => void;
  onSignOutGoogle?: () => void;
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
  onNavigateUrl?: (path: string) => void;
}

const CITIES = ALL_INDIAN_CITIES;

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  selectedCity,
  onCitySelect,
  savedCount,
  compareCount,
  googleUser,
  onOpenGoogleAuth,
  onSignOutGoogle,
  onOpenWishlist,
  onOpenCompare,
  onOpenPostProperty,
  onOpenAISearch,
  onOpenEMICalculator,
  onOpenDashboard,
  onOpenMessages,
  onNavigateHome,
  onNavigateSearch,
  onNavigateProjects,
  onNavigateUrl
}) => {
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Banner Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] sm:text-xs py-1.5 px-3 sm:px-8 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <span className="flex items-center text-blue-400 font-medium whitespace-nowrap">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 animate-pulse" />
            RERA Verified Marketplace
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-300">
            0% Brokerage on Owner Listings
          </span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={onOpenEMICalculator}
            className="hidden sm:flex hover:text-blue-400 transition-colors items-center cursor-pointer"
          >
            <Calculator className="w-3 h-3 mr-1 text-slate-400" />
            <span>EMI Calculator</span>
          </button>
          <span className="hidden sm:inline text-slate-700">|</span>
          <button
            onClick={onOpenMessages}
            className="hidden sm:flex hover:text-blue-400 transition-colors items-center space-x-1 cursor-pointer"
          >
            <MessageSquare className="w-3 h-3 mr-1 text-slate-400" />
            <span>Messages</span>
          </button>
          <span className="hidden sm:inline text-slate-700">|</span>
          {/* Role Switcher pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-blue-400 px-2 sm:px-2.5 py-0.5 rounded-full font-medium transition-all cursor-pointer text-[10px] sm:text-xs"
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
                {(['buyer', 'owner', 'broker', 'builder'] as Role[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleChange(role);
                      setShowRoleDropdown(false);
                      if (onNavigateUrl) {
                        onNavigateUrl(`/${role}-dashboard`);
                      }
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-blue-50 hover:text-blue-700 cursor-pointer ${
                      currentRole === role ? 'bg-blue-50 text-blue-700 font-bold' : ''
                    }`}
                  >
                    <span className="capitalize">{role === 'admin' ? 'Admin Portal' : `${role} Dashboard`}</span>
                    {currentRole === role && <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand Logo & City Selector */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          <button
            onClick={onNavigateHome}
            className="flex items-center space-x-2 sm:space-x-2.5 text-left group cursor-pointer focus:outline-hidden"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Shine <span className="text-blue-600 font-serif italic">Native</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
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
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 max-h-60 overflow-y-auto">
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
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          {/* Wishlist Heart */}
          <button
            onClick={onOpenWishlist}
            className="relative p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-all cursor-pointer"
            title="Saved Wishlist"
          >
            <Heart className="w-5 h-5" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white text-[9px] sm:text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white">
                {savedCount}
              </span>
            )}
          </button>

          {/* Compare Scale */}
          <button
            onClick={onOpenCompare}
            className="relative p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-all cursor-pointer"
            title="Compare Properties"
          >
            <Scale className="w-5 h-5" />
            {compareCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-indigo-600 text-white text-[9px] sm:text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white">
                {compareCount}
              </span>
            )}
          </button>

          {/* Dashboard Button */}
          <button
            onClick={onOpenDashboard}
            className="hidden md:flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 font-semibold text-xs transition-all cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <span>Dashboard</span>
          </button>

          {/* Google Login / Sign Up Button OR Profile Dropdown */}
          {googleUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 rounded-xl p-1.5 sm:px-2.5 sm:py-1.5 transition-all cursor-pointer"
              >
                <img
                  src={googleUser.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={googleUser.name || 'User'}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
                  }}
                  className="w-6 h-6 rounded-full object-cover border border-blue-500 shrink-0"
                />
                <div className="hidden lg:block text-left">
                  <span className="block text-[11px] font-extrabold text-slate-800 leading-tight">
                    {googleUser.name || 'User'}
                  </span>
                  <span className="block text-[9px] font-bold text-blue-600 uppercase">
                    {(googleUser.role || currentRole).toUpperCase()} Portal
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                  <div className="flex items-center space-x-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <img
                      src={googleUser.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt={googleUser.name || 'User'}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
                      }}
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 shrink-0"
                    />
                    <div className="text-left overflow-hidden">
                      <h4 className="font-extrabold text-xs text-slate-900 truncate">{googleUser.name || 'User'}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{googleUser.email || 'user@shinenative.com'}</p>
                      <span className="inline-flex items-center text-[9px] font-bold text-emerald-600 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 mr-0.5" /> Google Verified SSO
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        if (onOpenDashboard) onOpenDashboard();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl flex items-center justify-between cursor-pointer"
                    >
                      <span>Open {(googleUser.role || currentRole).toUpperCase()} Dashboard</span>
                      <BarChart3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        if (onOpenGoogleAuth) onOpenGoogleAuth(currentRole, 'login');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl flex items-center justify-between cursor-pointer"
                    >
                      <span>Switch Account</span>
                      <User className="w-3.5 h-3.5" />
                    </button>

                    {onSignOutGoogle && (
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onSignOutGoogle();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center justify-between cursor-pointer"
                      >
                        <span>Sign Out</span>
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-1.5">
              <button
                onClick={() => onOpenGoogleAuth && onOpenGoogleAuth(currentRole, 'login')}
                className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-extrabold text-xs px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="hidden sm:inline">Google Sign In</span>
                <span className="sm:hidden">Login</span>
              </button>
            </div>
          )}

          {/* Post Property FREE Button */}
          <button
            onClick={onOpenPostProperty}
            className="flex items-center space-x-1 sm:space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-md shadow-blue-600/25 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            <span className="text-[11px] sm:text-xs">Post Property</span>
            <span className="hidden sm:inline-block bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-md font-extrabold">
              FREE
            </span>
          </button>

          {/* Mobile Navigation Drawer Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {showMobileMenu ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* City Selector for Mobile */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-blue-600" /> Current City
              </span>
              <span className="text-blue-600 font-extrabold">{selectedCity}</span>
            </div>
            <select
              value={selectedCity}
              onChange={(e) => {
                onCitySelect(e.target.value);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Quick Nav Links */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setShowMobileMenu(false);
                onNavigateSearch('sale');
              }}
              className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl text-left font-bold text-xs text-slate-800 flex items-center justify-between cursor-pointer"
            >
              <span>Buy Properties</span>
              <Building2 className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => {
                setShowMobileMenu(false);
                onNavigateSearch('rent');
              }}
              className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl text-left font-bold text-xs text-slate-800 flex items-center justify-between cursor-pointer"
            >
              <span>Rent Homes</span>
              <Compass className="w-4 h-4 text-emerald-600" />
            </button>
            <button
              onClick={() => {
                setShowMobileMenu(false);
                onNavigateProjects();
              }}
              className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl text-left font-bold text-xs text-slate-800 flex items-center justify-between cursor-pointer"
            >
              <span>New Projects</span>
              <Building2 className="w-4 h-4 text-amber-600" />
            </button>
            <button
              onClick={() => {
                setShowMobileMenu(false);
                onOpenAISearch();
              }}
              className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-left font-bold text-xs text-blue-800 flex items-center justify-between cursor-pointer"
            >
              <span>AI Advisor</span>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          {/* Quick Utility Tools */}
          <div className="grid grid-cols-3 gap-2 text-xs font-bold text-slate-700">
            <button
              onClick={() => {
                setShowMobileMenu(false);
                onOpenEMICalculator();
              }}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl flex flex-col items-center justify-center space-y-1 text-center cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-slate-600" />
              <span className="text-[10px]">EMI Calculator</span>
            </button>
            <button
              onClick={() => {
                setShowMobileMenu(false);
                onOpenMessages();
              }}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl flex flex-col items-center justify-center space-y-1 text-center cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-slate-600" />
              <span className="text-[10px]">Messages</span>
            </button>
            <button
              onClick={() => {
                setShowMobileMenu(false);
                onOpenDashboard();
              }}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl flex flex-col items-center justify-center space-y-1 text-center cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-slate-600" />
              <span className="text-[10px]">Dashboard</span>
            </button>
          </div>

          {/* Role Mode Selection */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Switch User Mode
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(['buyer', 'owner', 'broker', 'builder'] as Role[]).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    onRoleChange(role);
                    setShowMobileMenu(false);
                    if (onNavigateUrl) onNavigateUrl(`/${role}-dashboard`);
                  }}
                  className={`py-1.5 px-2 text-[11px] font-bold rounded-lg capitalize text-center transition-all cursor-pointer ${
                    currentRole === role
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* User Sign In / Account section */}
          <div className="pt-3 border-t border-slate-100">
            {googleUser ? (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={googleUser.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={googleUser.name || 'User'}
                    className="w-8 h-8 rounded-full object-cover border border-blue-500"
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-800">{googleUser.name}</span>
                    <span className="block text-[10px] text-slate-500">{googleUser.email}</span>
                  </div>
                </div>
                {onSignOutGoogle && (
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      onSignOutGoogle();
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  if (onOpenGoogleAuth) onOpenGoogleAuth(currentRole, 'login');
                }}
                className="w-full py-2.5 bg-slate-900 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-2 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

