import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Flame,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  User,
  CalendarDays,
  MapPin,
} from 'lucide-react';
import { getPuja } from '@/lib/api';
import type { Puja } from '@/lib/types';
import { Reveal } from '@/components/motion';
import { RahuKaalCard } from '@/components/RahuKaalCard';
import { SEOMetadata } from '@/components/SEOMetadata';

// ─────────────────────────────────────────────────────────────
// Content block types — mirrors the Bhakti Page Content Builder
// (heading / paragraph / image / timing / table)
// ─────────────────────────────────────────────────────────────
type HeadingBlock = { type: 'heading'; value: string };
type ParagraphBlock = { type: 'paragraph'; value: string; bgColor?: string };
type ImageBlock = { type: 'image'; value: string };
type TimingBlock = { type: 'timing'; value: { label: string; time: string } };
type TableBlock = {
  type: 'table';
  value: { columns: string[]; rows: { cells: string[] }[] };
};
type RahuKalBlock = {
  type: 'rahu_kal';
  value?: { label?: string; note?: string };
};
type CtaBlock = {
  type: 'cta';
  value: { label: string; url: string };
};
type ContentBlock = HeadingBlock | ParagraphBlock | ImageBlock | TimingBlock | TableBlock | RahuKalBlock | CtaBlock;

type Faq = { question: string; answer: string };

// If these aren't on your real `Puja` type yet, add them there instead
// of keeping this local extension.
type PujaWithContent = Puja & {
  author?: string;
  category?: string;
  readTime?: string;
  publishAt?: string;
  featuredImage?: string;
  excerpt?: string;
  bhaktiType?: 'main' | 'location';
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
  blocks?: ContentBlock[];
  faqs?: Faq[];
  structuredData?: Record<string, unknown>;
};

// ─────────────────────────────────────────────────────────────
// Block renderer
// ─────────────────────────────────────────────────────────────
function BlockRenderer({
  block,
  cityName,
  countryName,
  latitude,
  longitude,
}: {
  block: ContentBlock;
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
          className="mt-6 w-full rounded-2xl border border-saffron-100 object-cover"
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
          customTitle={block.value?.label}
          customNote={block.value?.note}
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
// Sticky booking rail — right ~20% of the screen on large viewports
// ─────────────────────────────────────────────────────────────
function BookingRail({ puja }: { puja: PujaWithContent }) {
  const bookHref = `/payment?puja=${puja.id ?? ''}${puja.country ? `&country=${encodeURIComponent(puja.country)}` : ''}${puja.city ? `&city=${encodeURIComponent(puja.city)}` : ''}`;

  const perks = [
    'Experienced Vedic Priests',
    'Authentic rituals at home',
    'Complete samagri guidance',
    'On-time arrival, every time',
  ];

  return (
    <aside className="lg:col-span-1">
      <div className="lg:sticky lg:top-24 space-y-6">
        <div className="rounded-2xl border border-saffron-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-ink/60">Ready to begin?</p>
          <h3 className="mt-1 font-display text-lg font-bold text-ink">{puja.name}</h3>

          {puja.basePrice !== undefined && puja.basePrice !== null && Number(puja.basePrice) > 0 && (
            <div className="mt-3 text-2xl font-bold text-saffron-700">
              ₹{puja.basePrice} <span className="text-xs font-normal text-ink/60">onwards</span>
            </div>
          )}

          <Link
            to={bookHref}
            className="btn-primary mt-4 flex w-full items-center justify-center gap-2"
          >
            Book Now <Flame className="h-4 w-4" />
          </Link>

          <ul className="mt-5 space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2 text-sm text-ink/75">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-saffron-700" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>

          {(puja.durationMin || puja.city) && (
            <div className="mt-5 space-y-2 border-t border-saffron-100 pt-4 text-sm text-ink/60">
              {puja.durationMin && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> {Math.round(puja.durationMin / 60)}h+ ceremony
                </div>
              )}
              {puja.city && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {puja.city}{puja.country ? `, ${puja.country}` : ''}
                </div>
              )}
            </div>
          )}
        </div>

        {puja.blocks?.filter((b: any) => b.type === 'cta').map((block: any, i: number) => {
          const url = block.value?.url;
          const label = block.value?.label || 'Book Now';
          if (!url) return null;
          if (url.startsWith('/')) {
            return (
              <Link
                key={i}
                to={url}
                className="btn-primary flex w-full items-center justify-center gap-2 shadow-md"
              >
                {label} <Flame className="h-4 w-4" />
              </Link>
            );
          }
          return (
            <a
              key={i}
              href={url}
              className="btn-primary flex w-full items-center justify-center gap-2 shadow-md"
              target="_blank"
              rel="noopener noreferrer"
            >
              {label} <Flame className="h-4 w-4" />
            </a>
          );
        })}
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
export default function PujaDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [puja, setPuja] = useState<PujaWithContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getPuja(slug)
      .then((p) => {
        setPuja(p as PujaWithContent);
        document.title = `${p.name} | Naman Puja`;
        setLoading(false);
      })
      .catch(() => navigate('/404', { replace: true }));
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-ink/50">Loading...</p>
      </div>
    );
  }

  if (!puja) return null;

  return (
    <>
      <SEOMetadata
        title={puja.name}
        description={puja.excerpt || puja.shortDesc || puja.shortDescription || puja.subtitle || puja.description}
        keywords={puja.tags}
        ogImage={puja.featuredImage || puja.heroImage}
        jsonLd={puja.structuredData as any}
      />
      {puja.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(puja.structuredData) }}
        />
      )}
      <section className="bg-saffron-radial">
        <div className="container-page py-16">
          <Reveal>
            <span className="badge mt-12">
              <Sparkles className="h-3.5 w-3.5" /> {puja.deity}
            </span>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              {puja.name}
            </h1>
            {(puja.shortDesc || puja.shortDescription || puja.subtitle) && (
              <p className="mt-4 max-w-2xl text-lg text-ink/70">
                {puja.shortDesc || puja.shortDescription || puja.subtitle}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-ink/60">
              {puja.author && (
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" /> {puja.author}
                </span>
              )}
              {puja.readTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {puja.readTime}
                </span>
              )}
              {puja.publishAt && (
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(puja.publishAt).toLocaleDateString()}
                </span>
              )}
              {puja.category && (
  <span className="badge">
    {typeof puja.category === 'string' ? puja.category : (puja.category as { name?: string }).name}
  </span>
)}
              
            </div>
            
          </Reveal>
        </div>
      </section>

      {puja.featuredImage && (
        <div className="container-page -mt-8">
          <Reveal>
            <img
              src={puja.featuredImage}
              alt={puja.name}
              className="aspect-[16/7] w-full rounded-3xl border border-saffron-100 object-cover shadow-sm"
            />
          </Reveal>
          {puja.excerpt && (
            <Reveal>
              <p className="mt-6 text-xl font-medium leading-relaxed text-ink/80">
                {puja.excerpt}
              </p>
            </Reveal>
          )}
        </div>
      )}

      <article className="container-page py-16">
        {/* 80 / 20 split on large screens */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Main content — ~80% */}
          <div className="lg:col-span-4">
            {puja.description && (
              <Reveal>
                <p className="text-lg leading-relaxed text-ink/80">{puja.description}</p>
              </Reveal>
            )}

            {puja.blocks?.length ? (
              <Reveal>
                <div className="prose-puja mt-8">
                  {puja.blocks.map((block, i) => (
                    <BlockRenderer
                      key={i}
                      block={block}
                      cityName={puja.city}
                      countryName={puja.country}
                      latitude={puja.latitude}
                      longitude={puja.longitude}
                    />
                  ))}
                </div>
              </Reveal>
            ) : null}

            {puja.tags?.length ? (
              <Reveal>
                <div className="mt-10 flex flex-wrap gap-2">
                  {puja.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-saffron-100 bg-saffron-50/60 px-3 py-1 text-xs font-medium text-saffron-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </Reveal>
            ) : null}

            {puja.faqs?.length ? (
              <Reveal>
                <div className="mt-14">
                  <h2 className="font-display text-2xl font-bold text-ink">Frequently Asked Questions</h2>
                  <div className="mt-6 space-y-4">
                   {puja.faqs.map((faq: Faq, i: number) => (
  <details
    key={i}
    className="group rounded-xl border border-saffron-100 bg-white p-4 open:bg-saffron-50/30"
  >
    <summary className="cursor-pointer list-none font-medium text-ink">
      {faq.question}
    </summary>
    <p className="mt-2 text-sm leading-relaxed text-ink/70">{faq.answer}</p>
  </details>
))}
                  </div>
                </div>
              </Reveal>
            ) : null}

            <Reveal>
              <div className="mt-10 rounded-2xl border border-saffron-100 bg-white p-6">
                <p className="text-ink/70">
                  Available as{' '}
                  <strong>
                    {puja.serviceType === 'EPUJA'
                      ? 'an online e-puja'
                      : puja.serviceType === 'HOME_VISIT'
                      ? 'a home-visit puja'
                      : 'a home-visit puja and online e-puja'}
                  </strong>
                  . Choose your city to see this puja with local details and pricing.
                </p>
                <Link to="/#flow" className="mt-4 inline-flex items-center gap-1 font-medium text-saffron-700 hover:underline">
                  Find {puja.name} in your city <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Booking rail — ~20% */}
          <BookingRail puja={puja} />
        </div>
      </article>
    </>
  );
}