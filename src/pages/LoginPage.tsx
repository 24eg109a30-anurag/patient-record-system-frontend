import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, Lock, ArrowRight, Stethoscope, HeartHandshake, ClipboardCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import { Role } from '../types';

const ROLE_ICON: Record<Role, typeof Stethoscope> = {
  DOCTOR: Stethoscope,
  PATIENT: HeartHandshake,
  ADMIN: ClipboardCheck,
  AUDITOR: ClipboardCheck,
};

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('dr.jenkins@stjude.org');
  const [password, setPassword] = useState('Doctor@123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Hmm, that didn\'t match our records. Try a demo account below — no password stress.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = (role: Role) => {
    loginAsDemo(role);
    navigate(role === 'PATIENT' ? '/patient-portal' : role === 'ADMIN' ? '/compliance' : '/');
  };

  return (
    <div className="min-h-screen bg-blobs flex">
      {/* Brand panel */}
      <div className="hidden lg:flex w-[46%] flex-col justify-between p-10 bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="absolute bottom-10 -left-20 w-80 h-80 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="relative flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="font-display font-bold text-lg leading-none">CarePoint</p>
            <p className="text-xs text-teal-100/80">Your health, connected</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <h1 className="font-display text-4xl font-bold leading-tight">
            Every doctor visit, lab & prescription — finally in one place.
          </h1>
          <p className="text-teal-100/90 mt-4 leading-relaxed">
            CarePoint brings your hospitals, doctors, and health history together. Share access with a tap, stay in control, and never repeat your story again.
          </p>
          <div className="grid grid-cols-3 gap-3 mt-8">
            {[
              { v: '2.4M+', l: 'members cared for' },
              { v: '380+', l: 'hospitals linked' },
              { v: '4.9★', l: 'patient rating' },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-white/10 backdrop-blur p-3.5">
                <p className="font-display text-xl font-bold">{s.v}</p>
                <p className="text-[11px] text-teal-100/80 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-4 text-xs text-teal-100/80">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> HIPAA-ready</span>
          <span className="inline-flex items-center gap-1.5"><Lock className="w-4 h-4" /> Bank-grade encryption</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md animate-rise">
          <div className="lg:hidden flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white">
              <Activity className="w-5 h-5" />
            </div>
            <p className="font-display font-bold text-lg">CarePoint</p>
          </div>

          <h2 className="font-display text-2xl font-bold text-slate-900">Welcome back 👋</h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">Sign in to see your care team, records, and approvals.</p>

          <form onSubmit={handleSignIn} className="card p-5 space-y-3.5">
            <div>
              <label className="label-friendly" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-friendly"
                placeholder="you@example.com"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="label-friendly" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-friendly pr-11"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">{error}</p>
            )}

            <button type="submit" disabled={isLoading} className="btn-primary w-full">
              {isLoading ? 'Signing you in…' : 'Sign in'} <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-slate-400 text-center">Protected by consent checks & audit logging on every view.</p>
          </form>

          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">Try a demo account — one tap</p>
            <div className="grid gap-2">
              {DEMO_CREDENTIALS.map((d) => {
                const Icon = ROLE_ICON[d.role];
                return (
                  <button
                    key={d.role}
                    onClick={() => handleDemo(d.role)}
                    className="card card-hover p-3 flex items-center gap-3 text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{d.name}</p>
                      <p className="text-xs text-slate-400 truncate">{d.blurb} · {d.email}</p>
                    </div>
                    <span className="text-xs font-semibold text-teal-700 shrink-0">Enter →</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
