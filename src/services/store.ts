import { 
  Property, 
  CloudinaryFile, 
  WebsitePage, 
  HeaderConfig, 
  FooterConfig, 
  TeamMember, 
  PropertyAlert,
  Lead,
  ClientUser
} from '../types';
import { INITIAL_PROPERTIES } from '../data/mockData';

export const INITIAL_CLIENTS: ClientUser[] = [
  {
    id: 'client-1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    role: 'owner',
    phone: '+91 98200 12345',
    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    registeredAt: '2026-07-15T10:00:00.000Z',
    status: 'active',
    propertiesCount: 2
  },
  {
    id: 'client-2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    role: 'buyer',
    phone: '+91 98765 43210',
    picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    registeredAt: '2026-07-20T14:30:00.000Z',
    status: 'active',
    propertiesCount: 0
  },
  {
    id: 'client-3',
    name: 'Vikram Malhotra',
    email: 'vikram.m@luxuryhomes.in',
    role: 'builder',
    phone: '+91 98111 22334',
    picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    registeredAt: '2026-07-22T09:15:00.000Z',
    status: 'active',
    propertiesCount: 3
  },
  {
    id: 'client-4',
    name: 'Ananya Sen',
    email: 'ananya.sen@brokerage.com',
    role: 'broker',
    phone: '+91 99000 88776',
    picture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    registeredAt: '2026-07-25T16:45:00.000Z',
    status: 'active',
    propertiesCount: 1
  }
];


// Initial Cloudinary Files
export const INITIAL_FILES: CloudinaryFile[] = [
  {
    id: 'cld-1',
    publicId: 'properties/carter_road_penthouse_hero',
    name: 'carter_road_penthouse_hero.jpg',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    format: 'jpg',
    sizeBytes: 2450000,
    fileType: 'image',
    folder: '/properties',
    createdAt: '2026-07-20T10:00:00.000Z',
    width: 1920,
    height: 1080
  },
  {
    id: 'cld-2',
    publicId: 'properties/whitefield_skyline_living',
    name: 'whitefield_skyline_living.jpg',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop',
    format: 'jpg',
    sizeBytes: 1890000,
    fileType: 'image',
    folder: '/properties',
    createdAt: '2026-07-21T11:30:00.000Z',
    width: 1920,
    height: 1080
  },
  {
    id: 'cld-3',
    publicId: 'floor-plans/plan_3bhk_skyline',
    name: 'plan_3bhk_skyline.png',
    url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop',
    format: 'png',
    sizeBytes: 3200000,
    fileType: 'floor_plan',
    folder: '/floor-plans',
    createdAt: '2026-07-22T14:15:00.000Z',
    width: 1600,
    height: 1200
  },
  {
    id: 'cld-4',
    publicId: 'documents/rera_compliance_certificate',
    name: 'rera_compliance_certificate.pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    format: 'pdf',
    sizeBytes: 1050000,
    fileType: 'pdf',
    folder: '/documents',
    createdAt: '2026-07-23T09:45:00.000Z'
  },
  {
    id: 'cld-5',
    publicId: 'videos/virtual_walkthrough_carter_road',
    name: 'virtual_walkthrough_carter_road.mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    format: 'mp4',
    sizeBytes: 15400000,
    fileType: 'video',
    folder: '/videos',
    createdAt: '2026-07-24T16:20:00.000Z'
  },
  {
    id: 'cld-6',
    publicId: 'icons/luxury_villa_badge',
    name: 'luxury_villa_badge.svg',
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=600&auto=format&fit=crop',
    format: 'svg',
    sizeBytes: 45000,
    fileType: 'icon',
    folder: '/icons',
    createdAt: '2026-07-25T08:10:00.000Z'
  }
];

// Initial Website Pages
export const INITIAL_PAGES: WebsitePage[] = [
  {
    id: 'page-1',
    title: 'Home Page',
    slug: 'home',
    status: 'published',
    updatedAt: '2026-07-28T12:00:00.000Z',
    sections: [
      {
        id: 'sec-1',
        type: 'full_width_image_banner',
        title: 'Discover Luxury & Comfort',
        subtitle: 'Explore 10,000+ verified homes with 0% brokerage',
        imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop',
        buttonText: 'Explore Listings',
        buttonUrl: '/search'
      },
      {
        id: 'sec-2',
        type: 'dynamic_properties',
        title: 'Featured Premium Properties',
        subtitle: 'Curated residences across top metropolitan hubs',
        dynamicFilter: 'featured'
      },
      {
        id: 'sec-3',
        type: 'image_with_text',
        title: 'Why Buy With Shine Native?',
        subtitle: 'Verified by RERA experts with transparent legal audit checks',
        content: 'Our team personally inspects every property to ensure clear title ownership, structural integrity, and accurate pricing guidance for seamless home buying.',
        imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
        buttonText: 'Learn More'
      },
      {
        id: 'sec-4',
        type: 'faqs',
        title: 'Frequently Asked Questions',
        faqs: [
          { question: 'Are all listings RERA verified?', answer: 'Yes, every builder and owner listing undergoes verification before public display.' },
          { question: 'Is there any brokerage fee for direct owner properties?', answer: 'No, Shine Native charges 0% brokerage on direct owner listings.' },
          { question: 'How do I schedule a site visit?', answer: 'Click on any property and hit "Schedule Visit" or "Call Owner" to connect instantly.' }
        ]
      }
    ]
  },
  {
    id: 'page-2',
    title: 'Luxury Living Residences',
    slug: 'luxury-living',
    status: 'published',
    updatedAt: '2026-07-25T14:30:00.000Z',
    sections: [
      {
        id: 'sec-201',
        type: 'full_width_image_banner',
        title: 'Bespoke Sea View Penthouse Collection',
        subtitle: 'Handpicked ultra-luxury residences in Mumbai, Goa, and Bengaluru',
        imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop'
      },
      {
        id: 'sec-202',
        type: 'dynamic_properties',
        title: 'Curated Luxury Residences',
        dynamicFilter: 'featured'
      }
    ]
  },
  {
    id: 'page-3',
    title: 'Commercial & Office Hubs',
    slug: 'commercial',
    status: 'published',
    updatedAt: '2026-07-22T09:15:00.000Z',
    sections: [
      {
        id: 'sec-301',
        type: 'text_columns',
        title: 'Commercial Office Space Categories',
        columns: [
          { title: 'IT Parks & Tech Parks', description: 'Grade A plug-and-play office suites in Bandra-Kurla Complex and Whitefield.' },
          { title: 'Retail High Street Shops', description: 'Prime corner retail spaces with massive footfall in Indiranagar and Connaught Place.' },
          { title: 'Co-Working & Flex Space', description: 'Flexible modern shared office floors for high-growth tech teams.' }
        ]
      },
      {
        id: 'sec-302',
        type: 'dynamic_properties',
        title: 'Available Commercial Properties',
        dynamicFilter: 'commercial'
      }
    ]
  }
];

// Initial Header Configuration
export const DEFAULT_HEADER_CONFIG: HeaderConfig = {
  logoText: 'Shine',
  logoSubtext: 'Native',
  announcementText: '🎉 Special Festivity Offer: Zero Processing Fee on Pre-Approved Home Loans!',
  showAnnouncement: true,
  stickyHeader: true,
  showSearch: true,
  navLinks: [
    { id: 'nl-1', label: 'Buy Properties', url: '/search?purpose=sale' },
    { id: 'nl-2', label: 'Rent Homes', url: '/search?purpose=rent' },
    { id: 'nl-3', label: 'New Projects', url: '/projects' },
    { id: 'nl-4', label: 'Commercial', url: '/search?category=commercial' },
    { id: 'nl-5', label: 'AI Advisor', url: '#ai-advisor' }
  ],
  megaMenu: [
    {
      title: 'Popular Metros',
      items: [
        { label: 'Flats in Mumbai', url: '/search?city=Mumbai' },
        { label: 'Villas in Bengaluru', url: '/search?city=Bengaluru' },
        { label: 'Apartments in Delhi NCR', url: '/search?city=Delhi+NCR' },
        { label: 'Plots in Hyderabad', url: '/search?city=Hyderabad' }
      ]
    },
    {
      title: 'Top Categories',
      items: [
        { label: 'Ready to Move 3 BHK', url: '/search?status=ready_to_move&bedrooms=3', badge: 'Popular' },
        { label: 'Luxury Sea-Facing Penthouses', url: '/search?category=luxury', badge: 'Exclusive' },
        { label: 'Under-Construction Townships', url: '/search?status=under_construction' }
      ]
    }
  ],
  actionButtons: [
    { id: 'ab-1', label: 'Post Property FREE', type: 'primary', action: 'post_property' }
  ]
};

// Initial Footer Configuration
export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  aboutText: 'Shine Native is India\'s premier AI-enabled real estate platform connecting home buyers, tenants, direct property owners, and RERA-registered builders seamlessly with transparent verification.',
  helplinePhone: '+91 1800 266 8899',
  supportEmail: 'support@shinenative.com',
  copyrightText: '© 2026 Shine Native Technologies Inc. All rights reserved.',
  showNewsletter: true,
  showPaymentIcons: true,
  columns: [
    {
      title: 'Popular Cities',
      links: [
        { label: 'Properties in Mumbai', url: '/search?city=Mumbai' },
        { label: 'Properties in Bengaluru', url: '/search?city=Bengaluru' },
        { label: 'Properties in Delhi NCR', url: '/search?city=Delhi+NCR' },
        { label: 'Properties in Pune', url: '/search?city=Pune' }
      ]
    },
    {
      title: 'Property Types',
      links: [
        { label: 'Flats for Sale', url: '/search?purpose=sale' },
        { label: 'Houses for Rent', url: '/search?purpose=rent' },
        { label: 'Commercial Offices', url: '/search?category=commercial' },
        { label: 'Residential Plots', url: '/search?category=plots' }
      ]
    },
    {
      title: 'Real Estate Tools',
      links: [
        { label: 'Home Loan EMI Calculator', url: '#emi-calculator' },
        { label: 'AI Property Advisor', url: '#ai-advisor' },
        { label: 'RERA Verification Checker', url: '#rera' },
        { label: 'Locality Ratings & Safety', url: '#localities' }
      ]
    }
  ],
  socialMedia: [
    { platform: 'Facebook', url: 'https://facebook.com', enabled: true },
    { platform: 'Twitter', url: 'https://twitter.com', enabled: true },
    { platform: 'Instagram', url: 'https://instagram.com', enabled: true },
    { platform: 'LinkedIn', url: 'https://linkedin.com', enabled: true }
  ]
};

// Initial Client Pending Submissions for Client Audit Check
export const INITIAL_AUDIT_PROPERTIES: Property[] = [
  {
    id: 'audit-101',
    title: 'Pre-Launch 3 BHK Smart Eco Residency',
    slug: 'pre-launch-3-bhk-smart-eco-residency',
    description: 'Submitted by Prestige Developers. Green building certified with rainwater harvesting, solar roof grid, and intelligent automated home systems.',
    category: 'residential',
    subcategory: 'apartment',
    purpose: 'sale',
    status: 'new_launch',
    price: 18500000,
    priceFormatted: '₹ 1.85 Cr',
    pricePerSqft: 10882,
    negotiable: false,
    areaSqft: 1700,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    parking: 'covered',
    facing: 'East',
    floorNumber: 12,
    totalFloors: 28,
    constructionAgeYears: 0,
    ownership: 'freehold',
    availableFrom: '2028-06-01',
    latitude: 12.9352,
    longitude: 77.6245,
    address: 'Koramangala 4th Block',
    locality: 'Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    verified: false,
    featured: false,
    postedBy: 'builder',
    postedByName: 'Prestige Estates Project Manager',
    postedByPhone: '+91 98450 99887',
    postedByEmail: 'projects@prestige.example.com',
    postedByAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/260701/008912',
    builderName: 'Prestige Estates',
    amenities: ['Gymnasium', 'Swimming Pool', 'Solar Roof', 'EV Charging Station', 'Clubhouse'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop'
    ],
    floorPlans: [],
    nearbyPlaces: [{ name: 'Forum Mall', distanceKm: 0.5, type: 'mall' }],
    crimeRating: 4.7,
    localityRating: 4.8,
    reviewsCount: 0,
    averageRating: 0,
    tags: ['Pending Approval', 'Builder Submission'],
    viewsCount: 14,
    favoritesCount: 2,
    createdAt: new Date().toISOString(),
    approvalStatus: 'pending',
    approvalNotes: 'Awaiting admin verification of RERA document upload.'
  },
  {
    id: 'audit-102',
    title: 'Commercial Retail Ground Floor Shop on Main Road',
    slug: 'commercial-retail-ground-floor-shop',
    description: 'Submitted by Direct Owner Mr. Ramesh Patel. High footfall prime location shop suitable for bank branch, retail outlet, or clinic.',
    category: 'commercial',
    subcategory: 'retail',
    purpose: 'lease',
    status: 'ready_to_move',
    price: 250000,
    priceFormatted: '₹ 2.5 L / mo',
    pricePerSqft: 208,
    negotiable: true,
    areaSqft: 1200,
    bedrooms: 0,
    bathrooms: 2,
    balconies: 0,
    parking: 'open',
    facing: 'North',
    floorNumber: 0,
    totalFloors: 4,
    constructionAgeYears: 3,
    ownership: 'freehold',
    availableFrom: 'Immediate',
    latitude: 19.1197,
    longitude: 72.8464,
    address: 'SV Road, Andheri West',
    locality: 'Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400058',
    verified: false,
    featured: false,
    postedBy: 'owner',
    postedByName: 'Ramesh Patel',
    postedByPhone: '+91 98201 55443',
    postedByEmail: 'ramesh.patel@example.com',
    postedByAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    amenities: ['Power Backup', '24x7 Security', 'Visitor Parking', 'Glass Frontage'],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop'
    ],
    floorPlans: [],
    nearbyPlaces: [{ name: 'Andheri Metro Station', distanceKm: 0.2, type: 'metro' }],
    crimeRating: 4.5,
    localityRating: 4.6,
    reviewsCount: 0,
    averageRating: 0,
    tags: ['Pending Audit', 'Direct Owner'],
    viewsCount: 8,
    favoritesCount: 1,
    createdAt: new Date().toISOString(),
    approvalStatus: 'pending',
    approvalNotes: 'Needs property tax receipt verification.'
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Kavita Sundaram',
    role: 'Senior Sales Director',
    email: 'kavita@prestige.example.com',
    phone: '+91 98450 11223',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    listingsManaged: 12
  },
  {
    id: 'tm-2',
    name: 'Rahul Deshmukh',
    role: 'Project Relationship Manager',
    email: 'rahul.d@prestige.example.com',
    phone: '+91 98200 88776',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    listingsManaged: 8
  }
];

export const INITIAL_ALERTS: PropertyAlert[] = [
  {
    id: 'alt-1',
    title: '3 BHK Sea View in Bandra under 5 Cr',
    city: 'Mumbai',
    purpose: 'sale',
    maxPrice: 50000000,
    bedrooms: [3],
    frequency: 'instant',
    createdAt: '2026-07-26T10:00:00.000Z',
    active: true
  },
  {
    id: 'alt-2',
    title: 'Rental Flat near Whitefield Metro under 60k',
    city: 'Bengaluru',
    purpose: 'rent',
    maxPrice: 60000,
    bedrooms: [2, 3],
    frequency: 'daily',
    createdAt: '2026-07-27T08:30:00.000Z',
    active: true
  }
];
