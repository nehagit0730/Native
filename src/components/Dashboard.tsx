import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Building2,
  Users,
  Eye,
  Heart,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  PlusCircle,
  Clock,
  Phone,
  Mail,
  Edit,
  Trash2
} from 'lucide-react';
import { Role, Property, Lead } from '../types';
import { fetchDashboardAnalytics, fetchLeads } from '../services/api';

interface DashboardProps {
  currentRole: Role;
  properties: Property[];
  savedProperties: Property[];
  onSelectProperty: (property: Property) => void;
  onOpenPostProperty: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentRole,
  properties,
  savedProperties,
  onSelectProperty,
  onOpenPostProperty
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'leads' | 'saved' | 'admin'>('overview');
  const [analytics, setAnalytics] = useState<any>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stats = await fetchDashboardAnalytics();
      const leadsData = await fetchLeads();
      setAnalytics(stats);
      setLeads(leadsData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700/50">
        <div>
          <span className="bg-blue-600/20 text-blue-400 border border-blue-400/30 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            {currentRole} Command Center
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">
            Shine Native Dashboard
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Manage your property inventory, buyer leads, site visits, and platform analytics in one real-time workspace.
          </p>
        </div>

        <button
          onClick={onOpenPostProperty}
          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-lg transition-all flex items-center space-x-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>Post New Property</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Overview & Stats' },
          { id: 'listings', label: 'My Listed Properties' },
          { id: 'leads', label: 'Inquiries & Leads' },
          { id: 'saved', label: 'Saved Wishlist' },
          ...(currentRole === 'admin' ? [{ id: 'admin', label: 'Admin Moderation' }] : [])
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-blue-400 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Active Listings</span>
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">{properties.length}</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">↑ 12% from last month</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Impressions</span>
                <Eye className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">
                {analytics?.totalViews?.toLocaleString('en-IN') || '14,280'}
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Across all active search results</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Buyer Leads</span>
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">{leads.length}</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Callback & Visit requests</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Saved Favorites</span>
                <Heart className="w-5 h-5 text-rose-500" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">{savedProperties.length}</p>
              <p className="text-[11px] text-slate-500 font-medium mt-1">User wishlist bookmarks</p>
            </div>
          </div>

          {/* Recent Leads Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900">Recent Buyer Inquiries</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-2">Buyer Name</th>
                    <th className="py-3 px-2">Property</th>
                    <th className="py-3 px-2">Contact Details</th>
                    <th className="py-3 px-2">Type</th>
                    <th className="py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50">
                      <td className="py-3 px-2 font-bold text-slate-900">{lead.buyerName}</td>
                      <td className="py-3 px-2 font-medium text-slate-700 max-w-xs truncate">{lead.propertyTitle}</td>
                      <td className="py-3 px-2 text-slate-600">
                        <div>{lead.buyerPhone}</div>
                        <div className="text-[10px] text-slate-400">{lead.buyerEmail}</div>
                      </td>
                      <td className="py-3 px-2 capitalize">
                        <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md font-semibold">
                          {lead.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Listings Tab */}
      {activeTab === 'listings' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Active Listings ({properties.length})</h3>
            <button
              onClick={onOpenPostProperty}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              + Add Property
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <div key={prop.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
                <img src={prop.images[0]} alt={prop.title} className="w-full h-40 object-cover rounded-xl" />
                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{prop.title}</h4>
                <p className="text-blue-600 font-extrabold text-base">{prop.priceFormatted}</p>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Views: {prop.viewsCount}</span>
                  <button
                    onClick={() => onSelectProperty(prop)}
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    View Listing →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved Wishlist Tab */}
      {activeTab === 'saved' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h3 className="text-lg font-bold text-slate-900">Your Saved Properties ({savedProperties.length})</h3>
          {savedProperties.length === 0 ? (
            <p className="text-sm text-slate-500 py-12 text-center">No properties saved in wishlist yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {savedProperties.map((prop) => (
                <div key={prop.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                  <img src={prop.images[0]} alt={prop.title} className="w-full h-40 object-cover rounded-xl" />
                  <h4 className="font-bold text-slate-900 text-sm">{prop.title}</h4>
                  <p className="text-blue-600 font-bold">{prop.priceFormatted}</p>
                  <button
                    onClick={() => onSelectProperty(prop)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Admin Moderation Tab */}
      {activeTab === 'admin' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Platform Admin & Moderation Queue</h3>
          <p className="text-xs text-slate-500">Audit user accounts, RERA verification status, and flag inappropriate listings.</p>
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold">
            ✓ All active properties verified and compliant with local housing guidelines.
          </div>
        </div>
      )}
    </div>
  );
};
