'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { cn, safeAdminRedirect } from '@/lib/utils';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

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
        setError('Invalid email or password. Please check your credentials and try again.');
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
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1C] text-white px-4 py-12 relative overflow-hidden">
      {/* Background Lighting & Grid */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden bg-white shadow-2xl ring-2 sm:ring-4 ring-white/20 mb-4 p-1.5 hover:scale-105 transition-transform">
            <Image
              src="/images/logo.png"
              alt="Youth Empowerment Hub Logo"
              fill
              className="object-contain p-1"
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-1.5 text-white">
            <span className="text-[#0284C7]">Youth</span>
            <span className="text-[#F97316]">Empowerment Hub</span>
          </h1>
          <p className="text-slate-300 font-bold text-xs uppercase tracking-wider mt-1 flex items-center gap-1.5">
            <span>Learn</span>
            <span className="w-1 h-1 rounded-full bg-[#0284C7]" />
            <span>Innovate</span>
            <span className="w-1 h-1 rounded-full bg-[#F97316]" />
            <span>Grow</span>
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl bg-[#0F172A]/90 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 space-y-1">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-400 text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" /> Admin Authorization
            </div>
            <h2 className="text-xl font-bold text-white">Administrator Portal</h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Sign in with your authorized admin account to manage the ecosystem.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-400/30 text-rose-300 text-xs font-semibold leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold text-slate-300">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  className={cn(
                    'w-full h-11 pl-10 pr-4 rounded-xl text-sm text-white',
                    'bg-white/5 border border-white/10',
                    'placeholder:text-slate-500',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50',
                    'transition-all duration-200'
                  )}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-bold text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
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
                    'placeholder:text-slate-500',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50',
                    'transition-all duration-200'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !email || !password}
                className={cn(
                  'w-full h-11 sm:h-12 rounded-xl text-sm font-bold text-white cursor-pointer',
                  'bg-gradient-to-r from-blue-600 via-indigo-600 to-[#F97316]',
                  'hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg shadow-blue-500/25',
                  'transition-all duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'flex items-center justify-center gap-2'
                )}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Authenticate & Access Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-slate-500 mt-6 leading-relaxed">
          Protected by Youth Empowerment Hub 256-bit SSL authentication.
          <br />
          Unauthorized access attempts are monitored and recorded.
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