import type { Metadata } from 'next';
import { getPujas } from '@/lib/api';
import { BookingForm } from '@/components/BookingForm';
import { Reveal } from '@/components/motion';

export const metadata: Metadata = {
  title: 'Book a Puja',
  description:
    'Book an authentic Vedic puja with experienced priests — home visit or online e-puja. Quick, simple, and personalised.',
};

export const revalidate = 300;

export default async function BookPage({
  searchParams,
}: {
  searchParams: { puja?: string; city?: string };
}) {
  const pujas = await getPujas();
  return (
    <section className="bg-saffron-radial mt-12">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_1.1fr]">
        <Reveal className="lg:sticky lg:top-24 lg:h-fit">
          <span className="badge">Book in minutes</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Book your Puja
          </h1>
          <p className="mt-4 max-w-md text-lg text-ink/70">
            Tell us a few details and our team will confirm your booking. Choose a home-visit puja
            or an online e-puja — performed by experienced Vedic priests with complete devotion.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-ink/70">
            {[
              'Experienced, verified Vedic priests',
              'Authentic rituals & complete samagri guidance',
              'Flexible scheduling for any occasion',
              'Serving families across India & abroad',
            ].map((b) => (
              <li key={b} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" /> {b}
              </li>
            ))}
          </ul>
        </Reveal>

        <BookingForm pujas={pujas} defaultPujaId={searchParams.puja} defaultCityId={searchParams.city} />
      </div>
    </section>
  );
}
