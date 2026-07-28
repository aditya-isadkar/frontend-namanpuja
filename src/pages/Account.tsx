import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    document.title = 'My Account | Naman Puja';
    const stored = localStorage.getItem('np_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setForm({ name: parsed.name || '', email: parsed.email || '', phone: parsed.phone || '' });
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  function handleLogout() {
    localStorage.removeItem('np_user_token');
    localStorage.removeItem('np_user');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  }

  function handleCancel() {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
    }
    setError('');
    setEditing(false);
  }

  async function handleSave() {
    if (!user) return;
    setError('');
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.');
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem('np_user_token');
      const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to update profile.');
      }
      const updatedUser = { ...user, ...form };
      localStorage.setItem('np_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new Event('auth-change'));
      setEditing(false);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  const initial = user.name?.trim()?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Header */}
        <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f2e54a] text-2xl font-bold text-black">
            {initial}
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink">{user.name}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Account Details */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Account Details</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-sm font-bold text-saffron-600 hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {editing ? (
            <div className="space-y-4">
              {(['name', 'email', 'phone'] as const).map((field) => (
                <div key={field}>
                  <label className="mb-1 block text-sm font-medium text-gray-500 capitalize">{field}</label>
                  <input
                    type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                    value={form[field]}
                    onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-ink focus:border-saffron-500 focus:outline-none"
                  />
                </div>
              ))}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded-full px-5 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-[#f2e54a] px-5 py-2 text-sm font-bold text-black hover:bg-yellow-300 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <dl className="divide-y divide-gray-100">
              {[
                { label: 'Full Name', value: user.name },
                { label: 'Email', value: user.email },
                { label: 'Phone', value: user.phone || '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-3">
                  <dt className="text-sm font-medium text-gray-500">{label}</dt>
                  <dd className="text-sm font-semibold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* Booking History */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-ink">My Puja Bookings</h2>
          <p className="text-sm text-gray-500">
            You haven't made any bookings yet.{' '}
            <Link to="/pujas/MainPuja" className="font-semibold text-saffron-600 hover:underline">
              Browse Pujas
            </Link>
          </p>
        </div>

        {/* Logout */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-5 py-2 text-sm font-bold text-red-600 hover:bg-red-100 transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
