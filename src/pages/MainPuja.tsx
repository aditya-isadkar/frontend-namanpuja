import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Flame, Clock } from 'lucide-react';
import { getPujas } from '@/lib/api';
import { Reveal } from '@/components/motion';
import { PujaSearch } from '@/components/PujaSearch';
import type { Puja } from '@/lib/types';

export default function MainPuja() {
  const [searchParams] = useSearchParams();
  const [allPujas, setAllPujas] = useState<Puja[]>([]);
  const [loading, setLoading] = useState(true);

  const q = searchParams.get('q')?.toLowerCase().trim() ?? '';

  useEffect(() => {
    document.title = 'All Poojas';

    let cancelled = false;
    setLoading(true);
    getPujas()
      .then((data) => {
        if (!cancelled) setAllPujas(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const pujas = q
    ? allPujas.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
p.deity?.toLowerCase().includes(q) ||       
   p.subtitle?.toLowerCase().includes(q)
      )
    : allPujas;

  return (
    <div className="container-page py-28">
      {/* Search bar */}

      <Reveal>
        <form className="relative mb-8">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            name="q"
            defaultValue={searchParams.get('q') ?? ''}
            placeholder='Search poojas by name or occasion (e.g. "housewarming", "new baby")'
            className="w-full rounded-xl border border-saffron-200 bg-[#faf5ec] py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink/40 focus:border-saffron-400 focus:outline-none"
          />
        </form>
      </Reveal>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar filters */}
        <aside className="w-full shrink-0 rounded-2xl bg-[#faf5ec] p-5 lg:w-64">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-ink/60">Filters</h3>
          <div className="space-y-3">
            <select className="w-full rounded-lg border border-saffron-200 bg-white px-3 py-2 text-sm text-ink/80 focus:border-saffron-400 focus:outline-none">
              <option value="">Occasion</option>
              <option>Housewarming</option>
              <option>Wedding</option>
              <option>Birthday</option>
              <option>New baby</option>
              <option>Festival</option>
            </select>
            <select className="w-full rounded-lg border border-saffron-200 bg-white px-3 py-2 text-sm text-ink/80 focus:border-saffron-400 focus:outline-none">
              <option value="">Service type</option>
              <option>At home</option>
              <option>At temple</option>
              <option>Either</option>
            </select>
            <select className="w-full rounded-lg border border-saffron-200 bg-white px-3 py-2 text-sm text-ink/80 focus:border-saffron-400 focus:outline-none">
              <option value="">Deity</option>
              <option>Ganesha</option>
              <option>Vishnu</option>
              <option>Lakshmi</option>
              <option>Shiva</option>
              <option>Navagraha</option>
            </select>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {/* Sort row */}
          <div className="mb-6 flex flex-wrap items-center gap-1 rounded-xl border border-saffron-100 bg-white px-4 py-3 text-sm text-ink/60">
            <span className="mr-1 font-medium text-ink/80">Sort:</span>
            <Link to="?sort=popular" className="px-2 hover:text-saffron-700">Most popular</Link>
            <span className="text-ink/30">|</span>
            <Link to="?sort=alpha" className="px-2 hover:text-saffron-700">Alphabetical</Link>
            <span className="text-ink/30">|</span>
            <Link to="?sort=date" className="px-2 hover:text-saffron-700">Nearest date</Link>
          </div>

          {loading && (
            <p className="py-16 text-center text-sm text-ink/50">Loading poojas...</p>
          )}

          {/* Flat puja card grid */}
          {!loading && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pujas.map((p) => (
                <Reveal key={p.id}>
                  <Link
                    to={`/pujas/${p.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-saffron-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-saffron-100">
                      <Flame className="h-5 w-5 text-saffron-600" />
                    </div>
                    <h3 className="font-display text-base font-bold text-ink">{p.name}</h3>
                    {p.subtitle && (
                      <p className="mt-1 line-clamp-2 text-sm text-ink/60">{p.subtitle}</p>
                    )}
                    {p.durationMin && (
                      <span className="mt-2 flex items-center gap-1 text-xs text-ink/50">
                        <Clock className="h-3.5 w-3.5" /> {Math.round(p.durationMin / 60)}h+ ceremony
                      </span>
                    )}
                    <span className="mt-4 inline-flex w-fit items-center rounded-full bg-[#5c1a2b] px-4 py-2 text-xs font-bold text-white transition-colors group-hover:bg-[#4a1522]">
                      Book {p.name}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}

          {!loading && pujas.length === 0 && (
            <p className="py-16 text-center text-sm text-ink/50">
              No poojas match your search. Try a different term.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
