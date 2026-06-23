import type { Metadata } from 'next';
import { Reveal } from '@/components/motion';
import { RegistrationForm } from '@/components/RegistrationForm';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create your account to book pujas and manage your bookings.',
};

export default function RegisterPage() {
  return (
    <section className="bg-saffron-radial min-h-screen ">
      <div className="container-page py-16 ">
        <div className="mx-auto max-w-md">
          <Reveal>
            <div className="rounded-3xl border border-saffron-100 bg-white p-8 shadow-glow">
              <div className="mb-8 text-center">
                <span className="badge">Join Us</span>

                <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">
                  Create Account
                </h1>

                <p className="mt-3 text-ink/70">
                  Register to book pujas, track your requests, and manage your account.
                </p>
              </div>

              {/* Registration Form Component Goes Here */}
              <div className="rounded-xl border border-dashed border-saffron-200 p-6 text-center text-sm text-ink/50">
                <RegistrationForm />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}