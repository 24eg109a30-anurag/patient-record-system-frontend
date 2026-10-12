import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Activity, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, switchRole } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight text-slate-900">National EHR</span>
          </div>
        </div>

        {/* Primary Links */}
        <nav className="flex items-center space-x-1">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              location.pathname === '/'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Clinical Portal
          </Link>
          <Link
            to="/patient-portal"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              location.pathname === '/patient-portal'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Patient Consent
          </Link>
          <Link
            to="/compliance"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              location.pathname === '/compliance'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Audit Trail
          </Link>
        </nav>

        {/* Role Switcher */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
            {(['DOCTOR', 'PATIENT', 'ADMIN'] as const).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`px-2.5 py-1 rounded-md transition capitalize text-[11px] ${
                  user?.role === r
                    ? 'bg-white text-teal-700 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r.toLowerCase()}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 text-xs pl-2 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-slate-700 truncate max-w-[140px]">{user?.fullName?.split(',')[0]}</span>
            {user?.licenseVerified && <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />}
          </div>
        </div>
      </div>
    </header>
  );
};
