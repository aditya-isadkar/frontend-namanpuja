import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Flame } from 'lucide-react';
import { getCity, getPujas } from '@/lib/api';
import type { City, PujaLocation } from '@/lib/types';
import { pujaLocationSlug } from '@/lib/slug';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion';
import { SEOMetadata } from '@/components/SEOMetadata';

export default function CityDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [city, setCity] = useState<City | null>(null);
  const [displayLocations, setDisplayLocations] = useState<PujaLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    getCity(slug).then(async ({ city: fetchedCity, locations }) => {
      if (!fetchedCity?.id) {
        navigate('/404', { replace: true });
        return;
      }

      setCity(fetchedCity);
      document.title = `Book Pujas in ${fetchedCity.name} | Naman Puja`;

      let locs = [...locations];

      // For any puja that doesn't have a PujaLocation record in this city,
      // generate a mock card so the city page always lists every puja.
      const allPujas = await getPujas();
      const dbPujaIds = new Set(locations.map((l) => l.puja?.id).filter(Boolean));
      for (const puja of allPujas) {
        if (!dbPujaIds.has(puja.id)) {
          const mockSlug = pujaLocationSlug(puja.name, fetchedCity.name, fetchedCity.state);
          locs.push({
            id: `mock-${puja.id}-${fetchedCity.id}`,
            slug: mockSlug,
            h1: `${puja.name} in ${fetchedCity.name}`,
            pujaId: puja.id,
            cityId: fetchedCity.id,
            puja,
            city: fetchedCity,
            published: true,
          } as any);
        }
      }

      locs.sort(
        (a, b) =>
          (b.puja?.isFeatured ? 1 : 0) - (a.puja?.isFeatured ? 1 : 0) ||
          (a.puja?.sortOrder ?? 0) - (b.puja?.sortOrder ?? 0)
      );

      setDisplayLocations(locs);
      setLoading(false);
    });
  }, [slug, navigate]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-ink/50">Loading...</p></div>;
  }

  if (!city) return null;

  return (
    <>
      <SEOMetadata
        title={`Book Pujas in ${city.name}`}
        description={`Book authentic Vedic pujas with experienced priests in ${city.name}${city.state ? `, ${city.state}` : ''}. Custom samagri, flexible timings, and home or online pujas available.`}
      />
      <section className="bg-saffron-radial">
        <div className="container-page py-16">
          <Reveal>
            <nav className="mb-4 flex items-center gap-2 text-sm text-ink/50 pt-20">
              <Link to="/" className="hover:text-saffron-600">Home</Link>
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
              Choose from authentic Vedic pujas performed by experienced priests in {city.name} — at your home or online as an e-puja.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="section-title mb-8">All pujas available</h2>

        <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayLocations.map((loc) => (
            <StaggerItem key={loc.id}>
              <Link to={`/locations/${loc.slug}`} state={{ pujaSlug: loc.puja?.slug }} className="card group flex h-full flex-col">
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
