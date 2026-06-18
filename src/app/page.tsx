import Link from 'next/link';
import { Sparkles, Landmark, ArrowRight } from 'lucide-react';
import { getCountries, getPujas, getTemples } from '@/lib/api';
import { Hero } from '@/components/Hero';
import { FlowSelector } from '@/components/FlowSelector';
import { HowItWorks } from '@/components/HowItWorks';
import { PujaCard } from '@/components/PujaCard';
import { SlideImg } from '@/components/SlideImg';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion';
import { PujaSection } from '../components/PujaSection';
// import MainPuja  from '@/app/pujas/MainPuja/page'

export const revalidate = 300;

export default async function HomePage() {
  const [countries, pujas, temples] = await Promise.all([
    getCountries(),
    getPujas(),
    getTemples(),
    
  ]);

  const featuredPujas = pujas.filter((p) => p.isFeatured).slice(0, 6);
  const pujaList = featuredPujas.length ? featuredPujas : pujas.slice(0, 6);
  const featuredTemples = temples.slice(0, 6);

  return (
    <>  <Hero />
   
    
      
      <FlowSelector countries={countries} />
 <PujaSection/>
      {/* Featured pujas */}
      <div   className='rounded-3xl bg-gradient-to-r from-orange-500 to-yellow-400 '>
      <section id="pujas" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 ">
        <div className="flex flex-col  items-center justify-between gap-4 sm:flex-row sm:items-end">
          <div className="w-full text-center">
            <span className="badge"><Sparkles className="h-3.5 w-3.5 " /> Popular ceremonies</span>
            <h2 className="section-title mt-4 text-center w-full block text-white">Pujas performed with devotion</h2>
            <p className="mt-3 text-ink/60 text-white">
              Authentic Vedic rituals for every occasion — at your home or online, performed by
              experienced priests.
            </p>
          </div>
          <Link href="/pujas/MainPuja" className="btn-ghost shrink-0">
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
      </section></div>

      <HowItWorks />

      {/* Temples */}
      {/* <section id="temples" className="bg-saffron-radial py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="badge"><Landmark className="h-3.5 w-3.5" /> Sacred destinations</span>
            <h2 className="section-title mt-4">Major temples of North India</h2>
            <p className="mt-3 text-ink/60">
              Explore the spiritual heritage of India&apos;s holiest cities and their flagship temples.
            </p>
          </div>

          <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTemples.map((t) => (
              <StaggerItem key={t.id || t.slug}>
                <Link href={`/temples/${t.slug}`} className="card group block h-full">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-saffron-50 text-saffron-600">
                      <Landmark className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display font-bold leading-tight">{t.name}</h3>
                      {t.city && <p className="text-xs text-ink/50">{t.city.name}</p>}
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/60">{t.shortDesc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-saffron-600">
                    Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
            {featuredTemples.length === 0 && (
              <p className="text-ink/50">Connect the API to load temples.</p>
            )}
          </StaggerGroup>
        </div>
      </section> */}

      {/* CTA */}
      <section className="container-page py-20 ">
        <div className="overflow-hidden rounded-3xl bg-saffron-gradient px-8 py-14 text-center text-white shadow-glow sm:px-16">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            Honor Tradition. Celebrate Family. Receive Divine Blessings.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/90">
            Book authentic Vedic pujas with experienced priests and create a meaningful spiritual
            experience for your family — wherever you are.
          </p>
          <Link
            href="/book"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-semibold text-saffron-700 transition-transform hover:scale-105"
          >
            Discover Puja Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
