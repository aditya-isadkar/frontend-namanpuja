// import type { Metadata } from 'next';
// import { Inter, Poppins } from 'next/font/google';
// import './globals.css';
// import { Navbar } from '@/components/Navbar';
// import Footer from '@/components/Footer';

// const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
// const poppins = Poppins({
//   subsets: ['latin'],
//   weight: ['500', '600', '700', '800'],
//   variable: '--font-display',
//   display: 'swap',
// });

// const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.namanpuja.com';

// export const metadata: Metadata = {
//   metadataBase: new URL(SITE_URL),
//   title: {
//     default: 'Naman Puja — Book Authentic Vedic Pujas at Home & Online',
//     template: '%s | Naman Puja',
//   },
//   icons:{ icon: '/images/Namanpuja_Logo.png'},
//   description:
//     'Book authentic Hindu pujas with experienced Vedic priests — at home or online. Choose your country, your city, and the puja you need. Preserving traditions across generations.',
//   keywords: [
//     'puja booking', 'pandit booking', 'home puja', 'e-puja', 'online puja',
//     'Satyanarayan Puja', 'Griha Pravesh', 'Vedic priest', 'Hindu rituals',
//   ],
//   openGraph: {
//     type: 'website',
//     siteName: 'Naman Puja',
//     title: 'Naman Puja — Book Authentic Vedic Pujas at Home & Online',
//     description: 'Choose your country, your city, and book authentic Hindu pujas with experienced Vedic priests.',
//     url: SITE_URL,
//   },
//   twitter: { card: 'summary_large_image' },
//   robots: { index: true, follow: true },
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
//       <body className="flex min-h-screen flex-col">
//         <Navbar />
//         <main className="flex-1">{children}</main>
//         <Footer />
//       </body>
//     </html>
//   );
// }

import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCountries, getCountryCities, getPujas } from '@/lib/api';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.namanpuja.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Naman Puja — Book Authentic Vedic Pujas at Home & Online',
    template: '%s | Naman Puja',
  },
  icons: { icon: '/images/Namanpuja_Logo.png' },
  description:
    'Book authentic Hindu pujas with experienced Vedic priests — at home or online. Choose your country, your city, and the puja you need. Preserving traditions across generations.',
  keywords: [
    'puja booking', 'pandit booking', 'home puja', 'e-puja', 'online puja',
    'Satyanarayan Puja', 'Griha Pravesh', 'Vedic priest', 'Hindu rituals',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Naman Puja',
    title: 'Naman Puja — Book Authentic Vedic Pujas at Home & Online',
    description: 'Choose your country, your city, and book authentic Hindu pujas with experienced Vedic priests.',
    url: SITE_URL,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const countries = await getCountries();

  const results = await Promise.all(
    countries.map((c) => getCountryCities(c.slug)),
  );
  const cities = results.flatMap((r) =>
    r.cities.map((city) => ({ ...city, country: r.country })),
  );

  const pujas = await getPujas();

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Navbar countries={countries} cities={cities} pujas={pujas} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}