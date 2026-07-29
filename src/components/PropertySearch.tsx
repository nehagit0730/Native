import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Grid,
  List,
  Map,
  X,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { Property, SearchFilters, PropertyPurpose, PropertyCategory, PostedBy } from '../types';
import { ALL_AMENITIES } from '../data/mockData';
import { PropertyCard } from './PropertyCard';
import { PropertyMap } from './PropertyMap';

interface PropertySearchProps {
  properties: Property[];
  filters: SearchFilters;
  onFilterChange: (newFilters: SearchFilters) => void;
  savedIds: string[];
  comparedIds: string[];
  onToggleSave: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onContactClick: (property: Property, type: 'call' | 'whatsapp') => void;
}

export const PropertySearch: React.FC<PropertySearchProps> = ({
  properties,
  filters,
  onFilterChange,
  savedIds,
  comparedIds,
  onToggleSave,
  onToggleCompare,
  onSelectProperty,
  onContactClick
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const toggleBHKFilter = (bhk: number) => {
    const current = filters.bedrooms || [];
    const next = current.includes(bhk) ? current.filter((b) => b !== bhk) : [...current, bhk];
    onFilterChange({ ...filters, bedrooms: next });
  };

  const toggleAmenityFilter = (amenity: string) => {
    const current = filters.amenities || [];
    const next = current.includes(amenity) ? current.filter((a) => a !== amenity) : [...current, amenity];
    onFilterChange({ ...filters, amenities: next });
  };

  const resetFilters = () => {
    onFilterChange({
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
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">
            Real Estate Listings in <span className="text-blue-600">{filters.city || 'India'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing <span className="font-bold text-slate-800">{properties.length}</span> verified properties
          </p>
        </div>

        {/* Controls (Sort & View Toggles) */}
        <div className="flex items-center space-x-3">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="md:hidden flex items-center space-x-1.5 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            <Filter className="w-4 h-4 text-blue-400" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
            className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 px-3 py-2 rounded-xl focus:outline-hidden cursor-pointer"
          >
            <option value="relevance">Sort: Featured & Relevance</option>
            <option value="price_low_high">Price: Low to High</option>
            <option value="price_high_low">Price: High to Low</option>
            <option value="newest">Newest Listings First</option>
            <option value="rating">Top Rated Locality</option>
          </select>

          {/* View Toggles */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl space-x-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'map' ? 'bg-slate-900 text-blue-400 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Interactive Map View"
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar (4 Cols) */}
        <div className={`lg:col-span-3 space-y-6 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs ${
          showMobileFilter ? 'block' : 'hidden lg:block'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </h3>
            <button onClick={resetFilters} className="text-[11px] font-bold text-slate-400 hover:text-blue-600 flex items-center cursor-pointer">
              <RotateCcw className="w-3 h-3 mr-1" /> Reset
            </button>
          </div>

          {/* Purpose Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Property Purpose</label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {['all', 'sale', 'rent'].map((p) => (
                <button
                  key={p}
                  onClick={() => onFilterChange({ ...filters, purpose: p as any })}
                  className={`py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                    filters.purpose === p ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* BHK Type Multi-select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">BHK Configuration</label>
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3, 4, 5].map((bhk) => {
                const isSelected = filters.bedrooms?.includes(bhk);
                return (
                  <button
                    key={bhk}
                    onClick={() => toggleBHKFilter(bhk)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {bhk} BHK
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Category</label>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange({ ...filters, category: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 p-2.5 rounded-xl"
            >
              <option value="all">All Categories</option>
              <option value="residential">Residential Apartment</option>
              <option value="luxury">Luxury / Villa</option>
              <option value="commercial">Commercial Space</option>
              <option value="plots">Plots & Land</option>
              <option value="affordable">Affordable Housing</option>
            </select>
          </div>

          {/* Posted By */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Posted By</label>
            <select
              value={filters.postedBy}
              onChange={(e) => onFilterChange({ ...filters, postedBy: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 p-2.5 rounded-xl"
            >
              <option value="all">All Sellers</option>
              <option value="owner">Direct Owners (0% Brokerage)</option>
              <option value="broker">Verified Agents</option>
              <option value="builder">Builder Developers</option>
            </select>
          </div>

          {/* RERA Verified Toggle */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={(e) => onFilterChange({ ...filters, verifiedOnly: e.target.checked })}
                className="w-4 h-4 rounded-md text-blue-600 focus:ring-blue-500"
              />
              <span className="flex items-center text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> RERA Verified Only
              </span>
            </label>
          </div>

          {/* Amenities Multi-select */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block">Amenities</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {ALL_AMENITIES.map((amenity) => {
                const isChecked = filters.amenities?.includes(amenity);
                return (
                  <label key={amenity} className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleAmenityFilter(amenity)}
                      className="w-3.5 h-3.5 rounded-xs text-blue-600"
                    />
                    <span>{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Area (9 Cols) */}
        <div className="lg:col-span-9 space-y-6">
          {viewMode === 'map' ? (
            <PropertyMap properties={properties} onSelectProperty={onSelectProperty} />
          ) : properties.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
              <Sparkles className="w-10 h-10 mx-auto text-amber-500" />
              <h3 className="text-lg font-bold text-slate-900">No properties matched your filters</h3>
              <p className="text-xs text-slate-500">Try resetting filters or searching another locality.</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
            }`}>
              {properties.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  isSaved={savedIds.includes(prop.id)}
                  isCompared={comparedIds.includes(prop.id)}
                  onToggleSave={onToggleSave}
                  onToggleCompare={onToggleCompare}
                  onSelectProperty={onSelectProperty}
                  onContactClick={onContactClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
