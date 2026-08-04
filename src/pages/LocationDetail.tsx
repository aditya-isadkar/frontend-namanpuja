import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Check, Clock, Flame, ListChecks, MapPin, Sparkles, Star, CalendarHeart, ChevronRight,
} from 'lucide-react';
import { getLocation } from '@/lib/api';
import { getFallbackLocation } from '@/lib/fallbackContent';
import type { PujaLocation, ContentBlockType } from '@/lib/types';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion';
import { FaqList } from '@/components/FaqList';
import { RahuKaalCard } from '@/components/RahuKaalCard';

// ─────────────────────────────────────────────────────────────
// <head> helpers — upsert instead of duplicate on every mount
// ─────────────────────────────────────────────────────────────
function setMetaByName(name: string, content?: string) {
  if (!content) return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaByProperty(property: string, content?: string) {
  if (!content) return;
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href?: string) {
  if (!href) return;
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

// ─────────────────────────────────────────────────────────────
// Block renderer — same block format as the Content Builder
// (heading / paragraph / image / timing / table / rahu_kal)
// ─────────────────────────────────────────────────────────────
function BlockRenderer({
  block,
  cityName,
  countryName,
  latitude,
  longitude,
}: {
  block: ContentBlockType;
  cityName?: string;
  countryName?: string;
  latitude?: number;
  longitude?: number;
}) {
  switch (block.type) {
    case 'heading':
      return (
        <h2 className="mt-10 font-display text-2xl font-bold tracking-tight text-ink first:mt-0">
          {block.value}
        </h2>
      );

    case 'paragraph':
      return (
        <div
          className="mt-4 rounded-xl p-4 leading-relaxed text-ink/80"
          style={{ backgroundColor: block.bgColor && block.bgColor !== '#ffffff' ? block.bgColor : undefined }}
        >
          {block.value}
        </div>
      );

    case 'image':
      return block.value ? (
        <img
          src={block.value}
          alt=""
          className="mt-6 w-full rounded-2xl border border-saffron-100 object-cover shadow-sm"
        />
      ) : null;

    case 'timing':
      return (
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-saffron-100 bg-saffron-50/60 px-4 py-2 text-sm">
          <Clock className="h-4 w-4 text-saffron-700" />
          <span className="font-medium text-ink">{block.value.label}</span>
          <span className="text-ink/60">· {block.value.time}</span>
        </div>
      );

    case 'rahu_kal':
      return (
        <RahuKaalCard
          cityName={cityName}
          countryName={countryName}
          latitude={latitude}
          longitude={longitude}
          customTitle={(block.value as any)?.label}
          customNote={(block.value as any)?.note}
        />
      );

    case 'table':
      return (
        <div className="mt-6 overflow-x-auto rounded-xl border border-saffron-100">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-saffron-50/60">
                {block.value.columns.map((col, i) => (
                  <th key={i} className="border-b border-saffron-100 px-4 py-2 text-left font-semibold text-ink">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.value.rows.map((row, ri) => (
                <tr key={ri} className="odd:bg-white even:bg-saffron-50/20">
                  {row.cells.map((cell, ci) => (
                    <td key={ci} className="border-b border-saffron-100/70 px-4 py-2 text-ink/80">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Normalise a section entry into a ContentBlockType array.
// Handles both old  { heading, body }  and new block format
// { type, value, ... } that the Content Builder saves.
// ─────────────────────────────────────────────────────────────
function sectionToBlocks(s: NonNullable<PujaLocation['sections']>[number]): ContentBlockType[] {
  // Already a proper block (has .type field)
  if (s.type) {
    return [s as unknown as ContentBlockType];
  }
  // Legacy format — convert to heading + paragraph blocks
  const blocks: ContentBlockType[] = [];
  if (s.heading) blocks.push({ type: 'heading', value: s.heading });
  if (s.body)    blocks.push({ type: 'paragraph', value: s.body });
  return blocks;
}

export default function LocationDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loc, setLoc] = useState<PujaLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    (async () => {
      try {
        const data = await getLocation(slug);
        if (data && (data.sections?.length || data.blocks?.length || data.benefits?.length || data.faqs?.length)) {
          setLoc(data);
          setLoading(false);
          return;
        }
      } catch {}
      const fallback = await getFallbackLocation(slug);
      if (fallback) { setLoc(fallback); setLoading(false); return; }
      navigate('/404', { replace: true });
    })();
  }, [slug, navigate]);

  // Mirrors the Next.js generateMetadata() logic — runs client-side instead
  useEffect(() => {
    if (!loc) return;

    document.title = loc.metaTitle ?? loc.h1 ?? 'Puja Location | Naman Puja';
    setMetaByName('description', loc.metaDescription);
    if (loc.keywords) setMetaByName('keywords', loc.keywords as unknown as string);
    setCanonical(loc.canonicalUrl);

    setMetaByProperty('og:title', loc.metaTitle ?? loc.h1);
    setMetaByProperty('og:description', loc.metaDescription);
    setMetaByProperty('og:url', loc.canonicalUrl);
    if (loc.ogImage) {
      setMetaByProperty('og:image', loc.ogImage);
      if (loc.imageAlt) setMetaByProperty('og:image:alt', loc.imageAlt);
    }

    if (loc.city?.geoRegion) {
      setMetaByName('geo.region', loc.city.geoRegion);
      setMetaByName('geo.placename', loc.city.name);
    }
  }, [loc]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-ink/50">Loading...</p></div>;
  }

  if (!loc) return null;

  const bookHref = `/book?puja=${loc.puja?.id ?? ''}&city=${loc.city?.id ?? ''}`;

  // Hero image: prefer featuredImage / heroImage / ogImage, fall back to puja heroImage
  const heroImage = loc.featuredImage || loc.heroImage || loc.ogImage || loc.puja?.heroImage;

  // Normalise sections into blocks so BlockRenderer handles them
  const sectionBlocks: ContentBlockType[] = (loc.sections ?? []).flatMap(sectionToBlocks);

  // Same JSON-LD shape as the Next.js version: Service + FAQPage + Breadcrumb
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: loc.h1,
      description: loc.metaDescription,
      areaServed: loc.city ? `${loc.city.name}, ${loc.city.state}` : undefined,
      provider: { '@type': 'Organization', name: 'Naman Puja', url: 'https://www.namanpuja.com' },
    },
    loc.faqs?.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: loc.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null,
    loc.breadcrumb?.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: loc.breadcrumb.map((name, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name,
          })),
        }
      : null,
  ].filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-saffron-radial mt-12">
        <div className="container-page py-16">
          {loc.breadcrumb && (
            <nav className="mb-5 flex flex-wrap items-center gap-1 text-sm text-ink/50">
              {loc.breadcrumb.map((b, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                  <span className={i === loc.breadcrumb!.length - 1 ? 'text-ink' : ''}>{b}</span>
                </span>
              ))}
            </nav>
          )}
          <Reveal>
            <span className="badge"><Sparkles className="h-3.5 w-3.5" /> {loc.puja?.deity}</span>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {loc.h1}
            </h1>
            {loc.heroTagline && <p className="mt-4 max-w-3xl text-lg text-ink/70">{loc.heroTagline}</p>}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to={bookHref} className="btn-primary">
                {loc.cta?.buttonLabel ?? 'Book this Puja'} <Flame className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured / Hero image */}
      {heroImage && (
        <div className="container-page -mt-4 mb-4">
          <Reveal>
            <img
              src={heroImage}
              alt={loc.imageAlt ?? loc.h1}
              className="aspect-[16/7] w-full rounded-3xl border border-saffron-100 object-cover shadow-sm"
            />
          </Reveal>
        </div>
      )}

      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_320px]">
        <article className="prose-puja max-w-none">
          {loc.intro && <Reveal><p className="text-lg leading-relaxed text-ink/80">{loc.intro}</p></Reveal>}

          <Reveal>
            <RahuKaalCard
              cityName={loc.city?.name || loc.cityName || 'Delhi'}
              countryName={loc.countryName || loc.city?.country?.name}
              latitude={loc.city?.latitude}
              longitude={loc.city?.longitude}
            />
          </Reveal>

          {/* ── Content Builder blocks (image, table, heading, etc.) ── */}
          {loc.blocks?.length ? (
            <Reveal>
              <div className="mt-4">
                {loc.blocks.map((block, i) => (
                  <BlockRenderer
                    key={i}
                    block={block}
                    cityName={loc.city?.name || loc.cityName}
                    countryName={loc.countryName || loc.city?.country?.name}
                    latitude={loc.city?.latitude}
                    longitude={loc.city?.longitude}
                  />
                ))}
              </div>
            </Reveal>
          ) : null}

          {/* ── Sections (supports both legacy {heading,body} and block format) ── */}
          {sectionBlocks.length ? (
            <Reveal>
              <div className="mt-4">
                {sectionBlocks.map((block, i) => (
                  <BlockRenderer
                    key={i}
                    block={block}
                    cityName={loc.city?.name || loc.cityName}
                    countryName={loc.countryName || loc.city?.country?.name}
                    latitude={loc.city?.latitude}
                    longitude={loc.city?.longitude}
                  />
                ))}
              </div>
            </Reveal>
          ) : null}

          {loc.benefits?.length ? (
            <Reveal>
              <h2 className="flex items-center gap-2"><Star className="h-5 w-5 text-saffron-600" /> Spiritual Benefits</h2>
              <StaggerGroup className="mt-4 grid gap-3 sm:grid-cols-2">
                {loc.benefits.map((b, i) => (
                  <StaggerItem key={i}>
                    <div className="flex items-start gap-3 rounded-xl bg-saffron-50 p-4">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-saffron-600" />
                      <span className="text-sm text-ink/80">{typeof b === 'string' ? b : (b as any).title}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </Reveal>
          ) : null}

          {loc.rituals?.length ? (
            <Reveal>
              <h2 className="flex items-center gap-2"><Flame className="h-5 w-5 text-saffron-600" /> Traditional Rituals Included</h2>
              <ol className="mt-4 space-y-3">
                {loc.rituals.map((r, i) => (
                  <li key={i} className="flex gap-4 rounded-xl border border-saffron-100 bg-white p-4">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-saffron-gradient text-sm font-bold text-white">{i + 1}</span>
                    <span>
                      <span className="font-semibold">{r.name}</span>
                      <span className="block text-sm text-ink/60">{r.description}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          ) : null}

          {loc.samagri?.length ? (
            <Reveal>
              <h2 className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-saffron-600" /> Complete Puja Samagri List</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {loc.samagri.map((g) => (
                  <div key={g.group} className="rounded-xl border border-saffron-100 bg-white p-4">
                    <h3 className="font-semibold text-saffron-700">{g.group}</h3>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {g.items.map((item) => (
                        <li key={item} className="rounded-full bg-saffron-50 px-3 py-1 text-xs text-ink/70">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          ) : null}

          {loc.occasions?.length ? (
            <Reveal>
              <h2 className="flex items-center gap-2"><CalendarHeart className="h-5 w-5 text-saffron-600" /> Ideal for Every Occasion</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {loc.occasions.map((o) => (
                  <span key={o} className="rounded-full border border-saffron-200 bg-white px-4 py-2 text-sm text-ink/70">{o}</span>
                ))}
              </div>
            </Reveal>
          ) : null}

          {loc.whyChooseUs?.length ? (
            <Reveal>
              <h2>Why Choose Naman Puja in {loc.city?.name}?</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {loc.whyChooseUs.map((w) => (
                  <div key={w.title} className="rounded-xl bg-saffron-50 p-4">
                    <h3 className="font-semibold">{w.title}</h3>
                    <p className="mt-1 text-sm text-ink/60">{w.description}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          ) : null}

          {loc.serviceAreas?.length ? (
            <Reveal>
              <h2 className="flex items-center gap-2"><MapPin className="h-5 w-5 text-saffron-600" /> Serving Families Across {loc.city?.name}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {loc.serviceAreas.map((a) => (
                  <span key={a} className="rounded-full bg-saffron-100 px-3 py-1 text-sm text-saffron-800">{a}</span>
                ))}
              </div>
            </Reveal>
          ) : null}

          {loc.faqs?.length ? (
            <Reveal>
              <h2>Frequently Asked Questions</h2>
              <FaqList faqs={loc.faqs} />
            </Reveal>
          ) : null}
        </article>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-3xl border border-saffron-100 bg-white p-6 shadow-glow">
            <h3 className="font-display text-xl font-bold">Book {loc.puja?.name}</h3>
            <p className="mt-1 text-sm text-ink/60">in {loc.city?.name}, {loc.city?.state}</p>
            <Link to={bookHref} className="btn-primary mt-5 w-full">
              {loc.cta?.buttonLabel ?? 'Book Now'}
            </Link>
            <ul className="mt-5 space-y-2 text-sm text-ink/70">
              {(loc.cta?.bullets ?? ['Experienced Vedic Priests', 'Authentic rituals at home', 'Complete samagri guidance']).map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-saffron-600" /> {b}
                </li>
              ))}
            </ul>
          </div>

          {loc.internalLinks?.length ? (
            <div className="mt-6 rounded-3xl border border-saffron-100 bg-cream p-6">
              <h4 className="font-display font-semibold">Other pujas in {loc.city?.name}</h4>
              <ul className="mt-3 space-y-2">
                {loc.internalLinks.map((l) => (
                  <li key={l.href}>
                    <Link to={l.href} className="flex items-center gap-1 text-sm text-saffron-700 hover:underline">
                      <ChevronRight className="h-4 w-4" /> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>

      {loc.cta && (
        <section className="container-page pb-20">
          <div className="overflow-hidden rounded-3xl bg-saffron-gradient px-8 py-12 text-center text-white shadow-glow sm:px-16">
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">{loc.cta.heading}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-white/90">{loc.cta.body}</p>
            <Link to={bookHref} className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-semibold text-saffron-700 transition-transform hover:scale-105">
              {loc.cta.buttonLabel}
            </Link>
          </div>
        </section>
      )}
    </>
  );
}