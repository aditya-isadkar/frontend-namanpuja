/**
 * Static Oman puja data — sourced from the Naman Puja content document.
 * Used as a frontend fallback since Oman PujaLocation records are not yet
 * in the database. Same data shape as uaeData.ts.
 */

export interface OmanPujaFaq {
  question: string;
  answer: string;
}

export interface OmanPujaRitual {
  name: string;
  description: string;
}

export interface OmanPujaSamagriGroup {
  group: string;
  items: string[];
}

export interface OmanPujaLocation {
  slug: string;
  citySlug: string;
  cityName: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  breadcrumb: string[];
  heroTagline: string;
  intro: string;
  pujaName: string;
  pujaDeity: string;
  pujaShortDesc: string;
  benefits: string[];
  rituals: OmanPujaRitual[];
  samagri: OmanPujaSamagriGroup[];
  occasions: string[];
  serviceAreas: string[];
  faqs: OmanPujaFaq[];
  whyChooseUs: { title: string; description: string }[];
  cta: {
    heading: string;
    body: string;
    buttonLabel: string;
    bullets: string[];
  };
  internalLinks: { label: string; href: string }[];
  canonicalUrl: string;
}

// ── Shared ritual steps ──────────────────────────────────────────────────────

const ganeshRituals: OmanPujaRitual[] = [
  { name: 'Sankalp', description: 'The host states name, gotra and intent aloud, formally beginning the puja and dedicating it to a specific purpose.' },
  { name: 'Kalash Sthapana', description: 'A kalash is set up and consecrated, representing the presence of divine energy through the ritual.' },
  { name: 'Ganesh Sthapana & Pran Pratishtha', description: 'The Ganesha idol is placed and ritually invoked — life-breath is symbolically infused into the murti.' },
  { name: 'Panchamrit Abhishek', description: 'The idol is bathed in panchamrit (milk, curd, ghee, honey, sugar), followed by Gangajal.' },
  { name: 'Shodashopachara Puja', description: 'The sixteen traditional offerings — vastra, chandan, akshat, flowers, incense, lamp and more — are made in sequence.' },
  { name: 'Durva & Flower Offering', description: 'Twenty-one blades of durva grass and red hibiscus are offered, both considered especially dear to Ganesha.' },
  { name: 'Modak / Naivedya Offering', description: 'Modak, laddoo and fruits are offered as bhog.' },
  { name: 'Ganesh Havan (where included)', description: 'A short havan is performed invoking Ganapati mantras over the sacred fire.' },
  { name: 'Aarti', description: 'The Ganesh Aarti is sung, closing the main worship.' },
];

// ── Shared samagri ───────────────────────────────────────────────────────────

const ganeshSamagri: OmanPujaSamagriGroup[] = [
  {
    group: 'Sacred Items',
    items: ['Ganesh idol (clay/traditional)', 'Kalash', 'Coconut', 'Mango leaves', 'Sacred thread (mouli)', 'Betel leaves and betel nuts'],
  },
  {
    group: 'Flowers & Offerings',
    items: ['Durva grass (21 blades)', 'Red hibiscus', 'Marigold flowers', 'Garland', 'Fruits & banana'],
  },
  {
    group: 'Ritual Ingredients',
    items: ['Kumkum', 'Turmeric (haldi)', 'Sandalwood paste (chandan)', 'Akshat (rice)', 'Panchamrit', 'Gangajal'],
  },
  {
    group: 'Lamp & Incense',
    items: ['Ghee lamp with cotton wicks', 'Incense sticks', 'Camphor'],
  },
  {
    group: 'Prasad',
    items: ['Modak', 'Motichoor laddoo', 'Dry fruits', 'Sugarcane', 'Sweets'],
  },
];

// ── Shared benefits ──────────────────────────────────────────────────────────

const ganeshBenefits = [
  'Traditionally believed to clear obstacles standing in the way of a new venture, home, or milestone',
  'Many families perform this puja seeking Ganesha\'s blessing of wisdom and clear judgment before major decisions',
  'Associated with prosperity and good fortune — hence its place before business launches and Diwali\'s Lakshmi Puja',
  'Often performed to invite an auspicious, settled start to a new home or workspace',
  'Regular Chaturthi observance is, for many households, a sustained practice of devotion',
  'Brings a sense of continuity and spiritual grounding for families living abroad',
];

// ── Shared occasions ─────────────────────────────────────────────────────────

const ganeshOccasions = [
  'Moving into a new home (Griha Pravesh)',
  'Before Bhoomi Poojan or construction',
  'Opening a new office or business',
  'Buying a new vehicle',
  'Before an exam or major decision',
  'Ganesh Chaturthi festival',
  'Sankashti Chaturthi (monthly)',
  'New year or fresh beginnings',
];

// ── Shared Why Choose Us ─────────────────────────────────────────────────────

const ganeshWhyChooseUs = [
  { title: 'Verified Vedic Pandits', description: 'Every pandit is vetted for Vedic training and puja experience, not just availability.' },
  { title: 'Complete Samagri Provided', description: 'Durva grass, red hibiscus, modak and the rest arrive fresh and complete — no last-minute errands.' },
  { title: 'Your Choice of Format', description: 'At-home puja, live-streamed session, or temple-coordinated visit — you pick what works.' },
  { title: 'Transparent Pricing', description: 'You know the full cost before you confirm. No surprise add-ons on puja day.' },
  { title: 'Adapt to Your Tradition', description: 'Pandits adapt the sequence, mantras and samagri to your family\'s own regional tradition.' },
  { title: 'Family Abroad Can Join', description: 'Live-streamed option lets relatives in India or elsewhere participate in real time.' },
];

// ── MUSCAT ───────────────────────────────────────────────────────────────────

export const muscatGaneshPuja: OmanPujaLocation = {
  slug: 'ganesh-puja-muscat',
  citySlug: 'muscat',
  cityName: 'Muscat',
  h1: 'Ganesh Puja in Muscat — Book a Pandit for Your Home or a Temple Visit',
  metaTitle: 'Ganesh Puja in Muscat | Book Online - Naman Puja',
  metaDescription:
    'Book Ganesh Puja in Muscat with a pandit for your home, or coordinated with Muttrah\'s historic Shiva Temple. Full samagri included.',
  keywords: ['Ganesh Puja Muscat', 'Ganesh Chaturthi Muscat', 'Motishwar Mandir puja', 'home pandit Muscat Oman'],
  breadcrumb: ['Home', 'Pujas in Oman', 'Ganesh Puja', 'Muscat'],
  canonicalUrl: 'https://www.namanpuja.com/pujas-in-oman/ganesh-puja-muscat',
  pujaName: 'Ganesh Puja',
  pujaDeity: 'Lord Ganesha (Vighnaharta)',
  pujaShortDesc: 'Invoke Lord Ganesha in Muscat — remove obstacles, invite auspicious beginnings.',
  heroTagline:
    "Muscat's relationship with Hindu worship runs deeper than most Gulf cities can claim. The Motishwar Mandir in Muttrah — a Shiva temple with a well that's never run dry — has stood for over a century. Ganesh Puja here isn't a recent import; it's a continuation of what Gujarati and Sindhi merchant families never really stopped doing.",
  intro:
    "Naman Puja serves Muscat three ways: a pandit who comes to your home in Al Khuwair, Ruwi or Qurum with everything needed, a live-streamed session for family split across continents, or coordination for a puja at the Motishwar Mandir in Muttrah or the Sri Krishna Temple in Darsait.",
  benefits: ganeshBenefits,
  rituals: ganeshRituals,
  samagri: ganeshSamagri,
  occasions: ganeshOccasions,
  whyChooseUs: ganeshWhyChooseUs,
  serviceAreas: [
    'Seeb', 'Al Hail', 'Al Khoudh', 'Al Mouj Muscat', 'Mawaleh', 'Rusayl', 'Mabela',
    'Bawshar', 'Al Khuwayr', 'Madinat Al Sultan Qaboos', 'Ghubrah', 'Alazaiba', 'Ansab',
    'Muttrah', 'Darsait', 'Wadi Kabir', 'Ruwi', 'Hamriya', 'Old Muscat', 'Al Bustan',
    'Qantab', 'Al Amrat', 'Qurayyat',
  ],
  faqs: [
    {
      question: 'Is there a Ganesha shrine at Muscat\'s Shiva Temple?',
      answer: 'Public listings describe a small Ganesha shrine within the Motishwar Mandir complex in Muttrah. We recommend confirming current access directly with the temple management.',
    },
    {
      question: 'Can I have Ganesh Puja performed at home instead of at a temple in Muscat?',
      answer: 'Yes. Naman Puja can arrange for a verified pandit to visit your home in Muscat, providing all necessary samagri for a complete and traditional ritual.',
    },
    {
      question: 'How hot does it get in Muscat during Ganesh Chaturthi season?',
      answer: 'Ganesh Chaturthi falls in Bhadrapada (roughly August–September), when Muscat is very hot and humid. Most bookings are scheduled for early morning or evening for comfort.',
    },
    {
      question: 'Can family outside Oman join remotely?',
      answer: 'Yes, through Naman Puja\'s live-streamed puja option, allowing relatives anywhere in the world to participate in real-time.',
    },
    {
      question: 'Will the pandit follow my family\'s regional tradition?',
      answer: 'Yes. Naman Puja\'s pandits are trained to adapt the puja\'s sequence, mantras, and samagri to your family\'s specific tradition. Please mention your preferences when booking.',
    },
  ],
  cta: {
    heading: 'Book Your Ganesh Puja in Muscat',
    body: 'From a home puja in Al Khuwair to a visit to Muttrah\'s century-old Shiva Temple, Naman Puja can arrange your Ganesh Puja in Muscat.',
    buttonLabel: 'Book Ganesh Puja in Muscat',
    bullets: [
      'Pandit visits your home with all samagri',
      'Live-stream for family abroad',
      'Temple-coordinated options available',
    ],
  },
  internalLinks: [
    { label: 'Ganesh Puja in Salalah', href: '/pujas-in-oman/ganesh-puja-salalah' },
    { label: 'Ganesh Puja in Sohar', href: '/pujas-in-oman/ganesh-puja-sohar' },
  ],
};

// ── SALALAH ──────────────────────────────────────────────────────────────────

export const salalahGaneshPuja: OmanPujaLocation = {
  slug: 'ganesh-puja-salalah',
  citySlug: 'salalah',
  cityName: 'Salalah',
  h1: 'Ganesh Puja in Salalah — Book a Pandit for Your Home',
  metaTitle: 'Ganesh Puja in Salalah | Book a Home Pandit - Naman Puja',
  metaDescription:
    'Book Ganesh Puja in Salalah with a pandit who comes to your home. Full samagri included, live-stream option for family abroad.',
  keywords: ['Ganesh Puja Salalah', 'home pandit Salalah', 'Ganesh Chaturthi Salalah', 'puja Dhofar Oman'],
  breadcrumb: ['Home', 'Pujas in Oman', 'Ganesh Puja', 'Salalah'],
  canonicalUrl: 'https://www.namanpuja.com/pujas-in-oman/ganesh-puja-salalah',
  pujaName: 'Ganesh Puja',
  pujaDeity: 'Lord Ganesha (Vighnaharta)',
  pujaShortDesc: 'Invoke Lord Ganesha in Salalah — at your home, with complete samagri and a verified pandit.',
  heroTagline:
    "Salalah doesn't look like the rest of Oman for a few months a year — the khareef monsoon turns the Dhofar hills green. The city's Hindu community is small but devoted, and a puja here often happens with quiet sincerity rather than fanfare — which isn't the same as less devotion.",
  intro:
    "For Ganesh Puja in Salalah, home is the practical center of the ritual. Naman Puja sends a pandit to your home with everything needed — idol, samagri, prasad ingredients — so the puja doesn't depend on a temple's schedule or distance. If your family has a specific local temple connection, tell us and we'll coordinate around it.",
  benefits: ganeshBenefits,
  rituals: ganeshRituals,
  samagri: ganeshSamagri,
  occasions: ganeshOccasions,
  whyChooseUs: ganeshWhyChooseUs,
  serviceAreas: [
    'Al Wusta', 'Al Jadid', 'Al Haffa', 'Al Awqadayn', 'Al Qurm', 'Al Wadi',
    'Salalah Al Gharbiyah', 'Salalah Al Sharqiyah', 'Ad Dahariz', 'Al Heelah',
    'Saadah', 'Raysut', 'Awqad', 'Sahalnoot', 'Ittin', 'Al San', 'Taqah', 'Mirbat',
  ],
  faqs: [
    {
      question: 'Is there a Hindu temple in Salalah?',
      answer: 'Public information on this is inconsistent. Naman Puja recommends booking an at-home puja, which gives a complete, traditional ritual without depending on unverified temple information.',
    },
    {
      question: 'Does the khareef (monsoon) season affect puja scheduling in Salalah?',
      answer: 'It can — persistent drizzle and fog from roughly June to September may affect timing preferences. Mention your booking falls in this window so we can plan accordingly.',
    },
    {
      question: 'Can family outside Oman join remotely?',
      answer: 'Yes, through Naman Puja\'s live-streamed puja option, allowing relatives anywhere in the world to participate in real-time.',
    },
    {
      question: 'Will the pandit follow my family\'s regional tradition?',
      answer: 'Yes. Naman Puja\'s pandits can adapt the sequence, mantras and samagri to your family\'s tradition. Please mention your preferences when booking.',
    },
  ],
  cta: {
    heading: 'Book Your Ganesh Puja in Salalah',
    body: 'Wherever you are in Salalah, Naman Puja can bring Ganesh Puja to your home.',
    buttonLabel: 'Book Ganesh Puja in Salalah',
    bullets: [
      'Pandit comes to you — no temple travel needed',
      'Complete samagri included',
      'Live-stream for family abroad',
    ],
  },
  internalLinks: [
    { label: 'Ganesh Puja in Muscat', href: '/pujas-in-oman/ganesh-puja-muscat' },
    { label: 'Ganesh Puja in Sohar', href: '/pujas-in-oman/ganesh-puja-sohar' },
  ],
};

// ── SOHAR ────────────────────────────────────────────────────────────────────

export const soharGaneshPuja: OmanPujaLocation = {
  slug: 'ganesh-puja-sohar',
  citySlug: 'sohar',
  cityName: 'Sohar',
  h1: 'Ganesh Puja in Sohar — Book Authentic Vedic Ceremony with Expert Pandits',
  metaTitle: 'Ganesh Puja Sohar | Book Home Puja & Live Darshan - Naman Puja',
  metaDescription:
    'Book Ganesh Puja in Sohar with Naman Puja. Expert pandits, home visits, complete samagri, and live-streamed ceremonies for families in Al Batinah North.',
  keywords: ['Ganesh Puja Sohar', 'Ganesh Chaturthi Sohar', 'Vinayaka Puja Oman', 'pandit for Ganesh Puja Sohar'],
  breadcrumb: ['Home', 'Pujas in Oman', 'Ganesh Puja in Sohar'],
  canonicalUrl: 'https://www.namanpuja.com/pujas-in-oman/ganesh-puja-sohar',
  pujaName: 'Ganesh Puja',
  pujaDeity: 'Lord Ganesha (Vighnaharta)',
  pujaShortDesc: 'Invoke Lord Ganesha in Sohar before any new beginning — at your home with a verified Vedic pandit.',
  heroTagline:
    "Ganesh Puja in Sohar is the invocation of Lord Ganesha — the elephant-headed Vighnaharta, remover of obstacles — before any new beginning, whether it's a housewarming in Al Multaqa, a business launch near SOHAR Port, or a child's first day of school.",
  intro:
    "Naman Puja brings this sacred practice directly to your home in Sohar. Our pandits understand the unique rhythms of expatriate life here — the compact apartments near City Centre, the villa compounds along the Muscat highway, the tight-knit communities around SOHAR Port. Whether you need a full Shodashopachara Ganapati Puja for Ganesh Chaturthi or a live-stream ceremony so grandparents in Mumbai can join, we adapt the vidhi to your space and schedule.",
  benefits: ganeshBenefits,
  rituals: ganeshRituals,
  samagri: ganeshSamagri,
  occasions: ganeshOccasions,
  whyChooseUs: ganeshWhyChooseUs,
  serviceAreas: [
    'Sohar city center', 'Al Multaqa', 'Falaj Al Qabail', 'SOHAR Port area',
    'Saham', 'Al Batinah North coast',
  ],
  faqs: [
    {
      question: 'Where can I perform Ganesh Puja in Sohar?',
      answer: 'At home in your apartment or villa, at the Shri Krishna Temple in Muscat (which houses a Ganesh shrine), or via live-streamed ceremony through Naman Puja. Home puja is the most popular choice for convenience.',
    },
    {
      question: 'What samagri do I need for Ganesh Puja at home in Sohar?',
      answer: 'Naman Puja provides the complete samagri set — idol, chowki, durva grass, flowers, incense, ghee lamp, panchamrit, and prasad. You do not need to source anything yourself.',
    },
    {
      question: 'Can my family in India join a Ganesh Puja performed in Sohar?',
      answer: 'Yes. Naman Puja specializes in remote-family Ganesh Puja ceremonies. We set up a high-quality video call so relatives in India or elsewhere can watch the aarti, chant along, and be included in the sankalpa by name.',
    },
    {
      question: 'Are there any special considerations for Ganesh Puja in Sohar apartments?',
      answer: 'Check your building\'s fire safety rules before lighting diyas or incense. Use electric diyas if needed. Schedule summer pujas (May–September) for early morning or evening to manage the heat.',
    },
    {
      question: 'Where can I buy Ganesh Puja samagri in Sohar?',
      answer: 'LuLu Hypermarket (Sohar City Centre and Falaj Al Qabail) stocks most essentials. For harder-to-find items like durva grass or Gangajal, Naman Puja includes these in our service package.',
    },
  ],
  cta: {
    heading: 'Book Your Ganesh Puja in Sohar',
    body: 'However you choose to welcome Lord Ganesha into your home, Naman Puja is here to make it effortless, authentic, and deeply personal.',
    buttonLabel: 'Book Ganesh Puja in Sohar',
    bullets: [
      'Pandit arrives at your home or villa',
      'Live-stream for family in India',
      'Temple coordination available in Muscat',
    ],
  },
  internalLinks: [
    { label: 'Ganesh Puja in Muscat', href: '/pujas-in-oman/ganesh-puja-muscat' },
    { label: 'Ganesh Puja in Salalah', href: '/pujas-in-oman/ganesh-puja-salalah' },
  ],
};

// ── Index helpers ─────────────────────────────────────────────────────────────

export const omanPujaLocations: OmanPujaLocation[] = [
  muscatGaneshPuja,
  salalahGaneshPuja,
  soharGaneshPuja,
];

/** Lookup by location slug e.g. "ganesh-puja-muscat" */
export function getOmanPujaBySlug(slug: string): OmanPujaLocation | undefined {
  return omanPujaLocations.find((loc) => loc.slug === slug);
}

/**
 * Return all Oman pujas for a city — matched by city NAME (case-insensitive)
 * so it works regardless of whatever slug the admin assigned in the DB.
 */
export function getOmanPujasByCityName(cityName: string): OmanPujaLocation[] {
  const name = cityName.toLowerCase();
  return omanPujaLocations.filter((loc) => loc.cityName.toLowerCase() === name);
}
