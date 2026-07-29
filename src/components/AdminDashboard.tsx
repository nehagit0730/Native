import React, { useState } from 'react';
import {
  BarChart3,
  Building2,
  CheckSquare,
  FolderOpen,
  FileText,
  Sliders,
  Plus,
  Search,
  Eye,
  Edit,
  Copy,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Upload,
  Link,
  Grid,
  List as ListIcon,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  MoveUp,
  MoveDown,
  Save,
  Globe,
  Settings,
  Layers,
  HelpCircle,
  Image as ImageIcon,
  Video,
  FileSpreadsheet,
  Users,
  TrendingUp,
  DollarSign,
  PhoneCall,
  Mail,
  Share2,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { 
  Property, 
  CloudinaryFile, 
  CloudinaryFileType,
  WebsitePage, 
  PageSection, 
  PageSectionType,
  DynamicPropertiesFilter,
  HeaderConfig, 
  FooterConfig 
} from '../types';

interface AdminDashboardProps {
  properties: Property[];
  auditProperties: Property[];
  files: CloudinaryFile[];
  pages: WebsitePage[];
  headerConfig: HeaderConfig;
  footerConfig: FooterConfig;
  onApproveProperty: (id: string) => void;
  onRejectProperty: (id: string, notes: string) => void;
  onRequestChanges: (id: string, notes: string) => void;
  onDeleteProperty: (id: string) => void;
  onDuplicateProperty: (id: string) => void;
  onSaveProperty: (property: Property) => void;
  onOpenAddProperty: () => void;
  onPreviewProperty: (property: Property) => void;
  // File Manager handlers
  onUploadFile: (file: CloudinaryFile) => void;
  onDeleteFile: (id: string) => void;
  onRenameFile: (id: string, newName: string) => void;
  // Pages & Builder handlers
  onSavePage: (page: WebsitePage) => void;
  onDeletePage: (id: string) => void;
  onDuplicatePage: (id: string) => void;
  // Header / Footer handlers
  onSaveHeaderConfig: (cfg: HeaderConfig) => void;
  onSaveFooterConfig: (cfg: FooterConfig) => void;
}

const TRAFFIC_DATA = [
  { month: 'Jan', traffic: 14200, inquiries: 420, revenue: 125000 },
  { month: 'Feb', traffic: 18500, inquiries: 580, revenue: 168000 },
  { month: 'Mar', traffic: 22400, inquiries: 790, revenue: 210000 },
  { month: 'Apr', traffic: 29000, inquiries: 940, revenue: 285000 },
  { month: 'May', traffic: 34500, inquiries: 1120, revenue: 340000 },
  { month: 'Jun', traffic: 41200, inquiries: 1380, revenue: 410000 },
  { month: 'Jul', traffic: 48900, inquiries: 1650, revenue: 495000 }
];

const ROLE_DISTRIBUTION = [
  { name: 'Buyers & Tenants', value: 6800, color: '#2563eb' },
  { name: 'Property Owners', value: 2400, color: '#10b981' },
  { name: 'Agents & Brokers', value: 1100, color: '#f59e0b' },
  { name: 'RERA Builders', value: 450, color: '#8b5cf6' }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  properties,
  auditProperties,
  files,
  pages,
  headerConfig,
  footerConfig,
  onApproveProperty,
  onRejectProperty,
  onRequestChanges,
  onDeleteProperty,
  onDuplicateProperty,
  onSaveProperty,
  onOpenAddProperty,
  onPreviewProperty,
  onUploadFile,
  onDeleteFile,
  onRenameFile,
  onSavePage,
  onDeletePage,
  onDuplicatePage,
  onSaveHeaderConfig,
  onSaveFooterConfig
}) => {
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'properties' | 'audit' | 'files' | 'pages' | 'header_footer'
  >('analytics');

  // Properties Tab local state
  const [propertySearch, setPropertySearch] = useState('');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // File Manager state
  const [fileTypeFilter, setFileTypeFilter] = useState<CloudinaryFileType | 'all'>('all');
  const [fileSearch, setFileSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingFileName, setEditingFileName] = useState('');

  // Page Builder state
  const [editingPage, setEditingPage] = useState<WebsitePage | null>(null);
  const [isBuildingPage, setIsBuildingPage] = useState(false);

  // Header/Footer State
  const [localHeader, setLocalHeader] = useState<HeaderConfig>(headerConfig);
  const [localFooter, setLocalFooter] = useState<FooterConfig>(footerConfig);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  // Handle Copy URL
  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle Simulated Upload to Cloudinary
  const handleFileUploadSimulated = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    const file = uploadedFiles[0];
    let fileType: CloudinaryFileType = 'image';
    if (file.type.includes('video')) fileType = 'video';
    else if (file.type.includes('pdf')) fileType = 'pdf';
    else if (file.name.endsWith('.svg')) fileType = 'icon';

    const newCloudinaryFile: CloudinaryFile = {
      id: `cld-${Date.now()}`,
      publicId: `uploads/${file.name.replace(/\.[^/.]+$/, '')}`,
      name: file.name,
      url: URL.createObjectURL(file),
      format: file.name.split('.').pop() || 'png',
      sizeBytes: file.size,
      fileType,
      folder: '/uploads',
      createdAt: new Date().toISOString()
    };
    onUploadFile(newCloudinaryFile);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Header Badge */}
          <div className="flex items-center space-x-3 px-2 py-3 bg-blue-950/40 border border-blue-800/40 rounded-2xl">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-tight">Admin Console</h1>
              <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                Full System Control
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            <button
              onClick={() => { setActiveTab('analytics'); setIsBuildingPage(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <BarChart3 className="w-4 h-4" />
                <span>1. Analytics</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => { setActiveTab('properties'); setIsBuildingPage(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'properties'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Building2 className="w-4 h-4" />
                <span>2. Properties</span>
              </div>
              <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {properties.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('audit'); setIsBuildingPage(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <CheckSquare className="w-4 h-4 text-amber-400" />
                <span>3. Client Audit Check</span>
              </div>
              {auditProperties.length > 0 && (
                <span className="bg-amber-500 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
                  {auditProperties.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('files'); setIsBuildingPage(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'files'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FolderOpen className="w-4 h-4 text-cyan-400" />
                <span>4. File Manager (Cloudinary)</span>
              </div>
              <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {files.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('pages'); setIsBuildingPage(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pages'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>5. Pages & Page Builder</span>
              </div>
              <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {pages.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('header_footer'); setIsBuildingPage(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'header_footer'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>6. Header & Footer</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </nav>
        </div>

        {/* Database Status Footer */}
        <div className="pt-6 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Database Status</span>
            <span className="flex items-center text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-ping" />
              Connected
            </span>
          </div>
          <div className="text-[10px] text-slate-500 space-y-0.5">
            <p>Engine: Neon PostgreSQL</p>
            <p>Storage: Cloudinary CDN</p>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-h-[calc(100vh-60px)] md:max-h-screen">
        {/* TAB 1: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-extrabold text-white">System Performance Analytics</h2>
              <p className="text-xs text-slate-400 mt-1">
                Real-time website traffic, leads conversion, revenue growth, and property auditing metrics.
              </p>
            </div>

            {/* KPI Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>Total Properties</span>
                  <Building2 className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-white">{properties.length + auditProperties.length}</div>
                <p className="text-[11px] text-emerald-400 font-semibold flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> +14% vs last month
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>Active Listings</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">{properties.length}</div>
                <p className="text-[11px] text-slate-400 font-medium">Published & Verified</p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>Pending Approvals</span>
                  <CheckSquare className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-400">{auditProperties.length}</div>
                <p className="text-[11px] text-amber-300/80 font-medium">Awaiting Audit Check</p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>Total Users</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white">10,750</div>
                <p className="text-[11px] text-slate-400 font-medium">Buyers, Owners & Agents</p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>Property Views</span>
                  <Eye className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-white">148,920</div>
                <p className="text-[11px] text-emerald-400 font-semibold flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> +28% YoY
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>Inquiries & Leads</span>
                  <Mail className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-black text-white">4,890</div>
                <p className="text-[11px] text-slate-400 font-medium">High Intent Visitors</p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>Cloudinary Media Assets</span>
                  <FolderOpen className="w-4 h-4 text-pink-400" />
                </div>
                <div className="text-2xl font-black text-white">{files.length}</div>
                <p className="text-[11px] text-slate-400 font-medium">Images, Videos & PDFs</p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>Monthly Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-400">₹ 49.5 L</div>
                <p className="text-[11px] text-emerald-400 font-semibold">+18% MoM Growth</p>
              </div>
            </div>

            {/* Recharts Graphical Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Traffic & Inquiries Chart */}
              <div className="lg:col-span-2 bg-slate-800/70 border border-slate-700/60 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Website Traffic & Lead Inquiries</h3>
                    <p className="text-xs text-slate-400">Monthly breakdown of unique visitors and buyer lead conversions</p>
                  </div>
                  <span className="bg-blue-900/40 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-700/50">
                    2026 Trend
                  </span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={TRAFFIC_DATA}>
                      <defs>
                        <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} 
                      />
                      <Area type="monotone" dataKey="traffic" stroke="#2563eb" fillOpacity={1} fill="url(#colorTraffic)" name="Visitors" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Role Distribution Pie Chart */}
              <div className="bg-slate-800/70 border border-slate-700/60 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white">Platform User Breakdown</h3>
                  <p className="text-xs text-slate-400">Active registered accounts by user role</p>
                </div>

                <div className="h-48 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ROLE_DISTRIBUTION}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {ROLE_DISTRIBUTION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-1.5 text-xs">
                  {ROLE_DISTRIBUTION.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-slate-300">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-bold text-white">{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROPERTIES */}
        {activeTab === 'properties' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-white">Published Properties</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage all approved live property listings available on the public website.
                </p>
              </div>
              <button
                onClick={onOpenAddProperty}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center space-x-2 text-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>List Property</span>
              </button>
            </div>

            {/* Search & Filter bar */}
            <div className="bg-slate-800/70 border border-slate-700/60 p-3 rounded-2xl flex items-center space-x-3">
              <Search className="w-4 h-4 text-slate-400 ml-2" />
              <input
                type="text"
                value={propertySearch}
                onChange={(e) => setPropertySearch(e.target.value)}
                placeholder="Search by title, city, locality, or seller..."
                className="bg-transparent border-none text-xs text-white focus:outline-hidden w-full placeholder:text-slate-500"
              />
            </div>

            {/* Properties Table */}
            <div className="bg-slate-800/70 border border-slate-700/60 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-700/60">
                    <tr>
                      <th className="p-4">Property</th>
                      <th className="p-4">City / Locality</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Posted By</th>
                      <th className="p-4">Views</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {properties
                      .filter(p => p.title.toLowerCase().includes(propertySearch.toLowerCase()) || p.city.toLowerCase().includes(propertySearch.toLowerCase()))
                      .map((prop) => (
                        <tr key={prop.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 flex items-center space-x-3">
                            <img src={prop.images[0]} alt={prop.title} className="w-12 h-12 object-cover rounded-xl shrink-0" />
                            <div>
                              <h4 className="font-bold text-white text-xs line-clamp-1">{prop.title}</h4>
                              <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                                <span className="uppercase font-extrabold text-blue-400">{prop.purpose}</span>
                                <span>•</span>
                                <span>{prop.bedrooms} BHK</span>
                                <span>•</span>
                                <span>{prop.category}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-white">{prop.locality}</div>
                            <div className="text-[10px] text-slate-400">{prop.city}</div>
                          </td>
                          <td className="p-4 font-bold text-emerald-400">{prop.priceFormatted}</td>
                          <td className="p-4">
                            <span className="bg-slate-700/50 text-slate-300 text-[10px] px-2.5 py-1 rounded-lg capitalize font-medium">
                              {prop.postedByName} ({prop.postedBy})
                            </span>
                          </td>
                          <td className="p-4 font-bold text-slate-300">{prop.viewsCount}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => onPreviewProperty(prop)}
                                className="p-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
                                title="Preview Listing"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDuplicateProperty(prop.id)}
                                className="p-2 bg-slate-700/50 hover:bg-slate-700 text-blue-400 rounded-lg transition-colors cursor-pointer"
                                title="Duplicate Listing"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteProperty(prop.id)}
                                className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg transition-colors cursor-pointer"
                                title="Delete Listing"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CLIENT AUDIT CHECK */}
        {activeTab === 'audit' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Client Audit Check</h2>
              <p className="text-xs text-slate-400 mt-1">
                Review submitted properties from Owners, Builders, and Agents before publishing to the main site.
              </p>
            </div>

            {auditProperties.length === 0 ? (
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-3xl p-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">All Clear! No Pending Audits</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Every property submitted by users has been reviewed and published.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {auditProperties.map((item) => (
                  <div key={item.id} className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 space-y-4 shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
                      <div className="flex items-start space-x-4">
                        <img src={item.images[0]} alt={item.title} className="w-20 h-20 object-cover rounded-2xl shrink-0" />
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black px-2.5 py-0.5 rounded-md border border-amber-500/30">
                              PENDING APPROVAL
                            </span>
                            <span className="text-xs text-slate-400">
                              Submitted by {item.postedByName} ({item.postedBy})
                            </span>
                          </div>
                          <h3 className="text-base font-extrabold text-white">{item.title}</h3>
                          <p className="text-xs text-slate-300">{item.locality}, {item.city} • <span className="text-emerald-400 font-bold">{item.priceFormatted}</span></p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => onPreviewProperty(item)}
                          className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={() => onRequestChanges(item.id, 'Please provide updated RERA registration receipt.')}
                          className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 font-bold px-3.5 py-2 rounded-xl text-xs border border-amber-500/30 transition-all cursor-pointer"
                        >
                          Request Changes
                        </button>
                        <button
                          onClick={() => onRejectProperty(item.id, 'Property price is outside valid market parameters.')}
                          className="bg-red-950/40 hover:bg-red-900/60 text-red-400 font-bold px-3.5 py-2 rounded-xl text-xs border border-red-500/30 transition-all cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => onApproveProperty(item.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          <span>Approve & Publish</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-2xl text-xs text-slate-300 space-y-1">
                      <p className="text-[11px] font-bold text-slate-400 uppercase">Submitted Description:</p>
                      <p className="text-slate-300 leading-relaxed line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: FILE MANAGER (CLOUDINARY CONNECTED) */}
        {activeTab === 'files' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-white flex items-center space-x-2">
                  <span>Cloudinary File Manager</span>
                  <span className="bg-pink-950/60 text-pink-400 border border-pink-500/40 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                    Connected to Cloudinary CDN
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload and manage property images, videos, floor plans, RERA PDFs, and document assets.
                </p>
              </div>

              {/* Upload Button */}
              <label className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center space-x-2 text-xs transition-all cursor-pointer">
                <Upload className="w-4 h-4 stroke-[2.5]" />
                <span>Upload to Cloudinary</span>
                <input
                  type="file"
                  onChange={handleFileUploadSimulated}
                  className="hidden"
                />
              </label>
            </div>

            {/* Filter & View mode bar */}
            <div className="bg-slate-800/70 border border-slate-700/60 p-4 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* File Type Tabs */}
                <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {(['all', 'image', 'video', 'pdf', 'floor_plan', 'document', 'icon'] as const).map((ft) => (
                    <button
                      key={ft}
                      onClick={() => setFileTypeFilter(ft)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                        fileTypeFilter === ft
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-700/40 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {ft === 'all' ? 'All Assets' : ft.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {/* Grid vs List toggle */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-slate-400'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-slate-400'
                    }`}
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search & Folder filters */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 flex items-center space-x-2 w-full">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={fileSearch}
                    onChange={(e) => setFileSearch(e.target.value)}
                    placeholder="Search file name, public ID..."
                    className="bg-transparent text-xs text-white focus:outline-hidden w-full placeholder:text-slate-500"
                  />
                </div>
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="bg-slate-900 border border-slate-700/80 text-xs text-white rounded-xl px-3 py-2 focus:outline-hidden w-full sm:w-48"
                >
                  <option value="all">All Folders</option>
                  <option value="/properties">/properties</option>
                  <option value="/floor-plans">/floor-plans</option>
                  <option value="/documents">/documents</option>
                  <option value="/videos">/videos</option>
                </select>
              </div>
            </div>

            {/* File Assets Display */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {files
                  .filter(f => (fileTypeFilter === 'all' || f.fileType === fileTypeFilter) && f.name.toLowerCase().includes(fileSearch.toLowerCase()))
                  .map((file) => (
                    <div key={file.id} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden group space-y-2 p-3 hover:border-blue-500/60 transition-all">
                      <div className="h-32 bg-slate-950 rounded-xl overflow-hidden relative flex items-center justify-center">
                        {file.fileType === 'image' || file.fileType === 'floor_plan' || file.fileType === 'icon' ? (
                          <img src={file.url} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : file.fileType === 'video' ? (
                          <Video className="w-10 h-10 text-cyan-400" />
                        ) : (
                          <FileText className="w-10 h-10 text-rose-400" />
                        )}
                        <span className="absolute top-2 left-2 bg-slate-950/80 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
                          {file.format}
                        </span>
                      </div>

                      <div className="space-y-1">
                        {editingFileId === file.id ? (
                          <div className="flex items-center space-x-1">
                            <input
                              type="text"
                              value={editingFileName}
                              onChange={(e) => setEditingFileName(e.target.value)}
                              className="bg-slate-900 border border-slate-600 text-xs text-white px-2 py-1 rounded-md w-full"
                            />
                            <button
                              onClick={() => {
                                onRenameFile(file.id, editingFileName);
                                setEditingFileId(null);
                              }}
                              className="bg-emerald-600 text-white p-1 rounded-md"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-white text-xs truncate max-w-[140px]">{file.name}</h4>
                            <button
                              onClick={() => {
                                setEditingFileId(file.id);
                                setEditingFileName(file.name);
                              }}
                              className="text-slate-400 hover:text-white p-1"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        <p className="text-[10px] text-slate-400">
                          {(file.sizeBytes / 1024 / 1024).toFixed(2)} MB • {file.folder}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1 pt-2 border-t border-slate-700/60">
                        <button
                          onClick={() => handleCopyUrl(file.url, file.id)}
                          className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-slate-200 text-[10px] font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <Link className="w-3 h-3 text-cyan-400" />
                          <span>{copiedId === file.id ? 'Copied!' : 'Copy URL'}</span>
                        </button>
                        <button
                          onClick={() => onDeleteFile(file.id)}
                          className="p-1.5 bg-red-950/40 hover:bg-red-900 text-red-400 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-4">File Name</th>
                      <th className="p-4">Folder</th>
                      <th className="p-4">Format</th>
                      <th className="p-4">Size</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {files.map((file) => (
                      <tr key={file.id} className="hover:bg-slate-800/40">
                        <td className="p-4 flex items-center space-x-3">
                          <span className="font-bold text-white">{file.name}</span>
                        </td>
                        <td className="p-4 text-slate-400">{file.folder}</td>
                        <td className="p-4 uppercase font-bold text-blue-400">{file.format}</td>
                        <td className="p-4 font-medium">{(file.sizeBytes / 1024 / 1024).toFixed(2)} MB</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleCopyUrl(file.url, file.id)}
                            className="text-xs text-blue-400 font-bold hover:underline"
                          >
                            {copiedId === file.id ? 'Copied URL!' : 'Copy URL'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PAGES & SHOPIFY-STYLE PAGE BUILDER */}
        {activeTab === 'pages' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {!isBuildingPage ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-white">Pages Management</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Manage website landing pages and drag-and-drop sections with Shopify-style Page Builder.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newP: WebsitePage = {
                        id: `page-${Date.now()}`,
                        title: 'New Custom Page',
                        slug: 'custom-page',
                        status: 'published',
                        updatedAt: new Date().toISOString(),
                        sections: []
                      };
                      setEditingPage(newP);
                      setIsBuildingPage(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center space-x-2 text-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Add Page</span>
                  </button>
                </div>

                {/* Pages List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pages.map((page) => (
                    <div key={page.id} className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 space-y-4 shadow-lg hover:border-blue-500/60 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="bg-emerald-950 text-emerald-400 text-[10px] font-black px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                          {page.status.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {page.sections.length} Sections
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-extrabold text-white">{page.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">URL Slug: /{page.slug}</p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-700/60 text-xs">
                        <button
                          onClick={() => {
                            setEditingPage(page);
                            setIsBuildingPage(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1"
                        >
                          <Edit className="w-3.5 h-3.5 mr-1" />
                          <span>Edit Sections</span>
                        </button>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onDuplicatePage(page.id)}
                            className="p-1.5 bg-slate-700 hover:bg-slate-600 text-blue-300 rounded-lg cursor-pointer"
                            title="Duplicate Page"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeletePage(page.id)}
                            className="p-1.5 bg-red-950/40 hover:bg-red-900 text-red-400 rounded-lg cursor-pointer"
                            title="Delete Page"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* DEDICATED SHOPIFY-STYLE PAGE BUILDER */
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setIsBuildingPage(false)}
                      className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-700"
                    >
                      ← Back to Pages
                    </button>
                    <div>
                      <h2 className="text-xl font-extrabold text-white">
                        Shopify Page Builder: {editingPage?.title}
                      </h2>
                      <p className="text-xs text-slate-400">Drag & drop sections to compose custom layouts</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (editingPage) {
                        onSavePage(editingPage);
                        setIsBuildingPage(false);
                      }
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-lg text-xs cursor-pointer flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Page Layout</span>
                  </button>
                </div>

                {/* Builder Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Available Sections Toolbar */}
                  <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 space-y-4">
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider text-blue-400">
                      Add Shopify-Style Sections
                    </h3>
                    <div className="space-y-2">
                      {[
                        { type: 'full_width_image_banner', label: 'Full Width Image Banner', icon: ImageIcon },
                        { type: 'full_width_video_banner', label: 'Full Width Video Banner', icon: Video },
                        { type: 'image_slideshow', label: 'Image Slideshow', icon: Layers },
                        { type: 'image_with_text', label: 'Image with Text', icon: FileText },
                        { type: 'text_columns', label: 'Text Columns Grid', icon: Grid },
                        { type: 'rich_text', label: 'Rich Text Content', icon: FileText },
                        { type: 'faqs', label: 'FAQs Accordion', icon: HelpCircle },
                        { type: 'dynamic_properties', label: 'Dynamic Properties Feed', icon: Building2 }
                      ].map((sec) => (
                        <button
                          key={sec.type}
                          onClick={() => {
                            if (!editingPage) return;
                            const newSec: PageSection = {
                              id: `sec-${Date.now()}`,
                              type: sec.type as PageSectionType,
                              title: `New ${sec.label}`,
                              subtitle: 'Custom section description',
                              dynamicFilter: 'all'
                            };
                            setEditingPage({
                              ...editingPage,
                              sections: [...editingPage.sections, newSec]
                            });
                          }}
                          className="w-full bg-slate-900 hover:bg-blue-950/60 border border-slate-700 hover:border-blue-500/60 p-3 rounded-2xl text-left text-xs font-bold text-white flex items-center justify-between transition-all cursor-pointer"
                        >
                          <div className="flex items-center space-x-2.5">
                            <sec.icon className="w-4 h-4 text-blue-400" />
                            <span>{sec.label}</span>
                          </div>
                          <Plus className="w-4 h-4 text-blue-400" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Canvas & Active Sections List */}
                  <div className="lg:col-span-2 bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 space-y-6">
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider text-emerald-400">
                      Page Canvas ({editingPage?.sections.length || 0} Sections)
                    </h3>

                    <div className="space-y-4">
                      {editingPage?.sections.map((sec, index) => (
                        <div key={sec.id} className="bg-slate-900 border border-slate-700 rounded-2xl p-4 space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <div className="flex items-center space-x-2">
                              <span className="bg-slate-800 text-blue-400 font-black text-[10px] w-6 h-6 rounded-full flex items-center justify-center">
                                {index + 1}
                              </span>
                              <span className="font-extrabold text-white text-xs capitalize">
                                {sec.type.replace(/_/g, ' ')}
                              </span>
                            </div>

                            <div className="flex items-center space-x-1">
                              {/* Reorder Up */}
                              <button
                                disabled={index === 0}
                                onClick={() => {
                                  if (!editingPage || index === 0) return;
                                  const newArr = [...editingPage.sections];
                                  const temp = newArr[index - 1];
                                  newArr[index - 1] = newArr[index];
                                  newArr[index] = temp;
                                  setEditingPage({ ...editingPage, sections: newArr });
                                }}
                                className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md disabled:opacity-30 cursor-pointer"
                              >
                                <MoveUp className="w-3.5 h-3.5" />
                              </button>

                              {/* Reorder Down */}
                              <button
                                disabled={index === editingPage.sections.length - 1}
                                onClick={() => {
                                  if (!editingPage || index === editingPage.sections.length - 1) return;
                                  const newArr = [...editingPage.sections];
                                  const temp = newArr[index + 1];
                                  newArr[index + 1] = newArr[index];
                                  newArr[index] = temp;
                                  setEditingPage({ ...editingPage, sections: newArr });
                                }}
                                className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md disabled:opacity-30 cursor-pointer"
                              >
                                <MoveDown className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Section */}
                              <button
                                onClick={() => {
                                  if (!editingPage) return;
                                  setEditingPage({
                                    ...editingPage,
                                    sections: editingPage.sections.filter(s => s.id !== sec.id)
                                  });
                                }}
                                className="p-1 bg-red-950 hover:bg-red-900 text-red-400 rounded-md cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Controls based on section type */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="text-[10px] text-slate-400 font-bold">Section Title</label>
                              <input
                                type="text"
                                value={sec.title || ''}
                                onChange={(e) => {
                                  if (!editingPage) return;
                                  const newSecs = [...editingPage.sections];
                                  newSecs[index].title = e.target.value;
                                  setEditingPage({ ...editingPage, sections: newSecs });
                                }}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-medium"
                              />
                            </div>

                            {sec.type === 'dynamic_properties' && (
                              <div>
                                <label className="text-[10px] text-amber-400 font-bold">Dynamic Property Filter</label>
                                <select
                                  value={sec.dynamicFilter || 'all'}
                                  onChange={(e) => {
                                    if (!editingPage) return;
                                    const newSecs = [...editingPage.sections];
                                    newSecs[index].dynamicFilter = e.target.value as DynamicPropertiesFilter;
                                    setEditingPage({ ...editingPage, sections: newSecs });
                                  }}
                                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-bold"
                                >
                                  <option value="all">All Published Listings</option>
                                  <option value="rent">Rent Only</option>
                                  <option value="sale">Sale Only</option>
                                  <option value="commercial">Commercial Only</option>
                                  <option value="residential">Residential Only</option>
                                  <option value="featured">Featured Premium Only</option>
                                  <option value="latest">Recently Added</option>
                                </select>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: HEADER & FOOTER CONFIGURATION */}
        {activeTab === 'header_footer' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-white">Header & Footer Global Settings</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage announcement bars, navigation menus, mega menus, quick links, and footer compliance text.
                </p>
              </div>

              <button
                onClick={() => {
                  onSaveHeaderConfig(localHeader);
                  onSaveFooterConfig(localFooter);
                  setSavedSettingsNotice(true);
                  setTimeout(() => setSavedSettingsNotice(false), 3000);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-lg text-xs cursor-pointer flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Publish Global Changes</span>
              </button>
            </div>

            {savedSettingsNotice && (
              <div className="bg-emerald-900/60 border border-emerald-500/40 p-4 rounded-2xl text-emerald-200 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Header and Footer settings saved and deployed globally across website!</span>
              </div>
            )}

            {/* HEADER SETTINGS PANEL */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 space-y-6">
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider text-purple-400 border-b border-slate-700/60 pb-2">
                Header & Navigation Bar Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Announcement Bar Text</label>
                  <input
                    type="text"
                    value={localHeader.announcementText}
                    onChange={(e) => setLocalHeader({ ...localHeader, announcementText: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div className="flex items-center space-x-4 pt-6">
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localHeader.showAnnouncement}
                      onChange={(e) => setLocalHeader({ ...localHeader, showAnnouncement: e.target.checked })}
                      className="w-4 h-4 rounded-sm accent-purple-600"
                    />
                    <span>Show Top Announcement Bar</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localHeader.stickyHeader}
                      onChange={(e) => setLocalHeader({ ...localHeader, stickyHeader: e.target.checked })}
                      className="w-4 h-4 rounded-sm accent-purple-600"
                    />
                    <span>Enable Sticky Header</span>
                  </label>
                </div>
              </div>
            </div>

            {/* FOOTER SETTINGS PANEL */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 space-y-6">
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider text-purple-400 border-b border-slate-700/60 pb-2">
                Footer Settings & Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">24/7 Helpline Phone</label>
                  <input
                    type="text"
                    value={localFooter.helplinePhone}
                    onChange={(e) => setLocalFooter({ ...localFooter, helplinePhone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Support Email</label>
                  <input
                    type="text"
                    value={localFooter.supportEmail}
                    onChange={(e) => setLocalFooter({ ...localFooter, supportEmail: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-300">Copyright Notice Text</label>
                  <input
                    type="text"
                    value={localFooter.copyrightText}
                    onChange={(e) => setLocalFooter({ ...localFooter, copyrightText: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
