import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Flame, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { getPuja, getPujas } from '@/lib/api';
import { Reveal } from '@/components/motion';
import { PujaCard } from '@/components/PujaCard';
import { PujaSearch } from '@/components/PujaSearch';
import { Tangerine } from 'next/font/google';

const tangerine = Tangerine({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-tangerine',
});

export default async function page() {

 const pujas = await getPujas();
 

    return (
        <section id="pujas" className={tangerine.variable}>
            <div className="container-page">
                
                {/* Heading */}
                <div className="text-center mb-12 mt-20">
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4 italic">
                        Sacred Pujas Worldwide
                    </h1>
                    <p className="max-w-4xl mx-auto mt-6" style={{
                        fontFamily: 'var(--font-tangerine)',
                        fontSize: '75px',
                        fontWeight: 800,
                        color: '#e0763f',
                        lineHeight: 1.2
                    } as React.CSSProperties}>
                        Explore sacred pujas, seek blessings, and book authentic Vedic rituals across the world.
                    </p>
                </div>

                {/* Search + Filters on same line, centered */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    <PujaSearch pujas={pujas} />
                </div>

                {/* Cards */}
              
            </div>
        </section>
    )
}