import { useEffect, useState } from 'react';
import { getCountries, getCountryCities } from '@/lib/api';
import { Reveal } from '@/components/motion';
import { LocationsClient } from '@/components/LocationClient';
import { SEOMetadata } from '@/components/SEOMetadata';
import type { Country } from '@/lib/types';

// Tangerine font is loaded via a <link> tag (see index.html) instead of
// next/font/google, which has no Vite equivalent. Make sure index.html
// includes:
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
// <link href="https://fonts.googleapis.com/css2?family=Tangerine:wght@400;700&display=swap" rel="stylesheet">

type CountryWithCities = Country & { cities: Awaited<ReturnType<typeof getCountryCities>>['cities'] };

export default function LocationsPage() {
  const [countriesWithCities, setCountriesWithCities] = useState<CountryWithCities[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const countries = await getCountries();
      const withCities = await Promise.all(
        countries.map(async (country) => {
          const { cities } = await getCountryCities(country.slug);
          console.log(country.name, '→', cities.length, 'cities');
          return { ...country, cities };
        })
      );
      if (!cancelled) {
        setCountriesWithCities(withCities);
        setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="locations">
      <SEOMetadata
        title="Global Puja Locations — Naman Puja"
        description="Connecting devotees across the globe through sacred Vedic rituals. Find experienced priests and authentic puja services in your country and city."
      />
      <div className="container-page py-16">
        <div className="text-center mb-12 mt-20">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4 italic">
            Connecting Devotees Across the Globe Through Sacred Rituals
          </h1>
          <p
            className="max-w-4xl mx-auto mt-6"
            style={{
              fontFamily: "'Tangerine', cursive",
              fontSize: '75px',
              fontWeight: 800,
              color: '#e0763f',
              lineHeight: 1.2,
            }}
          >
            Serving Devotees with Authentic Rituals Across the World
          </p>
        </div>
        {loading ? (
          <p className="py-16 text-center text-sm text-ink/50">Loading locations...</p>
        ) : (
          <LocationsClient countries={countriesWithCities} />
        )}
      </div>
    </section>
  );
}
