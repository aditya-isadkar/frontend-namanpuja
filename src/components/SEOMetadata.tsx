import { useEffect } from 'react';

export interface SEOMetadataProps {
  title?: string;
  description?: string;
  keywords?: string | string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  referrerPolicy?: string;
  xFrameOptions?: string;
  hsts?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_DOMAIN = 'https://www.namanpuja.com';
const DEFAULT_TITLE = 'Naman Puja — Book Authentic Vedic Pujas at Home & Online';
const DEFAULT_DESCRIPTION =
  'Book authentic Hindu pujas with experienced Vedic priests — at home or online. Choose your country, your city, and the puja you need.';

function upsertMetaByName(name: string, content?: string) {
  if (!content) return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertMetaByHttpEquiv(httpEquiv: string, content?: string) {
  if (!content) return;
  let el = document.querySelector(`meta[http-equiv="${httpEquiv}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('http-equiv', httpEquiv);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertMetaByProperty(property: string, content?: string) {
  if (!content) return;
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>) {
  const existingScript = document.getElementById('dynamic-jsonld');
  if (existingScript) {
    existingScript.remove();
  }
  if (!jsonLd) return;

  const script = document.createElement('script');
  script.id = 'dynamic-jsonld';
  script.type = 'application/ld+json';
  script.text = JSON.stringify(jsonLd);
  document.head.appendChild(script);
}

export function SEOMetadata({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  referrerPolicy = 'strict-origin-when-cross-origin',
  xFrameOptions = 'SAMEORIGIN',
  hsts = 'max-age=31536000; includeSubDomains; preload',
  jsonLd,
}: SEOMetadataProps) {
  useEffect(() => {
    // 1. Page Title
    const finalTitle = title ? (title.includes('Naman Puja') ? title : `${title} | Naman Puja`) : DEFAULT_TITLE;
    document.title = finalTitle;

    // 2. Canonical Link (Dynamic calculation if omitted)
    let finalCanonical = canonicalUrl;
    if (!finalCanonical) {
      const origin = typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : DEFAULT_DOMAIN;
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      finalCanonical = `${origin}${pathname}`;
    }
    upsertCanonical(finalCanonical);

    // 3. Security Meta Directives
    upsertMetaByName('referrer', referrerPolicy);
    upsertMetaByHttpEquiv('Strict-Transport-Security', hsts);
    upsertMetaByHttpEquiv('X-Frame-Options', xFrameOptions);
    upsertMetaByHttpEquiv('Content-Security-Policy', "frame-ancestors 'self';");

    // 4. Description & Keywords
    const finalDesc = description || DEFAULT_DESCRIPTION;
    upsertMetaByName('description', finalDesc);

    if (keywords) {
      const kwStr = Array.isArray(keywords) ? keywords.join(', ') : keywords;
      upsertMetaByName('keywords', kwStr);
    }

    // 5. Open Graph Meta
    upsertMetaByProperty('og:title', title || DEFAULT_TITLE);
    upsertMetaByProperty('og:description', finalDesc);
    upsertMetaByProperty('og:url', finalCanonical);
    upsertMetaByProperty('og:type', ogType);
    if (ogImage) {
      upsertMetaByProperty('og:image', ogImage);
    }

    // 6. JSON-LD Structured Data
    upsertJsonLd(jsonLd);

    // 7. Clickjacking / Frame-busting check for X-Frame-Options: SAMEORIGIN
    try {
      if (window.self !== window.top) {
        if (window.top && window.top.location.origin !== window.location.origin) {
          window.top.location.href = window.self.location.href;
        }
      }
    } catch {
      // Cross-origin frame attempt blocked
    }
  }, [
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage,
    ogType,
    referrerPolicy,
    xFrameOptions,
    hsts,
    jsonLd,
  ]);

  return null;
}

export default SEOMetadata;
