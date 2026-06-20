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

export function PujaSearch({ pujas }: { pujas: Puja[] }) {
 const searchParams = useSearchParams();
const [query, setQuery] = useState('');
const [deity, setDeity] = useState(searchParams.get('deity') ?? '');
const [serviceType, setServiceType] = useState(searchParams.get('serviceType') ?? '');
const [category, setCategory] = useState(searchParams.get('category') ?? '');
  const deityOptions = useMemo(
    () => Array.from(new Set(pujas.map((p) => p.deity).filter(Boolean))) as string[],
    [pujas],
  );
  const serviceTypeOptions = useMemo(
    () => Array.from(new Set(pujas.map((p) => p.serviceType).filter(Boolean))) as string[],
    [pujas],
  );
  const categoryOptions = useMemo(
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
    const matchesCategory = !category || p.category?.name === category;

    return matchesQuery && matchesDeity && matchesServiceType && matchesCategory;
  });

  return (
    <div className="w-full">

      <div className="flex flex-col items-center gap-4">

        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by puja name or deity..."
            className="w-full rounded-full border border-saffron-100 bg-white py-3 pl-11 pr-4 text-sm text-ink shadow-sm outline-none transition focus:border-saffron-300 focus:ring-2 focus:ring-saffron-100"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <select
            value={deity}
            onChange={(e) => setDeity(e.target.value)}
            className="rounded-full border border-saffron-100 bg-white px-4 py-2 text-sm text-ink shadow-sm outline-none focus:border-saffron-300"
          >
            <option value="">All Deities</option>
            {deityOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="rounded-full border border-saffron-100 bg-white px-4 py-2 text-sm text-ink shadow-sm outline-none focus:border-saffron-300"
          >
            <option value="">All Service Types</option>
            {serviceTypeOptions.map((s) => (
              <option key={s} value={s}>{serviceTypeLabel[s] ?? s}</option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-full border border-saffron-100 bg-white px-4 py-2 text-sm text-ink shadow-sm outline-none focus:border-saffron-300"
          >
            <option value="">All Categories</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <PujaCard key={p.id || p.slug} puja={p} />
        ))}
        {filtered.length === 0 && (
          <p className="text-ink/50">No pujas match your filters.</p>
        )}
      </div>
    </div>
  );
}