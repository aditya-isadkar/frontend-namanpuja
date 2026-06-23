'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { GlobalSearch } from '@/components/GlobalSearch';
import type { Country, City, Puja } from '@/lib/types';

interface NavbarProps {
  countries: Country[];
  cities: City[];
  pujas: Puja[];
}

function NavDropdown({ label, options, disableClick = false }: {
  label: string;
  disableClick?: boolean;
  options: { label: string; value: string; icon?: string }[]
}){
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1 text-sm font-bold text-saffron-500 cursor-pointer bg-transparent border-none outline-none focus:outline-none"
      >
        {label}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-8 left-0 z-50 min-w-[220px] rounded-2xl bg-gray-900 py-2 shadow-xl">
          {options.map((opt) => (
          <button
  key={opt.label}
  disabled={disableClick}                    // add this
  onClick={() => {
    if (opt.value.startsWith('http') || opt.value.startsWith('tel:') || opt.value.startsWith('mailto:')) {
      window.open(opt.value, '_blank');
    } else {
      router.push(opt.value);
    }
    setOpen(false);
  }}
  className="w-full px-5 py-3 text-left text-sm font-semibold text-white hover:text-saffron-400 transition-colors flex items-center gap-3 disabled:cursor-default disabled:pointer-events-none"  // add disabled: classes
>
              {opt.icon && <span className="text-base">{opt.icon}</span>}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar({ countries, cities, pujas }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
<header className={`fixed top-0 left-0 right-0 z-50 w-full transition-colors duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>      <div className="container mx-auto px-4">
        <nav className="flex h-16 md:h-20 items-center justify-between bg-transparent">

          {/* Logo */}
          <Link href="/" className="flex flex-col items-center md:items-start mx-auto md:ml-20">
            <img src="/images/Namanpuja_Logo.png" alt="Namanpuja Logo" className="h-12 md:h-14 w-auto object-contain pl-4" />
            <span className="text-[7px] md:text-[8px] font-bold text-primary uppercase tracking-[0.05em] whitespace-nowrap opacity-80 text-saffron-800">
              Seva • Suvidha • Samarpan
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <GlobalSearch countries={countries} cities={cities} pujas={pujas} />
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-6 md:mr-20">
            <NavDropdown
  label="Book Puja"
  options={[
    { label: 'Home Puja', value: '/pujas/MainPuja?category=Home Pujas' },
    { label: 'Griha Pravesh Puja', value: '/pujas/MainPuja?category=Griha Pravesh' },
    { label: 'Special Anusthan', value: '/pujas/MainPuja?category=Special Anushthan' },
    { label: 'Festival Puja', value: '/pujas/MainPuja?category=Festival Pujas' },
    { label: 'Explore More', value: '/pujas/MainPuja' },
  ]}
/>
            <NavDropdown
              label="Choose Location"
              options={[
                { label: 'India', value: '/MainLocation' },
                { label: 'United States', value: '/MainLocation' },
                { label: 'United Kingdom', value: '/MainLocation' },
                { label: 'Australia', value: '/MainLocation' },
                { label: 'Explore More', value: '/MainLocation' },
              ]}
            />
            <NavDropdown
              label="Contact Info"
                disableClick
              options={[
                { label: '+91 9311973199', value: 'tel:+919311973199', icon: '📞' },
                { label: '+91 8796973199', value: 'https://wa.me/918796973199', icon: '💬' },
                { label: 'support@namanpuja.com', value: 'mailto:support@namanpuja.com', icon: '🎗️' },
                { label: 'sales@namanpuja.com', value: 'mailto:sales@namanpuja.com', icon: '💼' },
              ]}
            />

            <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-bold bg-[#f2e54a] text-black hover:bg-gray-50 h-9 px-4 rounded-full transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" />
              </svg>
              Login
            </Link>

            {/* Book a Puja CTA */}
            
          </div></nav>
          </div>
        
   </header>
  );
}
