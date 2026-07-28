'use client';

import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, UserPlus } from 'lucide-react';
import { register } from '@/lib/api';

// --- Password strength policy -------------------------------------------
// NOTE: This is client-side UX only. The server MUST enforce the same
// (or stricter) policy independently — never trust client validation alone.
const COMMON_PASSWORDS = new Set([
  'password', 'password1', '12345678', '123456789', 'qwerty123',
  'letmein', 'welcome1', 'iloveyou', 'admin123', 'abc123456',
]);

function getPasswordError(password: string): string | null {
  if (password.length < 10) return 'Password must be at least 10 characters long';
  if (!/[a-z]/.test(password)) return 'Password must include a lowercase letter';
  if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must include a number';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must include a symbol (e.g. ! @ # $)';
  if (COMMON_PASSWORDS.has(password.toLowerCase())) return 'This password is too common — please choose another';
  return null;
}

// --- Client-side rate limiting (UX only) --------------------------------
// This slows down accidental rapid-fire submits / basic scripted abuse from
// this form. It is NOT a substitute for server-side rate limiting, which
// must be enforced on the /register endpoint (per-IP and/or per-email).
const MAX_ATTEMPTS_BEFORE_LOCKOUT = 5;
const LOCKOUT_DURATION_MS = 60_000; // 1 minute

// --- Enumeration-safe error normalization --------------------------------
// Never reflect raw backend error text to the user — messages like
// "email already registered" let an attacker enumerate valid accounts.
// The real fix is server-side (respond identically whether or not the
// account exists), but we also normalize here as defense in depth.
function normalizeErrorMessage(rawMessage: string): string {
  const enumerationPatterns = [
    /already exists/i,
    /already registered/i,
    /already in use/i,
    /already taken/i,
    /account exists/i,
    /email is associated/i,
  ];

  if (enumerationPatterns.some((pattern) => pattern.test(rawMessage))) {
    return "If those details are correct, you're all set — check your email to verify your account, or try logging in instead.";
  }

  // Generic fallback — avoid leaking internal/validation specifics from the API
  return 'Registration failed. Please check your details and try again.';
}

export function RegistrationForm() {
const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const attemptsRef = useRef(0);
  const lockedUntilRef = useRef<number | null>(null);
  const [lockoutSecondsLeft, setLockoutSecondsLeft] = useState(0);

  const inputCls =
    'w-full rounded-xl border border-saffron-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200';

  function startLockoutCountdown(untilTimestamp: number) {
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((untilTimestamp - Date.now()) / 1000));
      setLockoutSecondsLeft(remaining);
      if (remaining > 0) {
        setTimeout(tick, 1000);
      } else {
        lockedUntilRef.current = null;
        attemptsRef.current = 0;
      }
    };
    tick();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    // --- Rate limit check ---
    if (lockedUntilRef.current && Date.now() < lockedUntilRef.current) {
      setError(
        `Too many attempts. Please wait ${Math.ceil(
          (lockedUntilRef.current - Date.now()) / 1000
        )}s and try again.`
      );
      return;
    }

    const formData = new FormData(e.currentTarget);

    const payload = {
      firstName: String(formData.get('firstName') ?? ''),
      lastName: String(formData.get('lastName') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
    };

    // --- Password strength check ---
    const passwordError = getPasswordError(payload.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (payload.password !== payload.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        email: payload.email,
        name: `${payload.firstName} ${payload.lastName}`.trim(),
        phone: payload.phone,
        password: payload.password,
      });

      // Reset attempt tracking on success
      attemptsRef.current = 0;
      lockedUntilRef.current = null;

      localStorage.setItem('np_user_token', response.token);
      localStorage.setItem('np_user', JSON.stringify(response.user));
      window.dispatchEvent(new Event('auth-change'));

      navigate('/');
    } catch (err) {
      attemptsRef.current += 1;

      if (attemptsRef.current >= MAX_ATTEMPTS_BEFORE_LOCKOUT) {
        const until = Date.now() + LOCKOUT_DURATION_MS;
        lockedUntilRef.current = until;
        startLockoutCountdown(until);
        setError(
          `Too many failed attempts. Please wait ${Math.ceil(
            LOCKOUT_DURATION_MS / 1000
          )}s before trying again.`
        );
      } else {
        setError(normalizeErrorMessage((err as Error).message || ''));
      }
    } finally {
      setLoading(false);
    }
  }

  const isLocked = lockoutSecondsLeft > 0;

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
        <span className="mt-1 block text-xs text-ink/50">
          At least 10 characters, with uppercase, lowercase, a number, and a symbol.
        </span>
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
        disabled={loading || isLocked}
        className="btn-primary w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : isLocked ? (
          <>Try again in {lockoutSecondsLeft}s</>
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
          to="/login"
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
