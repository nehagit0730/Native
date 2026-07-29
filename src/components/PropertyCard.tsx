import React from 'react';
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  CheckCircle2,
  Heart,
  Scale,
  Phone,
  MessageCircle,
  Eye,
  Sparkles,
  Building,
  Compass
} from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  isSaved: boolean;
  isCompared: boolean;
  onToggleSave: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onContactClick: (property: Property, type: 'call' | 'whatsapp') => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onSelectProperty,
  onContactClick
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col h-full relative">
      {/* Property Image & Overlay Badges */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onSelectProperty(property)}>
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {property.verified && (
            <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center shadow-xs">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Verified
            </span>
          )}
          {property.featured && (
            <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center shadow-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Featured
            </span>
          )}
          <span className="bg-slate-900/80 backdrop-blur-md text-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-md capitalize">
            {property.purpose === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
        </div>

        {/* Top Right Actions (Save & Compare) */}
        <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(property.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isCompared
                ? 'bg-blue-600 text-white'
                : 'bg-white/80 hover:bg-white text-slate-700 hover:text-blue-600'
            }`}
            title="Compare Property"
          >
            <Scale className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(property.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isSaved
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
            }`}
            title="Save to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Image Overlay Details */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white z-10">
          <div>
            <p className="text-xl font-extrabold tracking-tight drop-shadow-sm">
              {property.priceFormatted}
            </p>
            {property.pricePerSqft > 0 && (
              <p className="text-[11px] text-slate-200 font-medium -mt-0.5">
                ₹ {property.pricePerSqft.toLocaleString('en-IN')}/sqft
              </p>
            )}
          </div>
          <span className="text-[10px] bg-white/20 backdrop-blur-md px-2 py-1 rounded-md text-white font-medium capitalize">
            {property.postedBy} Listed
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title */}
          <h3
            onClick={() => onSelectProperty(property)}
            className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer"
            title={property.title}
          >
            {property.title}
          </h3>

          {/* Location */}
          <p className="text-xs text-slate-500 flex items-center mt-1">
            <MapPin className="w-3.5 h-3.5 text-blue-600 mr-1 shrink-0" />
            <span className="truncate">{property.locality}, {property.city}</span>
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700">
          <div className="flex items-center space-x-1.5">
            <BedDouble className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-semibold">{property.bedrooms} BHK</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Bath className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Maximize2 className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="font-semibold">{property.areaSqft} sqft</span>
          </div>
        </div>

        {/* Amenities snippet tags */}
        <div className="flex items-center gap-1.5 overflow-hidden text-[11px] text-slate-600 pt-1">
          {property.amenities.slice(0, 3).map((a) => (
            <span key={a} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md truncate max-w-[100px]">
              {a}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className="text-slate-400 font-semibold text-[10px]">
              +{property.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Footer Contact Buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => onContactClick(property, 'call')}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 rounded-xl transition-colors flex items-center justify-center space-x-1 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-blue-400" />
            <span>Call</span>
          </button>
          <button
            onClick={() => onContactClick(property, 'whatsapp')}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 rounded-xl transition-colors flex items-center justify-center space-x-1 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => onSelectProperty(property)}
            className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
