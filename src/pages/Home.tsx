import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getCountries, getPujas, getTemples } from '@/lib/api';
import type { Country, Puja, Temple } from '@/lib/types';
import { Hero } from '@/components/Hero';
import { FlowSelector } from '@/components/FlowSelector';
import { HowItWorks } from '@/components/HowItWorks';
import { PujaCard } from '@/components/PujaCard';
import { StaggerGroup, StaggerItem } from '@/components/motion';
import { PujaSection } from '@/components/PujaSection';

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [_temples, setTemples] = useState<Temple[]>([]);

  useEffect(() => {
    getCountries().then(setCountries);
    getPujas().then(setPujas);
    getTemples().then(setTemples);
  }, []);

    const featuredPujas = pujas.filter((p) => p.isFeatured);
  const pujaList = featuredPujas.length >= 6
    ? featuredPujas.slice(0, 6)
    : [...featuredPujas, ...pujas.filter((p) => !p.isFeatured)].slice(0, 6);

  return (
    <>
      <Hero />
      <FlowSelector countries={countries} />
      <PujaSection />

      {/* Featured pujas */}
      <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-yellow-400">
        <section id="pujas" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
            <div className="w-full text-center">
              <span className="badge"><Sparkles className="h-3.5 w-3.5" /> Popular ceremonies</span>
              <h2 className="section-title mt-4 text-center w-full block text-white">Pujas performed with devotion</h2>
              <p className="mt-3 text-ink/60 text-white">
                Authentic Vedic rituals for every occasion — at your home or online, performed by experienced priests.
              </p>
            </div>
            <Link to="/pujas/mainpuja" className="btn-ghost shrink-0">
              View all pujas <ArrowRight className="h-4 w-4" />
            </Link>
            
          </div>
          
          <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pujaList.map((p) => (
              <StaggerItem key={p.id || p.slug}>
                <PujaCard puja={p} />
              </StaggerItem>
            ))}
            {pujaList.length === 0 && (
              <p className="text-ink/50">Connect the API to load the puja catalog.</p>
            )}
          </StaggerGroup>
        </section>
      </div>

      <HowItWorks />

      {/* CTA */}
      <section className="container-page py-20">
        <div className="overflow-hidden rounded-3xl bg-saffron-gradient px-8 py-14 text-center text-white shadow-glow sm:px-16">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            Honor Tradition. Celebrate Family. Receive Divine Blessings.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/90">
            Book authentic Vedic pujas with experienced priests and create a meaningful spiritual experience for your family — wherever you are.
          </p>
          <Link
            to="/book"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-semibold text-saffron-700 transition-transform hover:scale-105"
          >
            Discover Puja Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
