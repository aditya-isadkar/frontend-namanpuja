'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <header className="border-b border-saffron-100 bg-cream/80 backdrop-blur-md w-full">
      <div className="container mx-auto px-4">
        <nav className="flex h-16 md:h-20 items-center justify-between">

          {/* Logo — centered on mobile, left on desktop */}
          <Link href="/" className="flex flex-col items-center md:items-start mx-auto md: ml-20">
            <img src="/images/Namanpuja_Logo.png" alt="Namanpuja Logo" className="h-12 md:h-14 w-auto object-contain "/>
            <span className="text-[7px] md:text-[8px] font-bold text-primary uppercase tracking-[0.05em] whitespace-nowrap opacity-80 text-saffron-800">
              Seva • Suvidha • Samarpan
            </span>
          </Link>

          {/* Search Bar — desktop only */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6 items-center border border-gray-200 rounded-full overflow-hidden bg-white shadow-sm">
            <input
              type="text"
              placeholder="Search city, package, and pooja..."
              className="flex-1 px-5 py-2.5 text-sm text-gray-600 placeholder-gray-400 outline-none bg-transparent"
            />
            <button className="m-1 h-9 w-9 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
          </div>

          {/* Right Side — desktop only */}
          <div className="  md:flex items-center gap-3 shrink-0">
            <a href="/#pujas" className=" md:bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-5 rounded-full transition-all shadow-sm text-sm whitespace-nowrap">
              Bless Your Accommodation
            </a>
            <Link href="/login" className="hidden  md:inline-flex items-center gap-1.5 text-sm font-bold border border-gray-200 bg-white hover:bg-gray-50 h-9 px-4 rounded-full transition-all md:mr-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" />
              </svg>
              Login
            </Link>
          </div>

        </nav>
      </div>
    </header>
  );
}