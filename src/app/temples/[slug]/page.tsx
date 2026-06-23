import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Landmark, Clock, MapPin, Sparkles, ChevronRight } from 'lucide-react';
import { getTemple, getTemples } from '@/lib/api';
import { Reveal } from '@/components/motion';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const temples = await getTemples();
  return temples.map((t) => ({ slug: t.slug }));
}

export const revalidate = 600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const t = await getTemple(params.slug);
    return {
      title: `${t.name}${t.city ? ', ' + t.city.name : ''} | Timings, History & Significance`,
      description: t.shortDesc,
    };
  } catch {
    return { title: 'Temple not found' };
  }
}

export default async function TemplePage({ params }: Props) {
  let t;
  try {
    t = await getTemple(params.slug);
  } catch {
    notFound();
  }

  return (
    <>
      <section className="bg-saffron-radial">
        <div className="container-page py-16">
          <nav className="mb-4 flex items-center gap-1 text-sm text-ink/50">
            <Link href="/" className="hover:text-saffron-600">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            {t.city && (
              <>
                <Link href={`/city/${t.city.slug}`} className="hover:text-saffron-600">{t.city.name}</Link>
                <ChevronRight className="h-3.5 w-3.5" />
              </>
            )}
            <span className="text-ink">{t.name}</span>
          </nav>
          <Reveal>
            <span className="badge"><Landmark className="h-3.5 w-3.5" /> {t.deity}</span>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              {t.name}
            </h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink/60">
              {t.city && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {t.city.name}, {t.city.state}</span>}
              {t.timings && <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {t.timings}</span>}
            </div>
          </Reveal>
        </div>
      </section>

      <article className="container-page prose-puja max-w-3xl py-16">
        {t.description && <Reveal><p className="text-lg leading-relaxed text-ink/80">{t.description}</p></Reveal>}
        {t.significance && (
          <Reveal>
            <h2 className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-saffron-600" /> Significance</h2>
            <p>{t.significance}</p>
          </Reveal>
        )}
        {t.history && (
          <Reveal>
            <h2>History</h2>
            <p>{t.history}</p>
          </Reveal>
        )}

        {t.city && (
          <Reveal>
            <div className="mt-10 rounded-2xl bg-saffron-gradient p-8 text-white">
              <h3 className="font-display text-xl font-bold">Planning a puja in {t.city.name}?</h3>
              <p className="mt-2 text-white/90">
                Book authentic Vedic pujas with experienced priests near {t.name}.
              </p>
              <Link href={`/city/${t.city.slug}`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 font-semibold text-saffron-700">
                View pujas in {t.city.name} <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        )}
      </article>
    </>
  );
}