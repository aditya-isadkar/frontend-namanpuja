'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, UserPlus } from 'lucide-react';

export function RegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputCls =
    'w-full rounded-xl border border-saffron-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    const payload = {
      firstName: String(formData.get('firstName') ?? ''),
      lastName: String(formData.get('lastName') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
    };

    if (payload.password !== payload.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      console.log('Registration Payload:', payload);

      // TODO:
      // const response = await register(payload);
      // router.push('/login');

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      setError((err as Error).message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First Name">
          <input
            type="text"
            name="firstName"
            required
            placeholder="First name"
            className={inputCls}
          />
        </Field>

        <Field label="Last Name">
          <input
            type="text"
            name="lastName"
            required
            placeholder="Last name"
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Email">
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className={inputCls}
        />
      </Field>

      <Field label="Phone Number">
        <input
          type="tel"
          name="phone"
          required
          placeholder="+91 XXXXX XXXXX"
          className={inputCls}
        />
      </Field>

      <Field label="Password">
        <input
          type="password"
          name="password"
          required
          placeholder="Create a password"
          className={inputCls}
        />
      </Field>

      <Field label="Confirm Password">
        <input
          type="password"
          name="confirmPassword"
          required
          placeholder="Confirm password"
          className={inputCls}
        />
      </Field>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            Create Account
            <UserPlus className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="text-center text-sm text-ink/60">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-saffron-700 hover:text-saffron-800"
        >
          Login
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink/70">
        {label}
      </span>
      {children}
    </label>
  );
}