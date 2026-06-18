import { getCountries, getCountryCities } from '@/lib/api';
import { Reveal } from '@/components/motion';
import { LocationsClient } from '@/components/LocationClient';
import { Tangerine } from 'next/font/google';

const tangerine = Tangerine({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-tangerine',
});

export default async function LocationsPage() {
  const countries = await getCountries();

 const countriesWithCities = await Promise.all(
  countries.map(async (country) => {
    const { cities } = await getCountryCities(country.slug);
    console.log(country.name, '→', cities.length, 'cities'); // 👈 add here
    return { ...country, cities };
  }),
);

return (
    <section id="locations" className={tangerine.variable}>
      <div className="container-page py-16">
        <div className="text-center mb-12 mt-20">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4 italic">
            Connecting Devotees Across the Globe Through Sacred Rituals
          </h1>
          <p className="max-w-4xl mx-auto mt-6" style={{
            fontFamily: 'var(--font-tangerine)',  // 👈 use the variable, not the string
            fontSize: '75px',
            fontWeight: 800,
            color: '#e0763f',
            lineHeight: 1.2
          } as React.CSSProperties}>
            Serving Devotees with Authentic Rituals Across the World
          </p>
        </div>

        <LocationsClient countries={countriesWithCities} />
      </div>
    </section>
  );
}