export type Role = 'guest' | 'buyer' | 'tenant' | 'owner' | 'builder' | 'broker' | 'admin' | 'moderator';

export type PropertyCategory = 'residential' | 'commercial' | 'plots' | 'farm_houses' | 'luxury' | 'affordable';

export type PropertySubcategory = 
  | 'apartment' 
  | 'independent_house' 
  | 'villa' 
  | 'penthouse' 
  | 'office' 
  | 'retail' 
  | 'plot' 
  | 'co_living' 
  | 'pg';

export type PropertyPurpose = 'sale' | 'rent' | 'lease';

export type PropertyStatus = 'ready_to_move' | 'under_construction' | 'new_launch';

export type PostedBy = 'owner' | 'broker' | 'builder';

export interface FloorPlan {
  id: string;
  title: string;
  bedrooms: number;
  areaSqft: number;
  imageUrl: string;
  priceEstimate?: number;
}

export interface NearbyPlace {
  name: string;
  distanceKm: number;
  type: 'school' | 'hospital' | 'metro' | 'restaurant' | 'mall' | 'airport' | 'park';
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: PropertyCategory;
  subcategory: PropertySubcategory;
  purpose: PropertyPurpose;
  status: PropertyStatus;
  price: number; // in INR or USD
  priceFormatted: string;
  pricePerSqft: number;
  negotiable: boolean;
  areaSqft: number;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  parking: 'covered' | 'open' | 'none' | 'multiple';
  facing: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West';
  floorNumber: number;
  totalFloors: number;
  constructionAgeYears: number;
  ownership: 'freehold' | 'leasehold' | 'cooperative' | 'power_of_attorney';
  availableFrom: string;
  latitude: number;
  longitude: number;
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  verified: boolean;
  featured: boolean;
  postedBy: PostedBy;
  postedByName: string;
  postedByPhone: string;
  postedByEmail: string;
  postedByAvatar?: string;
  reraNumber?: string;
  builderName?: string;
  amenities: string[];
  images: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  floorPlans: FloorPlan[];
  nearbyPlaces: NearbyPlace[];
  crimeRating: number; // 1 to 5 (5 being safest)
  localityRating: number; // 1 to 5
  reviewsCount: number;
  averageRating: number;
  tags: string[];
  viewsCount: number;
  favoritesCount: number;
  createdAt: string;
}

export interface BuilderProject {
  id: string;
  name: string;
  slug: string;
  builderName: string;
  builderLogo?: string;
  city: string;
  locality: string;
  startingPriceFormatted: string;
  priceRange: string;
  status: PropertyStatus;
  possessionDate: string;
  reraNumber: string;
  coverImage: string;
  images: string[];
  description: string;
  configurations: string[]; // e.g. ["2 BHK", "3 BHK", "4 BHK"]
  totalUnits: number;
  projectAreaAcres: number;
  brochureUrl?: string;
  amenities: string[];
}

export interface CityInfo {
  id: string;
  name: string;
  state: string;
  image: string;
  totalListings: number;
  avgPricePerSqft: number;
  popularLocalities: string[];
  growthPercentage: number;
}

export interface SearchFilters {
  query: string;
  city: string;
  locality: string;
  purpose: PropertyPurpose | 'all';
  category: PropertyCategory | 'all';
  subcategory: PropertySubcategory | 'all';
  status: PropertyStatus | 'all';
  postedBy: PostedBy | 'all';
  minPrice: number;
  maxPrice: number;
  bedrooms: number[]; // e.g. [1, 2, 3]
  minArea: number;
  maxArea: number;
  amenities: string[];
  verifiedOnly: boolean;
  readyToMove: boolean;
  underConstruction: boolean;
  facing: string[];
  sortBy: 'relevance' | 'price_low_high' | 'price_high_low' | 'newest' | 'rating';
}

export interface Lead {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  message: string;
  type: 'callback' | 'visit_schedule' | 'general_inquiry';
  visitDate?: string;
  status: 'new' | 'contacted' | 'scheduled' | 'closed';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderRole: Role;
  senderName: string;
  receiverName: string;
  propertyId?: string;
  propertyTitle?: string;
  text: string;
  timestamp: string;
}

export interface LocalityReview {
  id: string;
  locality: string;
  city: string;
  userName: string;
  userType: string;
  rating: number;
  connectivityRating: number;
  safetyRating: number;
  lifestyleRating: number;
  environmentRating: number;
  pros: string[];
  cons: string[];
  comment: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  verified: boolean;
  avatar: string;
  savedPropertyIds: string[];
  recentlyViewedIds: string[];
  postedPropertyIds: string[];
  leadsCount: number;
}
