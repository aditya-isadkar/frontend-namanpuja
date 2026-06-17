import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Landmark, MapPin, ArrowRight, Flame } from 'lucide-react';
import { getCity } from '@/lib/api';
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

  return (
    <>
      <section className="bg-saffron-radial">
        <div className="container-page py-16">
          <Reveal>
            <nav className="mb-4 flex items-center gap-2 text-sm text-ink/50">
              <Link href="/" className="hover:text-saffron-600">Home</Link>
              <span>/</span>
              {city.country && <span>{city.country.name}</span>}
              <span>/</span>
              <span className="text-ink">{city.name}</span>
            </nav>
            <span className="badge"><MapPin className="h-3.5 w-3.5" /> {city.state}</span>
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

      <section className="container-page py-16">
        <h2 className="section-title mb-8">All pujas available</h2>
        <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc) => (
            <StaggerItem key={loc.id}>
              <Link href={`/locations/${loc.slug}`} className="card group flex h-full flex-col">
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-saffron-gradient text-white">
                    <Flame className="h-5 w-5" />
                  </span>
                  
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{loc.puja?.name}</h3>
                {loc.puja?.deity && <p className="mt-1 text-sm text-saffron-700">{loc.puja.deity}</p>}
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
          {locations.length === 0 && (
            <p className="text-ink/50">No pujas configured for {city.name} yet.</p>
          )}
        </StaggerGroup>
      </section>

      
    </>
  );
}
