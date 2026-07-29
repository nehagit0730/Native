import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  Building2,
  MapPin,
  IndianRupee,
  CheckCircle2,
  Upload,
  Sparkles,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Loader2,
  ImageIcon
} from 'lucide-react';
import { Property, PropertyCategory, PropertyPurpose, PropertySubcategory, PostedBy, CloudinaryFile } from '../types';
import { ALL_AMENITIES } from '../data/mockData';
import { createPropertyListing, uploadFile } from '../services/api';

interface PostPropertyWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onListingCreated: (newProp: Property) => void;
  files?: CloudinaryFile[];
}

export const PostPropertyWizard: React.FC<PostPropertyWizardProps> = ({
  isOpen,
  onClose,
  onListingCreated,
  files = []
}) => {
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'gold' | 'platinum'>('free');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState<PropertyPurpose>('sale');
  const [category, setCategory] = useState<PropertyCategory>('residential');
  const [subcategory, setSubcategory] = useState<PropertySubcategory>('apartment');
  const [postedBy, setPostedBy] = useState<PostedBy>('owner');
  const [city, setCity] = useState('Mumbai');
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('400050');
  const [price, setPrice] = useState<number>(12500000);
  const [areaSqft, setAreaSqft] = useState<number>(1400);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [balconies, setBalconies] = useState<number>(2);
  const [facing, setFacing] = useState<any>('East');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Lift / Elevator',
    '24x7 Security',
    'Covered Parking',
    'Gym'
  ]);
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'
  );
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;
    setUploadingImage(true);
    try {
      const cldFile = await uploadFile(uploaded[0], '/properties');
      setImageUrl(cldFile.url);
    } catch (err) {
      console.error('Image upload error:', err);
      alert('Failed to upload photo to Cloudinary');
    } finally {
      setUploadingImage(false);
    }
  };

  if (!isOpen) return null;

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      const newProp = await createPropertyListing({
        title: title || `${bedrooms} BHK Property in ${locality || city}`,
        description: description || 'Beautiful property with excellent connectivity and premium amenities.',
        purpose,
        category,
        subcategory,
        postedBy,
        city,
        locality: locality || 'Central Locality',
        address: address || `${locality}, ${city}`,
        pincode,
        price: Number(price),
        areaSqft: Number(areaSqft),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        balconies: Number(balconies),
        facing,
        amenities: selectedAmenities,
        images: [imageUrl],
        featured: selectedPlan !== 'free'
      });

      onListingCreated(newProp);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Error publishing listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20">
              <PlusCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Post Your Property FREE</h2>
              <p className="text-xs text-blue-400">Step {step} of 5 • Shine Native Publisher Wizard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 flex">
          <div
            style={{ width: `${(step / 5) * 100}%` }}
            className="bg-blue-600 h-full transition-all duration-300"
          />
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <h3 className="text-base font-extrabold text-slate-900">Step 1: Property Purpose & Category</h3>

              {/* User Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">I am listing as:</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'owner', label: 'Property Owner (0% Brokerage)' },
                    { id: 'broker', label: 'Real Estate Broker' },
                    { id: 'builder', label: 'Builder / Developer' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPostedBy(p.id as any)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left cursor-pointer ${
                        postedBy === p.id
                          ? 'border-blue-600 bg-blue-50/60 text-blue-900 shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Purpose */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Property Purpose:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPurpose('sale')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      purpose === 'sale' ? 'border-blue-600 bg-blue-600 text-white shadow-xs' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    Sell Property
                  </button>
                  <button
                    type="button"
                    onClick={() => setPurpose('rent')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      purpose === 'rent' ? 'border-blue-600 bg-blue-600 text-white shadow-xs' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    Rent / Lease
                  </button>
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Property Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Spacious 3 BHK Sea View Flat"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-hidden"
                  >
                    <option value="residential">Residential Apartment</option>
                    <option value="luxury">Luxury Residence / Villa</option>
                    <option value="commercial">Commercial Office / Retail</option>
                    <option value="plots">Plots & Land</option>
                  </select>
                </div>
              </div>

              {/* Primary Property Photo Upload */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700">Primary Property Photo (Cloudinary Powered)</label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:w-40 h-28 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shrink-0 relative flex items-center justify-center">
                    {uploadingImage ? (
                      <div className="flex flex-col items-center space-y-1 text-blue-600">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-[10px] font-bold">Uploading...</span>
                      </div>
                    ) : imageUrl ? (
                      <img src={imageUrl} alt="Property Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <label className={`w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 font-bold px-4 py-2.5 rounded-xl flex items-center justify-center space-x-2 text-xs transition-all ${uploadingImage ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                      {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 stroke-[2.5]" />}
                      <span>{uploadingImage ? 'Uploading to Cloudinary...' : 'Upload Image File to Cloudinary'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingImage}
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>

                    {files.length > 0 && (
                      <select
                        value={imageUrl}
                        onChange={(e) => {
                          if (e.target.value) setImageUrl(e.target.value);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] font-bold text-blue-700 focus:outline-hidden"
                      >
                        <option value="">-- Or Pick Existing Photo from Cloudinary File Manager --</option>
                        {files.filter(f => f.fileType === 'image' || f.fileType === 'floor_plan').map(f => (
                          <option key={f.id} value={f.url}>{f.name} ({f.folder})</option>
                        ))}
                      </select>
                    )}

                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Or paste image URL (https://...)"
                      className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] font-mono text-slate-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <h3 className="text-base font-extrabold text-slate-900">Step 2: Location & Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-hidden"
                  >
                    {['Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad', 'Pune', 'Goa'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Locality / Sector</label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Bandra West, Whitefield"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-hidden"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Building / Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Flat 1402, Building A, Carter Road"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Pricing & Config */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <h3 className="text-base font-extrabold text-slate-900">Step 3: Pricing & Layout Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expected Price (INR)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Super Area (Sqft)</label>
                  <input
                    type="number"
                    value={areaSqft}
                    onChange={(e) => setAreaSqft(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bedrooms (BHK)</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-hidden"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} BHK</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Amenities */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <h3 className="text-base font-extrabold text-slate-900">Step 4: Select Included Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {ALL_AMENITIES.map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-3 rounded-2xl border text-xs font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{amenity}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Plans & Publishing */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <h3 className="text-base font-extrabold text-slate-900">Step 5: Select Visibility Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Free */}
                <div
                  onClick={() => setSelectedPlan('free')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedPlan === 'free' ? 'border-blue-600 bg-blue-50/40 shadow-md' : 'border-slate-200'
                  }`}
                >
                  <p className="font-extrabold text-sm text-slate-900">FREE Standard</p>
                  <p className="text-2xl font-black text-slate-900 my-2">₹ 0</p>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    <li>✓ Basic search visibility</li>
                    <li>✓ Direct buyer inquiries</li>
                    <li>✓ Active for 30 days</li>
                  </ul>
                </div>

                {/* Gold */}
                <div
                  onClick={() => setSelectedPlan('gold')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedPlan === 'gold' ? 'border-blue-600 bg-blue-50/40 shadow-md' : 'border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-extrabold text-sm text-blue-600">Gold Boost</p>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Popular</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 my-2">₹ 999</p>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    <li>✓ 5x Higher search rank</li>
                    <li>✓ Verified badge</li>
                    <li>✓ Featured tag on cards</li>
                  </ul>
                </div>

                {/* Platinum */}
                <div
                  onClick={() => setSelectedPlan('platinum')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedPlan === 'platinum' ? 'border-blue-600 bg-blue-50/40 shadow-md' : 'border-slate-200'
                  }`}
                >
                  <p className="font-extrabold text-sm text-indigo-600">Platinum Pro</p>
                  <p className="text-2xl font-black text-slate-900 my-2">₹ 2,999</p>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    <li>✓ Top 1 position guarantee</li>
                    <li>✓ WhatsApp push blast</li>
                    <li>✓ Dedicated relationship manager</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 inline mr-1" />
            Back
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="bg-slate-900 hover:bg-slate-800 text-blue-400 font-extrabold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Next Step
              <ChevronRight className="w-4 h-4 inline ml-1" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleFinalSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              {submitting ? 'Publishing...' : 'Publish Property Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
