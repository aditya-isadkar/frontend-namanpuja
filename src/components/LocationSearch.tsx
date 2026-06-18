'use client';

import { Search } from 'lucide-react';

interface LocationSearchProps {
  countryOptions: string[];
  cityOptions: string[];
  query: string;
  country: string;
  city: string;
  onQuery: (v: string) => void;
  onCountry: (v: string) => void;
  onCity: (v: string) => void;
}

export function LocationSearch({
  countryOptions, cityOptions,
  query, country, city,
  onQuery, onCountry, onCity,
}: LocationSearchProps) {
  return (
    <div>
      <div className="relative mt-8 max-w-md">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search by city or country..."
          className="w-full rounded-full border border-saffron-100 bg-white py-3 pl-11 pr-4 text-sm text-ink shadow-sm outline-none transition focus:border-saffron-300 focus:ring-2 focus:ring-saffron-100"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <select
          value={country}
          onChange={(e) => onCountry(e.target.value)}
          className="rounded-full border border-saffron-100 bg-white px-4 py-2 text-sm text-ink shadow-sm outline-none focus:border-saffron-300"
        >
          <option value="">All Countries</option>
          {countryOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={city}
          onChange={(e) => onCity(e.target.value)}
          className="rounded-full border border-saffron-100 bg-white px-4 py-2 text-sm text-ink shadow-sm outline-none focus:border-saffron-300"
        >
          <option value="">All Cities</option>
          {cityOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}