import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  IndianRupee,
  CheckCircle2,
  Upload,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  Loader2,
  ImageIcon,
  X,
  Trash2,
  Plus,
  Star,
  Film,
  Compass,
  Layers,
  Phone,
  User,
  FileText,
  Check,
  ArrowRight,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Property, PropertyCategory, PropertyPurpose, PropertySubcategory, PropertyStatus, PostedBy, CloudinaryFile } from '../types';
import { ALL_AMENITIES, POPULAR_CITIES } from '../data/mockData';
import { createPropertyListing, uploadFile } from '../services/api';
import { FileManagerModalPicker } from './FileManagerModalPicker';

interface PostPropertyPageProps {
  files?: CloudinaryFile[];
  onUploadFile?: (file: CloudinaryFile) => void;
  onListingCreated: (newProp: Property) => void;
  onNavigateBack: () => void;
  isAdmin?: boolean;
  currentUserEmail?: string;
  currentGoogleUser?: any;
}

export const PostPropertyPage: React.FC<PostPropertyPageProps> = ({
  files = [],
  onUploadFile,
  onListingCreated,
  onNavigateBack,
  isAdmin = false,
  currentUserEmail,
  currentGoogleUser
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'location' | 'specs' | 'amenities' | 'media' | 'preview'>('basic');

  // Basic Information
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState<PropertyPurpose>('sale');
  const [category, setCategory] = useState<PropertyCategory>('residential');
  const [subcategory, setSubcategory] = useState<PropertySubcategory>('apartment');
  const [postedBy, setPostedBy] = useState<PostedBy>('owner');
  const [postedByName, setPostedByName] = useState('Admin Desk');
  const [postedByPhone, setPostedByPhone] = useState('+91 98200 12345');
  const [postedByEmail, setPostedByEmail] = useState('admin@shinenative.com');
  const [reraNumber, setReraNumber] = useState('');
  const [builderName, setBuilderName] = useState('');

  // Location & Address
  const [city, setCity] = useState('Mumbai');
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('400050');
  const [stateName, setStateName] = useState('Maharashtra');

  // Pricing & Specs
  const [price, setPrice] = useState<number>(12500000);
  const [negotiable, setNegotiable] = useState(true);
  const [areaSqft, setAreaSqft] = useState<number>(1400);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [balconies, setBalconies] = useState<number>(2);
  const [floorNumber, setFloorNumber] = useState<number>(5);
  const [totalFloors, setTotalFloors] = useState<number>(18);
  const [status, setStatus] = useState<PropertyStatus>('ready_to_move');
  const [facing, setFacing] = useState<any>('East');
  const [parking, setParking] = useState<'covered' | 'open' | 'none' | 'multiple'>('covered');
  const [constructionAgeYears, setConstructionAgeYears] = useState<number>(2);

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Lift / Elevator',
    '24x7 Security',
    'Covered Parking',
    'Gym',
    'Swimming Pool',
    'Power Backup'
  ]);
  const [customAmenityInput, setCustomAmenityInput] = useState('');

  // Media (Multiple Images)
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop'
  ]);
  const [videoUrl, setVideoUrl] = useState('');
  const [virtualTourUrl, setVirtualTourUrl] = useState('');
  const [directImageUrl, setDirectImageUrl] = useState('');
  const [uploadingState, setUploadingState] = useState<{ active: boolean; current: number; total: number }>({
    active: false,
    current: 0,
    total: 0
  });

  // Package & Status
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'gold' | 'platinum'>('free');

  // Calculated values
  const pricePerSqft = areaSqft > 0 ? Math.round(price / areaSqft) : 0;

  // Multi-image file upload handler
  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const fileList: File[] = Array.from(selectedFiles);
    setUploadingState({ active: true, current: 0, total: fileList.length });

    const newUploadedUrls: string[] = [];
    for (let i = 0; i < fileList.length; i++) {
      setUploadingState({ active: true, current: i + 1, total: fileList.length });
      try {
        const cldFile = await uploadFile(fileList[i], '/properties');
        newUploadedUrls.push(cldFile.url);
      } catch (err) {
        console.error(`Error uploading image ${i + 1}:`, err);
      }
    }

    if (newUploadedUrls.length > 0) {
      setImages(prev => [...prev, ...newUploadedUrls]);
    }
    setUploadingState({ active: false, current: 0, total: 0 });
    e.target.value = '';
  };

  const handleAddDirectUrl = () => {
    if (!directImageUrl.trim()) return;
    setImages(prev => [...prev, directImageUrl.trim()]);
    setDirectImageUrl('');
  };

  const handleSetCoverImage = (index: number) => {
    if (index === 0) return;
    setImages(prev => {
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      return [moved, ...copy];
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleAddCustomAmenity = () => {
    if (!customAmenityInput.trim()) return;
    if (!selectedAmenities.includes(customAmenityInput.trim())) {
      setSelectedAmenities([...selectedAmenities, customAmenityInput.trim()]);
    }
    setCustomAmenityInput('');
  };

  const handleFinalSubmit = async () => {
    if (!title.trim() && !locality.trim()) {
      alert('Please fill in at least the Property Title or Locality');
      setActiveTab('basic');
      return;
    }

    setSubmitting(true);
    try {
      const defaultTitle = `${bedrooms} BHK ${subcategory.replace('_', ' ').toUpperCase()} in ${locality || city}`;
      const defaultDesc = description || `Spacious and beautifully designed ${bedrooms} BHK property located in ${locality || city}. Excellent connectivity to schools, hospitals, and major transit hubs.`;

      const isUserAdmin = isAdmin;
      const userEmailToUse = currentUserEmail || currentGoogleUser?.email || postedByEmail || 'client@shinenative.com';

      const newProp = await createPropertyListing({
        title: title || defaultTitle,
        description: defaultDesc,
        purpose,
        category,
        subcategory,
        status,
        price,
        priceFormatted: price >= 10000000 
          ? `₹${(price / 10000000).toFixed(2)} Cr` 
          : price >= 100000 
          ? `₹${(price / 100000).toFixed(2)} Lac` 
          : `₹${price.toLocaleString('en-IN')}`,
        pricePerSqft,
        negotiable,
        areaSqft,
        bedrooms,
        bathrooms,
        balconies,
        parking,
        facing,
        floorNumber,
        totalFloors,
        constructionAgeYears,
        ownership: 'freehold',
        availableFrom: 'Immediate',
        latitude: 19.076,
        longitude: 72.8777,
        address: address || `${locality}, ${city}`,
        locality: locality || 'Central City',
        city,
        state: stateName,
        pincode,
        verified: isUserAdmin,
        approvalStatus: isUserAdmin ? 'approved' : 'pending',
        featured: selectedPlan !== 'free',
        postedBy,
        postedByName: currentGoogleUser?.displayName || postedByName || 'Shine Native Client',
        postedByPhone: postedByPhone || '+91 98000 00000',
        postedByEmail: userEmailToUse,
        reraNumber,
        builderName,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : ['24x7 Security', 'Lift / Elevator'],
        images: images.length > 0 ? images : [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'
        ],
        videoUrl: videoUrl || undefined,
        virtualTourUrl: virtualTourUrl || undefined,
        floorPlans: [],
        nearbyPlaces: [
          { name: 'Metro Station', distanceKm: 0.8, type: 'metro' },
          { name: 'City Hospital', distanceKm: 1.5, type: 'hospital' },
          { name: 'International School', distanceKm: 1.2, type: 'school' }
        ],
        crimeRating: 4.9,
        localityRating: 4.8,
        reviewsCount: 1,
        averageRating: 4.9,
        tags: isUserAdmin ? ['Admin Direct', 'Verified Listing'] : ['Client Audit Check', 'Pending Verification'],
        viewsCount: 1,
        favoritesCount: 0,
        createdAt: new Date().toISOString()
      });

      onListingCreated(newProp);
      if (isUserAdmin) {
        alert('Admin Success! Property listing directly published live to Shine Native.');
      } else {
        alert(`Property Submitted! An official review email notification has been dispatched to ${userEmailToUse}. Your listing is now placed in Client Audit Check for Admin verification.`);
      }
      onNavigateBack();
    } catch (err: any) {
      console.error('Error creating property:', err);
      alert('Failed to publish property: ' + (err.message || 'Error occurred'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <button
              onClick={onNavigateBack}
              className="p-2.5 bg-slate-700/80 hover:bg-slate-700 rounded-xl text-slate-200 transition-colors cursor-pointer shrink-0"
              title="Back to Dashboard"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-blue-500/30">
                  Full Page Listing Creator
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {images.length} Photos Attached
                </span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-blue-400" />
                Post New Property Listing
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onNavigateBack}
              className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleFinalSubmit}
              disabled={submitting || uploadingState.active}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center space-x-2 cursor-pointer disabled:opacity-50 transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Listing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Property</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* SECTION TAB NAVIGATION */}
        <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80 overflow-x-auto scrollbar-none">
          {[
            { id: 'basic', label: '1. Basic Info', icon: FileText },
            { id: 'location', label: '2. Location & Address', icon: MapPin },
            { id: 'specs', label: '3. Pricing & Specs', icon: IndianRupee },
            { id: 'amenities', label: '4. Amenities', icon: Layers },
            { id: 'media', label: `5. Gallery & Media (${images.length})`, icon: ImageIcon },
            { id: 'preview', label: '6. Review & Publish', icon: Eye }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: BASIC INFORMATION */}
        {activeTab === 'basic' && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-700 pb-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Basic Property Overview
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Provide essential details including title, category, purpose, and listing contact info.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Property Title / Headline <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  placeholder="e.g., Luxury 3 BHK Sea View Apartment in Bandra West"
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Purpose Tabs */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Listing Purpose
                </label>
                <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-700">
                  {[
                    { id: 'sale', label: 'For Sale' },
                    { id: 'rent', label: 'For Rent' },
                    { id: 'lease', label: 'Commercial Lease' }
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPurpose(p.id as PropertyPurpose)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        purpose === p.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Property Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 font-medium capitalize"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="plots">Plots / Land</option>
                  <option value="farm_houses">Farm Houses</option>
                  <option value="luxury">Luxury Living</option>
                  <option value="affordable">Affordable Housing</option>
                </select>
              </div>

              {/* Subcategory */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Property Sub-Type
                </label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value as PropertySubcategory)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value="apartment">Multistorey Apartment</option>
                  <option value="villa">Independent Villa</option>
                  <option value="independent_house">Independent Builder Floor</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="office">Commercial Office Space</option>
                  <option value="retail">Retail Shop / Showroom</option>
                  <option value="plot">Residential Plot</option>
                  <option value="co_living">Co-Living Space</option>
                  <option value="pg">PG / Hostel</option>
                </select>
              </div>

              {/* Posted By */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Posted By Role
                </label>
                <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-700">
                  {[
                    { id: 'owner', label: 'Owner' },
                    { id: 'builder', label: 'Builder' },
                    { id: 'broker', label: 'Agent / Broker' }
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setPostedBy(r.id as PostedBy)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        postedBy === r.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Detailed Property Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  placeholder="Describe the highlight features, ventilation, nearby landmarks, society rules, and USP of this property..."
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Contact Info Row */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Contact Name</label>
                <input
                  type="text"
                  value={postedByName}
                  onChange={(e) => setPostedByName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Contact Phone</label>
                <input
                  type="text"
                  value={postedByPhone}
                  onChange={(e) => setPostedByPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              {/* RERA and Builder */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">RERA Number (Optional)</label>
                <input
                  type="text"
                  value={reraNumber}
                  placeholder="e.g. P51800012345"
                  onChange={(e) => setReraNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Builder / Developer Name (Optional)</label>
                <input
                  type="text"
                  value={builderName}
                  placeholder="e.g. Oberoi Realty / Godrej Properties"
                  onChange={(e) => setBuilderName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab('location')}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center space-x-2"
              >
                <span>Continue to Location</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: LOCATION & ADDRESS */}
        {activeTab === 'location' && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-700 pb-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                Property Location & Geographical Details
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Accurate location boosts buyer trust and ensures precise map placement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
                >
                  {POPULAR_CITIES.map(c => (
                    <option key={c.id} value={c.name}>{c.name} ({c.state})</option>
                  ))}
                  <option value="Pune">Pune</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Kolkata">Kolkata</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Locality / Sector / Landmark</label>
                <input
                  type="text"
                  value={locality}
                  placeholder="e.g. Bandra West / HSR Layout / Gachibowli"
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-300 block mb-2">Full Building / Street Address</label>
                <input
                  type="text"
                  value={address}
                  placeholder="e.g. Flat 502, Tower B, Horizon Heights, Hill Road"
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">State</label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs rounded-xl"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center space-x-2"
              >
                <span>Continue to Pricing & Specs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: PRICING & SPECS */}
        {activeTab === 'specs' && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-700 pb-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-amber-400" />
                Pricing, Area & Property Specifications
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure asking price, carpet/built-up area, BHK configuration, and facing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Total Asking Price (₹ INR)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400 font-bold text-base">
                    ₹
                  </div>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-lg font-black text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-1.5 font-medium">
                  <span>
                    Formatted: <strong className="text-white">
                      {price >= 10000000 ? `₹${(price / 10000000).toFixed(2)} Cr` : `₹${(price / 100000).toFixed(2)} Lac`}
                    </strong>
                  </span>
                  <span>Calculated: <strong className="text-amber-300">₹{pricePerSqft.toLocaleString('en-IN')}/sqft</strong></span>
                </div>
              </div>

              {/* Price Negotiable */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Negotiability</label>
                <button
                  type="button"
                  onClick={() => setNegotiable(!negotiable)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs border flex items-center justify-between transition-all cursor-pointer ${
                    negotiable 
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' 
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  <span>Price Negotiable</span>
                  <CheckCircle2 className={`w-4 h-4 ${negotiable ? 'text-amber-400' : 'text-slate-600'}`} />
                </button>
              </div>

              {/* Area */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Super Built-Up Area (sq. ft.)</label>
                <input
                  type="number"
                  value={areaSqft}
                  onChange={(e) => setAreaSqft(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold"
                />
              </div>

              {/* Bedrooms */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Bedrooms (BHK)</label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold"
                >
                  {[1, 2, 3, 4, 5, 6].map(b => (
                    <option key={b} value={b}>{b} BHK</option>
                  ))}
                </select>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Bathrooms</label>
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold"
                >
                  {[1, 2, 3, 4, 5, 6].map(b => (
                    <option key={b} value={b}>{b} Baths</option>
                  ))}
                </select>
              </div>

              {/* Balconies */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Balconies</label>
                <select
                  value={balconies}
                  onChange={(e) => setBalconies(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold"
                >
                  {[0, 1, 2, 3, 4].map(b => (
                    <option key={b} value={b}>{b} Balconies</option>
                  ))}
                </select>
              </div>

              {/* Floor / Total Floors */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Property Floor</label>
                <input
                  type="number"
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Total Floors in Building</label>
                <input
                  type="number"
                  value={totalFloors}
                  onChange={(e) => setTotalFloors(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold"
                />
              </div>

              {/* Facing */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Facing Direction</label>
                <select
                  value={facing}
                  onChange={(e) => setFacing(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold"
                >
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="North-East">North-East (Vastu Preferred)</option>
                  <option value="North-West">North-West</option>
                  <option value="South-East">South-East</option>
                  <option value="South-West">South-West</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Construction Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold"
                >
                  <option value="ready_to_move">Ready To Move</option>
                  <option value="under_construction">Under Construction</option>
                  <option value="new_launch">New Launch</option>
                </select>
              </div>

              {/* Parking */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Parking Reserved</label>
                <select
                  value={parking}
                  onChange={(e) => setParking(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold"
                >
                  <option value="covered">1 Covered Parking</option>
                  <option value="multiple">Multiple Covered Parkings</option>
                  <option value="open">Open Parking</option>
                  <option value="none">No Parking</option>
                </select>
              </div>

              {/* Construction Age */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">Age of Property (Years)</label>
                <input
                  type="number"
                  value={constructionAgeYears}
                  onChange={(e) => setConstructionAgeYears(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab('location')}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs rounded-xl"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('amenities')}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center space-x-2"
              >
                <span>Continue to Amenities</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: AMENITIES */}
        {activeTab === 'amenities' && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-700 pb-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Select Property Amenities & Society Features
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Selected amenities appear on buyer search filters and listing badges. ({selectedAmenities.length} selected)
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {ALL_AMENITIES.map((item) => {
                const isSelected = selectedAmenities.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAmenity(item)}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center space-x-2.5 transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                        : 'bg-slate-900 border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-blue-600 text-white' : 'border border-slate-600'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="truncate">{item}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Amenity Input */}
            <div className="pt-4 border-t border-slate-700/80">
              <label className="text-xs font-bold text-slate-300 block mb-2">Add Custom Unique Amenity</label>
              <div className="flex items-center space-x-2 max-w-md">
                <input
                  type="text"
                  value={customAmenityInput}
                  placeholder="e.g. Private Heated Pool, EV Fast Charger"
                  onChange={(e) => setCustomAmenityInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomAmenity())}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddCustomAmenity}
                  className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs rounded-xl"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('media')}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center space-x-2"
              >
                <span>Continue to Media & Multiple Images ({images.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: MULTI-IMAGE GALLERY & MEDIA */}
        {activeTab === 'media' && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-700 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-400" />
                  Property Image Gallery & Media ({images.length} Photos)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload multiple high-resolution photos, pick from Cloudinary File Manager, set primary cover image, or attach video tours.
                </p>
              </div>
              <span className="bg-purple-950 text-purple-300 border border-purple-800 text-[11px] font-bold px-3 py-1 rounded-full self-start sm:self-auto">
                {images.length} Photos Attached
              </span>
            </div>

            {/* MULTI UPLOAD BOX */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Box 1: Multi-file device upload */}
              <div className="bg-slate-900/90 border-2 border-dashed border-purple-500/40 hover:border-purple-500 rounded-2xl p-6 text-center space-y-3 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto">
                  {uploadingState.active ? (
                    <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Upload Multiple Photos Directly</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Select 1 or multiple JPEG/PNG files from your device to upload directly to Cloudinary.
                  </p>
                </div>

                {uploadingState.active && (
                  <div className="text-xs font-bold text-purple-300 animate-pulse">
                    Uploading image {uploadingState.current} of {uploadingState.total}...
                  </div>
                )}

                <label className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-lg shadow-purple-600/20">
                  <Upload className="w-4 h-4" />
                  <span>Choose Multiple Files</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploadingState.active}
                    onChange={handleMultipleFilesUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Box 2: File Manager Library Select */}
              <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
                      <Sparkles className="w-4 h-4" />
                      <span>{isAdmin ? 'Admin File Manager Library' : 'My File Manager Library'}</span>
                    </div>
                    <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {files.length} Saved Files
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Avoid uploading duplicates! Select existing high-res property assets directly from your personal File Manager library:
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPickerModal(true)}
                  className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Choose from File Manager Library</span>
                </button>

                {/* Direct URL input */}
                <div className="pt-2 border-t border-slate-800">
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Or Paste Direct Image Web URL</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={directImageUrl}
                      placeholder="https://images.unsplash.com/..."
                      onChange={(e) => setDirectImageUrl(e.target.value)}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddDirectUrl}
                      className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl shrink-0 cursor-pointer"
                    >
                      Add URL
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* GALLERY PREVIEW GRID */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>Attached Photos Gallery</span>
                <span className="text-slate-500 font-normal">(First photo is the Cover Banner)</span>
              </h3>

              {images.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-700/60 text-slate-400 text-xs font-medium">
                  No images attached yet. Upload or pick photos above.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {images.map((imgUrl, idx) => {
                    const isCover = idx === 0;
                    return (
                      <div
                        key={`${imgUrl}-${idx}`}
                        className={`group relative bg-slate-900 border rounded-2xl overflow-hidden shadow-lg transition-all ${
                          isCover ? 'border-2 border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-700'
                        }`}
                      >
                        <div className="aspect-4/3 w-full bg-slate-950 overflow-hidden relative">
                          <img
                            src={imgUrl}
                            alt={`Property Photo ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as any).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop';
                            }}
                          />
                          {isCover ? (
                            <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-md flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-slate-950" />
                              <span>Cover Photo</span>
                            </span>
                          ) : (
                            <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              #{idx + 1}
                            </span>
                          )}
                        </div>

                        {/* Controls Overlay / Footer */}
                        <div className="p-2.5 bg-slate-900 flex items-center justify-between border-t border-slate-800">
                          {!isCover ? (
                            <button
                              type="button"
                              onClick={() => handleSetCoverImage(idx)}
                              className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                              title="Set as main cover image"
                            >
                              <Star className="w-3 h-3" />
                              <span>Set Cover</span>
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-400">Primary Banner</span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1.5 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Delete photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* VIDEO & VIRTUAL TOUR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-700/80">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2 flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-purple-400" />
                  <span>Video Walkthrough URL (YouTube / MP4)</span>
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  placeholder="https://www.youtube.com/watch?v=..."
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>Virtual 360 Tour Embed URL</span>
                </label>
                <input
                  type="text"
                  value={virtualTourUrl}
                  placeholder="https://my.matterport.com/show/..."
                  onChange={(e) => setVirtualTourUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab('amenities')}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs rounded-xl"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center space-x-2 cursor-pointer"
              >
                <span>{isAdmin ? 'Continue to Final Confirmation (Admin)' : 'Continue to Final Review & Audit'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: PREVIEW & PUBLISH */}
        {activeTab === 'preview' && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-700 pb-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-400" />
                Review Property & Select Publishing Spotlight
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Verify property summary and pick visibility spotlight tier before going live.
              </p>
            </div>

            {/* PREVIEW CARD */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700/80 space-y-4">
              <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">
                Live Buyer Search Card Preview
              </h3>

              <div className="max-w-md bg-white text-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  <img
                    src={images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-blue-600 text-white font-black text-[10px] uppercase px-2.5 py-1 rounded-md shadow-md">
                    {purpose === 'sale' ? 'FOR SALE' : purpose === 'rent' ? 'FOR RENT' : 'LEASE'}
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                    {images.length} Photos
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-black text-blue-900">
                      {price >= 10000000 ? `₹${(price / 10000000).toFixed(2)} Cr` : `₹${(price / 100000).toFixed(2)} Lac`}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">₹{pricePerSqft}/sqft</span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                    {title || `${bedrooms} BHK ${subcategory} in ${locality || city}`}
                  </h4>

                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{locality || 'Central Area'}, {city}</span>
                  </p>

                  <div className="flex items-center space-x-3 text-xs font-bold text-slate-600 pt-2 border-t border-slate-100">
                    <span>{bedrooms} Beds</span>
                    <span>•</span>
                    <span>{bathrooms} Baths</span>
                    <span>•</span>
                    <span>{areaSqft} sqft</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SPOTLIGHT PACKAGE TIERS */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                Select Listing Plan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 'free',
                    title: 'Free Standard Listing',
                    price: '₹0 / Free',
                    desc: 'Standard verification badge, listed on search results.'
                  },
                  {
                    id: 'gold',
                    title: 'Gold Featured Spotlight',
                    price: '₹999 / listing',
                    desc: '3x higher buyer inquiries, top category search placement.'
                  },
                  {
                    id: 'platinum',
                    title: 'Builder Spotlight Platinum',
                    price: '₹2,499 / listing',
                    desc: 'Homepage banner feature, direct WhatsApp lead notifications.'
                  }
                ].map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id as any)}
                    className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedPlan === plan.id
                        ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/30'
                        : 'bg-slate-900 border-slate-700/80 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-sm text-white">{plan.title}</span>
                      <span className="text-xs font-bold text-amber-400">{plan.price}</span>
                    </div>
                    <p className="text-xs text-slate-400">{plan.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab('media')}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs rounded-xl"
              >
                Back to Media
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={submitting || uploadingState.active}
                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm rounded-xl shadow-xl shadow-blue-600/30 flex items-center space-x-2 cursor-pointer disabled:opacity-50 transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{isAdmin ? 'Publishing Property Listing...' : 'Submitting to Client Audit Check...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{isAdmin ? 'Publish Listing Directly (Admin)' : 'Submit Property for Client Audit Review'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* FILE MANAGER PICKER MODAL */}
        {showPickerModal && (
          <FileManagerModalPicker
            isOpen={showPickerModal}
            onClose={() => setShowPickerModal(false)}
            files={files}
            onUploadFile={onUploadFile}
            onSelectFiles={(selectedUrls) => {
              setImages(prev => [...prev, ...selectedUrls]);
              setShowPickerModal(false);
            }}
            multiSelect={true}
            title={isAdmin ? "Admin Storage File Manager Library" : "My Personal File Manager Library"}
          />
        )}

      </div>
    </div>
  );
};
