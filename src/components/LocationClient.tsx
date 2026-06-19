'use client';

import { useState, useMemo } from 'react';
import { LocationSearch } from './LocationSearch';
import { CountryCard } from './CountryCard';
import type { City, Country } from '@/lib/types';

interface CountryWithCities extends Country {
  cities: City[];
}

export function LocationsClient({ countries }: { countries: CountryWithCities[] }) {
  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const countryOptions = useMemo(() => countries.map((c) => c.name), [countries]);

  const cityOptions = useMemo(
    () =>
      Array.from(
        new Set(
          countries
            .filter((c) => !selectedCountry || c.name === selectedCountry)
            .flatMap((c) => c.cities.map((city) => city.name)),
        ),
      ),
    [countries, selectedCountry],
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return countries
      .filter((c) => !selectedCountry || c.name === selectedCountry)
      .map((c) => ({
        ...c,
        cities: c.cities.filter((city) => {
          const matchesQuery =
            !q || city.name.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
          const matchesCity = !selectedCity || city.name === selectedCity;
          return matchesQuery && matchesCity;
        }),
      }))
.filter((c) => c.cities.length > 0 || (!q && !selectedCity));  }, [countries, query, selectedCountry, selectedCity]);

  return (
    <>
      <LocationSearch
        countryOptions={countryOptions}
        cityOptions={cityOptions}
        query={query}
        country={selectedCountry}
        city={selectedCity}
        onQuery={setQuery}
        onCountry={setSelectedCountry}
        onCity={setSelectedCity}
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((country) => (
          <CountryCard key={country.id} country={country} cities={country.cities} />
        ))}
        {filtered.length === 0 && (
          <p className="text-ink/50">No results match your filters.</p>
        )}
      </div>
    </>
  );
}