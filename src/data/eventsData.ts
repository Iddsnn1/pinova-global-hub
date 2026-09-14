export interface EventTicketTier {
  id: string;
  name: string;
  badge?: string;
  fiatPrice: number;
  description: string;
  availableQuantity: number;
  perks: string[];
}

export interface GlobalEventItem {
  id: string;
  title: string;
  organizer: string;
  category: 'web3' | 'music' | 'tech' | 'pi_community' | 'business' | 'sports' | 'arts';
  categoryLabel: string;
  bannerImage: string;
  date: string;
  time: string;
  timezone: string;
  locationType: 'in_person' | 'virtual' | 'hybrid';
  venue: string;
  city: string;
  country: string;
  countryCode: string;
  flag: string;
  description: string;
  isFeatured?: boolean;
  isVipAvailable?: boolean;
  ticketTiers: EventTicketTier[];
}

export interface PurchasedEventTicket {
  ticketId: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  eventCity: string;
  eventCountry: string;
  tierName: string;
  attendeeName: string;
  attendeeEmail: string;
  piAmount: number;
  fiatAmount: number;
  txId: string;
  piTxid: string;
  qrCodeData: string;
  purchaseDate: string;
  status: 'VALID' | 'CHECKED_IN' | 'TRANSFERRED';
}

export const GLOBAL_EVENTS_MASTER: GlobalEventItem[] = [
  {
    id: 'event-pi-global-summit-2026',
    title: 'Pi Global Pioneers & Web3 Ecosystem Summit 2026',
    organizer: 'Pi Network Global Foundation',
    category: 'pi_community',
    categoryLabel: 'Pi Community & Web3',
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    date: '2026-10-14',
    time: '09:00 AM',
    timezone: 'UTC+1',
    locationType: 'hybrid',
    venue: 'Eko International Convention Centre',
    city: 'Lagos',
    country: 'Nigeria',
    countryCode: 'NG',
    flag: '🇳🇬',
    description: 'The landmark annual global conference bringing together Pi Core developers, merchant innovators, decentralized utility creators, and international Pioneers.',
    isFeatured: true,
    isVipAvailable: true,
    ticketTiers: [
      {
        id: 'tier-pi-gen',
        name: 'General Pioneer Pass',
        fiatPrice: 35,
        description: 'Standard access to keynote stages, exhibit halls, and developer workshop zones.',
        availableQuantity: 450,
        perks: ['Keynote & Panel Access', 'Exhibit Hall Access', 'Digital Summit Badge', 'Networking Lounge']
      },
      {
        id: 'tier-pi-vip',
        name: 'VIP Executive Pass',
        badge: 'VIP Access',
        fiatPrice: 120,
        description: 'Priority front-row seating, private VIP networking lounge, catered lunch, and exclusive fireside session.',
        availableQuantity: 80,
        perks: ['Front-Row Reserved Seating', 'VIP Lounge & Gourmet Catering', 'Private Founders Roundtable', 'Exclusive Pi Swag Pack']
      },
      {
        id: 'tier-pi-vvip',
        name: 'VVIP Ecosystem Patron & Gala Dinner',
        badge: 'VVIP Premium',
        fiatPrice: 300,
        description: 'All VIP perks + Invitation to the private Black-Tie Gala Dinner and direct access to top Web3 venture founders.',
        availableQuantity: 25,
        perks: ['Black-Tie Gala Dinner Entry', 'Backstage Green Room Access', 'Dedicated Concierge', 'NFT Lifetime Summit Pass']
      }
    ]
  },
  {
    id: 'event-dubai-future-fintech-2026',
    title: 'Dubai World Future Blockchain & FinTech Expo',
    organizer: 'Gulf Web3 Innovation Hub',
    category: 'web3',
    categoryLabel: 'FinTech & Blockchain',
    bannerImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    date: '2026-11-20',
    time: '10:00 AM',
    timezone: 'GST (UTC+4)',
    locationType: 'in_person',
    venue: 'Dubai World Trade Centre (DWTC)',
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    flag: '🇦🇪',
    description: 'Premier Middle East symposium highlighting decentralized payment systems, cross-border token settlement, and next-gen merchant infrastructure.',
    isFeatured: true,
    isVipAvailable: true,
    ticketTiers: [
      {
        id: 'tier-dwtc-std',
        name: 'Delegate Pass',
        fiatPrice: 75,
        description: 'Full 3-day access to conference tracks, expo floors, and AI FinTech stages.',
        availableQuantity: 600,
        perks: ['3-Day Conference Tracks', 'Exhibition Floor Entry', 'Mobile Networking App']
      },
      {
        id: 'tier-dwtc-vip',
        name: 'VIP Investor Pass',
        badge: 'VIP Access',
        fiatPrice: 250,
        description: 'Access to the Investor Deal Lounge, 1-on-1 speaker meetings, and fast-track entrance.',
        availableQuantity: 100,
        perks: ['Fast-Track VIP Badge', 'Investor Lounge Access', 'Private Speaker Luncheon', 'Valet Parking Pass']
      }
    ]
  },
  {
    id: 'event-london-ai-devcon-2026',
    title: 'London Global AI & Decentralized Systems DevCon',
    organizer: 'Imperial Tech Labs',
    category: 'tech',
    categoryLabel: 'AI & Engineering',
    bannerImage: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
    date: '2026-12-05',
    time: '08:30 AM',
    timezone: 'GMT (UTC+0)',
    locationType: 'in_person',
    venue: 'ExCeL London International Centre',
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    description: 'Hands-on developer conference exploring open autonomous agents, decentralized RPC nodes, and smart contract security.',
    isFeatured: false,
    isVipAvailable: true,
    ticketTiers: [
      {
        id: 'tier-london-dev',
        name: 'Developer Track Pass',
        fiatPrice: 50,
        description: 'Access to 40+ technical workshops, hackathon arena, and developer tools showcase.',
        availableQuantity: 300,
        perks: ['Workshop Participation', 'Hackathon Registration', 'Official Dev Swag Box']
      },
      {
        id: 'tier-london-vip',
        name: 'VIP Tech Leader Pass',
        badge: 'VIP Access',
        fiatPrice: 160,
        description: 'Access to CTO breakout roundtables, executive breakfast, and VIP networking reception.',
        availableQuantity: 60,
        perks: ['CTO Roundtable Access', 'Private Breakfast Reception', 'Priority Tech Demos']
      }
    ]
  },
  {
    id: 'event-nairobi-afrobeats-fest',
    title: 'Nairobi Lights Afrobeats & Pioneer Music Festival',
    organizer: 'East Africa Sounds & Live Nation Africa',
    category: 'music',
    categoryLabel: 'Music & Concerts',
    bannerImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    date: '2026-10-28',
    time: '04:00 PM',
    timezone: 'EAT (UTC+3)',
    locationType: 'in_person',
    venue: 'Uhuru Gardens Mega Arena',
    city: 'Nairobi',
    country: 'Kenya',
    countryCode: 'KE',
    flag: '🇰🇪',
    description: 'An electrifying night of live Afrobeats, Amapiano, international DJ sets, and Pioneer community entertainment.',
    isFeatured: true,
    isVipAvailable: true,
    ticketTiers: [
      {
        id: 'tier-nbo-gen',
        name: 'Regular Arena Entry',
        fiatPrice: 20,
        description: 'General admission standing & lawn access to main music stages.',
        availableQuantity: 1200,
        perks: ['Main Stage Access', 'Food Truck Village Access', 'Wristband Entry']
      },
      {
        id: 'tier-nbo-vip',
        name: 'VIP Golden Circle',
        badge: 'VIP Access',
        fiatPrice: 65,
        description: 'Elevated VIP viewing deck, dedicated VIP bar, and fast-track entrance gate.',
        availableQuantity: 200,
        perks: ['Elevated Golden Circle Deck', 'Express Entry Lane', 'Complimentary Drink Tokens', 'Private VIP Restrooms']
      },
      {
        id: 'tier-nbo-vvip',
        name: 'VVIP Backstage Cabana Table',
        badge: 'VVIP Premium',
        fiatPrice: 220,
        description: 'Private shaded cabana table for 4, premium bottle service, and artist backstage lounge access.',
        availableQuantity: 15,
        perks: ['Private Cabana Table', 'Artist Backstage Access', 'Premium Bottle Service', 'Dedicated VIP Host']
      }
    ]
  },
  {
    id: 'event-cape-town-business-gala',
    title: 'Cape Town Pan-African Commerce & Enterprise Gala',
    organizer: 'African Trade & Commerce Council',
    category: 'business',
    categoryLabel: 'Business & Networking',
    bannerImage: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80',
    date: '2026-11-12',
    time: '06:00 PM',
    timezone: 'SAST (UTC+2)',
    locationType: 'in_person',
    venue: 'Cape Town International Convention Centre (CTICC)',
    city: 'Cape Town',
    country: 'South Africa',
    countryCode: 'ZA',
    flag: '🇿🇦',
    description: 'High-level business symposium and black-tie awards evening celebrating innovative cross-border commerce leaders across the African continent.',
    isFeatured: false,
    isVipAvailable: true,
    ticketTiers: [
      {
        id: 'tier-cpt-biz',
        name: 'Corporate Delegate Pass',
        fiatPrice: 90,
        description: 'Access to business keynote sessions, afternoon exhibition, and cocktail mixer.',
        availableQuantity: 180,
        perks: ['Symposium Entry', 'Cocktail Networking Mixer', 'Conference Proceedings Directory']
      },
      {
        id: 'tier-cpt-gala',
        name: 'VIP Gala Dinner & Awards Seat',
        badge: 'VIP Access',
        fiatPrice: 210,
        description: '3-course gala awards dinner, reserved corporate table seating, and champagne reception.',
        availableQuantity: 50,
        perks: ['3-Course Gourmet Dinner', 'Champagne Welcome Reception', 'Reserved Table Seating', 'Direct Access to Honorees']
      }
    ]
  },
  {
    id: 'event-tokyo-esports-championship',
    title: 'Tokyo Global E-Sports & Gaming Championship 2026',
    organizer: 'Asia Esports League & Tokyo Arena',
    category: 'sports',
    categoryLabel: 'Sports & Gaming',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    date: '2026-11-28',
    time: '11:00 AM',
    timezone: 'JST (UTC+9)',
    locationType: 'in_person',
    venue: 'Ariake Arena Tokyo',
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    description: 'World championship gaming finals featuring top international teams competing live in battle royale, strategy, and fighting esports.',
    isFeatured: false,
    isVipAvailable: true,
    ticketTiers: [
      {
        id: 'tier-tyo-gen',
        name: 'Main Grandstand Seat',
        fiatPrice: 30,
        description: 'Full day tournament viewing from upper stadium seating with stadium audio and giant LED screens.',
        availableQuantity: 500,
        perks: ['Grandstand Seat', 'Official Gaming Poster', 'Tournament Playbill']
      },
      {
        id: 'tier-tyo-vip',
        name: 'VIP Stage-Side Pass & Player Meet',
        badge: 'VIP Access',
        fiatPrice: 110,
        description: 'Front-stage floor seating, autographed tournament merchandise, and player autograph signing session.',
        availableQuantity: 80,
        perks: ['Stage-Side Floor Seat', 'Player Meet & Greet', 'Limited Edition Jersey', 'Priority Entrance']
      }
    ]
  },
  {
    id: 'event-singapore-web3-hackathon',
    title: 'Singapore Asia-Pacific Web3 Builder Hackathon',
    organizer: 'Marina Bay Tech Alliance',
    category: 'web3',
    categoryLabel: 'FinTech & Blockchain',
    bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    date: '2026-12-10',
    time: '09:00 AM',
    timezone: 'SGT (UTC+8)',
    locationType: 'hybrid',
    venue: 'Marina Bay Sands Expo Center',
    city: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    flag: '🇸🇬',
    description: '48-hour intensive builder hackathon with $150,000 in ecosystem bounties for Pi apps, micro-payments, and decentralized commerce tools.',
    isFeatured: false,
    isVipAvailable: false,
    ticketTiers: [
      {
        id: 'tier-sg-hack',
        name: 'Hacker / Builder Pass',
        fiatPrice: 15,
        description: 'Full 48-hour hackathon access, dedicated work desk, meals, cloud credits, and mentor access.',
        availableQuantity: 200,
        perks: ['48-Hour Venue Access', 'All Meals & Refreshments', 'API & Cloud Sandbox Credits', 'Bounty Submission Eligibility']
      }
    ]
  },
  {
    id: 'event-accra-cultural-arts-fest',
    title: 'Accra Heritage Arts & African Fashion Gala',
    organizer: 'Ghana Creative Arts Commission',
    category: 'arts',
    categoryLabel: 'Arts & Culture',
    bannerImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    date: '2026-12-18',
    time: '05:30 PM',
    timezone: 'GMT (UTC+0)',
    locationType: 'in_person',
    venue: 'National Theatre of Ghana',
    city: 'Accra',
    country: 'Ghana',
    countryCode: 'GH',
    flag: '🇬🇭',
    description: 'A celebration of contemporary African runway fashion, fine art exhibitions, and traditional percussion performances.',
    isFeatured: false,
    isVipAvailable: true,
    ticketTiers: [
      {
        id: 'tier-accra-gen',
        name: 'Auditorium Seat',
        fiatPrice: 25,
        description: 'Standard seated entry for runway shows and art gallery walk.',
        availableQuantity: 250,
        perks: ['Runway Show Entry', 'Art Gallery Exhibition Access', 'Event Program Guide']
      },
      {
        id: 'tier-accra-vip',
        name: 'VIP Front Row Runway & Cocktail',
        badge: 'VIP Access',
        fiatPrice: 85,
        description: 'Front-row runway seating, VIP cocktail hour with designers, and commemorative art catalogue.',
        availableQuantity: 40,
        perks: ['Front-Row Runway Seat', 'Pre-Show Designer Cocktail Reception', 'Hardcover Art Catalogue', 'VIP Gift Bag']
      }
    ]
  }
];
