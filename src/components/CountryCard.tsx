'use client';

import { useState } from 'react';
import {Link} from 'react-router-dom';
import { ChevronDown, Globe2, ArrowRight, MapPin } from 'lucide-react';
import type { Country, City } from '@/lib/types';

export function CountryCard({
  country,
  cities = [],
  href,
}: {
  country: Country;
  cities?: City[];
  href?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const cityCount = country._count?.cities ?? cities.length;

  return (
    <div className="rounded-3xl border border-saffron-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <button
  type="button"
  onClick={() => setIsOpen((prev) => !prev)}
  className="group flex items-center gap-3 text-left"
>
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-saffron-gradient text-white text-2xl">
            {country.flagEmoji ?? <Globe2 className="h-6 w-6" />}
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight transition group-hover:text-saffron-600">
              {country.name}
            </h2>
            <p className="flex items-center gap-1 text-sm text-ink/60">
              <MapPin className="h-3.5 w-3.5" />
              {cityCount > 0
                ? `${cityCount} ${cityCount === 1 ? 'city' : 'cities'} available`
                : 'Explore cities'}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {country.isoCode && <span className="badge">{country.isoCode}</span>}

        

          
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Hide cities' : 'Show cities'}
              className="grid h-9 w-9 place-items-center rounded-full border border-saffron-100 text-ink/60 transition hover:border-saffron-300 hover:text-saffron-600"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
        
        </div>
      </div>

      {isOpen && (
  <div className="mt-5 flex flex-wrap gap-3 border-t border-saffron-100 pt-5">
    {cities.length > 0 ? (
      cities.map((city) => (
        <Link
          key={city.id || city.slug}
          to={`/city/${city.slug}`}
          className="group flex items-center gap-1.5 rounded-full border border-saffron-100 bg-saffron-50/50 px-4 py-2 text-sm font-medium text-ink/70 transition hover:border-saffron-300 hover:bg-saffron-gradient hover:text-white"
        >
          <MapPin className="h-3.5 w-3.5" />
          {city.name}
        </Link>
      ))
    ) : (
      <p className="text-sm text-ink/40">No cities available.</p>  // 👈 empty state
    )}
  </div>
)}
    </div>
  );
}