import { Reveal } from '@/components/motion';
import { RegistrationForm } from '@/components/RegistrationForm';
import { SEOMetadata } from '@/components/SEOMetadata';

export default function Register() {
  return (
    <section className="bg-saffron-radial min-h-screen">
      <SEOMetadata
        title="Register / Create Account"
        description="Register an account on Naman Puja to easily book pujas, track your requests, and manage your account."
      />
      <div className="container-page py-16">
        <div className="mx-auto max-w-md">
          <Reveal>
            <div className="rounded-3xl border border-saffron-100 bg-white p-8 shadow-glow">
              <div className="mb-8 text-center">
                <span className="badge">Join Us</span>
                <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">Create Account</h1>
                <p className="mt-3 text-ink/70">Register to book pujas, track your requests, and manage your account.</p>
              </div>
              <RegistrationForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
