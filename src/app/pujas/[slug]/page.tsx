import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Flame, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { getPuja, getPujas } from '@/lib/api';
import { Reveal } from '@/components/motion';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const pujas = await getPujas();
  return pujas.map((p) => ({ slug: p.slug }));
}

export const revalidate = 600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const p = await getPuja(params.slug);
    return { title: p.name, description: p.shortDesc ?? p.subtitle };
  } catch {
    return { title: 'Puja not found' };
  }
}

export default async function PujaPage({ params }: Props) {
  let p;
  try {
    p = await getPuja(params.slug);
  } catch {
    notFound();
  }

  return (
    <>
      <section className="bg-saffron-radial">
        <div className="container-page py-16">
          <Reveal>
            <span className="badge"><Sparkles className="h-3.5 w-3.5" /> {p.deity}</span>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              {p.name}
            </h1>
            {p.subtitle && <p className="mt-4 max-w-2xl text-lg text-ink/70">{p.subtitle}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href={`/book?puja=${p.id}`} className="btn-primary">
                Book {p.name} <Flame className="h-4 w-4" />
              </Link>
              {p.durationMin && (
                <span className="flex items-center gap-1 text-sm text-ink/60">
                  <Clock className="h-4 w-4" /> {Math.round(p.durationMin / 60)}h+ ceremony
                </span>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <article className="container-page prose-puja max-w-3xl py-16">
        {p.description && <Reveal><p className="text-lg leading-relaxed text-ink/80">{p.description}</p></Reveal>}
        <Reveal>
          <div className="mt-10 rounded-2xl border border-saffron-100 bg-white p-6">
            <p className="text-ink/70">
              Available as{' '}
              <strong>
                {p.serviceType === 'EPUJA'
                  ? 'an online e-puja'
                  : p.serviceType === 'HOME_VISIT'
                    ? 'a home-visit puja'
                    : 'a home-visit puja and online e-puja'}
              </strong>
              . Choose your city to see this puja with local details and pricing.
            </p>
            <Link href="/#flow" className="mt-4 inline-flex items-center gap-1 font-medium text-saffron-700 hover:underline">
              Find {p.name} in your city <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </article>
    </>
  );
}
