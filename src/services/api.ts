import { Property, BuilderProject, CityInfo, SearchFilters, Lead, ChatMessage, LocalityReview } from '../types';

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

  const res = await fetch(`/api/properties?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch properties');
  const json = await res.json();
  return json.data || [];
}

export async function fetchPropertyById(id: string): Promise<Property> {
  const res = await fetch(`/api/properties/${id}`);
  if (!res.ok) throw new Error('Property not found');
  const json = await res.json();
  return json.data;
}

export async function createPropertyListing(propertyData: Partial<Property>): Promise<Property> {
  const res = await fetch('/api/properties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(propertyData)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to list property');
  return json.data;
}

export async function fetchBuilderProjects(): Promise<BuilderProject[]> {
  const res = await fetch('/api/projects');
  if (!res.ok) throw new Error('Failed to fetch projects');
  const json = await res.json();
  return json.data || [];
}

export async function fetchCities(): Promise<CityInfo[]> {
  const res = await fetch('/api/cities');
  if (!res.ok) throw new Error('Failed to fetch cities');
  const json = await res.json();
  return json.data || [];
}

export async function askGeminiPropertyAdvisor(prompt: string): Promise<{ explanation: string; properties: Property[] }> {
  const res = await fetch('/api/ai-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  const json = await res.json();
  return {
    explanation: json.explanation || 'Matched properties:',
    properties: json.data || []
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
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Inquiry failed');
  return json.data;
}

export async function fetchLeads(): Promise<Lead[]> {
  const res = await fetch('/api/leads');
  const json = await res.json();
  return json.data || [];
}

export async function fetchMessages(): Promise<ChatMessage[]> {
  const res = await fetch('/api/messages');
  const json = await res.json();
  return json.data || [];
}

export async function sendMessage(msg: Partial<ChatMessage>): Promise<ChatMessage> {
  const res = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msg)
  });
  const json = await res.json();
  return json.data;
}

export async function fetchDashboardAnalytics(): Promise<any> {
  const res = await fetch('/api/analytics');
  const json = await res.json();
  return json.data || {};
}

export async function fetchLocalityReviews(): Promise<LocalityReview[]> {
  const res = await fetch('/api/reviews');
  const json = await res.json();
  return json.data || [];
}

export async function submitLocalityReview(review: Partial<LocalityReview>): Promise<LocalityReview> {
  const res = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review)
  });
  const json = await res.json();
  return json.data;
}
