import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Search,
  Award,
  ChevronRight,
  ArrowRight,
  Calculator,
  MessageSquare,
  Home
} from 'lucide-react';
import { 
  Property, 
  BuilderProject, 
  SearchFilters, 
  Role, 
  WebsitePage, 
  CloudinaryFile, 
  HeaderConfig, 
  FooterConfig,
  GoogleAuthUser 
} from './types';
import { fetchProperties, fetchBuilderProjects, submitLeadInquiry, fetchFiles, deleteFileApi, renameFileApi } from './services/api';
import { POPULAR_CITIES, MOCK_BLOGS, LOCALITY_REVIEWS } from './data/mockData';
import { INITIAL_PAGES, INITIAL_FILES } from './services/store';
import { onAuthChange, logoutFirebase } from './lib/firebase';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { PropertyCard } from './components/PropertyCard';
import { PropertySearch } from './components/PropertySearch';
import { PropertyDetail } from './components/PropertyDetail';
import { ProjectsView } from './components/ProjectsView';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PageView } from './components/PageView';
import { AuthModal } from './components/AuthModal';
import { AISearchModal } from './components/AISearchModal';
import { EMICalculator } from './components/EMICalculator';
import { CompareDrawer } from './components/CompareDrawer';
import { PostPropertyWizard } from './components/PostPropertyWizard';
import { PostPropertyPage } from './components/PostPropertyPage';
import { MessagingDrawer } from './components/MessagingDrawer';

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>('buyer');
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');

  // Properties & Projects State
  const [properties, setProperties] = useState<Property[]>([]);
  const [auditProperties, setAuditProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<BuilderProject[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>(['prop-1']);
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Store Collections
  const [pages, setPages] = useState<WebsitePage[]>(INITIAL_PAGES);
  const [files, setFiles] = useState<CloudinaryFile[]>(INITIAL_FILES);
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>({
    logoText: 'Shine Native',
    tagline: 'Real Estate Marketplace',
    navLinks: [
      { label: 'Buy', url: '/search?purpose=sale' },
      { label: 'Rent', url: '/search?purpose=rent' },
      { label: 'New Projects', url: '/pages/new-project' },
      { label: 'Luxury Living', url: '/pages/luxury-living' }
    ]
  });
  const [footerConfig, setFooterConfig] = useState<FooterConfig>({
    aboutText: 'Shine Native is India’s premier verified real estate portal powering seamless direct buyer, builder, and broker transactions.',
    copyrightText: '© 2026 Shine Native Technologies Inc. All rights reserved.',
    contactEmail: 'support@shinenative.com',
    contactPhone: '+91 1800 200 9000'
  });

  // Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    const stored = localStorage.getItem('isAdminAuthenticated');
    return stored === null ? true : stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isAdminAuthenticated', String(isAdminAuthenticated));
  }, [isAdminAuthenticated]);

  const [authenticatedRoles, setAuthenticatedRoles] = useState<Record<Role, boolean>>({
    buyer: true,
    owner: true,
    broker: true,
    builder: true
  });

  const [googleUserSessions, setGoogleUserSessions] = useState<Record<string, GoogleAuthUser | null>>(() => {
    const defaultSessions: Record<string, GoogleAuthUser> = {
      buyer: {
        email: 'rahul.buyer@gmail.com',
        name: 'Rahul Sharma',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        role: 'buyer',
        isVerified: true,
        loggedInAt: new Date().toISOString(),
        authMethod: 'google'
      },
      owner: {
        email: 'sunil.owner@gmail.com',
        name: 'Sunil Mehta',
        picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        role: 'owner',
        isVerified: true,
        loggedInAt: new Date().toISOString(),
        authMethod: 'google'
      },
      broker: {
        email: 'apex.broker@gmail.com',
        name: 'Anil Verma (Apex Realty)',
        picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        role: 'broker',
        isVerified: true,
        loggedInAt: new Date().toISOString(),
        authMethod: 'google'
      },
      builder: {
        email: 'builder.prestige@gmail.com',
        name: 'Prestige Developers Team',
        picture: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
        role: 'builder',
        isVerified: true,
        loggedInAt: new Date().toISOString(),
        authMethod: 'google'
      }
    };

    const stored = localStorage.getItem('google_user_sessions');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return {
            buyer: parsed.buyer ? { ...defaultSessions.buyer, ...parsed.buyer } : defaultSessions.buyer,
            owner: parsed.owner ? { ...defaultSessions.owner, ...parsed.owner } : defaultSessions.owner,
            broker: parsed.broker ? { ...defaultSessions.broker, ...parsed.broker } : defaultSessions.broker,
            builder: parsed.builder ? { ...defaultSessions.builder, ...parsed.builder } : defaultSessions.builder,
          };
        }
      } catch (e) {
        console.error('Error parsing stored Google sessions:', e);
      }
    }
    return defaultSessions;
  });

  useEffect(() => {
    localStorage.setItem('google_user_sessions', JSON.stringify(googleUserSessions));
  }, [googleUserSessions]);

  useEffect(() => {
    const unsubscribe = onAuthChange((fbUser) => {
      if (fbUser) {
        setGoogleUserSessions(prev => ({
          ...prev,
          [currentRole]: {
            email: fbUser.email || 'user@firebase.com',
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Firebase User',
            picture: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            role: currentRole,
            isVerified: true,
            loggedInAt: new Date().toISOString(),
            authMethod: 'google'
          }
        }));
      }
    });
    return () => unsubscribe();
  }, [currentRole]);

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authTargetRole, setAuthTargetRole] = useState<Role | 'admin'>('buyer');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const handleOpenGoogleAuth = (role?: Role | 'admin', mode?: 'login' | 'signup') => {
    setAuthTargetRole(role || (currentRole === 'admin' ? 'buyer' : currentRole));
    setAuthModalMode(mode || 'login');
    setAuthModalOpen(true);
  };

  const handleSignOutGoogle = () => {
    logoutFirebase().catch(err => console.error('Signout error:', err));
    setGoogleUserSessions(prev => ({
      ...prev,
      [currentRole]: null
    }));
  };

  const currentGoogleUser = googleUserSessions[currentRole] || null;


  // Modals & Drawers
  const [showAISearch, setShowAISearch] = useState(false);
  const [showEMI, setShowEMI] = useState(false);
  const [showPostProperty, setShowPostProperty] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  // Filter State
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    city: 'Mumbai',
    locality: '',
    purpose: 'all',
    category: 'all',
    subcategory: 'all',
    status: 'all',
    postedBy: 'all',
    minPrice: 0,
    maxPrice: 0,
    bedrooms: [],
    minArea: 0,
    maxArea: 0,
    amenities: [],
    verifiedOnly: false,
    readyToMove: false,
    underConstruction: false,
    facing: [],
    sortBy: 'relevance'
  });

  // Synchronize browser URL history navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load properties from backend API
  useEffect(() => {
    loadData();
  }, [filters, selectedCity]);

  const loadData = async () => {
    try {
      const propData = await fetchProperties({ ...filters, city: selectedCity });
      const projData = await fetchBuilderProjects();
      const fileData = await fetchFiles();
      setProperties(propData);
      setProjects(projData);
      setFiles(fileData);

      // Separate unverified/pending properties for Audit
      setAuditProperties(propData.filter(p => !p.verified || p.postedBy === 'owner'));
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleToggleSave = (id: string) => {
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter((i) => i !== id));
    } else {
      setSavedIds([...savedIds, id]);
    }
  };

  const handleToggleCompare = (id: string) => {
    if (comparedIds.includes(id)) {
      setComparedIds(comparedIds.filter((i) => i !== id));
    } else {
      if (comparedIds.length >= 3) {
        alert('You can compare a maximum of 3 properties at once.');
        return;
      }
      setComparedIds([...comparedIds, id]);
    }
  };

  const handleHeroSearch = (heroFilters: {
    query: string;
    city: string;
    purpose: any;
    category: any;
    bedrooms: number[];
  }) => {
    setSelectedCity(heroFilters.city);
    setFilters({
      ...filters,
      query: heroFilters.query,
      city: heroFilters.city,
      purpose: heroFilters.purpose,
      category: heroFilters.category,
      bedrooms: heroFilters.bedrooms
    });
    navigate('/search');
  };

  const handleContactClick = (property: Property, type: 'call' | 'whatsapp') => {
    if (type === 'call') {
      alert(`Connecting call to ${property.postedByName} (${property.postedByPhone})...`);
    } else {
      const text = `Hi, I am inquiring about ${property.title} on Shine Native.`;
      window.open(`https://wa.me/919820012345?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  // Auth completion handler
  const handleAuthenticated = (role: Role | 'admin', userEmail?: string, userName?: string, userPicture?: string) => {
    const email = userEmail || `${role}_user@gmail.com`;
    const name = userName || `Verified ${role.toUpperCase()} User`;
    const picture = userPicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

    const updatedUser: GoogleAuthUser = {
      email,
      name,
      picture,
      role,
      isVerified: true,
      loggedInAt: new Date().toISOString(),
      authMethod: 'google'
    };

    if (role === 'admin') {
      setIsAdminAuthenticated(true);
      setCurrentRole('admin');
    } else {
      setAuthenticatedRoles(prev => ({ ...prev, [role]: true }));
      setCurrentRole(role);
    }

    setGoogleUserSessions(prev => ({
      ...prev,
      [role]: updatedUser
    }));
  };

  // Admin CRUD Handlers
  const handleApproveProperty = (id: string) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, verified: true } : p));
    setAuditProperties(prev => prev.filter(p => p.id !== id));
  };

  const handleRejectProperty = (id: string, reason: string) => {
    setAuditProperties(prev => prev.filter(p => p.id !== id));
    alert(`Property rejected: ${reason}`);
  };

  const handleRequestChanges = (id: string, notes: string) => {
    alert(`Requested changes sent to property owner: ${notes}`);
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const handleDuplicateProperty = (id: string) => {
    const prop = properties.find(p => p.id === id);
    if (prop) {
      const copy = { ...prop, id: `prop-copy-${Date.now()}`, title: `${prop.title} (Copy)` };
      setProperties([copy, ...properties]);
    }
  };

  const handleSaveProperty = (prop: Property) => {
    setProperties(prev => {
      const exists = prev.some(p => p.id === prop.id);
      if (exists) return prev.map(p => p.id === prop.id ? prop : p);
      return [prop, ...prev];
    });
  };

  const handleUploadFile = (file: CloudinaryFile) => {
    setFiles(prev => [file, ...prev]);
  };

  const handleDeleteFile = async (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    await deleteFileApi(id);
  };

  const handleRenameFile = async (id: string, newName: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
    await renameFileApi(id, newName);
  };

  const handleSavePage = (page: WebsitePage) => {
    setPages(prev => {
      const idx = prev.findIndex(p => p.id === page.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = page;
        return next;
      }
      return [...prev, page];
    });
  };

  const handleDeletePage = (id: string) => {
    setPages(prev => prev.filter(p => p.id !== id));
  };

  const handleDuplicatePage = (id: string) => {
    const pg = pages.find(p => p.id === id);
    if (pg) {
      const copy = {
        ...pg,
        id: `page-${Date.now()}`,
        title: `${pg.title} (Copy)`,
        slug: `${pg.slug}-copy`
      };
      setPages([...pages, copy]);
    }
  };

  const savedPropertyList = properties.filter((p) => savedIds.includes(p.id));
  const comparedPropertyList = properties.filter((p) => comparedIds.includes(p.id));

  // Determine current active view based on URL path
  const isPostPropertyRoute = currentPath === '/post-property';
  const isAdminRoute = currentPath.startsWith('/admin-dashboard');
  const isBuilderRoute = currentPath === '/builder-dashboard';
  const isBrokerRoute = currentPath === '/broker-dashboard';
  const isOwnerRoute = currentPath === '/owner-dashboard';
  const isBuyerRoute = currentPath === '/buyer-dashboard';
  const isPagesRoute = currentPath.startsWith('/pages/');
  const isPropertyRoute = currentPath.startsWith('/properties/');
  const isProjectsRoute = currentPath === '/projects';
  const isSearchRoute = currentPath === '/search';

  // Extract subtab for Admin Dashboard
  const adminSubTab = isAdminRoute ? currentPath.replace('/admin-dashboard/', '').replace('/admin-dashboard', '') : '';

  // Extract custom page slug
  const pageSlug = isPagesRoute ? currentPath.replace('/pages/', '') : '';
  const currentCustomPage = pages.find(p => p.slug === pageSlug) || (pageSlug ? {
    id: `temp-${pageSlug}`,
    title: pageSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    slug: pageSlug,
    status: 'published',
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: `sec-temp-1`,
        type: 'full_width_image_banner',
        title: pageSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        subtitle: 'Fully admin customizable section built with Shine Native Page Builder',
        imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop',
        buttonText: 'Explore Real Estate',
        buttonUrl: '/search'
      },
      {
        id: `sec-temp-2`,
        type: 'dynamic_properties',
        title: 'Featured Townships & Listings',
        subtitle: 'Curated homes verified by expert real estate auditors',
        dynamicFilter: 'featured'
      }
    ]
  } as WebsitePage : null);

  // Extract property slug/id
  const propertySlug = isPropertyRoute ? currentPath.replace('/properties/', '') : '';
  const currentPropertyFromUrl = properties.find(p => p.slug === propertySlug || p.id === propertySlug);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Global Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          navigate(`/${role === 'admin' ? 'admin' : role}-dashboard`);
        }}
        selectedCity={selectedCity}
        onCitySelect={(city) => {
          setSelectedCity(city);
          setFilters({ ...filters, city });
        }}
        savedCount={savedIds.length}
        compareCount={comparedIds.length}
        googleUser={currentGoogleUser}
        onOpenGoogleAuth={handleOpenGoogleAuth}
        onSignOutGoogle={handleSignOutGoogle}
        onOpenWishlist={() => navigate('/buyer-dashboard')}
        onOpenCompare={() => {
          if (comparedIds.length === 0) alert('Add properties to compare first using the scale icon on cards.');
        }}
        onOpenPostProperty={() => navigate('/post-property')}
        onOpenAISearch={() => setShowAISearch(true)}
        onOpenEMICalculator={() => setShowEMI(true)}
        onOpenDashboard={() => navigate(`/${currentRole === 'admin' ? 'admin' : currentRole}-dashboard`)}
        onOpenMessages={() => setShowMessages(true)}
        onNavigateHome={() => navigate('/')}
        onNavigateSearch={(p) => {
          if (p) setFilters({ ...filters, purpose: p });
          navigate('/search');
        }}
        onNavigateProjects={() => navigate('/projects')}
        onNavigateUrl={(url) => navigate(url)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {/* ROUTE 0: DEDICATED POST PROPERTY PAGE (/post-property) */}
        {isPostPropertyRoute && (
          <PostPropertyPage
            files={files}
            onListingCreated={(newProp) => {
              setProperties([newProp, ...properties]);
              setSelectedProperty(newProp);
            }}
            onNavigateBack={() => navigate('/admin-dashboard/properties')}
          />
        )}

        {/* ROUTE 1: ADMIN DASHBOARD */}
        {isAdminRoute && (
          !isAdminAuthenticated ? (
            <div className="py-24 max-w-md mx-auto text-center space-y-4 px-4">
              <ShieldCheck className="w-16 h-16 text-blue-600 mx-auto animate-bounce" />
              <h2 className="text-2xl font-extrabold text-slate-900">Admin Authentication Required</h2>
              <p className="text-xs text-slate-600">
                Please log in with administrator credentials (Username: <code className="font-bold text-amber-700">admin</code>, Password: <code className="font-bold text-amber-700">admin</code>).
              </p>
              <button
                onClick={() => {
                  setAuthTargetRole('admin');
                  setAuthModalOpen(true);
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg cursor-pointer"
              >
                Open Admin Login Modal
              </button>
            </div>
          ) : (
            <AdminDashboard
              properties={properties}
              auditProperties={auditProperties}
              files={files}
              pages={pages}
              headerConfig={headerConfig}
              footerConfig={footerConfig}
              initialSubTab={adminSubTab}
              onNavigateSubTab={(path) => navigate(path)}
              onApproveProperty={handleApproveProperty}
              onRejectProperty={handleRejectProperty}
              onRequestChanges={handleRequestChanges}
              onDeleteProperty={handleDeleteProperty}
              onDuplicateProperty={handleDuplicateProperty}
              onSaveProperty={handleSaveProperty}
              onOpenAddProperty={() => navigate('/post-property')}
              onPreviewProperty={(p) => setSelectedProperty(p)}
              onUploadFile={handleUploadFile}
              onDeleteFile={handleDeleteFile}
              onRenameFile={handleRenameFile}
              onSavePage={handleSavePage}
              onDeletePage={handleDeletePage}
              onDuplicatePage={handleDuplicatePage}
              onSaveHeaderConfig={setHeaderConfig}
              onSaveFooterConfig={setFooterConfig}
            />
          )
        )}

        {/* ROUTE 2: ROLE DASHBOARDS (BUILDER, BROKER, OWNER, BUYER) */}
        {(isBuilderRoute || isBrokerRoute || isOwnerRoute || isBuyerRoute) && (
          <Dashboard
            currentRole={
              isBuilderRoute ? 'builder' :
              isBrokerRoute ? 'broker' :
              isOwnerRoute ? 'owner' : 'buyer'
            }
            onRoleChange={(role) => {
              setCurrentRole(role);
              navigate(`/${role}-dashboard`);
            }}
            properties={properties}
            savedProperties={savedPropertyList}
            googleUser={currentGoogleUser}
            onOpenGoogleAuth={handleOpenGoogleAuth}
            onSignOutGoogle={handleSignOutGoogle}
            onSelectProperty={(p) => setSelectedProperty(p)}
            onOpenPostProperty={() => navigate('/post-property')}
            onUpdateProperties={setProperties}
          />
        )}

        {/* ROUTE 3: CUSTOM PAGE BUILDER RENDERER (/pages/:slug) */}
        {isPagesRoute && currentCustomPage && (
          <PageView
            page={currentCustomPage}
            properties={properties}
            savedIds={savedIds}
            comparedIds={comparedIds}
            onToggleSave={handleToggleSave}
            onToggleCompare={handleToggleCompare}
            onSelectProperty={(p) => setSelectedProperty(p)}
            onContactClick={handleContactClick}
            onNavigatePage={(url) => navigate(url)}
          />
        )}

        {/* ROUTE 4: PROPERTY DETAIL URL (/properties/:slug) */}
        {isPropertyRoute && currentPropertyFromUrl && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <button
              onClick={() => navigate('/search')}
              className="mb-4 text-xs font-bold text-blue-600 hover:underline flex items-center"
            >
              ← Back to Search
            </button>
            <PropertyCard
              property={currentPropertyFromUrl}
              isSaved={savedIds.includes(currentPropertyFromUrl.id)}
              isCompared={comparedIds.includes(currentPropertyFromUrl.id)}
              onToggleSave={handleToggleSave}
              onToggleCompare={handleToggleCompare}
              onSelectProperty={(p) => setSelectedProperty(p)}
              onContactClick={handleContactClick}
            />
          </div>
        )}

        {/* ROUTE 5: SEARCH LISTINGS (/search) */}
        {isSearchRoute && (
          <PropertySearch
            properties={properties}
            filters={filters}
            onFilterChange={setFilters}
            savedIds={savedIds}
            comparedIds={comparedIds}
            onToggleSave={handleToggleSave}
            onToggleCompare={handleToggleCompare}
            onSelectProperty={(p) => setSelectedProperty(p)}
            onContactClick={handleContactClick}
          />
        )}

        {/* ROUTE 6: NEW PROJECTS (/projects) */}
        {isProjectsRoute && (
          <ProjectsView
            projects={projects}
            onOpenInquiryModal={(projName) => {
              alert(`Inquiry request submitted for ${projName}! Our builder representative will reach out.`);
            }}
          />
        )}

        {/* ROUTE 7: DEFAULT HOME PAGE (/) */}
        {!isPostPropertyRoute && !isAdminRoute && !isBuilderRoute && !isBrokerRoute && !isOwnerRoute && !isBuyerRoute && !isPagesRoute && !isPropertyRoute && !isProjectsRoute && !isSearchRoute && (
          <div className="space-y-16 pb-12">
            {/* Search Hero */}
            <Hero
              selectedCity={selectedCity}
              onCityChange={(city) => {
                setSelectedCity(city);
                setFilters({ ...filters, city });
              }}
              onSearchSubmit={handleHeroSearch}
              onOpenAISearch={() => setShowAISearch(true)}
              onOpenPostProperty={() => navigate('/post-property')}
            />

            {/* Featured Properties Carousel/Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex items-end justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-amber-600 font-extrabold text-xs tracking-wider uppercase">
                    Handpicked Premium Residences
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                    Featured Properties in {selectedCity}
                  </h2>
                </div>
                <button
                  onClick={() => navigate('/search')}
                  className="text-amber-700 hover:text-amber-800 font-extrabold text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <span>See All Properties</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.slice(0, 6).map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    isSaved={savedIds.includes(prop.id)}
                    isCompared={comparedIds.includes(prop.id)}
                    onToggleSave={handleToggleSave}
                    onToggleCompare={handleToggleCompare}
                    onSelectProperty={(p) => setSelectedProperty(p)}
                    onContactClick={handleContactClick}
                  />
                ))}
              </div>
            </section>

            {/* Popular Cities Section */}
            <section className="bg-slate-900 text-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                    Explore India Real Estate
                  </span>
                  <h2 className="text-3xl font-extrabold text-white">
                    Popular Real Estate Hubs
                  </h2>
                  <p className="text-xs text-slate-400">
                    Discover active listings, price per sqft trends, and top rated localities across major metros.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {POPULAR_CITIES.map((city) => (
                    <div
                      key={city.id}
                      onClick={() => {
                        setSelectedCity(city.name);
                        setFilters({ ...filters, city: city.name });
                        navigate('/search');
                      }}
                      className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-lg border border-slate-800"
                    >
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-extrabold">{city.name}</h3>
                          <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md">
                            ↑ {city.growthPercentage}% YoY
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">
                          {city.totalListings.toLocaleString('en-IN')} Listings • Avg ₹ {city.avgPricePerSqft}/sqft
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Builder Projects Teaser */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex items-end justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-amber-600 font-extrabold text-xs uppercase">
                    RERA Approved Townships
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                    Featured Builder Launches
                  </h2>
                </div>
                <button
                  onClick={() => navigate('/projects')}
                  className="text-amber-700 hover:text-amber-800 font-extrabold text-xs flex items-center"
                >
                  <span>View All Projects</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col md:flex-row gap-5 shadow-xs">
                    <img src={proj.coverImage} alt={proj.name} className="w-full md:w-48 h-40 object-cover rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <span className="text-[10px] font-bold text-amber-600 uppercase">{proj.builderName}</span>
                      <h3 className="text-lg font-bold text-slate-900">{proj.name}</h3>
                      <p className="text-xs text-slate-500">{proj.locality}, {proj.city}</p>
                      <p className="text-amber-600 font-extrabold text-sm">{proj.startingPriceFormatted}</p>
                      <button
                        onClick={() => navigate('/projects')}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors mt-2 cursor-pointer"
                      >
                        Explore Project
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Locality Reviews & Home Buyer Guides */}
            <section className="bg-slate-100 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="text-center space-y-2 max-w-xl mx-auto">
                  <h2 className="text-3xl font-extrabold text-slate-900">Real Resident Locality Insights</h2>
                  <p className="text-xs text-slate-500">Read unbiased reviews on connectivity, crime safety, and lifestyle ratings.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {LOCALITY_REVIEWS.map((rev) => (
                    <div key={rev.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">{rev.locality}, {rev.city}</h4>
                          <span className="text-[11px] text-slate-400">{rev.userName} • {rev.userType}</span>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 font-black text-xs px-2.5 py-1 rounded-lg">
                          {rev.rating} / 5.0 ⭐
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        targetRole={authTargetRole}
        initialMode={authModalMode}
        onAuthenticated={handleAuthenticated}
      />

      {/* Property Detail Modal */}
      <PropertyDetail
        property={selectedProperty}
        isOpen={Boolean(selectedProperty)}
        onClose={() => setSelectedProperty(null)}
        isSaved={selectedProperty ? savedIds.includes(selectedProperty.id) : false}
        isCompared={selectedProperty ? comparedIds.includes(selectedProperty.id) : false}
        onToggleSave={handleToggleSave}
        onToggleCompare={handleToggleCompare}
        onOpenEMICalculator={() => setShowEMI(true)}
        onSubmitInquiry={submitLeadInquiry}
        allProperties={properties}
        onSelectProperty={(p) => setSelectedProperty(p)}
      />

      {/* AI Search Advisor Modal */}
      <AISearchModal
        isOpen={showAISearch}
        onClose={() => setShowAISearch(false)}
        savedIds={savedIds}
        comparedIds={comparedIds}
        onToggleSave={handleToggleSave}
        onToggleCompare={handleToggleCompare}
        onSelectProperty={(p) => setSelectedProperty(p)}
        onContactClick={handleContactClick}
      />

      {/* EMI Calculator Modal */}
      <EMICalculator isOpen={showEMI} onClose={() => setShowEMI(false)} />

      {/* Messaging Drawer */}
      <MessagingDrawer
        isOpen={showMessages}
        onClose={() => setShowMessages(false)}
        currentRole={currentRole}
      />

      {/* Sticky Compare Drawer */}
      <CompareDrawer
        comparedProperties={comparedPropertyList}
        onRemoveCompare={handleToggleCompare}
        onClearCompare={() => setComparedIds([])}
        onSelectProperty={(p) => setSelectedProperty(p)}
      />

      {/* Global Footer */}
      <Footer
        onSelectCity={(city) => {
          setSelectedCity(city);
          setFilters({ ...filters, city });
          navigate('/search');
        }}
        onNavigateCategory={(cat) => {
          setFilters({ ...filters, category: cat as any });
          navigate('/search');
        }}
        onOpenEMICalculator={() => setShowEMI(true)}
      />
    </div>
  );
}
