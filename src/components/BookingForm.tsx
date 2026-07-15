'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Flame } from 'lucide-react';
import { createBooking, type BookingPayload } from '@/lib/api';
import type { Puja } from '@/lib/types';

interface Props {
  pujas: Puja[];
  defaultPujaId?: string;
  defaultCityId?: string;
}

export function BookingForm({ pujas, defaultPujaId, defaultCityId }: Props) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState<BookingPayload['serviceType']>('HOME_VISIT');
  const [user, setUser] = useState<{ id: string; name: string; email: string; phone: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('np_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (err) {
        // ignore
      }
    }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload: BookingPayload = {
      serviceType,
      customerName: String(form.get('customerName') ?? ''),
      customerEmail: String(form.get('customerEmail') ?? ''),
      customerPhone: String(form.get('customerPhone') ?? ''),
      pujaId: String(form.get('pujaId') ?? '') || undefined,
      preferredDate: String(form.get('preferredDate') ?? '') || undefined,
      preferredTime: String(form.get('preferredTime') ?? '') || undefined,
      addressLine: String(form.get('addressLine') ?? '') || undefined,
      pincode: String(form.get('pincode') ?? '') || undefined,
      notes: String(form.get('notes') ?? '') || undefined,
      cityId: defaultCityId,
      userId: user?.id ?? undefined,
    };
    try {
      const res = await createBooking(payload);
      setReference(res.reference);
      setStatus('success');
    } catch (err) {
      setError((err as Error).message);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-saffron-100 bg-white p-10 text-center shadow-glow"
      >
        <CheckCircle2 className="mx-auto h-16 w-16 text-saffron-600" />
        <h3 className="mt-4 font-display text-2xl font-bold">Booking received! 🙏</h3>
        <p className="mt-2 text-ink/60">
          Your reference is <span className="font-semibold text-saffron-700">{reference}</span>.
          Our team will contact you shortly to confirm the details.
        </p>
      </motion.div>
    );
  }

  const inputCls =
    'w-full rounded-xl border border-saffron-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200';

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-saffron-100 bg-white p-6 shadow-glow sm:p-8">
      {/* Service type toggle */}
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-saffron-50 p-1">
        {(
          [
            { key: 'HOME_VISIT', label: 'Home Visit Puja' },
            { key: 'EPUJA', label: 'Online e-Puja' },
          ] as const
        ).map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setServiceType(opt.key)}
            className={`rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              serviceType === opt.key ? 'bg-white text-saffron-700 shadow-sm' : 'text-ink/50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name *">
          <input name="customerName" required className={inputCls} placeholder="Full name" defaultValue={user?.name ?? ''} key={user ? 'u-name' : 'e-name'} />
        </Field>
        <Field label="Phone *">
          <input name="customerPhone" required className={inputCls} placeholder="+91 …" defaultValue={user?.phone ?? ''} key={user ? 'u-phone' : 'e-phone'} />
        </Field>
        <Field label="Email *">
          <input name="customerEmail" type="email" required className={inputCls} placeholder="you@example.com" defaultValue={user?.email ?? ''} key={user ? 'u-email' : 'e-email'} />
        </Field>
        <Field label="Select puja">
          <select name="pujaId" defaultValue={defaultPujaId ?? ''} className={inputCls}>
            <option value="">Choose a puja…</option>
            {pujas.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Preferred date">
          <input name="preferredDate" type="date" className={inputCls} />
        </Field>
        <Field label="Preferred time">
          <input name="preferredTime" type="time" className={inputCls} />
        </Field>
        {serviceType === 'HOME_VISIT' && (
          <>
            <Field label="Address" className="sm:col-span-2">
              <input name="addressLine" className={inputCls} placeholder="House / street / area" />
            </Field>
            <Field label="Pincode">
              <input name="pincode" className={inputCls} placeholder="000000" />
            </Field>
          </>
        )}
        <Field label="Notes" className="sm:col-span-2">
          <textarea name="notes" rows={3} className={inputCls} placeholder="Any special requirements or occasion details" />
        </Field>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={status === 'submitting'} className="btn-primary mt-6 w-full">
        {status === 'submitting' ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
        ) : (
          <>Request Booking <Flame className="h-4 w-4" /></>
        )}
      </button>
      <p className="mt-3 text-center text-xs text-ink/50">
        No payment now — our team will confirm availability and details with you.
      </p>
    </form>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="mb-1.5 block text-sm font-medium text-ink/70">{label}</span>
      {children}
    </label>
  );
}
