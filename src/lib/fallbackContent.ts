import { getPujas, getAllCitiesWithCountry } from './api';
import { pujaLocationSlug } from './slug';
import { getOmanPujasByCityName } from './omanData';
import { getUAEPujasByCity } from './uaeData';
import type { PujaLocation, Puja, City } from './types';

const SITE = 'https://www.namanpuja.com';

/**
 * Generate fallback location content for any city+puja combination
 * that is not in the database.
 * If static content is available (Oman/UAE Ganesh Puja), it uses that.
 */
export async function getFallbackLocation(slug: string): Promise<PujaLocation | null> {
  const [pujas, cities] = await Promise.all([getPujas(), getAllCitiesWithCountry()]);

  for (const puja of pujas) {
    for (const city of cities) {
      const isOman =
        city.country?.name.toLowerCase() === 'oman' || city.country?.slug === 'oman';
      const isUAE =
        city.country?.name.toLowerCase() === 'united arab emirates' ||
        city.country?.name.toLowerCase() === 'uae' ||
        city.country?.slug === 'united-arab-emirates' ||
        city.country?.slug === 'uae';

      const slugWithState = pujaLocationSlug(puja.name, city.name, city.state);
      const slugWithoutState = pujaLocationSlug(puja.name, city.name, null);

      if (slug === slugWithState || slug === slugWithoutState) {
        // Found the combination!

        const countryName = city.country?.name ?? '';
        const place = city.state ? `${city.name}, ${city.state}` : `${city.name}, ${countryName}`;

        // 1. Check if we have specific static Google Doc content for this city + puja
        if (puja.slug === 'ganesh-puja') {
          if (isOman) {
            const staticOman = getOmanPujasByCityName(city.name)[0];
            if (staticOman) {
              return {
                id: `static-${puja.id}-${city.id}`,
                slug,
                h1: staticOman.h1,
                heroTagline: staticOman.heroTagline,
                intro: staticOman.intro,
                benefits: staticOman.benefits,
                rituals: staticOman.rituals,
                samagri: staticOman.samagri,
                whyChooseUs: staticOman.whyChooseUs,
                occasions: staticOman.occasions,
                serviceAreas: staticOman.serviceAreas,
                faqs: staticOman.faqs,
                cta: staticOman.cta,
                metaTitle: staticOman.metaTitle,
                metaDescription: staticOman.metaDescription,
                keywords: staticOman.keywords,
                canonicalUrl: staticOman.canonicalUrl,
                breadcrumb: staticOman.breadcrumb,
                internalLinks: staticOman.internalLinks,
                puja,
                city,
              } as PujaLocation;
            }
          } else if (isUAE) {
            const staticUAE = getUAEPujasByCity(city.slug)[0];
            if (staticUAE) {
              return {
                id: `static-${puja.id}-${city.id}`,
                slug,
                h1: staticUAE.h1,
                heroTagline: staticUAE.heroTagline,
                intro: staticUAE.intro,
                benefits: staticUAE.benefits,
                rituals: staticUAE.rituals,
                samagri: staticUAE.samagri,
                whyChooseUs: staticUAE.whyChooseUs,
                occasions: staticUAE.occasions,
                serviceAreas: staticUAE.serviceAreas,
                faqs: staticUAE.faqs,
                cta: staticUAE.cta,
                metaTitle: staticUAE.metaTitle,
                metaDescription: staticUAE.metaDescription,
                keywords: staticUAE.keywords,
                canonicalUrl: staticUAE.canonicalUrl,
                breadcrumb: staticUAE.breadcrumb,
                internalLinks: staticUAE.internalLinks,
                puja,
                city,
              } as PujaLocation;
            }
          }
        }

        // 2. Otherwise, generate content dynamically based on the master Puja data
        const h1 = `${puja.name} in ${place} – Authentic Vedic Rituals at Home`;
        const heroTagline = `Celebrate Faith, Family and Tradition with ${puja.name} in ${city.name}. ${puja.subtitle ?? ''}`;
        const intro =
          `In ${place}, ${puja.name} offers Hindu families a meaningful way to stay connected to their ` +
          `spiritual roots while celebrating life's most important milestones. At Naman Puja, we bring ` +
          `experienced Vedic priests directly to your home in ${city.name}, helping you perform authentic ` +
          `Hindu rituals with convenience and devotion. ${puja.shortDesc ?? ''}`;

        const sections = [
          {
            heading: `Understanding the Significance of ${puja.name}`,
            body: puja.description ?? '',
          },
          {
            heading: `Why Families in ${city.name} Perform ${puja.name}`,
            body:
              `Families across ${city.name} perform ${puja.name} to bless new homes, celebrate milestones such as ` +
              `birthdays and anniversaries, seek success in career and business, express gratitude, and bring ` +
              `the family together in prayer and devotion.`,
          },
          {
            heading: `Keeping Hindu Traditions Alive in ${city.state ?? countryName}`,
            body:
              `${city.name} is home to a vibrant community that has preserved ` +
              `its customs, festivals and religious traditions across generations. ${puja.name} continues to play ` +
              `an important role in these celebrations — helping families stay connected to Sanatan Dharma, teach ` +
              `younger generations about Hindu traditions, and create meaningful spiritual experiences at home.`,
          },
        ];

        const whyChooseUs = [
          {
            title: 'Experienced Vedic Priests',
            description:
              'Authentic rituals performed according to Hindu scriptures and regional traditions.',
          },
          {
            title: 'Convenient Home & e-Puja Services',
            description: `Perform the ceremony comfortably at your home in ${city.name}, or join a guided online e-puja.`,
          },
          {
            title: 'Personalized Support',
            description: 'Complete guidance on samagri, preparations and ceremony arrangements.',
          },
          {
            title: 'Flexible Scheduling',
            description: 'Book a date and time that suits your family and occasion.',
          },
        ];

        const benefits = Array.isArray(puja.benefits) ? puja.benefits : [];
        const rituals = Array.isArray(puja.rituals) ? puja.rituals : [];
        const samagri = Array.isArray(puja.samagri) ? puja.samagri : [];
        const occasions = Array.isArray(puja.occasions) ? puja.occasions : [];

        const faqs = [
          {
            question: `Can ${puja.name} be performed at home in ${city.name}?`,
            answer: `Yes. Naman Puja provides experienced Vedic priests who can perform ${puja.name} at homes, apartments, community halls and other venues throughout ${city.name} and surrounding areas.`,
          },
          {
            question: `How long does ${puja.name} take?`,
            answer: puja.durationMin
              ? `A complete ${puja.name} generally takes about ${Math.round(puja.durationMin / 30) * 0.5} to ${Math.ceil(puja.durationMin / 60) + 0.5} hours depending on the rituals, family participation and number of attendees.`
              : 'A complete puja generally takes about 1.5 to 2.5 hours.',
          },
          {
            question: `What are the benefits of performing ${puja.name}?`,
            answer: `Devotees believe ${puja.name} brings peace, prosperity, obstacle removal, and spiritual growth.`,
          },
          {
            question: 'Do I need to arrange the puja samagri myself?',
            answer:
              'Naman Puja provides complete guidance regarding all required puja samagri before the ceremony, and can arrange the samagri for you on request.',
          },
          {
            question: `Is an online e-puja option available for ${puja.name}?`,
            answer:
              puja.serviceType === 'HOME_VISIT'
                ? `${puja.name} is best performed at home with a priest present; contact us to discuss available options.`
                : `Yes. We offer a guided online e-puja for ${puja.name}, where the rituals are performed on your behalf (sankalp in your name) and streamed live for you to participate from anywhere.`,
          },
        ];

        const cta = {
          heading: 'Honor Tradition. Celebrate Family. Receive Divine Blessings.',
          bullets: [
            'Authentic Vedic Rituals at Home',
            'Experienced Hindu Priests',
            'Personalized Guidance and Support',
            'Preserve Hindu Traditions Across Generations',
          ],
          body: `Book your ${puja.name} in ${city.name} today with Naman Puja and create a meaningful spiritual experience that brings your family together under divine blessings.`,
          buttonLabel: `Book ${puja.name}`,
        };

        const keywords = [
          `${puja.name} in ${city.name}`,
          `${puja.name} ${city.name}`,
          `Book ${puja.name} ${city.name}`,
          `Home ${puja.name} ${city.name}`,
          `Pandit for ${puja.name} ${city.name}`,
          `Hindu Priest ${city.name}`,
          `${puja.name} at home ${city.name}`,
          `Online ${puja.name} booking ${city.name}`,
        ];

        const metaTitle = `${puja.name} in ${city.name}${city.state ? ' ' + city.state : ''} | Book Pandit for Home Puja`;
        const metaDescription =
          `Book ${puja.name} in ${place} with experienced Vedic priests. Authentic Hindu rituals at home, ` +
          `flexible scheduling and complete samagri guidance. Invite prosperity, peace and divine blessings.`;

        const breadcrumb = ['Home', countryName, city.state ?? '', city.name, puja.name].filter(
          Boolean,
        );

        const internalLinks = pujas
          .filter((p) => p.name !== puja.name)
          .slice(0, 6)
          .map((p) => ({
            label: `${p.name} in ${city.name}`,
            href: `/locations/${pujaLocationSlug(p.name, city.name, city.state)}`,
          }));

        return {
          id: `dynamic-${puja.id}-${city.id}`,
          slug,
          h1,
          heroTagline,
          intro,
          sections,
          benefits,
          rituals,
          samagri,
          whyChooseUs,
          occasions,
          serviceAreas: [],
          faqs,
          cta,
          metaTitle,
          metaDescription,
          keywords,
          ogImage: `${SITE}/images/${slug}.jpg`,
          canonicalUrl: `${SITE}/locations/${slug}`,
          breadcrumb,
          internalLinks,
          imageAlt: `${puja.name} at home in ${place} performed by an experienced Hindu priest`,
          puja,
          city,
        } as PujaLocation;
      }
    }
  }

  return null;
}
