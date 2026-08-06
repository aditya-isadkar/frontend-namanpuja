export type ServiceType = 'EPUJA' | 'HOME_VISIT' | 'BOTH';

export interface Country {
  id: string;
  name: string;
  slug: string;
  isoCode?: string;
  flagEmoji?: string;
  _count?: { cities: number };
}

export interface City {
  id: string;
  name: string;
  slug: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  geoRegion?: string;
  isPopular?: boolean;
  country?: Country;
}

export interface PujaCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface Puja {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  shortDesc?: string;
  description?: string;
  serviceType: ServiceType;
  durationMin?: number;
  basePrice?: string | number;
  currency?: string;
  heroImage?: string;
  deity?: string;
  isFeatured?: boolean;
  sortOrder?: number;
  category?: PujaCategory;
  benefits?: any;
  rituals?: any;
  samagri?: any;
  occasions?: any;
  faqs?: any;
}

export interface NamedDescription {
  name: string;
  description: string;
}
export interface TitledDescription {
  title: string;
  description: string;
}
export interface SamagriGroup {
  group: string;
  items: string[];
}
export interface Faq {
  question: string;
  answer: string;
}

export type ContentBlockType =
  | { type: 'heading'; value: string }
  | { type: 'paragraph'; value: string; bgColor?: string }
  | { type: 'image'; value: string }
  | { type: 'timing'; value: { label: string; time: string } }
  | { type: 'table'; value: { columns: string[]; rows: { cells: string[] }[] } }
  | { type: 'rahu_kal'; value?: { label?: string; note?: string } }
  | { type: 'cta'; value: { label: string; url: string } };

export interface PujaLocation {
  id: string;
  slug: string;
  h1: string;
  heroTagline?: string;
  intro?: string;
  featuredImage?: string;
  heroImage?: string;
  sections?: { heading?: string; body?: string; type?: string; value?: any }[];
  blocks?: ContentBlockType[];
  benefits?: string[];
  rituals?: NamedDescription[];
  samagri?: SamagriGroup[];
  whyChooseUs?: TitledDescription[];
  occasions?: string[];
  serviceAreas?: string[];
  faqs?: Faq[];
  cta?: { heading: string; bullets: string[]; body: string; buttonLabel: string };
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  breadcrumb?: string[];
  internalLinks?: { label: string; href: string }[];
  imageAlt?: string;
  basePrice?: string | number;
  puja?: Puja;
  city?: City;
  cityName?: string;
  countryName?: string;
}

export interface Temple {
  id: string;
  name: string;
  slug: string;
  deity?: string;
  shortDesc?: string;
  description?: string;
  history?: string;
  significance?: string;
  timings?: string;
  heroImage?: string;
  city?: City;
}
