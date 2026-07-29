import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { getNeonSql, getCloudinary } from './src/services/serverIntegrations';
import { INITIAL_PROPERTIES, BUILDER_PROJECTS, POPULAR_CITIES, LOCALITY_REVIEWS } from './src/data/mockData';
import { Property, Lead, ChatMessage, LocalityReview } from './src/types';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory data store initialized with initial mock datasets
let propertiesStore: Property[] = [...INITIAL_PROPERTIES];
let projectsStore = [...BUILDER_PROJECTS];
let leadsStore: Lead[] = [
  {
    id: 'lead-101',
    propertyId: 'prop-1',
    propertyTitle: 'Ultra Luxury 4 BHK Sky Residence with Sea View',
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=300&auto=format&fit=crop',
    buyerName: 'Vikramaditya Roy',
    buyerEmail: 'vikram.roy@example.com',
    buyerPhone: '+91 98211 44332',
    message: 'Interested in booking a weekend site visit. Is the price negotiable for immediate cheque payment?',
    type: 'visit_schedule',
    visitDate: '2026-08-01',
    status: 'new',
    createdAt: new Date().toISOString()
  },
  {
    id: 'lead-102',
    propertyId: 'prop-2',
    propertyTitle: 'Modern 3 BHK High-Rise Apartment near Tech Hub',
    propertyImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=300&auto=format&fit=crop',
    buyerName: 'Sneha Reddy',
    buyerEmail: 'sneha.reddy@example.com',
    buyerPhone: '+91 99800 11223',
    message: 'Please request the property owner to call me back regarding floor plan options and bank loan approval status.',
    type: 'callback',
    status: 'contacted',
    createdAt: new Date().toISOString()
  }
];

let messagesStore: ChatMessage[] = [
  {
    id: 'msg-1',
    senderRole: 'buyer',
    senderName: 'Anand Kumar',
    receiverName: 'Rajesh Shah (Owner)',
    propertyId: 'prop-1',
    propertyTitle: 'Ultra Luxury 4 BHK Sky Residence with Sea View',
    text: 'Hello, is this Carter Road property still available for viewing this Saturday?',
    timestamp: '10:30 AM'
  },
  {
    id: 'msg-2',
    senderRole: 'owner',
    senderName: 'Rajesh Shah (Owner)',
    receiverName: 'Anand Kumar',
    propertyId: 'prop-1',
    propertyTitle: 'Ultra Luxury 4 BHK Sky Residence with Sea View',
    text: 'Yes Anand! Saturday 4 PM works great. I will keep the keys and society entry pass ready.',
    timestamp: '10:35 AM'
  }
];

let reviewsStore: LocalityReview[] = [...LOCALITY_REVIEWS];

// API Routes

// 1. Health check
app.get('/api/health', (req, res) => {
  const neonSql = getNeonSql();
  const cld = getCloudinary();
  res.json({ 
    status: 'ok', 
    service: 'Shine Native API', 
    integrations: {
      neonPostgres: Boolean(neonSql),
      cloudinary: Boolean(cld)
    },
    timestamp: new Date().toISOString() 
  });
});

// Neon PostgreSQL Status & Direct Query Endpoint
app.get('/api/neon/status', async (req, res) => {
  const sql = getNeonSql();
  if (!sql) {
    return res.json({
      connected: false,
      message: 'DATABASE_URL is not configured in .env.example. Add your Neon connection string to enable live PostgreSQL queries.'
    });
  }
  try {
    const result = await sql`SELECT NOW() as current_time, version();`;
    res.json({
      connected: true,
      provider: 'Neon PostgreSQL',
      serverTime: result[0]?.current_time,
      version: result[0]?.version
    });
  } catch (err: any) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

// Cloudinary Status & Signature Endpoint
app.get('/api/cloudinary/status', (req, res) => {
  const cld = getCloudinary();
  if (!cld) {
    return res.json({
      configured: false,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || null,
      message: 'CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET not set in environment.'
    });
  }
  res.json({
    configured: true,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKeyConfigured: Boolean(process.env.CLOUDINARY_API_KEY)
  });
});

app.post('/api/cloudinary/signature', (req, res) => {
  const cld = getCloudinary();
  if (!cld) {
    return res.status(400).json({
      success: false,
      message: 'Cloudinary credentials missing in environment'
    });
  }
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = req.body.folder || 'properties';
    const signature = cld.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET!
    );
    res.json({
      success: true,
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Get Properties with filters, search, and sorting
app.get('/api/properties', (req, res) => {
  try {
    let result = [...propertiesStore];
    const {
      query,
      city,
      locality,
      purpose,
      category,
      subcategory,
      status,
      postedBy,
      minPrice,
      maxPrice,
      bedrooms,
      minArea,
      maxArea,
      amenities,
      verifiedOnly,
      sortBy,
      featuredOnly
    } = req.query;

    if (query && typeof query === 'string') {
      const q = query.toLowerCase().trim();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.locality.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (city && typeof city === 'string' && city !== 'all') {
      result = result.filter(p => p.city.toLowerCase() === city.toLowerCase());
    }

    if (locality && typeof locality === 'string' && locality !== 'all') {
      result = result.filter(p => p.locality.toLowerCase().includes(locality.toLowerCase()));
    }

    if (purpose && typeof purpose === 'string' && purpose !== 'all') {
      result = result.filter(p => p.purpose === purpose);
    }

    if (category && typeof category === 'string' && category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    if (subcategory && typeof subcategory === 'string' && subcategory !== 'all') {
      result = result.filter(p => p.subcategory === subcategory);
    }

    if (status && typeof status === 'string' && status !== 'all') {
      result = result.filter(p => p.status === status);
    }

    if (postedBy && typeof postedBy === 'string' && postedBy !== 'all') {
      result = result.filter(p => p.postedBy === postedBy);
    }

    if (minPrice) {
      const minP = Number(minPrice);
      if (!isNaN(minP)) result = result.filter(p => p.price >= minP);
    }

    if (maxPrice) {
      const maxP = Number(maxPrice);
      if (!isNaN(maxP) && maxP > 0) result = result.filter(p => p.price <= maxP);
    }

    if (bedrooms && typeof bedrooms === 'string') {
      const bhkArr = bedrooms.split(',').map(b => Number(b.trim())).filter(n => !isNaN(n));
      if (bhkArr.length > 0) {
        result = result.filter(p => bhkArr.includes(p.bedrooms));
      }
    }

    if (minArea) {
      const mA = Number(minArea);
      if (!isNaN(mA)) result = result.filter(p => p.areaSqft >= mA);
    }

    if (maxArea) {
      const xA = Number(maxArea);
      if (!isNaN(xA) && xA > 0) result = result.filter(p => p.areaSqft <= xA);
    }

    if (amenities && typeof amenities === 'string') {
      const reqAmenities = amenities.split(',').map(a => a.trim()).filter(Boolean);
      if (reqAmenities.length > 0) {
        result = result.filter(p => reqAmenities.every(a => p.amenities.includes(a)));
      }
    }

    if (verifiedOnly === 'true') {
      result = result.filter(p => p.verified);
    }

    if (featuredOnly === 'true') {
      result = result.filter(p => p.featured);
    }

    // Sorting
    if (sortBy === 'price_low_high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high_low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.averageRating - a.averageRating);
    } else {
      // default relevance / featured
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    res.json({ success: true, count: result.length, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Get single property details
app.get('/api/properties/:id', (req, res) => {
  const { id } = req.params;
  const prop = propertiesStore.find(p => p.id === id || p.slug === id);
  if (!prop) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }
  // Increment view counter
  prop.viewsCount += 1;
  res.json({ success: true, data: prop });
});

// 4. Create property (Sell / Post Listing)
app.post('/api/properties', (req, res) => {
  try {
    const body = req.body;
    const newId = `prop-${Date.now()}`;
    const slug = (body.title || 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    let formattedPrice = `₹ ${body.price?.toLocaleString('en-IN')}`;
    if (body.price >= 10000000) {
      formattedPrice = `₹ ${(body.price / 10000000).toFixed(2)} Cr`;
    } else if (body.price >= 100000) {
      formattedPrice = `₹ ${(body.price / 100000).toFixed(2)} L`;
    }
    if (body.purpose === 'rent') {
      formattedPrice += ' / mo';
    }

    const newProperty: Property = {
      id: newId,
      title: body.title || 'Untitled Listing',
      slug,
      description: body.description || '',
      category: body.category || 'residential',
      subcategory: body.subcategory || 'apartment',
      purpose: body.purpose || 'sale',
      status: body.status || 'ready_to_move',
      price: Number(body.price) || 0,
      priceFormatted: formattedPrice,
      pricePerSqft: body.areaSqft ? Math.round(Number(body.price) / Number(body.areaSqft)) : 0,
      negotiable: body.negotiable ?? true,
      areaSqft: Number(body.areaSqft) || 1000,
      bedrooms: Number(body.bedrooms) || 2,
      bathrooms: Number(body.bathrooms) || 2,
      balconies: Number(body.balconies) || 1,
      parking: body.parking || 'covered',
      facing: body.facing || 'East',
      floorNumber: Number(body.floorNumber) || 1,
      totalFloors: Number(body.totalFloors) || 5,
      constructionAgeYears: Number(body.constructionAgeYears) || 0,
      ownership: body.ownership || 'freehold',
      availableFrom: body.availableFrom || 'Immediate',
      latitude: Number(body.latitude) || 19.0760,
      longitude: Number(body.longitude) || 72.8777,
      address: body.address || 'Central Locality',
      locality: body.locality || 'Downtown',
      city: body.city || 'Mumbai',
      state: body.state || 'Maharashtra',
      pincode: body.pincode || '400001',
      verified: true,
      featured: body.featured ?? false,
      postedBy: body.postedBy || 'owner',
      postedByName: body.postedByName || 'Verified User',
      postedByPhone: body.postedByPhone || '+91 98000 00000',
      postedByEmail: body.postedByEmail || 'user@shinenative.com',
      postedByAvatar: body.postedByAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      reraNumber: body.reraNumber || '',
      builderName: body.builderName || '',
      amenities: Array.isArray(body.amenities) ? body.amenities : ['Lift / Elevator', '24x7 Security', 'Covered Parking'],
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop'
      ],
      videoUrl: body.videoUrl || '',
      virtualTourUrl: body.virtualTourUrl || '',
      floorPlans: body.floorPlans || [],
      nearbyPlaces: body.nearbyPlaces || [
        { name: 'City Hospital', distanceKm: 1.0, type: 'hospital' },
        { name: 'Central Metro', distanceKm: 0.8, type: 'metro' }
      ],
      crimeRating: 4.8,
      localityRating: 4.7,
      reviewsCount: 1,
      averageRating: 4.8,
      tags: body.tags || ['New Listing', 'Verified Owner'],
      viewsCount: 1,
      favoritesCount: 0,
      createdAt: new Date().toISOString()
    };

    propertiesStore.unshift(newProperty);
    res.status(201).json({ success: true, message: 'Property listed successfully!', data: newProperty });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 5. Get Builder Projects
app.get('/api/projects', (req, res) => {
  res.json({ success: true, count: projectsStore.length, data: projectsStore });
});

// 6. Get Cities
app.get('/api/cities', (req, res) => {
  res.json({ success: true, data: POPULAR_CITIES });
});

// 7. Gemini AI Smart Property Search Matcher
app.post('/api/ai-search', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ success: false, message: 'Prompt parameter required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  let aiSummary = '';
  let matchedIds: string[] = [];

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const catalogSummary = propertiesStore.map(p => ({
        id: p.id,
        title: p.title,
        city: p.city,
        locality: p.locality,
        bedrooms: p.bedrooms,
        priceFormatted: p.priceFormatted,
        priceNum: p.price,
        category: p.category,
        purpose: p.purpose,
        amenities: p.amenities
      }));

      const systemPrompt = `You are "Shine Native AI Property Advisor", an intelligent assistant for a modern real estate marketplace.
Given a user query, analyze the user's intent and select the 1 to 4 best matching property IDs from our catalog:
${JSON.stringify(catalogSummary, null, 2)}

Respond with a valid JSON object strictly matching this format:
{
  "explanation": "Short friendly sentence explaining why these properties match their requirements.",
  "matchedPropertyIds": ["prop-1", "prop-2"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Search Request: "${prompt}"` }] }
        ]
      });

      const responseText = response.text || '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        aiSummary = parsed.explanation || 'Here are the properties matching your request.';
        matchedIds = parsed.matchedPropertyIds || [];
      } else {
        aiSummary = 'Here are our top recommended properties based on your request.';
      }
    } catch (err) {
      console.error('Gemini AI Search API error:', err);
    }
  }

  // Fallback keyword matching if AI matched no IDs or API key wasn't set
  if (matchedIds.length === 0) {
    const q = prompt.toLowerCase();
    const matched = propertiesStore.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.locality.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      q.includes(p.city.toLowerCase()) ||
      q.includes(p.locality.toLowerCase()) ||
      (q.includes('bhk') && q.includes(`${p.bedrooms}`)) ||
      (q.includes('pool') && p.amenities.includes('Swimming Pool')) ||
      (q.includes('rent') && p.purpose === 'rent') ||
      (q.includes('luxury') && p.category === 'luxury')
    );
    matchedIds = matched.slice(0, 4).map(p => p.id);
    if (!aiSummary) {
      aiSummary = `Found ${matchedIds.length} properties matching "${prompt}".`;
    }
  }

  const resultProperties = propertiesStore.filter(p => matchedIds.includes(p.id));

  res.json({
    success: true,
    explanation: aiSummary || 'Properties tailored to your lifestyle preferences.',
    data: resultProperties.length > 0 ? resultProperties : propertiesStore.slice(0, 3)
  });
});

// 8. Submit Lead / Schedule Visit / Call Request
app.post('/api/leads', (req, res) => {
  const { propertyId, propertyTitle, propertyImage, buyerName, buyerEmail, buyerPhone, message, type, visitDate } = req.body;
  if (!buyerName || !buyerPhone) {
    return res.status(400).json({ success: false, message: 'Name and phone number are required' });
  }

  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    propertyId: propertyId || 'prop-1',
    propertyTitle: propertyTitle || 'Shine Native Property',
    propertyImage: propertyImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=300&auto=format&fit=crop',
    buyerName,
    buyerEmail: buyerEmail || 'buyer@example.com',
    buyerPhone,
    message: message || 'Please contact me with more information.',
    type: type || 'callback',
    visitDate,
    status: 'new',
    createdAt: new Date().toISOString()
  };

  leadsStore.unshift(newLead);
  res.status(201).json({ success: true, message: 'Inquiry submitted! Owner/Agent will reach out shortly.', data: newLead });
});

// 9. Get Leads for Dashboard
app.get('/api/leads', (req, res) => {
  res.json({ success: true, count: leadsStore.length, data: leadsStore });
});

// 10. Messages API
app.get('/api/messages', (req, res) => {
  res.json({ success: true, count: messagesStore.length, data: messagesStore });
});

app.post('/api/messages', (req, res) => {
  const { senderRole, senderName, receiverName, propertyId, propertyTitle, text } = req.body;
  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    senderRole: senderRole || 'buyer',
    senderName: senderName || 'User',
    receiverName: receiverName || 'Agent/Owner',
    propertyId,
    propertyTitle,
    text: text || 'Hi, interested in this listing!',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  messagesStore.push(newMsg);
  res.status(201).json({ success: true, data: newMsg });
});

// 11. Dashboard Analytics
app.get('/api/analytics', (req, res) => {
  const totalViews = propertiesStore.reduce((acc, p) => acc + p.viewsCount, 0);
  const totalFavorites = propertiesStore.reduce((acc, p) => acc + p.favoritesCount, 0);
  res.json({
    success: true,
    data: {
      activeListings: propertiesStore.length,
      totalViews,
      totalFavorites,
      totalLeads: leadsStore.length,
      recentLeads: leadsStore.slice(0, 5),
      topCities: POPULAR_CITIES.slice(0, 4)
    }
  });
});

// 12. Reviews API
app.get('/api/reviews', (req, res) => {
  res.json({ success: true, data: reviewsStore });
});

app.post('/api/reviews', (req, res) => {
  const { locality, city, userName, rating, comment, pros, cons } = req.body;
  const newReview: LocalityReview = {
    id: `rev-${Date.now()}`,
    locality: locality || 'Central Locality',
    city: city || 'Mumbai',
    userName: userName || 'Anonymous Reviewer',
    userType: 'Resident',
    rating: Number(rating) || 4.5,
    connectivityRating: 4.5,
    safetyRating: 4.5,
    lifestyleRating: 4.5,
    environmentRating: 4.5,
    pros: Array.isArray(pros) ? pros : ['Great connectivity'],
    cons: Array.isArray(cons) ? cons : ['Occasional traffic'],
    comment: comment || 'Overall fantastic locality to live in with family.',
    createdAt: new Date().toISOString().split('T')[0]
  };
  reviewsStore.unshift(newReview);
  res.status(201).json({ success: true, data: newReview });
});

// Vite / Static production serving middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Shine Native Server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
