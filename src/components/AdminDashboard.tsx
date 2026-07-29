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
  Filter,
  Database,
  Server,
  RefreshCw,
  Activity,
  Cloud,
  ShieldCheck
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
  initialSubTab?: string;
  onNavigateSubTab?: (path: string) => void;
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
    'analytics' | 'properties' | 'audit' | 'files' | 'pages' | 'header_footer' | 'db_diagnostics'
  >('analytics');

  // Database & Cloudinary Diagnostics State
  const [neonStatus, setNeonStatus] = useState<{
    loading: boolean;
    connected: boolean;
    provider?: string;
    serverTime?: string;
    version?: string;
    message?: string;
    error?: string;
  }>({ loading: false, connected: false });

  const [cloudinaryStatus, setCloudinaryStatus] = useState<{
    loading: boolean;
    configured: boolean;
    cloudName?: string | null;
    apiKeyConfigured?: boolean;
    message?: string;
    error?: string;
  }>({ loading: false, configured: false });

  const [rawJsonResponse, setRawJsonResponse] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setNeonStatus(prev => ({ ...prev, loading: true }));
    setCloudinaryStatus(prev => ({ ...prev, loading: true }));
    setRawJsonResponse(null);

    let neonResData: any = null;
    let cldResData: any = null;

    try {
      const resNeon = await fetch('/api/neon/status');
      const rawTextNeon = await resNeon.text();
      try {
        neonResData = JSON.parse(rawTextNeon);
      } catch (parseErr) {
        neonResData = {
          connected: false,
          error: `API returned HTML/text instead of JSON (Status ${resNeon.status}). If hosting statically on Vercel, ensure Vercel Serverless Functions and environment variables (DATABASE_URL) are set.`
        };
      }
      setNeonStatus({ loading: false, connected: neonResData.connected ?? false, ...neonResData });
    } catch (err: any) {
      neonResData = { connected: false, error: err.message };
      setNeonStatus({ loading: false, connected: false, error: err.message });
    }

    try {
      const resCld = await fetch('/api/cloudinary/status');
      const rawTextCld = await resCld.text();
      try {
        cldResData = JSON.parse(rawTextCld);
      } catch (parseErr) {
        cldResData = {
          configured: false,
          error: `API returned HTML/text instead of JSON (Status ${resCld.status}). If hosting statically on Vercel, ensure Vercel Serverless Functions and environment variables (CLOUDINARY_*) are set.`
        };
      }
      setCloudinaryStatus({ loading: false, configured: cldResData.configured ?? false, ...cldResData });
    } catch (err: any) {
      cldResData = { configured: false, error: err.message };
      setCloudinaryStatus({ loading: false, configured: false, error: err.message });
    }

    setRawJsonResponse(JSON.stringify({ neonPostgreSQL: neonResData, cloudinaryCDN: cldResData }, null, 2));
  };

  React.useEffect(() => {
    runDiagnostics();
  }, []);

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

            <button
              onClick={() => { setActiveTab('db_diagnostics'); setIsBuildingPage(false); runDiagnostics(); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'db_diagnostics'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>7. DB Diagnostics</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center ${
                neonStatus.connected ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-300'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1 ${neonStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>Neon & Cld</span>
              </span>
            </button>
          </nav>
        </div>

        {/* Database Status Footer */}
        <div className="pt-6 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Database Status</span>
            <span className={`flex items-center font-bold text-[10px] ${neonStatus.connected ? 'text-emerald-400' : 'text-amber-400'}`}>
              <span className={`w-2 h-2 rounded-full mr-1.5 ${neonStatus.connected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
              {neonStatus.connected ? 'Neon Live' : 'Setup Ready'}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 space-y-0.5">
            <p className="flex justify-between">
              <span>PostgreSQL:</span>
              <span className={neonStatus.connected ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                {neonStatus.connected ? 'Connected' : 'Ready'}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Cloudinary CDN:</span>
              <span className={cloudinaryStatus.configured ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                {cloudinaryStatus.configured ? 'Active' : 'Ready'}
              </span>
            </p>
          </div>
          <button
            onClick={() => { setActiveTab('db_diagnostics'); setIsBuildingPage(false); runDiagnostics(); }}
            className="w-full text-left text-[11px] font-extrabold text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-between pt-1 cursor-pointer"
          >
            <span>Run DB Diagnostics</span>
            <ChevronRight className="w-3 h-3" />
          </button>
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

                          {/* Fully Admin Customizable Controls Panel */}
                          <div className="space-y-4 pt-2 text-xs">
                            {/* Row 1: Title, Subtitle, Overlay Badge */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="text-[10px] text-slate-400 font-bold block mb-1">Section Title</label>
                                <input
                                  type="text"
                                  value={sec.title || ''}
                                  placeholder="e.g. Modern Residential Project"
                                  onChange={(e) => {
                                    if (!editingPage) return;
                                    const newSecs = [...editingPage.sections];
                                    newSecs[index].title = e.target.value;
                                    setEditingPage({ ...editingPage, sections: newSecs });
                                  }}
                                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-medium"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] text-slate-400 font-bold block mb-1">Subtitle / Category</label>
                                <input
                                  type="text"
                                  value={sec.subtitle || ''}
                                  placeholder="e.g. Handpicked luxury homes"
                                  onChange={(e) => {
                                    if (!editingPage) return;
                                    const newSecs = [...editingPage.sections];
                                    newSecs[index].subtitle = e.target.value;
                                    setEditingPage({ ...editingPage, sections: newSecs });
                                  }}
                                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-medium"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] text-amber-400 font-bold block mb-1">Overlay Badge Text</label>
                                <input
                                  type="text"
                                  value={sec.overlayText || ''}
                                  placeholder="e.g. 0% BROKERAGE"
                                  onChange={(e) => {
                                    if (!editingPage) return;
                                    const newSecs = [...editingPage.sections];
                                    newSecs[index].overlayText = e.target.value;
                                    setEditingPage({ ...editingPage, sections: newSecs });
                                  }}
                                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-amber-300 font-bold"
                                />
                              </div>
                            </div>

                            {/* Row 2: Description / Content Body */}
                            <div>
                              <label className="text-[10px] text-slate-400 font-bold block mb-1">Description / Content</label>
                              <textarea
                                rows={2}
                                value={sec.content || ''}
                                placeholder="Write detailed content text for this section..."
                                onChange={(e) => {
                                  if (!editingPage) return;
                                  const newSecs = [...editingPage.sections];
                                  newSecs[index].content = e.target.value;
                                  setEditingPage({ ...editingPage, sections: newSecs });
                                }}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-medium"
                              />
                            </div>

                            {/* Row 3: Image Upload / Select from Cloudinary */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[10px] text-cyan-400 font-bold block mb-1">
                                  Image URL (or select from Cloudinary File Manager)
                                </label>
                                <div className="space-y-1">
                                  <input
                                    type="text"
                                    value={sec.imageUrl || ''}
                                    placeholder="https://images.unsplash.com/..."
                                    onChange={(e) => {
                                      if (!editingPage) return;
                                      const newSecs = [...editingPage.sections];
                                      newSecs[index].imageUrl = e.target.value;
                                      setEditingPage({ ...editingPage, sections: newSecs });
                                    }}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono text-[11px]"
                                  />
                                  {files.length > 0 && (
                                    <select
                                      onChange={(e) => {
                                        if (!editingPage || !e.target.value) return;
                                        const newSecs = [...editingPage.sections];
                                        newSecs[index].imageUrl = e.target.value;
                                        setEditingPage({ ...editingPage, sections: newSecs });
                                      }}
                                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-cyan-300 text-[10px] font-bold"
                                    >
                                      <option value="">-- Quick Pick from Cloudinary Files --</option>
                                      {files.filter(f => f.fileType === 'image' || f.fileType === 'floor_plan').map(f => (
                                        <option key={f.id} value={f.url}>{f.name} ({f.folder})</option>
                                      ))}
                                    </select>
                                  )}
                                </div>
                              </div>

                              {sec.type === 'full_width_video_banner' ? (
                                <div>
                                  <label className="text-[10px] text-purple-400 font-bold block mb-1">Video URL (MP4 / WebM)</label>
                                  <input
                                    type="text"
                                    value={sec.videoUrl || ''}
                                    placeholder="https://commondatastorage.googleapis.com/..."
                                    onChange={(e) => {
                                      if (!editingPage) return;
                                      const newSecs = [...editingPage.sections];
                                      newSecs[index].videoUrl = e.target.value;
                                      setEditingPage({ ...editingPage, sections: newSecs });
                                    }}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono text-[11px]"
                                  />
                                </div>
                              ) : (
                                <div>
                                  <label className="text-[10px] text-emerald-400 font-bold block mb-1">Action Button Text & URL</label>
                                  <div className="flex space-x-2">
                                    <input
                                      type="text"
                                      placeholder="Button Label"
                                      value={sec.buttonText || ''}
                                      onChange={(e) => {
                                        if (!editingPage) return;
                                        const newSecs = [...editingPage.sections];
                                        newSecs[index].buttonText = e.target.value;
                                        setEditingPage({ ...editingPage, sections: newSecs });
                                      }}
                                      className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                                    />
                                    <input
                                      type="text"
                                      placeholder="URL (e.g. /search)"
                                      value={sec.buttonUrl || ''}
                                      onChange={(e) => {
                                        if (!editingPage) return;
                                        const newSecs = [...editingPage.sections];
                                        newSecs[index].buttonUrl = e.target.value;
                                        setEditingPage({ ...editingPage, sections: newSecs });
                                      }}
                                      className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Row 4: Styling Options (Overlay Color, Opacity, Text Color, Background Color, Align) */}
                            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-3">
                              <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider block">
                                Visual Style & Color Controls
                              </span>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div>
                                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Background Color</label>
                                  <input
                                    type="color"
                                    value={sec.backgroundColor || '#ffffff'}
                                    onChange={(e) => {
                                      if (!editingPage) return;
                                      const newSecs = [...editingPage.sections];
                                      newSecs[index].backgroundColor = e.target.value;
                                      setEditingPage({ ...editingPage, sections: newSecs });
                                    }}
                                    className="w-full h-8 bg-slate-800 border border-slate-700 rounded-lg cursor-pointer p-0.5"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Text Color</label>
                                  <input
                                    type="color"
                                    value={sec.textColor || '#0f172a'}
                                    onChange={(e) => {
                                      if (!editingPage) return;
                                      const newSecs = [...editingPage.sections];
                                      newSecs[index].textColor = e.target.value;
                                      setEditingPage({ ...editingPage, sections: newSecs });
                                    }}
                                    className="w-full h-8 bg-slate-800 border border-slate-700 rounded-lg cursor-pointer p-0.5"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Overlay Color</label>
                                  <input
                                    type="color"
                                    value={sec.overlayColor || '#000000'}
                                    onChange={(e) => {
                                      if (!editingPage) return;
                                      const newSecs = [...editingPage.sections];
                                      newSecs[index].overlayColor = e.target.value;
                                      setEditingPage({ ...editingPage, sections: newSecs });
                                    }}
                                    className="w-full h-8 bg-slate-800 border border-slate-700 rounded-lg cursor-pointer p-0.5"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-400 font-bold block mb-1">
                                    Overlay Opacity: {sec.overlayOpacity ?? 50}%
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={sec.overlayOpacity ?? 50}
                                    onChange={(e) => {
                                      if (!editingPage) return;
                                      const newSecs = [...editingPage.sections];
                                      newSecs[index].overlayOpacity = parseInt(e.target.value);
                                      setEditingPage({ ...editingPage, sections: newSecs });
                                    }}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-2"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                                <div>
                                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Text Alignment</label>
                                  <select
                                    value={sec.textAlign || 'center'}
                                    onChange={(e) => {
                                      if (!editingPage) return;
                                      const newSecs = [...editingPage.sections];
                                      newSecs[index].textAlign = e.target.value as any;
                                      setEditingPage({ ...editingPage, sections: newSecs });
                                    }}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white font-bold text-[11px]"
                                  >
                                    <option value="left">Left Aligned</option>
                                    <option value="center">Center Aligned</option>
                                    <option value="right">Right Aligned</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Heading Size</label>
                                  <select
                                    value={sec.headingSize || 'medium'}
                                    onChange={(e) => {
                                      if (!editingPage) return;
                                      const newSecs = [...editingPage.sections];
                                      newSecs[index].headingSize = e.target.value as any;
                                      setEditingPage({ ...editingPage, sections: newSecs });
                                    }}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white font-bold text-[11px]"
                                  >
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large Banner</option>
                                    <option value="huge">Huge Display</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Section Padding</label>
                                  <select
                                    value={sec.paddingY || 'normal'}
                                    onChange={(e) => {
                                      if (!editingPage) return;
                                      const newSecs = [...editingPage.sections];
                                      newSecs[index].paddingY = e.target.value as any;
                                      setEditingPage({ ...editingPage, sections: newSecs });
                                    }}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white font-bold text-[11px]"
                                  >
                                    <option value="compact">Compact (Py-8)</option>
                                    <option value="normal">Normal (Py-16)</option>
                                    <option value="spacious">Spacious (Py-24)</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* Section Specific Controllers */}
                            {sec.type === 'dynamic_properties' && (
                              <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl">
                                <label className="text-[10px] text-amber-400 font-bold block mb-1">Dynamic Property Filter Feed</label>
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

        {/* TAB 7: DATABASE & CLOUDINARY DIAGNOSTICS */}
        {activeTab === 'db_diagnostics' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-emerald-950/60 border border-emerald-800/50 rounded-2xl text-emerald-400">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-white">DB & Storage Diagnostics</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Verify connection status, configuration parameters, and API health for Neon PostgreSQL & Cloudinary CDN.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={runDiagnostics}
                disabled={neonStatus.loading || cloudinaryStatus.loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-lg text-xs cursor-pointer flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${neonStatus.loading || cloudinaryStatus.loading ? 'animate-spin' : ''}`} />
                <span>{neonStatus.loading || cloudinaryStatus.loading ? 'Testing Connections...' : 'Re-Run Diagnostics'}</span>
              </button>
            </div>

            {/* STATUS SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NEON POSTGRESQL CARD */}
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 space-y-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-white">Neon PostgreSQL</h3>
                        <span className="text-[10px] text-slate-400">Serverless Relational Database</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center space-x-1.5 ${
                      neonStatus.connected
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${neonStatus.connected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                      <span>{neonStatus.connected ? 'CONNECTED & LIVE' : 'CONFIGURATION READY'}</span>
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-xs p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-bold">Engine Status</span>
                      <span className="text-white font-mono font-bold">@neondatabase/serverless</span>
                    </div>

                    <div className="flex items-center justify-between text-xs p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-bold">Connection Target</span>
                      <span className="text-slate-200 font-mono text-[11px] font-semibold">
                        {neonStatus.connected ? 'Neon Cloud Branch (SSL Mode)' : 'DATABASE_URL in .env.example'}
                      </span>
                    </div>

                    {neonStatus.serverTime && (
                      <div className="flex items-center justify-between text-xs p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                        <span className="text-slate-400 font-bold">PostgreSQL Server Time</span>
                        <span className="text-emerald-400 font-mono text-[11px] font-bold">
                          {new Date(neonStatus.serverTime).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {neonStatus.version && (
                      <div className="flex items-center justify-between text-xs p-3 bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
                        <span className="text-slate-400 font-bold">PostgreSQL Version</span>
                        <span className="text-slate-300 font-mono text-[10px] truncate max-w-[200px]" title={neonStatus.version}>
                          {neonStatus.version}
                        </span>
                      </div>
                    )}

                    {neonStatus.message && (
                      <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl text-amber-300 text-xs leading-relaxed">
                        <div className="font-bold flex items-center space-x-1.5 mb-1">
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                          <span>Neon Setup Note</span>
                        </div>
                        {neonStatus.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/60 text-[11px] text-slate-400 space-y-1">
                  <div className="font-bold text-slate-300 mb-1">How Neon Integration Works:</div>
                  <p>• Lazy initialisation in <code className="text-cyan-300">/src/services/serverIntegrations.ts</code>.</p>
                  <p>• Server route <code className="text-cyan-300">/api/neon/status</code> executes direct PostgreSQL queries when key is present.</p>
                </div>
              </div>

              {/* CLOUDINARY CDN CARD */}
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 space-y-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-purple-950 border border-purple-800/60 flex items-center justify-center text-purple-400">
                        <Cloud className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-white">Cloudinary CDN</h3>
                        <span className="text-[10px] text-slate-400">Media Asset Management & CDN</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center space-x-1.5 ${
                      cloudinaryStatus.configured
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${cloudinaryStatus.configured ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                      <span>{cloudinaryStatus.configured ? 'CONFIGURED & READY' : 'KEYS NEEDED'}</span>
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-xs p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-bold">SDK Package</span>
                      <span className="text-white font-mono font-bold">cloudinary (v2 API)</span>
                    </div>

                    <div className="flex items-center justify-between text-xs p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-bold">Cloud Name</span>
                      <span className="text-purple-300 font-mono text-[11px] font-bold">
                        {cloudinaryStatus.cloudName || 'CLOUDINARY_CLOUD_NAME in .env'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-bold">Upload Signature Endpoint</span>
                      <span className="text-emerald-400 font-mono text-[11px] font-bold">
                        /api/cloudinary/signature (Secure)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-bold">Managed File Assets</span>
                      <span className="text-cyan-400 font-mono text-[11px] font-bold">
                        {files.length} active files in manager
                      </span>
                    </div>

                    {cloudinaryStatus.message && (
                      <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl text-amber-300 text-xs leading-relaxed">
                        <div className="font-bold flex items-center space-x-1.5 mb-1">
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                          <span>Cloudinary Setup Note</span>
                        </div>
                        {cloudinaryStatus.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/60 text-[11px] text-slate-400 space-y-1">
                  <div className="font-bold text-slate-300 mb-1">How Cloudinary Integration Works:</div>
                  <p>• API keys are stored strictly server-side in <code className="text-purple-300">server.ts</code>.</p>
                  <p>• Direct image upload signatures are calculated using <code className="text-purple-300">api_sign_request</code>.</p>
                </div>
              </div>
            </div>

            {/* LIVE API RESPONSE CONSOLE */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div className="flex items-center space-x-2.5">
                  <Server className="w-5 h-5 text-blue-400" />
                  <h3 className="text-base font-extrabold text-white">Live System Diagnostics Response Payload</h3>
                </div>
                <span className="text-[10px] bg-slate-950 text-slate-400 px-3 py-1 rounded-full border border-slate-800 font-mono">
                  GET /api/neon/status & GET /api/cloudinary/status
                </span>
              </div>

              {rawJsonResponse ? (
                <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto max-h-80">
                  {rawJsonResponse}
                </pre>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/50 rounded-2xl border border-slate-800">
                  Click <span className="text-blue-400 font-bold">"Re-Run Diagnostics"</span> above to fetch live server payloads.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
