import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Flame, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { getPuja, getPujas } from '@/lib/api';
import { Reveal } from '@/components/motion';
import { PujaCard } from '@/components/PujaCard';
import { PujaSearch } from '@/components/PujaSearch';





export default async function page() {

 const pujas = await getPujas();

    return (
        <section id="pujas">
            <div className="container-page">
                <Reveal>
                    <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Explore Pujas for Every Need</h2>
                </Reveal>
                <Reveal className="mt-4 max-w-2xl text-lg text-ink/70">
                    Browse pujas by category or look for pujas in specific cities.
                </Reveal>
                <div className="search_filter">
                    <div className="both">
                        <div className="search"> <PujaSearch pujas={pujas} />
                        </div>
                        <div className="filter"></div>
                        <div className="filter"></div>
                        <div className="filter"></div>
                    </div>
                </div>
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pujas.map((p) => (
            <PujaCard key={p.id || p.slug} puja={p} />
          ))}
          {pujas.length === 0 && (
            <p className="text-ink/50">No pujas found.</p>
          )}
        </div>
            </div>
        </section>
    )
}