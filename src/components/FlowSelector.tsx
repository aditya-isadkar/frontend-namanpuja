'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Globe2, ArrowRight, Loader2 } from 'lucide-react';
import type { City, Country } from '@/lib/types';
import { API_URL } from '@/lib/api';
import { Sparkles, Landmark, } from 'lucide-react';

export function FlowSelector({ countries }: { countries: Country[] }) {
  const router = useRouter();
  const [country, setCountry] = useState<Country | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

 async function selectCountry(c: Country) {
  setCountry(c);
  setLoading(true);
  try {
    const url = `${API_URL}/countries/${c.slug}/cities`;
    console.log('Fetching:', url);
    const res = await fetch(url);
    const data = await res.json();
    console.log('Response data:', data);
    console.log('Cities array:', data.cities);
    console.log('Cities length:', data.cities?.length);
    setCities(data.cities ?? []);
    console.log('State set to:', data.cities ?? []);
  } catch (e) {
    console.log('Fetch error:', e);
    setCities([]);
  } finally {
    setLoading(false);
  }
}

  return (
    <section id="flow" className="container-page -mt-12 pb-8 pt-36">
       <div className="w-full text-center mb-6 bg-saffron-gradient bg-clip-text text-transparent">
            <span className="badge"><Landmark className="h-3.5 w-3.5 " /> Popular Locations</span>
            <h2 className="section-title mt-4 text-center w-full block bg-saffron-gradient bg-clip-text text-transparent ">Pujas performed with devotion</h2>
            <p className="mt-3 bg-saffron-gradient bg-clip-text text-transparent">
              Authentic Vedic rituals for every occasion — at your home or online, performed by
              experienced priests.
            </p>
          </div>        
      <div className="rounded-3xl border border-saffron-100 bg-white p-6 shadow-glow sm:p-10">
        <h1 className='font-display pt-4 pb-20 text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-center bg-black bg-clip-text text-transparent'> Ancient traditions, now accessible to devotees around the globe.</h1>

        <div className="mb-8 flex items-center gap-4 text-sm font-semibold">
          <Step n={1} label="Choose Country" active={!country} done={!!country} />
          <div className="h-px flex-1 bg-saffron-100" />
          <Step n={2} label="Choose City" active={!!country} done={false} />
          <div className="h-px flex-1 bg-saffron-100" />
          <Step n={3} label="All Pujas" active={false} done={false} />
        </div>

        <AnimatePresence mode="wait">
          {!country ? (
            <motion.div
              key="countries"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-bold pt-2 pb-1">
                <Globe2 className="h-5 w-5 text-saffron-600 " /> Your Country of Accomodation 
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {countries.map((c) => (
                  <button
                    key={c.id || c.slug}
                    onClick={() => selectCountry(c)}
                    className="group flex flex-col items-start gap-2 rounded-2xl border border-saffron-100 bg-cream p-4 text-left transition-all hover:-translate-y-1 hover:border-saffron-300 hover:shadow-soft"
                  >
                    <span className="text-3xl">{c.flagEmoji ?? '🌍'}</span>
                    <span className="font-semibold">{c.name}</span>
                    {c._count?.cities ? (
                      <span className="text-xs text-ink/50">{c._count.cities} cities</span>
                    ) : null}
                  </button>
                ))}
                {countries.length === 0 && (
                  <p className="col-span-full text-sm text-ink/50">
                    Connect the API to load countries.
                  </p>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="cities"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4 flex items-center justify-between pt-2 pb-1">
                <h3 className="flex items-center gap-2 font-display text-xl font-bold">
                  <MapPin className="h-5 w-5 text-saffron-600" /> Choose your city in {country.name}
                </h3>
                <button
                  onClick={() => setCountry(null)}
                  className="text-sm font-medium text-saffron-600 hover:underline"
                >
                  ← Change country
                </button>
              </div>

              {loading ? (
                <div className="flex items-center gap-2 py-10 text-ink/50">
                  <Loader2 className="h-5 w-5 animate-spin" /> Loading cities…
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => router.push(`/city/${city.slug}`)}
                      className="group flex items-center justify-between rounded-2xl border border-saffron-100 bg-cream p-4 text-left transition-all hover:-translate-y-1 hover:border-saffron-300 hover:shadow-soft"
                    >
                      <span>
                        <span className="block font-semibold">{city.name}</span>
                        {city.state && <span className="text-xs text-ink/50">{city.state}</span>}
                      </span>
                      <ArrowRight className="h-4 w-4 text-saffron-400 transition-transform group-hover:translate-x-1" />
                    </button>
                  ))}
                  {cities.length === 0 && (
                    <p className="col-span-full text-sm text-ink/50">No cities yet for {country.name}.</p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Step({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold transition-colors ${
          active || done ? 'bg-saffron-gradient text-white' : 'bg-saffron-100 text-saffron-600'
        }`}
      >
        {n}
      </span>
      <span className={`hidden sm:inline ${active ? 'text-ink' : 'text-ink/50'}`}>{label}</span>
    </div>
  );
}
