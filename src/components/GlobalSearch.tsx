'use client';

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Globe2, MapPin, Flame, Sparkles } from 'lucide-react';
import type { Country, City, Puja } from '@/lib/types';

interface GlobalSearchProps {
  countries: Country[];
  cities: City[];
  pujas: Puja[];
}

export function GlobalSearch({ countries, cities, pujas }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
const navigate = useNavigate();
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const q = query.toLowerCase().trim();

  const matchedCountries = q
    ? countries.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const matchedCities = q
    ? cities.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 4)
    : [];

  const matchedDeities = q
    ? Array.from(
        new Set(pujas.map((p) => p.deity).filter(Boolean) as string[]),
      ).filter((d) => d.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const matchedCategories = q
    ? Array.from(
        new Set(pujas.map((p) => p.category?.name).filter(Boolean) as string[]),
      ).filter((c) => c.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const hasResults =
    matchedCountries.length > 0 ||
    matchedCities.length > 0 ||
    matchedDeities.length > 0 ||
    matchedCategories.length > 0;

  function handleSelect(href: string) {
    setQuery('');
    setOpen(false);
    navigate(href);
  }

  return (
<div ref={ref} className="relative w-full" style={{ isolation: 'isolate' }}>      {/* Input */}
      <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white shadow-sm">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search city, package, and pooja..."
          className="flex-1 px-5 py-2.5 text-sm text-gray-600 placeholder-gray-400 outline-none bg-transparent"
        />
        <button className="m-1 h-9 w-9 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors">
          <Search className="h-4 w-4" />
        </button>
      </div>

      {/* Dropdown */}
      {open && q && (
<div className="absolute top-full left-0 right-0 z-[9999] mt-2 max-h-96 overflow-y-auto rounded-2xl border border-saffron-100 bg-white shadow-xl">          {!hasResults && (
            <p className="px-5 py-4 text-sm text-ink/50">No results found for "{query}"</p>
          )}

          {/* Countries */}
          {matchedCountries.length > 0 && (
            <div>
              <p className="px-5 pt-4 pb-1 text-xs font-semibold uppercase tracking-widest text-ink/40">
                Countries
              </p>
              {matchedCountries.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelect('/MainLocation')}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition hover:bg-saffron-50"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-saffron-gradient text-white text-base">
                    {c.flagEmoji ?? <Globe2 className="h-4 w-4" />}
                  </span>
                  <span className="font-medium">{c.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Cities */}
          {matchedCities.length > 0 && (
            <div>
              <p className="px-5 pt-4 pb-1 text-xs font-semibold uppercase tracking-widest text-ink/40">
                Cities
              </p>
              {matchedCities.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelect(`/city/${c.slug}`)}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition hover:bg-saffron-50"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-saffron-50 text-saffron-600">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="font-medium">{c.name}</span>
                    {c.country?.name && (
                      <span className="ml-2 text-xs text-ink/40">{c.country.name}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Deities */}
          {matchedDeities.length > 0 && (
            <div>
              <p className="px-5 pt-4 pb-1 text-xs font-semibold uppercase tracking-widest text-ink/40">
                Deities
              </p>
              {matchedDeities.map((d) => (
                <button
                  key={d}
                  onClick={() => handleSelect(`/pujas/MainPuja?deity=${encodeURIComponent(d)}`)}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition hover:bg-saffron-50"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-saffron-50 text-saffron-600">
                    <Flame className="h-4 w-4" />
                  </span>
                  <span className="font-medium">{d}</span>
                </button>
              ))}
            </div>
          )}

          {/* Categories */}
          {matchedCategories.length > 0 && (
            <div className="pb-2">
              <p className="px-5 pt-4 pb-1 text-xs font-semibold uppercase tracking-widest text-ink/40">
                Categories
              </p>
              {matchedCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => handleSelect(`/pujas/MainPuja?category=${encodeURIComponent(c)}`)}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition hover:bg-saffron-50"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-saffron-50 text-saffron-600">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span className="font-medium">{c}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}