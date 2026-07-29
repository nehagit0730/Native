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
import { Property, BuilderProject, SearchFilters, Role } from './types';
import { fetchProperties, fetchBuilderProjects, submitLeadInquiry } from './services/api';
import { POPULAR_CITIES, MOCK_BLOGS, LOCALITY_REVIEWS } from './data/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { PropertyCard } from './components/PropertyCard';
import { PropertySearch } from './components/PropertySearch';
import { PropertyDetail } from './components/PropertyDetail';
import { ProjectsView } from './components/ProjectsView';
import { Dashboard } from './components/Dashboard';
import { AISearchModal } from './components/AISearchModal';
import { EMICalculator } from './components/EMICalculator';
import { CompareDrawer } from './components/CompareDrawer';
import { PostPropertyWizard } from './components/PostPropertyWizard';
import { MessagingDrawer } from './components/MessagingDrawer';

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>('buyer');
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [view, setView] = useState<'home' | 'search' | 'projects' | 'dashboard'>('home');

  // Properties State
  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<BuilderProject[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>(['prop-1']);
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

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

  // Load properties from backend API
  useEffect(() => {
    loadData();
  }, [filters, selectedCity]);

  const loadData = async () => {
    try {
      const propData = await fetchProperties({ ...filters, city: selectedCity });
      const projData = await fetchBuilderProjects();
      setProperties(propData);
      setProjects(projData);
    } catch (err) {
      console.error(err);
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
    setView('search');
  };

  const handleContactClick = (property: Property, type: 'call' | 'whatsapp') => {
    if (type === 'call') {
      alert(`Connecting call to ${property.postedByName} (${property.postedByPhone})...`);
    } else {
      const text = `Hi, I am inquiring about ${property.title} on Shine Native.`;
      window.open(`https://wa.me/919820012345?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const savedPropertyList = properties.filter((p) => savedIds.includes(p.id));
  const comparedPropertyList = properties.filter((p) => comparedIds.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Global Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        selectedCity={selectedCity}
        onCitySelect={(city) => {
          setSelectedCity(city);
          setFilters({ ...filters, city });
        }}
        savedCount={savedIds.length}
        compareCount={comparedIds.length}
        onOpenWishlist={() => setView('dashboard')}
        onOpenCompare={() => {
          if (comparedIds.length === 0) alert('Add properties to compare first using the compare icon on cards.');
        }}
        onOpenPostProperty={() => setShowPostProperty(true)}
        onOpenAISearch={() => setShowAISearch(true)}
        onOpenEMICalculator={() => setShowEMI(true)}
        onOpenDashboard={() => setView('dashboard')}
        onOpenMessages={() => setShowMessages(true)}
        onNavigateHome={() => setView('home')}
        onNavigateSearch={(p) => {
          if (p) setFilters({ ...filters, purpose: p });
          setView('search');
        }}
        onNavigateProjects={() => setView('projects')}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* VIEW 1: HOME PAGE */}
        {view === 'home' && (
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
              onOpenPostProperty={() => setShowPostProperty(true)}
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
                  onClick={() => setView('search')}
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
                    onSelectProperty={setSelectedProperty}
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
                        setView('search');
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
                  onClick={() => setView('projects')}
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
                        onClick={() => setView('projects')}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors mt-2"
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

        {/* VIEW 2: SEARCH LISTINGS */}
        {view === 'search' && (
          <PropertySearch
            properties={properties}
            filters={filters}
            onFilterChange={setFilters}
            savedIds={savedIds}
            comparedIds={comparedIds}
            onToggleSave={handleToggleSave}
            onToggleCompare={handleToggleCompare}
            onSelectProperty={setSelectedProperty}
            onContactClick={handleContactClick}
          />
        )}

        {/* VIEW 3: NEW PROJECTS */}
        {view === 'projects' && (
          <ProjectsView
            projects={projects}
            onOpenInquiryModal={(projName) => {
              alert(`Inquiry request sent to ${projName} sales team!`);
            }}
          />
        )}

        {/* VIEW 4: DASHBOARD */}
        {view === 'dashboard' && (
          <Dashboard
            currentRole={currentRole}
            properties={properties}
            savedProperties={savedPropertyList}
            onSelectProperty={setSelectedProperty}
            onOpenPostProperty={() => setShowPostProperty(true)}
          />
        )}
      </main>

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
        onSelectProperty={setSelectedProperty}
      />

      {/* AI Search Advisor Modal */}
      <AISearchModal
        isOpen={showAISearch}
        onClose={() => setShowAISearch(false)}
        savedIds={savedIds}
        comparedIds={comparedIds}
        onToggleSave={handleToggleSave}
        onToggleCompare={handleToggleCompare}
        onSelectProperty={setSelectedProperty}
        onContactClick={handleContactClick}
      />

      {/* EMI Calculator Modal */}
      <EMICalculator isOpen={showEMI} onClose={() => setShowEMI(false)} />

      {/* Post Property Wizard Modal */}
      <PostPropertyWizard
        isOpen={showPostProperty}
        onClose={() => setShowPostProperty(false)}
        onListingCreated={(newProp) => {
          setProperties([newProp, ...properties]);
          setSelectedProperty(newProp);
        }}
      />

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
        onSelectProperty={setSelectedProperty}
      />

      {/* Global Footer */}
      <Footer
        onSelectCity={(city) => {
          setSelectedCity(city);
          setFilters({ ...filters, city });
          setView('search');
        }}
        onNavigateCategory={(cat) => {
          setFilters({ ...filters, category: cat as any });
          setView('search');
        }}
        onOpenEMICalculator={() => setShowEMI(true)}
      />
    </div>
  );
}
