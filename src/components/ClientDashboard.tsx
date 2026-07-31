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
  Plus,
  Loader2,
  Upload
} from 'lucide-react';
import { Property, Role, Lead, TeamMember, PropertyAlert, ChatMessage, GoogleAuthUser, CloudinaryFile } from '../types';
import { INITIAL_TEAM_MEMBERS, INITIAL_ALERTS } from '../services/store';
import { uploadFile } from '../services/api';

interface ClientDashboardProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  properties: Property[];
  savedProperties: Property[];
  clientFiles?: CloudinaryFile[];
  onUploadClientFile?: (file: CloudinaryFile) => void;
  onDeleteClientFile?: (id: string) => void;
  googleUser?: GoogleAuthUser | null;
  onOpenGoogleAuth?: (role?: Role | 'admin', mode?: 'login' | 'signup') => void;
  onSignOutGoogle?: () => void;
  onSelectProperty: (property: Property) => void;
  onOpenPostProperty: () => void;
  onSubmitPropertyForAudit: (property: Property) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  currentRole,
  onRoleChange,
  properties,
  savedProperties,
  clientFiles = [],
  onUploadClientFile,
  onDeleteClientFile,
  googleUser,
  onOpenGoogleAuth,
  onSignOutGoogle,
  onSelectProperty,
  onOpenPostProperty,
  onSubmitPropertyForAudit
}) => {

  // Navigation tabs for client role
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Client File Manager states
  const [uploadingFile, setUploadingFile] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [fileSearchTerm, setFileSearchTerm] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');

  const handleCopyClientUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadClientDeviceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    const file = uploadedFiles[0];
    setUploadingFile(true);

    try {
      const uploaded = await uploadFile(file, '/client-files');
      if (onUploadClientFile) {
        onUploadClientFile(uploaded);
      }
      alert('File successfully saved to your personal Client File Manager library!');
    } catch (err: any) {
      console.error('Client file upload error:', err);
      alert('Failed to upload file: ' + (err.message || 'Error'));
    } finally {
      setUploadingFile(false);
      e.target.value = '';
    }
  };

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

        {/* GOOGLE AUTHENTICATION STATUS BANNER FOR BUYER, OWNER, BROKER, BUILDER */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md">
          {googleUser ? (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={googleUser.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={googleUser.name || 'User'}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
                  }}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-sm shrink-0"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Google SSO Active</span>
                    </span>
                    <span className="text-slate-400 text-xs font-semibold">• {(currentRole || 'user').toUpperCase()} PORTAL</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 mt-1">
                    Logged in as <span className="text-blue-600">{googleUser.name || 'User'}</span> ({googleUser.email || 'user@shinenative.com'})
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentRole === 'buyer' && 'Saved properties, compare history & price alerts synced to your Google account.'}
                    {currentRole === 'owner' && 'Direct buyer phone calls & property inquiry notifications routed to your Gmail.'}
                    {currentRole === 'broker' && 'Client lead management, CRM callbacks & team draft listings linked to your Google SSO.'}
                    {currentRole === 'builder' && 'Prestige Estates Township projects & RERA launch brochures managed under Google Workspace.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => onOpenGoogleAuth && onOpenGoogleAuth(currentRole, 'login')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-300 transition-all cursor-pointer"
                >
                  Switch Account
                </button>
                {onSignOutGoogle && (
                  <button
                    onClick={onSignOutGoogle}
                    className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-3.5 py-2 rounded-xl border border-red-200 transition-all cursor-pointer"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 border border-blue-100">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Sign Up or Log In with Google for {currentRole.toUpperCase()} Dashboard
                  </h3>
                  <p className="text-xs text-slate-500">
                    Authenticate instantly with Google to unlock verified listing management, lead alerts & cloud backups.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => onOpenGoogleAuth && onOpenGoogleAuth(currentRole, 'signup')}
                  className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign Up with Google</span>
                </button>

                <button
                  onClick={() => onOpenGoogleAuth && onOpenGoogleAuth(currentRole, 'login')}
                  className="flex-1 sm:flex-initial bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Log In with Google</span>
                </button>
              </div>
            </div>
          )}
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
              {['overview', 'my_properties', 'pending_approval', 'inquiries', 'file_manager', 'subscription'].map((t) => (
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
              {['overview', 'team', 'projects', 'leads', 'file_manager', 'analytics'].map((t) => (
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
              {['overview', 'leads', 'clients', 'file_manager', 'analytics'].map((t) => (
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
              {['wishlist', 'alerts', 'inquiries', 'file_manager', 'recent'].map((t) => (
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
            {/* COMMON CLIENT FILE MANAGER VIEW */}
            {activeTab === 'file_manager' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-blue-200">
                        CLIENT FILE STORAGE
                      </span>
                      <span className="text-slate-400 text-xs font-medium">• Isolated Workspace</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900">Client Personal File Manager</h2>
                    <p className="text-xs text-slate-500">
                      Upload and manage your property images, brochures, floor plans and PDF documents. Files saved here are kept in your personal workspace and will not clutter the Admin Dashboard.
                    </p>
                  </div>

                  <label className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-3 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 shrink-0">
                    {uploadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 stroke-[2.5]" />}
                    <span>{uploadingFile ? 'Uploading File...' : 'Upload File to My Library'}</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      disabled={uploadingFile}
                      onChange={handleUploadClientDeviceFile}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* File Stats Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-slate-500">Saved Items</span>
                    <div className="text-2xl font-extrabold text-slate-900">{clientFiles.length}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-slate-500">Property Photos</span>
                    <div className="text-2xl font-extrabold text-blue-600">
                      {clientFiles.filter(f => f.fileType === 'image' || f.fileType === 'floor_plan').length}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-slate-500">Brochures & PDFs</span>
                    <div className="text-2xl font-extrabold text-emerald-600">
                      {clientFiles.filter(f => f.fileType === 'pdf' || f.fileType === 'document').length}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-slate-500">Storage Vault</span>
                    <div className="text-sm font-extrabold text-slate-700">Client Vault</div>
                  </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search my files..."
                      value={fileSearchTerm}
                      onChange={(e) => setFileSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto">
                    {['all', 'image', 'floor_plan', 'pdf'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setFileTypeFilter(t)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                          fileTypeFilter === t ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
                        }`}
                      >
                        {t.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* File Grid */}
                {clientFiles.length === 0 ? (
                  <div className="py-12 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-800">Your Client File Manager is Empty</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Upload your property photos, floor plan layouts, or RERA documents. They will be saved here so you can attach them directly when posting property listings!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {clientFiles
                      .filter(f => {
                        if (fileTypeFilter !== 'all' && f.fileType !== fileTypeFilter) return false;
                        if (fileSearchTerm.trim()) {
                          return f.name.toLowerCase().includes(fileSearchTerm.toLowerCase()) || f.url.toLowerCase().includes(fileSearchTerm.toLowerCase());
                        }
                        return true;
                      })
                      .map((file) => {
                        const isImg = file.fileType === 'image' || file.fileType === 'floor_plan' || file.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);

                        return (
                          <div key={file.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2 flex flex-col justify-between hover:shadow-md transition-all">
                            <div className="w-full h-32 bg-white rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 relative">
                              {isImg ? (
                                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-center p-2">
                                  <FileText className="w-10 h-10 text-red-500 mx-auto" />
                                  <span className="text-[10px] font-bold text-slate-500 uppercase">{file.fileType}</span>
                                </div>
                              )}
                            </div>

                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-slate-900 truncate" title={file.name}>
                                {file.name}
                              </h4>
                              <p className="text-[10px] text-slate-400">{file.folder || '/client-files'}</p>
                            </div>

                            <div className="flex items-center space-x-2 pt-1 border-t border-slate-200/80">
                              <button
                                onClick={() => handleCopyClientUrl(file.url, file.id)}
                                className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px] py-1.5 rounded-lg transition-all cursor-pointer text-center"
                              >
                                {copiedId === file.id ? 'Copied!' : 'Copy Link'}
                              </button>
                              {onDeleteClientFile && (
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete file "${file.name}" from your Client File Manager?`)) {
                                      onDeleteClientFile(file.id);
                                    }
                                  }}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-100 transition-all cursor-pointer"
                                  title="Delete file"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
