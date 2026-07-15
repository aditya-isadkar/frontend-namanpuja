/**
 * Static UAE puja data — sourced from the Naman Puja content document.
 * Used as a frontend fallback since UAE PujaLocation records are not yet
 * in the database. Same data shape as OmanPujaLocation.
 */

export interface UAEPujaFaq {
  question: string;
  answer: string;
}

export interface UAEPujaRitual {
  name: string;
  description: string;
}

export interface UAEPujaSamagriGroup {
  group: string;
  items: string[];
}

export interface UAEPujaLocation {
  slug: string;
  citySlug: string;
  cityName: string;
  countryName: string;
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
  rituals: UAEPujaRitual[];
  samagri: UAEPujaSamagriGroup[];
  occasions: string[];
  serviceAreas: string[];
  faqs: UAEPujaFaq[];
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

// ── Shared ritual steps for Ganesh Puja ──────────────────────────────────────

const ganeshRituals: UAEPujaRitual[] = [
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

// ── Shared samagri list ──────────────────────────────────────────────────────

const ganeshSamagri: UAEPujaSamagriGroup[] = [
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
  'Live-stream option keeps family across two continents connected to the same ritual',
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
  'New job or relocation',
];

// ── Shared Why Choose Us ─────────────────────────────────────────────────────

const ganeshWhyChooseUs = [
  { title: 'Verified Vedic Pandits', description: 'Every pandit is vetted for Vedic training and puja experience, not just availability.' },
  { title: 'Complete Samagri Provided', description: 'Durva grass, red hibiscus, modak and the rest arrive fresh and complete — no last-minute errands.' },
  { title: 'Your Choice of Format', description: 'At-home puja, live-streamed session, or temple-coordinated visit — you pick what works.' },
  { title: 'Transparent Pricing', description: 'You know the full cost before you confirm. No surprise add-ons on puja day.' },
  { title: 'Adapt to Your Tradition', description: 'Pandits adapt the sequence, mantras and samagri to your family\'s own regional tradition — mention it at booking.' },
  { title: 'Family Abroad Can Join', description: 'Live-streamed option lets relatives in India or elsewhere participate in real time.' },
];

// ── DUBAI ────────────────────────────────────────────────────────────────────

export const dubaiGaneshPuja: UAEPujaLocation = {
  slug: 'ganesh-puja-dubai',
  citySlug: 'dubai',
  cityName: 'Dubai',
  countryName: 'UAE',
  h1: 'Ganesh Puja in Dubai — Book a Pandit for Home, Temple, or Live-Stream Worship',
  metaTitle: 'Ganesh Puja in Dubai | Book a Pandit Online - Naman Puja',
  metaDescription:
    'Book Ganesh Puja in Dubai with a verified pandit for your home, a temple visit, or live-stream worship. Same-week slots, all rituals explained.',
  keywords: ['Ganesh Puja Dubai', 'Ganesh Chaturthi Dubai pandit', 'book pandit Dubai Ganesh Puja', 'Ganpati puja at home Dubai'],
  breadcrumb: ['Home', 'Pujas in UAE', 'Ganesh Puja', 'Dubai'],
  canonicalUrl: 'https://www.namanpuja.com/pujas-in-uae/ganesh-puja-dubai',
  pujaName: 'Ganesh Puja',
  pujaDeity: 'Lord Ganesha (Vighnaharta)',
  pujaShortDesc: 'Invoke Lord Ganesha in Dubai — at home, live-streamed, or at the temple. Verified pandits, complete samagri.',
  heroTagline:
    "Dubai's Indian community has been quietly building its own version of home the moment it lands here — a small brass Ganesha tucked on a shelf near the door. Ganesh Puja is where that instinct becomes ritual: families invoke Ganesha before a new job offer, a new apartment, a new business license, or simply because Bhadrapada has rolled around again.",
  intro:
    "Naman Puja runs this ritual across Dubai three ways: a pandit who comes to your apartment or villa with everything packed and ready, a live-streamed session for family split across two continents and three time zones, or — for families who want the specific charge of a real temple hall — coordination for a visit to one of Dubai's Hindu temple complexes. Which one you pick usually comes down to logistics: can the building's smoke detector handle a small havan, is grandmother joining from Ahmedabad on video, or does the family just want it done before the Friday crowd hits Bur Dubai?",
  benefits: ganeshBenefits,
  rituals: ganeshRituals,
  samagri: ganeshSamagri,
  occasions: ganeshOccasions,
  whyChooseUs: ganeshWhyChooseUs,
  serviceAreas: [
    'Deira', 'Bur Dubai', 'Jumeirah', 'Downtown Dubai', 'Dubai Marina',
    'Business Bay', 'Palm Jumeirah', 'Dubai Hills Estate', 'JLT', 'Al Nahda', 'Al Barsha',
  ],
  faqs: [
    {
      question: 'Can I perform Ganesh Puja in a Dubai apartment if my building restricts open flame?',
      answer: 'Yes. Naman Puja\'s pandits carry a smokeless or reduced-smoke alternative for buildings where a full havan isn\'t practical, and will confirm this option during booking.',
    },
    {
      question: 'Is there a Hindu temple near me in Dubai where I can have Ganesh Puja performed?',
      answer: 'Dubai has Hindu temple complexes in Bur Dubai and Jebel Ali. Naman Puja can help coordinate a temple visit, though exact hours and current arrangements should be confirmed directly with the temple before your visit.',
    },
    {
      question: 'Can family members outside the UAE join the puja remotely?',
      answer: 'Yes — Naman Puja offers a live-streamed puja option specifically for families with relatives abroad who want to participate in real time.',
    },
    {
      question: 'Will the pandit follow my family\'s specific regional tradition?',
      answer: 'Yes. Naman Puja\'s pandits can adapt the puja\'s sequence, mantras, and samagri to your family\'s own regional or community tradition — mention your preference when booking.',
    },
    {
      question: 'How far in advance should I book Ganesh Puja in Dubai around Ganesh Chaturthi?',
      answer: 'Slots fill up quickly during Ganesh Chaturthi week. We recommend booking at least 1–2 weeks in advance for festive dates and a few days ahead for regular monthly observances.',
    },
  ],
  cta: {
    heading: 'Book Your Ganesh Puja in Dubai',
    body: 'Wherever in Dubai you\'re setting up your altar this year, Naman Puja can bring the ritual to you.',
    buttonLabel: 'Book Ganesh Puja in Dubai',
    bullets: [
      'Pandit visits your apartment or villa',
      'Live-stream for family abroad',
      'Temple coordination available',
    ],
  },
  internalLinks: [
    { label: 'Ganesh Puja in Abu Dhabi', href: '/pujas-in-uae/ganesh-puja-abu-dhabi' },
    { label: 'Ganesh Puja in Sharjah', href: '/pujas-in-uae/ganesh-puja-sharjah' },
  ],
};

// ── ABU DHABI ────────────────────────────────────────────────────────────────

export const abuDhabiGaneshPuja: UAEPujaLocation = {
  slug: 'ganesh-puja-abu-dhabi',
  citySlug: 'abu-dhabi',
  cityName: 'Abu Dhabi',
  countryName: 'UAE',
  h1: 'Ganesh Puja in Abu Dhabi — Book a Pandit for Your Home or a Temple Visit',
  metaTitle: 'Ganesh Puja in Abu Dhabi | Book Online - Naman Puja',
  metaDescription:
    'Book Ganesh Puja in Abu Dhabi at home or coordinated with the city\'s Hindu temple. Verified pandits, all rituals included, quick booking.',
  keywords: ['Ganesh Puja Abu Dhabi', 'Ganesh Chaturthi Abu Dhabi', 'BAPS Mandir puja booking', 'home pandit Abu Dhabi'],
  breadcrumb: ['Home', 'Pujas in UAE', 'Ganesh Puja', 'Abu Dhabi'],
  canonicalUrl: 'https://www.namanpuja.com/pujas-in-uae/ganesh-puja-abu-dhabi',
  pujaName: 'Ganesh Puja',
  pujaDeity: 'Lord Ganesha (Vighnaharta)',
  pujaShortDesc: 'Invoke Lord Ganesha in Abu Dhabi — at your home or at BAPS Hindu Mandir. Verified pandits, complete samagri.',
  heroTagline:
    'Something changed for Hindu families in Abu Dhabi in February 2024. Until then, a proper temple visit meant a drive to Dubai or further. Then BAPS Hindu Mandir opened — carved sandstone shipped from Rajasthan, marble from Italy, seven shrines representing the seven emirates — and suddenly "we\'re going to temple" meant something local.',
  intro:
    'Naman Puja serves Abu Dhabi both ways. A pandit can come to your home in Khalifa City, Al Reem Island, or Yas Island with everything needed — the more common option for a routine Bhadrapada observance or a quick invocation before a new job or apartment. For families who want the scale of a temple setting, particularly for Ganesh Chaturthi itself, we can help coordinate that too.',
  benefits: ganeshBenefits,
  rituals: ganeshRituals,
  samagri: ganeshSamagri,
  occasions: ganeshOccasions,
  whyChooseUs: ganeshWhyChooseUs,
  serviceAreas: [
    'Al Reem Island', 'Al Maryah Island', 'Saadiyat Island', 'Yas Island', 'Corniche',
    'Al Bateen', 'Khalifa City', 'Al Raha Beach', 'Al Raha Gardens', 'Al Reef',
    'Mohammed Bin Zayed City', 'Al Zahiyah',
  ],
  faqs: [
    {
      question: 'Can I have Ganesh Puja performed at BAPS Hindu Mandir instead of at home?',
      answer: 'Naman Puja can help coordinate a temple visit tied to BAPS Hindu Mandir; exact process and current hours should be confirmed directly with the temple before your visit.',
    },
    {
      question: 'Is a havan possible in an Abu Dhabi villa?',
      answer: 'Often yes, given more outdoor and majlis space than a typical apartment. Naman Puja\'s pandits will assess your specific setup at booking to ensure safety and compliance.',
    },
    {
      question: 'Can family outside the UAE join remotely?',
      answer: 'Yes, through Naman Puja\'s live-streamed puja option, allowing relatives anywhere in the world to participate in real-time.',
    },
    {
      question: 'Will the pandit follow my family\'s own regional tradition?',
      answer: 'Yes. Naman Puja\'s pandits can adapt the puja\'s sequence, mantras, and samagri to match your family\'s specific regional or community tradition. Please mention your preference when booking.',
    },
    {
      question: 'What is BAPS Hindu Mandir and is it open for Ganesh Puja?',
      answer: 'BAPS Hindu Mandir opened in February 2024 — the first traditional stone Hindu temple in the region. It is reported to be open Tue–Sun with separate aarti times. Naman Puja can help coordinate a visit; confirm current hours and registration directly with the temple.',
    },
  ],
  cta: {
    heading: 'Book Your Ganesh Puja in Abu Dhabi',
    body: 'From a villa in Khalifa City to an apartment on Reem Island, Naman Puja can bring Ganesh Puja to you.',
    buttonLabel: 'Book Ganesh Puja in Abu Dhabi',
    bullets: [
      'Pandit visits your home with all samagri',
      'BAPS Mandir coordination available',
      'Live-stream for family abroad',
    ],
  },
  internalLinks: [
    { label: 'Ganesh Puja in Dubai', href: '/pujas-in-uae/ganesh-puja-dubai' },
    { label: 'Ganesh Puja in Sharjah', href: '/pujas-in-uae/ganesh-puja-sharjah' },
  ],
};

// ── SHARJAH ──────────────────────────────────────────────────────────────────

export const sharjahGaneshPuja: UAEPujaLocation = {
  slug: 'ganesh-puja-sharjah',
  citySlug: 'sharjah',
  cityName: 'Sharjah',
  countryName: 'UAE',
  h1: 'Ganesh Puja in Sharjah — Book a Pandit for Your Home or a Live-Streamed Puja',
  metaTitle: 'Ganesh Puja in Sharjah | Home Pandit Booking - Naman Puja',
  metaDescription:
    'Book Ganesh Puja in Sharjah with a pandit who comes to you — no temple travel needed. Full samagri included, live-stream option available.',
  keywords: ['Ganesh Puja Sharjah', 'home pandit Sharjah', 'Ganesh Chaturthi Sharjah', 'puja at home Al Nahda Sharjah'],
  breadcrumb: ['Home', 'Pujas in UAE', 'Ganesh Puja', 'Sharjah'],
  canonicalUrl: 'https://www.namanpuja.com/pujas-in-uae/ganesh-puja-sharjah',
  pujaName: 'Ganesh Puja',
  pujaDeity: 'Lord Ganesha (Vighnaharta)',
  pujaShortDesc: 'Invoke Lord Ganesha in Sharjah — pandit comes to your home with complete samagri. No temple travel needed.',
  heroTagline:
    "Sharjah's Hindu families have gotten used to a small workaround: when it's the temple you want, it's Dubai you drive to. There's no Hindu temple within Sharjah itself. For something like a routine Ganesh Puja before a housewarming or a new job — a ritual that traditionally happens at home anyway — it's an unnecessary trip.",
  intro:
    "That's really the whole pitch for Sharjah: bring the puja to the apartment or villa instead of building a trip around it. A Naman Puja pandit arrives with everything already packed — idol, samagri, prasad ingredients — and performs the ritual in your own space, on your own schedule, without asking anyone to navigate Sheikh Mohammed Bin Zayed Road during rush hour.",
  benefits: ganeshBenefits,
  rituals: ganeshRituals,
  samagri: ganeshSamagri,
  occasions: ganeshOccasions,
  whyChooseUs: ganeshWhyChooseUs,
  serviceAreas: [
    'Al Khan', 'Al Majaz', 'Al Nahda', 'Al Taawun', 'Muwaileh', 'Aljada',
    'Al Zahia', 'Tilal City', 'Al Qasimia', 'Abu Shagara', 'Al Rahmaniya',
    'Al Suyoh', 'Al Tai', 'Barashi', 'Al Nouf',
  ],
  faqs: [
    {
      question: 'Is there a Hindu temple in Sharjah?',
      answer: 'No confirmed Hindu temple currently exists within Sharjah itself. The nearest are in Dubai and Abu Dhabi. Sharjah Geeta Shangha operates as a Hindu community organization for satsangs and bhajans.',
    },
    {
      question: 'Can I still have a temple-style Ganesh Puja if I live in Sharjah?',
      answer: 'Yes — Naman Puja can coordinate a puja tied to a temple visit in Dubai or Abu Dhabi, though this involves roughly 45–60 minutes of travel time each way.',
    },
    {
      question: 'Is a home puja in Sharjah just as complete as one performed at a temple?',
      answer: 'Ganesh Puja is traditionally a home ritual in most Hindu households regardless of location. A temple isn\'t required for it to be complete.',
    },
    {
      question: 'Can family outside the UAE join remotely?',
      answer: 'Yes, through Naman Puja\'s live-streamed puja option, allowing relatives anywhere to participate in the ceremony in real-time.',
    },
    {
      question: 'Will the pandit follow my family\'s regional tradition?',
      answer: 'Yes. Naman Puja\'s pandits can adapt the sequence, mantras, and samagri to your family\'s specific regional or community tradition. Please mention your preference when booking.',
    },
  ],
  cta: {
    heading: 'Book Your Ganesh Puja in Sharjah',
    body: 'No temple to travel to doesn\'t mean no puja — Naman Puja brings Ganesh Puja to your Sharjah home.',
    buttonLabel: 'Book Ganesh Puja in Sharjah',
    bullets: [
      'Pandit comes to you — no Dubai drive needed',
      'Complete samagri included',
      'Live-stream for family abroad',
    ],
  },
  internalLinks: [
    { label: 'Ganesh Puja in Dubai', href: '/pujas-in-uae/ganesh-puja-dubai' },
    { label: 'Ganesh Puja in Abu Dhabi', href: '/pujas-in-uae/ganesh-puja-abu-dhabi' },
  ],
};

// ── Index helpers ─────────────────────────────────────────────────────────────

export const uaePujaLocations: UAEPujaLocation[] = [
  dubaiGaneshPuja,
  abuDhabiGaneshPuja,
  sharjahGaneshPuja,
];

/** Lookup by location slug e.g. "ganesh-puja-dubai" */
export function getUAEPujaBySlug(slug: string): UAEPujaLocation | undefined {
  return uaePujaLocations.find((loc) => loc.slug === slug);
}

/** Return all UAE pujas for a city slug e.g. "dubai" */
export function getUAEPujasByCity(citySlug: string): UAEPujaLocation[] {
  return uaePujaLocations.filter((loc) => loc.citySlug === citySlug);
}

/** All city slugs that have static UAE data */
export const UAE_CITY_SLUGS = new Set(['dubai', 'abu-dhabi', 'sharjah']);
