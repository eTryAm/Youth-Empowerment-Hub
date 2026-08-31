'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { cn, safeAdminRedirect } from '@/lib/utils';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Shield } from 'lucide-react';

const ERROR_MESSAGES: Record<string, string> = {
  auth_callback_error: 'Sign-in could not be completed. Please try again.',
  no_account: 'This account is not authorized for the admin portal.',
  account_disabled: 'This account has been disabled. Contact a super admin.',
  unauthorized: 'You do not have access to that area.',
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeAdminRedirect(searchParams.get('redirectTo'));
  const queryError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(ERROR_MESSAGES[queryError ?? ''] || '');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
      <div className="absolute inset-0 mesh-bg opacity-60" />
      <div className="absolute inset-0 dot-pattern opacity-20" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-3xl overflow-hidden bg-white shadow-2xl ring-4 ring-white/30 mb-4 p-1.5 hover:scale-105 transition-transform">
            <Image
              src="/images/logo.png"
              alt="Youth Empowerment Hub Logo"
              fill
              className="object-contain p-1"
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-1.5">
            <span className="text-[#0284C7]">Youth</span>
            <span className="text-[#F97316]">Empowerment Hub</span>
          </h1>
          <p className="text-slate-300 font-bold text-xs uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
            <span>Learn</span>
            <span className="w-1 h-1 rounded-full bg-[#0284C7]" />
            <span>Innovate</span>
            <span className="w-1 h-1 rounded-full bg-[#F97316]" />
            <span>Grow</span>
          </p>
        </div>

        <div className="glass-dark rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-1">Welcome back</h2>
          <p className="text-[var(--color-text-on-dark-muted)] text-sm mb-6">
            Sign in to manage the Youth Empowerment Hub ecosystem.
          </p>

          {error ? (
            <div className="mb-4 p-3 rounded-lg bg-[var(--color-accent-rose)]/10 border border-[var(--color-accent-rose)]/20 text-[var(--color-accent-rose)] text-sm">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-on-dark)]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-on-dark-muted)]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yeh.official"
                  required
                  autoComplete="email"
                  className={cn(
                    'w-full h-11 pl-10 pr-4 rounded-xl text-sm text-white',
                    'bg-white/5 border border-white/10',
                    'placeholder:text-[var(--color-text-on-dark-muted)]/50',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]/50',
                    'transition-all duration-200'
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-on-dark)]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-on-dark-muted)]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className={cn(
                    'w-full h-11 pl-10 pr-11 rounded-xl text-sm text-white',
                    'bg-white/5 border border-white/10',
                    'placeholder:text-[var(--color-text-on-dark-muted)]/50',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]/50',
                    'transition-all duration-200'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-on-dark-muted)] hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className={cn(
                'w-full h-11 rounded-xl text-sm font-medium text-white',
                'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-violet)]',
                'hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-2'
              )}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[var(--color-text-on-dark-muted)]/60 mt-6">
          This portal is restricted to authorized administrators only.
          <br />
          All access is monitored and logged.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0F1C]" />}>
      <LoginForm />
    </Suspense>
  );
}
