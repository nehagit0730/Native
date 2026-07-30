import React, { useState } from 'react';
import {
  X,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  CheckCircle2,
  Heart,
  Scale,
  Phone,
  MessageCircle,
  Share2,
  ShieldCheck,
  Building,
  Compass,
  Calendar,
  Sparkles,
  Calculator,
  Flag,
  Navigation,
  School,
  Hospital,
  Train,
  UtensilsCrossed,
  ShoppingBag,
  Star,
  Copy,
  Check,
  ExternalLink,
  Send,
  Mail,
  Globe
} from 'lucide-react';
import { Property } from '../types';
import { PropertyCard } from './PropertyCard';

interface PropertyDetailProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  isCompared: boolean;
  onToggleSave: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onOpenEMICalculator: () => void;
  onSubmitInquiry: (data: {
    propertyId: string;
    propertyTitle: string;
    buyerName: string;
    buyerPhone: string;
    message: string;
    type: 'visit_schedule' | 'callback';
    visitDate?: string;
  }) => void;
  allProperties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({
  property,
  isOpen,
  onClose,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onOpenEMICalculator,
  onSubmitInquiry,
  allProperties,
  onSelectProperty
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('Interested in visiting this property.');

  if (!isOpen || !property) return null;

  const currentImage = selectedImage || property.images[0];
  const similarProps = allProperties.filter(
    (p) => p.id !== property.id && (p.city === property.city || p.bedrooms === property.bedrooms)
  ).slice(0, 3);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/?property=${property.id}` : '';
  const shareText = `Check out this property: ${property.title} in ${property.city} for ${property.priceFormatted} on Shine Native Real Estate!`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: property.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share canceled or failed:', err);
      }
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone) {
      alert('Please enter your name and phone number');
      return;
    }
    onSubmitInquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      buyerName,
      buyerPhone,
      message: inquiryMsg,
      type: visitDate ? 'visit_schedule' : 'callback',
      visitDate
    });
    alert('Visit requested! The owner/broker will reach out shortly.');
    setShowVisitModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-4 sm:px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
              {property.purpose === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            <span className="text-xs text-slate-300 font-semibold truncate max-w-xs sm:max-w-md">
              {property.title}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="bg-blue-600/90 hover:bg-blue-600 text-white transition-all cursor-pointer flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border border-blue-500/50 shadow-xs"
              title="Share Property Link & Social Media"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Property</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-8">
          {/* Top Gallery & Quick Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Gallery Left (7 Cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={currentImage}
                  alt={property.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {property.verified && (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                      RERA Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails list */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      currentImage === img ? 'border-blue-600 scale-105 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Panel Right (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {property.category} • {property.subcategory}
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                  {property.title}
                </h1>
                <p className="text-xs text-slate-500 flex items-center mt-1">
                  <MapPin className="w-4 h-4 text-blue-600 mr-1 shrink-0" />
                  {property.address}
                </p>

                {/* Price Display */}
                <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Offered Price</span>
                  <p className="text-3xl font-black text-slate-900">{property.priceFormatted}</p>
                  {property.pricePerSqft > 0 && (
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      ₹ {property.pricePerSqft.toLocaleString('en-IN')} / sqft
                    </p>
                  )}
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
                    <BedDouble className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                    <span className="font-bold text-slate-900">{property.bedrooms} BHK</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
                    <Bath className="w-4 h-4 mx-auto text-slate-500 mb-1" />
                    <span className="font-bold text-slate-900">{property.bathrooms} Baths</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
                    <Maximize2 className="w-4 h-4 mx-auto text-slate-500 mb-1" />
                    <span className="font-bold text-slate-900">{property.areaSqft} sqft</span>
                  </div>
                </div>
              </div>

              {/* Action Contact Buttons */}
              <div className="space-y-2 pt-4 border-t border-slate-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowVisitModal(true)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer text-center"
                  >
                    Schedule Visit / Call
                  </button>
                  <button
                    onClick={() => {
                      const text = `Hi, I am interested in ${property.title} listed on Shine Native.`;
                      window.open(`https://wa.me/919820012345?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition-colors cursor-pointer"
                    title="WhatsApp Direct"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                  <button onClick={onOpenEMICalculator} className="text-blue-600 font-bold hover:underline flex items-center cursor-pointer">
                    <Calculator className="w-3.5 h-3.5 mr-1" /> Calculate EMI
                  </button>
                  <div className="flex items-center space-x-3">
                    <button onClick={() => setShowShareModal(true)} className="hover:text-blue-600 cursor-pointer flex items-center text-slate-600 font-medium">
                      <Share2 className="w-4 h-4 text-blue-600" />
                    </button>
                    <button onClick={() => onToggleSave(property.id)} className="hover:text-rose-500 cursor-pointer">
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    <button onClick={() => onToggleCompare(property.id)} className="hover:text-blue-600 cursor-pointer">
                      <Scale className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Specs Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Property Specifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Facing</span>
                <span className="font-bold text-slate-900">{property.facing} Facing</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Floor Level</span>
                <span className="font-bold text-slate-900">{property.floorNumber} of {property.totalFloors} Floors</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Property Age</span>
                <span className="font-bold text-slate-900">{property.constructionAgeYears} Years</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Ownership</span>
                <span className="font-bold text-slate-900 capitalize">{property.ownership}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-base font-extrabold text-slate-900">Overview & Description</h3>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Amenities & Lifestyle Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {property.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-800">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Places & Locality Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-base font-extrabold text-slate-900">Nearby Connectivity</h3>
              <div className="space-y-2 text-xs">
                {property.nearbyPlaces.map((np, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <span className="font-medium text-slate-800">{np.name}</span>
                    <span className="bg-blue-50 text-blue-900 border border-blue-200/60 font-extrabold px-2 py-0.5 rounded-md">
                      {np.distanceKm} km
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-base font-extrabold text-slate-900">Locality & Crime Score</h3>
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span>Locality Rating</span>
                  <span className="text-blue-400 font-extrabold text-base">{property.localityRating} / 5.0 ⭐</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Safety & Crime Rating</span>
                  <span className="text-emerald-400 font-extrabold text-base">{property.crimeRating} / 5.0 🛡️</span>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          {similarProps.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-lg font-extrabold text-slate-900">Recommended Similar Listings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {similarProps.map((sp) => (
                  <PropertyCard
                    key={sp.id}
                    property={sp}
                    isSaved={isSaved}
                    isCompared={isCompared}
                    onToggleSave={onToggleSave}
                    onToggleCompare={onToggleCompare}
                    onSelectProperty={onSelectProperty}
                    onContactClick={() => {}}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Visit Modal */}
      {showVisitModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-slate-900">Schedule Site Visit / Request Callback</h3>
              <button onClick={() => setShowVisitModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Preferred Visit Date (Optional)</label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Message</label>
                <textarea
                  rows={2}
                  value={inquiryMsg}
                  onChange={(e) => setInquiryMsg(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl shadow-md cursor-pointer"
              >
                Submit Inquiry Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Share Property Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Share Property</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Spread the word or save for later</p>
                </div>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Property Snippet Preview */}
            <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="overflow-hidden text-left">
                <h4 className="font-extrabold text-xs text-slate-900 truncate">{property.title}</h4>
                <p className="text-[11px] text-blue-600 font-bold mt-0.5">{property.priceFormatted}</p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5 flex items-center">
                  <MapPin className="w-3 h-3 mr-0.5 text-slate-400 inline shrink-0" />
                  {property.address}
                </p>
              </div>
            </div>

            {/* Copy Link Section */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Property Web Link</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-700 font-mono focus:outline-none select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Native Web Share Button (if supported) */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Share via System / Native Apps</span>
              </button>
            )}

            {/* Social Sharing Grid */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Share to Social Media</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all font-bold group"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span>WhatsApp</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-all font-bold group"
                >
                  <Globe className="w-5 h-5 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span>Facebook</span>
                </a>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition-all font-bold group"
                >
                  <Send className="w-5 h-5 text-slate-800 mb-1 group-hover:scale-110 transition-transform" />
                  <span>Twitter / X</span>
                </a>

                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition-all font-bold group"
                >
                  <Building className="w-5 h-5 text-sky-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span>LinkedIn</span>
                </a>

                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 transition-all font-bold group"
                >
                  <Send className="w-5 h-5 text-cyan-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span>Telegram</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:?subject=${encodeURIComponent(property.title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all font-bold group"
                >
                  <Mail className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
