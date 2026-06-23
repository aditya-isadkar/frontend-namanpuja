import type { Metadata } from "next";
import { Reveal } from "@/components/motion";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <section className="bg-saffron-radial min-h-screen mt-12">
      <div className="container-page py-16">
        <div className="mx-auto max-w-md">
          <Reveal>
            <div className="rounded-3xl border border-saffron-100 bg-white p-8 shadow-glow">
              <div className="mb-8 text-center">
                <span className="badge">Welcome Back</span>

                <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">
                  Login
                </h1>

                <p className="mt-3 text-ink/70">
                  Sign in to access your bookings and account details.
                </p>
              </div>

              {/* Login Form Component Goes Here */}
              <div className="rounded-xl border border-dashed border-saffron-200 p-6 text-center text-sm text-ink/50">
               <LoginForm />
              </div>
              
              
             
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}