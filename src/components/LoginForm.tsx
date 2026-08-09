'use client';

import { useState } from 'react';
import { useNavigate, Link  } from 'react-router-dom';
import { Loader2, LogIn } from 'lucide-react';
import { login } from '@/lib/api';

export function LoginForm() {
  const navigate = useNavigate();
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
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    };

    try {
      const response = await login(payload);
      localStorage.setItem('np_user_token', response.token);
      localStorage.setItem('np_user', JSON.stringify(response.user));
      window.dispatchEvent(new Event('auth-change'));
      
      navigate('/');
    } catch (err) {
      setError((err as Error).message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Email">
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className={inputCls}
        />
      </Field>

      <Field label="Password">
        <input
          type="password"
          name="password"
          required
          placeholder="Enter your password"
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
            Logging in...
          </>
        ) : (
          <>
            Login
            <LogIn className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="text-center text-sm text-ink/60">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-medium text-saffron-700 hover:text-saffron-800"
        >
          Register
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
