import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { GlobalSearch } from '@/components/GlobalSearch';
import type { Country, City, Puja } from '@/lib/types';

interface NavbarProps {
  countries: Country[];
  cities: City[];
  pujas: Puja[];
}

function NavDropdown({ label, options }: {
  label: string;
  options: { label: string; value: string; icon?: string }[]
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
          {options.map((opt) => {
            const isInternal = opt.value.startsWith('/');
            return isInternal ? (
              <Link
                key={opt.label}
                to={opt.value}
                onClick={() => setOpen(false)}
                className="w-full px-5 py-3 text-left text-sm font-semibold text-white hover:text-saffron-400 transition-colors flex items-center gap-3"
              >
                {opt.icon && <span className="text-base">{opt.icon}</span>}
                {opt.label}
              </Link>
            ) : (
              <a
                key={opt.label}
                href={opt.value}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="w-full px-5 py-3 text-left text-sm font-semibold text-white hover:text-saffron-400 transition-colors flex items-center gap-3"
              >
                {opt.icon && <span className="text-base">{opt.icon}</span>}
                {opt.label}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MobileAccordion({ label, options, onNavigate }: {
  label: string;
  options: { label: string; value: string; icon?: string }[];
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between py-4 text-left text-base font-bold text-saffron-600"
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="pb-3 pl-2 flex flex-col">
          {options.map((opt) => {
            const isInternal = opt.value.startsWith('/');
            return isInternal ? (
              <Link
                key={opt.label}
                to={opt.value}
                onClick={onNavigate}
                className="py-2.5 text-sm font-semibold text-gray-700 flex items-center gap-3"
              >
                {opt.icon && <span className="text-base">{opt.icon}</span>}
                {opt.label}
              </Link>
            ) : (
              <a
                key={opt.label}
                href={opt.value}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onNavigate}
                className="py-2.5 text-sm font-semibold text-gray-700 flex items-center gap-3"
              >
                {opt.icon && <span className="text-base">{opt.icon}</span>}
                {opt.label}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

function UserMenu({ name, onLogout }: { name: string; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initial = name?.trim()?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="relative" id='ontopof' ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2e54a] text-sm font-bold text-black hover:bg-yellow-300 transition-all cursor-pointer border-none outline-none focus:outline-none"
        aria-label="Account menu"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute top-11 right-0 z-50 min-w-[180px] rounded-2xl bg-gray-900 py-2 shadow-xl">
          <button
            onClick={() => {
              navigate('/account');
              setOpen(false);
            }}
            className="w-full px-5 py-3 text-left text-sm font-semibold text-white hover:text-saffron-400 transition-colors"
          >
            My Account
          </button>
          <button
            onClick={() => {
              onLogout();
              setOpen(false);
            }}
            className="w-full px-5 py-3 text-left text-sm font-semibold text-white hover:text-saffron-400 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export function Navbar({ countries, cities, pujas }: NavbarProps) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function loadUser() {
      const stored = localStorage.getItem('np_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }

    loadUser();

    window.addEventListener('auth-change', loadUser);
    window.addEventListener('storage', loadUser);
    return () => {
      window.removeEventListener('auth-change', loadUser);
      window.removeEventListener('storage', loadUser);
    };
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close the mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('np_user_token');
    localStorage.removeItem('np_user');
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
    setMobileOpen(false);
    navigate('/');
  }

  const bookPujaOptions = [
    { label: 'Home Puja', value: '/pujas/mainpuja?category=Home Pujas' },
    { label: 'Griha Pravesh Puja', value: '/pujas/mainpuja?category=Griha Pravesh' },
    { label: 'Special Anusthan', value: '/pujas/mainpuja?category=Special Anushthan' },
    { label: 'Festival Puja', value: '/pujas/mainpuja?category=Festival Pujas' },
    { label: 'Explore More', value: '/pujas/mainpuja' },
  ];

  const locationOptions = [
    { label: 'India', value: '/mainlocation' },
    { label: 'United States', value: '/mainlocation' },
    { label: 'United Kingdom', value: '/mainlocation' },
    { label: 'Australia', value: '/mainlocation' },
    { label: 'Explore More', value: '/mainlocation' },
  ];

  const contactOptions = [
    { label: '+91 9311973199', value: 'tel:+919311973199', icon: '📞' },
    { label: '+91 8796973199', value: 'https://wa.me/918796973199', icon: '💬' },
    { label: 'support@namanpuja.com', value: 'mailto:support@namanpuja.com', icon: '🎗️' },
    { label: 'sales@namanpuja.com', value: 'mailto:sales@namanpuja.com', icon: '💼' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-colors duration-300 ${scrolled || mobileOpen ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <nav className="flex h-16 md:h-20 items-center justify-between bg-transparent">

          {/* Mobile burger button */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="md:hidden flex items-center justify-center h-10 w-10 -ml-2 text-saffron-600 bg-transparent border-none outline-none focus:outline-none"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex flex-col items-center md:items-start mx-auto md:ml-20">
            <img src="/images/Namanpuja_Logo.png" alt="Namanpuja Logo" className="h-12 md:h-14 w-auto object-contain pl-4" />
            <span className="text-[7px] md:text-[8px] font-bold text-primary uppercase tracking-[0.05em] whitespace-nowrap opacity-80 text-saffron-800">
              Seva • Suvidha • Samarpan
            </span>
          </Link>

          {/* Search Bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <GlobalSearch countries={countries} cities={cities} pujas={pujas} />
          </div>

          {/* Right Side (desktop) */}
          <div className="hidden md:flex items-center gap-6 md:mr-20">
            <NavDropdown label="Book Puja" options={bookPujaOptions} />
            <NavDropdown label="Choose Location" options={locationOptions} />
            <NavDropdown label="Contact Info" options={contactOptions} />

            {user ? (
              <UserMenu name={user.name} onLogout={handleLogout} />
            ) : (
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-bold bg-[#f2e54a] text-black hover:bg-gray-50 h-9 px-4 rounded-full transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" />
                </svg>
                Login
              </Link>
            )}
          </div>

          {/* Mobile: account/login icon stays visible next to burger */}
          <div className="md:hidden">
            {user ? (
              <UserMenu name={user.name} onLogout={handleLogout} />
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#f2e54a] text-black h-8 px-3 rounded-full transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="container mx-auto px-4 py-4">
            <div className="mb-2">
              <GlobalSearch countries={countries} cities={cities} pujas={pujas} />
            </div>

            <MobileAccordion label="Book Puja" options={bookPujaOptions} onNavigate={() => setMobileOpen(false)} />
            <MobileAccordion label="Choose Location" options={locationOptions} onNavigate={() => setMobileOpen(false)} />
            <MobileAccordion label="Contact Info" options={contactOptions} onNavigate={() => setMobileOpen(false)} />

            {user && (
              <div className="pt-4 flex flex-col gap-1">
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm font-semibold text-gray-700"
                >
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="py-2.5 text-left text-sm font-semibold text-gray-700 bg-transparent border-none"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
