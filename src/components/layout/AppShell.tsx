import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  LayoutDashboard,
  HeartHandshake,
  ShieldCheck,
  Bell,
  LogOut,
  ChevronDown,
  LifeBuoy,
  FileText,
  Stethoscope,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/ProductUI';

const NAV = [
  { to: '/', label: 'Care Workspace', hint: 'Patients & records', icon: LayoutDashboard, roles: ['DOCTOR', 'ADMIN', 'AUDITOR'] },
  { to: '/patient-portal', label: 'My Health', hint: 'Consents & history', icon: HeartHandshake, roles: ['PATIENT', 'DOCTOR', 'ADMIN'] },
  { to: '/compliance', label: 'Safety & Activity', hint: 'Audit ledger', icon: ShieldCheck, roles: ['ADMIN', 'AUDITOR', 'DOCTOR'] },
];

const NOTIFICATIONS = [
  { id: 1, title: 'OTP verified', body: 'Alice Smith approved access for 2 hours', time: '12 min ago', icon: CheckCircle2, tone: 'text-teal-600 bg-teal-50' },
  { id: 2, title: 'Critical lab flagged', body: 'Troponin I 0.08 ng/mL needs review', time: '38 min ago', icon: Activity, tone: 'text-red-600 bg-red-50' },
  { id: 3, title: 'New visit note ready', body: 'Cardiology follow-up from St. Jude', time: '2 hr ago', icon: FileText, tone: 'text-sky-600 bg-sky-50' },
];

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const visibleNav = NAV.filter((n) => !user || n.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-[#F7F8F7]">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-slate-200/80 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2.5 px-5 pt-6 pb-5">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-[0_4px_12px_-2px_rgba(13,148,136,0.5)]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="font-display font-bold text-[15px] text-slate-900 leading-none">CarePoint</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Your health, connected</p>
          </div>
        </Link>

        <nav className="px-3 space-y-1 flex-1">
          <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Care menu</p>
          {visibleNav.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                  active ? 'bg-teal-50 text-teal-900 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-[18px] h-[18px] ${active ? 'text-teal-600' : 'text-slate-400'}`} />
                <span className="flex-1">{item.label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
              </Link>
            );
          })}

          <p className="px-3 pt-5 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Helpful resources</p>
          {[
            { label: 'Find a specialist', icon: Stethoscope, hint: 'Cardiology, ortho & more' },
            { label: 'Visit guides', icon: FileText, hint: 'Prep for appointments' },
            { label: 'Help & support', icon: LifeBuoy, hint: 'We reply in minutes' },
          ].map((r) => (
            <button
              key={r.label}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition text-left"
            >
              <r.icon className="w-[18px] h-[18px] text-slate-400" />
              <span className="flex-1">
                <span className="block leading-tight">{r.label}</span>
                <span className="block text-[11px] text-slate-400">{r.hint}</span>
              </span>
            </button>
          ))}
        </nav>

        <div className="p-4">
          <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 p-4 text-white">
            <p className="text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> You're protected
            </p>
            <p className="text-[11px] text-teal-100 mt-1 leading-relaxed">
              Every record view is consent-checked and logged for your safety.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3 px-1 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All systems normal · v2.4.1
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-40 bg-[#F7F8F7]/85 backdrop-blur-md border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
            <Link to="/" className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-slate-900">CarePoint</span>
            </Link>

            {/* Mobile nav */}
            <nav className="lg:hidden flex items-center gap-1 ml-1">
              {visibleNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`p-2 rounded-xl transition ${location.pathname === item.to ? 'bg-teal-100 text-teal-800' : 'text-slate-500'}`}
                  aria-label={item.label}
                >
                  <item.icon className="w-5 h-5" />
                </Link>
              ))}
            </nav>

            <div className="hidden sm:flex items-center gap-2 ml-1">
              <span className="pill bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live · St. Jude network
              </span>
            </div>

            <div className="flex-1" />

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications((v) => !v); setShowUserMenu(false); }}
                className="relative p-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-600 transition"
                aria-label="Notifications"
              >
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
              </button>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 mt-2 w-80 card p-2 z-20 animate-rise shadow-xl">
                    <p className="px-3 pt-2 pb-1 text-xs font-bold text-slate-900">Updates for you</p>
                    {NOTIFICATIONS.map((n) => (
                      <div key={n.id} className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.tone}`}>
                          <n.icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-slate-900 leading-tight">{n.title}</p>
                          <p className="text-xs text-slate-500 leading-snug mt-0.5">{n.body}</p>
                          <p className="text-[11px] text-slate-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => { setShowUserMenu((v) => !v); setShowNotifications(false); }}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition"
              >
                <Avatar name={user?.fullName ?? 'Guest'} size="sm" />
                <span className="hidden sm:block text-left">
                  <span className="block text-[13px] font-semibold text-slate-900 leading-none max-w-[140px] truncate">
                    {user?.fullName?.split(',')[0] ?? 'Guest'}
                  </span>
                  <span className="block text-[11px] text-slate-400 capitalize mt-0.5">{user?.role?.toLowerCase() ?? ''} account</span>
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-60 card p-2 z-20 animate-rise shadow-xl">
                    <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                      <p className="text-[13px] font-semibold text-slate-900 truncate">{user?.fullName}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition font-medium"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>

        {/* Product footer */}
        <footer className="border-t border-slate-200/70 bg-white/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-slate-700">CarePoint Health Exchange</span>
              <span className="hidden sm:inline text-slate-400">· Caring for 2.4M members nationwide</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Operational
              </span>
              <a className="hover:text-slate-800 transition cursor-pointer">Privacy</a>
              <a className="hover:text-slate-800 transition cursor-pointer">Terms</a>
              <a className="hover:text-slate-800 transition cursor-pointer">Security</a>
              <span className="pill bg-slate-100 text-slate-500 border border-slate-200">HIPAA-ready</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
