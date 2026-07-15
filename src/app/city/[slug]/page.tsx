import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, ArrowRight, Flame } from 'lucide-react';
import { getCity, getPujas } from '@/lib/api';
import { pujaLocationSlug } from '@/lib/slug';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await getCity(params.slug);
  if (!city?.id) return { title: 'City not found' };
  return {
    title: `Book Pujas in ${city.name}${city.state ? ', ' + city.state : ''}`,
    description: `Book authentic Vedic pujas in ${city.name} with experienced priests — at home or online. Explore all available pujas and temples.`,
  };
}

export default async function CityPage({ params }: Props) {
  const { city, locations, temples } = await getCity(params.slug);
  if (!city?.id) notFound();

  // Determine if this is an Oman or UAE city to decide if we should fallback mock other pujas
  const isOman =
    city.country?.name.toLowerCase() === 'oman' || city.country?.slug === 'oman';
  const isUAE =
    city.country?.name.toLowerCase() === 'united arab emirates' ||
    city.country?.name.toLowerCase() === 'uae' ||
    city.country?.slug === 'united-arab-emirates' ||
    city.country?.slug === 'uae';

  let displayLocations = [...locations];

  if (isOman || isUAE) {
    const allPujas = await getPujas();
    const dbPujaIds = new Set(locations.map((loc) => loc.puja?.id).filter(Boolean));

    for (const puja of allPujas) {
      if (!dbPujaIds.has(puja.id)) {
        // Generate mock PujaLocation exactly like India city slug system
        const slug = pujaLocationSlug(puja.name, city.name, city.state);
        displayLocations.push({
          id: `mock-${puja.id}-${city.id}`,
          slug,
          h1: `${puja.name} in ${city.name}`,
          pujaId: puja.id,
          cityId: city.id,
          puja,
          city,
          published: true,
        } as any);
      }
    }
  }

  // Sort them so featured ones are on top, just like backend
  displayLocations.sort(
    (a, b) =>
      (b.puja?.isFeatured ? 1 : 0) - (a.puja?.isFeatured ? 1 : 0) ||
      (a.puja?.sortOrder ?? 0) - (b.puja?.sortOrder ?? 0),
  );

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-saffron-radial">
        <div className="container-page py-16">
          <Reveal>
            <nav className="mb-4 flex items-center gap-2 text-sm text-ink/50 pt-20">
              <Link href="/" className="hover:text-saffron-600">Home</Link>
              <span>/</span>
              {city.country && <span>{city.country.name}</span>}
              <span>/</span>
              <span className="text-ink">{city.name}</span>
            </nav>
            <span className="badge">
              <MapPin className="h-3.5 w-3.5" />{' '}
              {city.state ?? city.country?.name}
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Pujas in {city.name}
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-ink/70">
              Choose from authentic Vedic pujas performed by experienced priests in {city.name} —
              at your home or online as an e-puja.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Puja grid ────────────────────────────────────────────────── */}
      <section className="container-page py-16">
        <h2 className="section-title mb-8">All pujas available</h2>

        <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayLocations.map((loc) => (
            <StaggerItem key={loc.id}>
              <Link href={`/locations/${loc.slug}`} className="card group flex h-full flex-col">
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-saffron-gradient text-white">
                    <Flame className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{loc.puja?.name}</h3>
                {loc.puja?.deity && (
                  <p className="mt-1 text-sm text-saffron-700">{loc.puja.deity}</p>
                )}
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/60">
                  {loc.puja?.shortDesc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-saffron-600">
                  View details &amp; book{' '}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </StaggerItem>
          ))}

          {displayLocations.length === 0 && (
            <p className="text-ink/50">No pujas configured for {city.name} yet.</p>
          )}
        </StaggerGroup>
      </section>
    </>
  );
}
