import { getCountries, getCountryCities } from '@/lib/api';
import { Reveal } from '@/components/motion';
import { LocationsClient } from '@/components/LocationClient';

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
    <section id="locations">
      <div className="container-page py-16">
        <Reveal>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Find Pujas in Your City
          </h2>
        </Reveal>
        <Reveal className="mt-4 max-w-2xl text-lg text-ink/70">
          Browse by country, then choose your city to see available pujas near you.
        </Reveal>

        <LocationsClient countries={countriesWithCities} />
      </div>
    </section>
  );
}