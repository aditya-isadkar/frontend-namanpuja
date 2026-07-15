'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { PujaCard } from '@/components/PujaCard';
import type { Puja } from '@/lib/types';
import { useSearchParams } from 'next/navigation';

const serviceTypeLabel: Record<string, string> = {
  EPUJA: 'Online e-Puja',
  HOME_VISIT: 'Home Visit',
  BOTH: 'Home & Online',
};

type SortOption = 'popular' | 'alpha' | 'date';

export function PujaSearch({ pujas }: { pujas: Puja[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [deity, setDeity] = useState(searchParams.get('deity') ?? '');
  const [serviceType, setServiceType] = useState(searchParams.get('serviceType') ?? '');
  const [occasion, setOccasion] = useState(searchParams.get('category') ?? '');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState<SortOption>('popular');

  const deityOptions = useMemo(
    () => Array.from(new Set(pujas.map((p) => p.deity).filter(Boolean))) as string[],
    [pujas],
  );
  const serviceTypeOptions = useMemo(
    () => Array.from(new Set(pujas.map((p) => p.serviceType).filter(Boolean))) as string[],
    [pujas],
  );
  const occasionOptions = useMemo(
    () => Array.from(new Set(pujas.map((p) => p.category?.name).filter(Boolean))) as string[],
    [pujas],
  );

  const filtered = pujas.filter((p) => {
    const q = query.toLowerCase();
    const matchesQuery =
      p.name.toLowerCase().includes(q) ||
      (p.deity?.toLowerCase().includes(q) ?? false);

    const matchesDeity = !deity || p.deity === deity;
    const matchesServiceType = !serviceType || p.serviceType === serviceType;
    const matchesOccasion = !occasion || p.category?.name === occasion;

    return matchesQuery && matchesDeity && matchesServiceType && matchesOccasion;
  });

  const sorted = useMemo(() => {
    if (sort === 'alpha') {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
    // 'popular' and 'date' fall back to default order until those fields exist on Puja
    return filtered;
  }, [filtered, sort]);

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="relative mb-8 w-full">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search poojas by name or occasion (e.g. "housewarming", "new baby")'
          className="w-full rounded-xl border border-saffron-200 bg-[#faf5ec] py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink/40 outline-none transition focus:border-saffron-400"
        />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar filters */}
        <aside className="w-full shrink-0 rounded-2xl bg-[#faf5ec] p-5 lg:w-64">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-ink/60">Filters</h3>
          <div className="space-y-3">
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full rounded-lg border border-saffron-200 bg-white px-3 py-2 text-sm text-ink/80 outline-none focus:border-saffron-400"
            >
              <option value="">Occasion</option>
              {occasionOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full rounded-lg border border-saffron-200 bg-white px-3 py-2 text-sm text-ink/80 outline-none focus:border-saffron-400"
            >
              <option value="">Service type</option>
              {serviceTypeOptions.map((s) => (
                <option key={s} value={s}>{serviceTypeLabel[s] ?? s}</option>
              ))}
            </select>

            <select
              value={deity}
              onChange={(e) => setDeity(e.target.value)}
              className="w-full rounded-lg border border-saffron-200 bg-white px-3 py-2 text-sm text-ink/80 outline-none focus:border-saffron-400"
            >
              <option value="">Deity</option>
              {deityOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (zip code)"
              className="w-full rounded-lg border border-saffron-200 bg-white px-3 py-2 text-sm text-ink/80 placeholder:text-ink/40 outline-none focus:border-saffron-400"
            />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {/* Sort row */}
          <div className="mb-6 flex flex-wrap items-center gap-1 rounded-xl border border-saffron-100 bg-white px-4 py-3 text-sm text-ink/60">
            <span className="mr-1 font-medium text-ink/80">Sort:</span>
            <button
              onClick={() => setSort('popular')}
              className={`px-2 hover:text-saffron-700 ${sort === 'popular' ? 'font-bold text-saffron-700' : ''}`}
            >
              Most popular
            </button>
            <span className="text-ink/30">|</span>
            <button
              onClick={() => setSort('alpha')}
              className={`px-2 hover:text-saffron-700 ${sort === 'alpha' ? 'font-bold text-saffron-700' : ''}`}
            >
              Alphabetical
            </button>
            <span className="text-ink/30">|</span>
            <button
              onClick={() => setSort('date')}
              className={`px-2 hover:text-saffron-700 ${sort === 'date' ? 'font-bold text-saffron-700' : ''}`}
            >
              Nearest date
            </button>
          </div>

          {/* Puja card grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((p) => (
              <PujaCard key={p.id || p.slug} puja={p} />
            ))}
            {sorted.length === 0 && (
              <p className="text-ink/50">No pujas match your filters.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}