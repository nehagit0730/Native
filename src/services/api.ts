import { Property, BuilderProject, CityInfo, SearchFilters, Lead, ChatMessage, LocalityReview } from '../types';
import { INITIAL_PROPERTIES, BUILDER_PROJECTS, POPULAR_CITIES, LOCALITY_REVIEWS } from '../data/mockData';

async function safeFetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      console.warn(`[API] Endpoint ${url} returned non-JSON response (${res.status}). Falling back to client store.`);
      return null;
    }
    const json = await res.json();
    return json;
  } catch (err) {
    console.warn(`[API] Network or JSON parse error for ${url}:`, err);
    return null;
  }
}

export async function fetchProperties(filters?: Partial<SearchFilters> & { featuredOnly?: boolean }): Promise<Property[]> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'all') {
        if (Array.isArray(val)) {
          if (val.length > 0) params.append(key, val.join(','));
        } else {
          params.append(key, String(val));
        }
      }
    });
  }

  const json = await safeFetchJson<{ data?: Property[] }>(`/api/properties?${params.toString()}`);
  if (json && json.data) return json.data;

  // Fallback to local filter logic if server API route is unrouted (e.g., Vercel static host)
  let result = [...INITIAL_PROPERTIES];
  if (filters) {
    if (filters.city && filters.city !== 'all') {
      result = result.filter(p => p.city.toLowerCase() === filters.city!.toLowerCase());
    }
    if (filters.purpose && filters.purpose !== 'all') {
      result = result.filter(p => p.purpose === filters.purpose);
    }
    if (filters.category && filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.locality.toLowerCase().includes(q));
    }
  }
  return result;
}

export async function fetchPropertyById(id: string): Promise<Property> {
  const json = await safeFetchJson<{ data?: Property }>(`/api/properties/${id}`);
  if (json && json.data) return json.data;
  const prop = INITIAL_PROPERTIES.find(p => p.id === id || p.slug === id);
  if (prop) return prop;
  throw new Error('Property not found');
}

export async function createPropertyListing(propertyData: Partial<Property>): Promise<Property> {
  const json = await safeFetchJson<{ success?: boolean; data?: Property; error?: string }>('/api/properties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(propertyData)
  });
  if (json && json.data) return json.data;

  // Fallback client creation
  const newProp: Property = {
    id: `prop-${Date.now()}`,
    title: propertyData.title || 'New Property',
    slug: (propertyData.title || 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: propertyData.description || '',
    category: propertyData.category || 'residential',
    subcategory: propertyData.subcategory || 'apartment',
    purpose: propertyData.purpose || 'sale',
    status: propertyData.status || 'ready_to_move',
    price: Number(propertyData.price) || 5000000,
    priceFormatted: `₹ ${Number(propertyData.price || 5000000).toLocaleString('en-IN')}`,
    pricePerSqft: 5000,
    negotiable: true,
    areaSqft: Number(propertyData.areaSqft) || 1000,
    bedrooms: Number(propertyData.bedrooms) || 2,
    bathrooms: 2,
    balconies: 1,
    parking: 'covered',
    facing: 'East',
    floorNumber: 2,
    totalFloors: 10,
    constructionAgeYears: 1,
    ownership: 'freehold',
    availableFrom: 'Immediate',
    latitude: 19.076,
    longitude: 72.8777,
    address: propertyData.address || 'Locality',
    locality: propertyData.locality || 'Bandra',
    city: propertyData.city || 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    verified: true,
    featured: false,
    postedBy: 'owner',
    postedByName: 'User',
    postedByPhone: '+91 98000 00000',
    postedByEmail: 'user@shinenative.com',
    postedByAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    amenities: propertyData.amenities || ['Lift / Elevator', '24x7 Security'],
    images: propertyData.images && propertyData.images.length > 0 ? propertyData.images : [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'
    ],
    floorPlans: propertyData.floorPlans || [],
    nearbyPlaces: propertyData.nearbyPlaces || [],
    crimeRating: 4.8,
    localityRating: 4.7,
    reviewsCount: 1,
    averageRating: 4.8,
    tags: ['New Listing'],
    viewsCount: 1,
    favoritesCount: 0,
    createdAt: new Date().toISOString()
  };
  return newProp;
}

export async function fetchBuilderProjects(): Promise<BuilderProject[]> {
  const json = await safeFetchJson<{ data?: BuilderProject[] }>('/api/projects');
  if (json && json.data) return json.data;
  return BUILDER_PROJECTS;
}

export async function fetchCities(): Promise<CityInfo[]> {
  const json = await safeFetchJson<{ data?: CityInfo[] }>('/api/cities');
  if (json && json.data) return json.data;
  return POPULAR_CITIES;
}

export async function askGeminiPropertyAdvisor(prompt: string): Promise<{ explanation: string; properties: Property[] }> {
  const json = await safeFetchJson<{ explanation?: string; data?: Property[] }>('/api/ai-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (json) {
    return {
      explanation: json.explanation || 'Matched properties:',
      properties: json.data || []
    };
  }
  // Client fallback search
  const q = prompt.toLowerCase();
  const matched = INITIAL_PROPERTIES.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.city.toLowerCase().includes(q) ||
    p.locality.toLowerCase().includes(q)
  );
  return {
    explanation: matched.length > 0 ? `Found ${matched.length} listings for "${prompt}".` : 'Explore our top residences:',
    properties: matched.length > 0 ? matched : INITIAL_PROPERTIES.slice(0, 3)
  };
}

export async function submitLeadInquiry(leadData: {
  propertyId?: string;
  propertyTitle?: string;
  propertyImage?: string;
  buyerName: string;
  buyerEmail?: string;
  buyerPhone: string;
  message?: string;
  type?: 'callback' | 'visit_schedule' | 'general_inquiry';
  visitDate?: string;
}): Promise<Lead> {
  const json = await safeFetchJson<{ success?: boolean; data?: Lead; message?: string }>('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData)
  });
  if (json && json.data) return json.data;

  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    propertyId: leadData.propertyId || 'prop-1',
    propertyTitle: leadData.propertyTitle || 'Shine Native Residence',
    propertyImage: leadData.propertyImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=300&auto=format&fit=crop',
    buyerName: leadData.buyerName,
    buyerEmail: leadData.buyerEmail || 'buyer@example.com',
    buyerPhone: leadData.buyerPhone,
    message: leadData.message || 'Callback requested',
    type: leadData.type || 'callback',
    visitDate: leadData.visitDate,
    status: 'new',
    createdAt: new Date().toISOString()
  };
  return newLead;
}

export async function fetchLeads(): Promise<Lead[]> {
  const json = await safeFetchJson<{ data?: Lead[] }>('/api/leads');
  if (json && json.data) return json.data;
  return [];
}

export async function fetchMessages(): Promise<ChatMessage[]> {
  const json = await safeFetchJson<{ data?: ChatMessage[] }>('/api/messages');
  if (json && json.data) return json.data;
  return [];
}

export async function sendMessage(msg: Partial<ChatMessage>): Promise<ChatMessage> {
  const json = await safeFetchJson<{ data?: ChatMessage }>('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msg)
  });
  if (json && json.data) return json.data;
  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    senderRole: msg.senderRole || 'buyer',
    senderName: msg.senderName || 'User',
    receiverName: msg.receiverName || 'Owner',
    propertyId: msg.propertyId,
    propertyTitle: msg.propertyTitle,
    text: msg.text || 'Hello',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  return newMsg;
}

export async function fetchDashboardAnalytics(): Promise<any> {
  const json = await safeFetchJson<{ data?: any }>('/api/analytics');
  if (json && json.data) return json.data;
  return {
    activeListings: INITIAL_PROPERTIES.length,
    totalViews: 1240,
    totalFavorites: 320,
    totalLeads: 12,
    recentLeads: [],
    topCities: POPULAR_CITIES.slice(0, 4)
  };
}

export async function fetchLocalityReviews(): Promise<LocalityReview[]> {
  const json = await safeFetchJson<{ data?: LocalityReview[] }>('/api/reviews');
  if (json && json.data) return json.data;
  return LOCALITY_REVIEWS;
}

export async function submitLocalityReview(review: Partial<LocalityReview>): Promise<LocalityReview> {
  const json = await safeFetchJson<{ data?: LocalityReview }>('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review)
  });
  if (json && json.data) return json.data;
  const newReview: LocalityReview = {
    id: `rev-${Date.now()}`,
    locality: review.locality || 'Locality',
    city: review.city || 'Mumbai',
    userName: review.userName || 'Anonymous',
    userType: 'Resident',
    rating: Number(review.rating) || 4.5,
    connectivityRating: 4.5,
    safetyRating: 4.5,
    lifestyleRating: 4.5,
    environmentRating: 4.5,
    pros: ['Great connectivity'],
    cons: ['Traffic'],
    comment: review.comment || 'Good place.',
    createdAt: new Date().toISOString().split('T')[0]
  };
  return newReview;
}
