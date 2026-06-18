'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, Star, ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-saffron-radial">
      {/* floating decorative diyas */}
      <motion.div
        className="pointer-events-none absolute -left-10 top-24 h-40 w-40 rounded-full bg-saffron-200/40 blur-3xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute right-0 top-40 h-56 w-56 rounded-full bg-saffron-300/30 blur-3xl"
        animate={{ y: [0, 24, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
<h1 className='font-display pb-12 pt-20 text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center bg-saffron-gradient bg-clip-text text-transparent'>
  Bridge the Gap Between You and the Divine
</h1>
      <div className="container-page relative grid items-center gap-12 py-10 lg:grid-cols-2 lg:py-14">
        
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="badge"
          >
            <Star className="h-3.5 w-3.5" /> Trusted by thousands of devout families
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            Book Authentic{' '}
            <span className="bg-saffron-gradient bg-clip-text text-transparent">Vedic Pujas</span>
            <br /> at Home or Online
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70"
          >
            Choose your country, your city, and the puja you need. Experienced priests perform
            authentic rituals with complete devotion — preserving Hindu traditions across generations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link href="#flow" className="btn-primary">
              Find Pujas in Your City <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/book" className="btn-ghost">
              Book a Puja
            </Link>
          </motion.div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink/60">
            {['Experienced Vedic Priests', 'Home & Online e-Puja', 'Complete Samagri Guidance'].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Decorative card cluster */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="absolute inset-0 rotate-6 rounded-3xl bg-saffron-gradient opacity-20 blur-2xl" />
          <div className="relative rounded-3xl border border-saffron-100 bg-white p-8 shadow-glow">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-saffron-gradient text-white">
                <Flame className="h-6 w-6 diya-glow" />
              </span>
              <div>
                <p className="font-display text-lg font-bold">Satyanarayan Puja</p>
                <p className="text-sm text-ink/60">Lord Vishnu · 2–3 hours</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {['Ganesh Puja & Sankalp', 'Kalash Sthapana', 'Satyanarayan Katha', 'Aarti & Prasad'].map(
                (step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-3 rounded-xl bg-saffron-50 px-4 py-3 text-sm font-medium text-ink/80"
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-bold text-saffron-600">
                      {i + 1}
                    </span>
                    {step}
                  </motion.div>
                ),
              )}
            </div>
            <div className="mt-6 flex items-center justify-between rounded-xl bg-ink px-4 py-3 text-white">
              <span className="text-sm">Book Your First Puja Today</span>
             
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
