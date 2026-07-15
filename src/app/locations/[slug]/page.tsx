import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Check, Flame, ListChecks, MapPin, Sparkles, Star, CalendarHeart, ChevronRight,
} from 'lucide-react';
import { getAllLocationSlugs, getLocation } from '@/lib/api';
import { getFallbackLocation } from '@/lib/fallbackContent';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion';
import { FaqList } from '@/components/FaqList';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllLocationSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export const revalidate = 600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let loc;
  try {
    loc = await getLocation(params.slug);
  } catch {
    loc = await getFallbackLocation(params.slug);
  }

  if (!loc) {
    return { title: 'Page not found' };
  }

  return {
    title: loc.metaTitle ?? loc.h1,
    description: loc.metaDescription,
    keywords: loc.keywords,
    alternates: { canonical: loc.canonicalUrl },
    openGraph: {
      title: loc.metaTitle ?? loc.h1,
      description: loc.metaDescription,
      images: loc.ogImage ? [{ url: loc.ogImage, alt: loc.imageAlt }] : undefined,
      url: loc.canonicalUrl,
    },
    other: loc.city?.geoRegion
      ? { 'geo.region': loc.city.geoRegion, 'geo.placename': loc.city.name }
      : undefined,
  };
}

export default async function LocationPage({ params }: Props) {
  let loc;
  try {
    loc = await getLocation(params.slug);
  } catch {
    loc = await getFallbackLocation(params.slug);
  }

  if (!loc) {
    notFound();
  }

  const bookHref = `/book?puja=${loc.puja?.id ?? ''}&city=${loc.city?.id ?? ''}`;

  // JSON-LD: Service + FAQPage + Breadcrumb
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
              <Link href={bookHref} className="btn-primary">
                {loc.cta?.buttonLabel ?? 'Book this Puja'} <Flame className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_320px]">
        <article className="prose-puja max-w-none">
          {loc.intro && <Reveal><p className="text-lg leading-relaxed text-ink/80">{loc.intro}</p></Reveal>}

          {loc.sections?.map((s) => (
            <Reveal key={s.heading}>
              <h2>{s.heading}</h2>
              <p>{s.body}</p>
            </Reveal>
          ))}

          {/* Benefits */}
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

          {/* Rituals */}
          {loc.rituals?.length ? (
            <Reveal>
              <h2 className="flex items-center gap-2"><Flame className="h-5 w-5 text-saffron-600" /> Traditional Rituals Included</h2>
              <ol className="mt-4 space-y-3">
                {loc.rituals.map((r, i) => (
                  <li key={i} className="flex gap-4 rounded-xl border border-saffron-100 bg-white p-4">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-saffron-gradient text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <span>
                      <span className="font-semibold">{r.name}</span>
                      <span className="block text-sm text-ink/60">{r.description}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          ) : null}

          {/* Samagri */}
          {loc.samagri?.length ? (
            <Reveal>
              <h2 className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-saffron-600" /> Complete Puja Samagri List</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {loc.samagri.map((g) => (
                  <div key={g.group} className="rounded-xl border border-saffron-100 bg-white p-4">
                    <h3 className="font-semibold text-saffron-700">{g.group}</h3>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {g.items.map((item) => (
                        <li key={item} className="rounded-full bg-saffron-50 px-3 py-1 text-xs text-ink/70">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          ) : null}

          {/* Occasions */}
          {loc.occasions?.length ? (
            <Reveal>
              <h2 className="flex items-center gap-2"><CalendarHeart className="h-5 w-5 text-saffron-600" /> Ideal for Every Occasion</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {loc.occasions.map((o) => (
                  <span key={o} className="rounded-full border border-saffron-200 bg-white px-4 py-2 text-sm text-ink/70">
                    {o}
                  </span>
                ))}
              </div>
            </Reveal>
          ) : null}

          {/* Why choose us */}
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

          {/* Service areas */}
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

          {/* FAQs */}
          {loc.faqs?.length ? (
            <Reveal>
              <h2>Frequently Asked Questions</h2>
              <FaqList faqs={loc.faqs} />
            </Reveal>
          ) : null}
        </article>

        {/* Sticky booking sidebar */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-3xl border border-saffron-100 bg-white p-6 shadow-glow">
            <h3 className="font-display text-xl font-bold">Book {loc.puja?.name}</h3>
            <p className="mt-1 text-sm text-ink/60">in {loc.city?.name}, {loc.city?.state}</p>
            <Link href={bookHref} className="btn-primary mt-5 w-full">
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

          {/* Internal links */}
          {loc.internalLinks?.length ? (
            <div className="mt-6 rounded-3xl border border-saffron-100 bg-cream p-6">
              <h4 className="font-display font-semibold">Other pujas in {loc.city?.name}</h4>
              <ul className="mt-3 space-y-2">
                {loc.internalLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="flex items-center gap-1 text-sm text-saffron-700 hover:underline">
                      <ChevronRight className="h-4 w-4" /> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>

      {/* CTA */}
      {loc.cta && (
        <section className="container-page pb-20">
          <div className="overflow-hidden rounded-3xl bg-saffron-gradient px-8 py-12 text-center text-white shadow-glow sm:px-16">
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">{loc.cta.heading}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-white/90">{loc.cta.body}</p>
            <Link href={bookHref} className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-semibold text-saffron-700 transition-transform hover:scale-105">
              {loc.cta.buttonLabel}
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
