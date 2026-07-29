import React, { useState } from 'react';
import {
  User,
  Building2,
  Briefcase,
  Home,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  FileText,
  Bell,
  Heart,
  Scale,
  Users,
  Settings,
  TrendingUp,
  Search,
  Filter,
  PhoneCall,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Award,
  CreditCard,
  Plus
} from 'lucide-react';
import { Property, Role, Lead, TeamMember, PropertyAlert, ChatMessage } from '../types';
import { INITIAL_TEAM_MEMBERS, INITIAL_ALERTS } from '../services/store';

interface ClientDashboardProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  properties: Property[];
  savedProperties: Property[];
  onSelectProperty: (property: Property) => void;
  onOpenPostProperty: () => void;
  onSubmitPropertyForAudit: (property: Property) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  currentRole,
  onRoleChange,
  properties,
  savedProperties,
  onSelectProperty,
  onOpenPostProperty,
  onSubmitPropertyForAudit
}) => {
  // Navigation tabs for client role
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Role selection mode toggle if user wants to switch initial mode
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  // Mock states for builder team & alerts
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [alerts, setAlerts] = useState<PropertyAlert[]>(INITIAL_ALERTS);

  // New alert form state
  const [newAlertCity, setNewAlertCity] = useState('Mumbai');
  const [newAlertPrice, setNewAlertPrice] = useState('20000000');

  // Mock seller listings
  const myOwnerProperties = properties.filter(
    (p) => p.postedBy === 'owner' || p.postedByName.includes('Owner') || p.postedByName.includes('Verified User')
  );

  return (
    <div className="min-h-screen bg-slate-100/80 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ROLE SELECTION HEADER BAR */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              {currentRole === 'owner' && <Home className="w-7 h-7" />}
              {currentRole === 'builder' && <Building2 className="w-7 h-7" />}
              {currentRole === 'broker' && <Briefcase className="w-7 h-7" />}
              {currentRole === 'buyer' && <User className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-blue-400/30">
                  {currentRole.toUpperCase()} DASHBOARD
                </span>
                <span className="text-slate-400 text-xs">• Verified User</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white mt-1 capitalize">
                Welcome back, {currentRole === 'builder' ? 'Prestige Estates Team' : currentRole === 'broker' ? 'Apex Realty Agent' : 'Valued User'}
              </h1>
            </div>
          </div>

          {/* Role Switcher Controls */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <button
              onClick={() => setShowRoleSelector(!showRoleSelector)}
              className="bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>Switch Dashboard Mode ({currentRole})</span>
            </button>
            <button
              onClick={onOpenPostProperty}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Property</span>
            </button>
          </div>
        </div>

        {/* ROLE SELECTION MODAL / EXPANDABLE SCREEN */}
        {showRoleSelector && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4 animate-in fade-in duration-200">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider text-center">
              Choose How You Want to Use Shine Native Platform
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  role: 'owner' as Role,
                  title: 'Property Owner / Seller',
                  desc: 'List flats, villas or land with 0% brokerage and direct buyer inquiry calls.',
                  icon: Home,
                  color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
                },
                {
                  role: 'builder' as Role,
                  title: 'RERA Builder / Developer',
                  desc: 'Manage multiple townships, team members, brochures and RERA launches.',
                  icon: Building2,
                  color: 'bg-blue-50 text-blue-600 border-blue-200'
                },
                {
                  role: 'broker' as Role,
                  title: 'Real Estate Agent',
                  desc: 'Track client leads, callback inquiries, property analytics and saved drafts.',
                  icon: Briefcase,
                  color: 'bg-amber-50 text-amber-600 border-amber-200'
                },
                {
                  role: 'buyer' as Role,
                  title: 'Home Buyer / Tenant',
                  desc: 'Save favorite properties, compare listings, schedule visits and set alerts.',
                  icon: User,
                  color: 'bg-purple-50 text-purple-600 border-purple-200'
                }
              ].map((item) => (
                <button
                  key={item.role}
                  onClick={() => {
                    onRoleChange(item.role);
                    setShowRoleSelector(false);
                    setActiveTab('overview');
                  }}
                  className={`p-5 rounded-2xl border text-left space-y-3 transition-all cursor-pointer hover:scale-[1.02] ${
                    currentRole === item.role ? `${item.color} ring-2 ring-blue-500 font-bold shadow-md` : 'bg-slate-50 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* DASHBOARD 1: PROPERTY OWNER / SELLER DASHBOARD */}
        {(currentRole === 'owner') && (
          <div className="space-y-6">
            {/* Owner Tab Navigation */}
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
              {['overview', 'my_properties', 'pending_approval', 'inquiries', 'drafts', 'subscription'].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold capitalize transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Overview Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                    <span className="text-xs font-bold text-slate-500">Active Listings</span>
                    <div className="text-3xl font-extrabold text-slate-900">{myOwnerProperties.length}</div>
                    <p className="text-[11px] text-emerald-600 font-semibold">Live on Public Site</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                    <span className="text-xs font-bold text-slate-500">Pending Admin Approval</span>
                    <div className="text-3xl font-extrabold text-amber-600">1</div>
                    <p className="text-[11px] text-amber-600 font-semibold">Under Audit Review</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                    <span className="text-xs font-bold text-slate-500">Total Views Received</span>
                    <div className="text-3xl font-extrabold text-blue-600">1,240</div>
                    <p className="text-[11px] text-slate-500 font-medium">Across all properties</p>
                  </div>
                </div>

                {/* My Properties List */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 shadow-xs">
                  <h3 className="text-base font-extrabold text-slate-900">My Posted Listings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myOwnerProperties.map((prop) => (
                      <div key={prop.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-4">
                        <img src={prop.images[0]} alt={prop.title} className="w-24 h-24 object-cover rounded-xl shrink-0" />
                        <div className="space-y-1">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md">APPROVED</span>
                          <h4 className="font-extrabold text-slate-900 text-sm line-clamp-1">{prop.title}</h4>
                          <p className="text-xs text-slate-500">{prop.locality}, {prop.city}</p>
                          <p className="text-blue-600 font-bold text-xs">{prop.priceFormatted}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DASHBOARD 2: BUILDER DASHBOARD */}
        {currentRole === 'builder' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
              {['overview', 'team', 'projects', 'leads', 'analytics'].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold capitalize transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Builder Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">Prestige Estates Company Profile</h3>
                      <p className="text-xs text-slate-500">RERA Registration: PRM/KA/RERA/1251/310/PR/260701/008912</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                      Verified Builder Account
                    </span>
                  </div>
                </div>

                {/* Team Members Section */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-slate-900">Team Members & Sales Directors</h3>
                    <button className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                      + Add Team Member
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {teamMembers.map((tm) => (
                      <div key={tm.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center space-x-3">
                        <img src={tm.avatar} alt={tm.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">{tm.name}</h4>
                          <p className="text-[11px] text-slate-500">{tm.role}</p>
                          <p className="text-[10px] text-blue-600 font-semibold">{tm.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DASHBOARD 3: AGENT DASHBOARD */}
        {currentRole === 'broker' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
              {['overview', 'leads', 'clients', 'analytics'].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold capitalize transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900">Agent Lead Tracking & Inquiries</h3>
              <p className="text-xs text-slate-500">Track interested home buyers scheduled for site visits</p>
            </div>
          </div>
        )}

        {/* DASHBOARD 4: BUYER DASHBOARD */}
        {currentRole === 'buyer' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
              {['wishlist', 'alerts', 'inquiries', 'recent'].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold capitalize transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {t === 'wishlist' ? 'Saved Wishlist' : t.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Saved Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">Your Saved Properties ({savedProperties.length})</h3>
                {savedProperties.length === 0 ? (
                  <p className="text-xs text-slate-500">No saved properties yet. Click the heart icon on any card to save it here.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedProperties.map((p) => (
                      <div key={p.id} className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs space-y-3">
                        <img src={p.images[0]} alt={p.title} className="w-full h-40 object-cover rounded-2xl" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{p.title}</h4>
                          <p className="text-blue-600 font-extrabold text-xs">{p.priceFormatted}</p>
                        </div>
                        <button
                          onClick={() => onSelectProperty(p)}
                          className="w-full bg-slate-900 text-white text-xs font-bold py-2 rounded-xl"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Property Alerts */}
            {activeTab === 'alerts' && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900">Configured Property Alerts</h3>
                  <button className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                    + Set New Alert
                  </button>
                </div>
                <div className="space-y-3">
                  {alerts.map((alt) => (
                    <div key={alt.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{alt.title}</h4>
                        <p className="text-[11px] text-slate-500">{alt.city} • Frequency: {alt.frequency}</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
