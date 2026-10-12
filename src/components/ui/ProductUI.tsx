import React from 'react';
import { LucideIcon } from 'lucide-react';

/* ---------- Avatar with friendly initials ---------- */
const AVATAR_COLORS = [
  'bg-teal-100 text-teal-800',
  'bg-amber-100 text-amber-800',
  'bg-sky-100 text-sky-800',
  'bg-rose-100 text-rose-800',
  'bg-violet-100 text-violet-800',
  'bg-emerald-100 text-emerald-800',
];

export function initialsOf(name: string): string {
  const parts = name.replace(/^(Dr|Mr|Ms|Mrs)\.\s*/i, '').trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar: React.FC<{ name: string; size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  name,
  size = 'md',
  className = '',
}) => {
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const color = AVATAR_COLORS[hash % AVATAR_COLORS.length];
  const dims = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-14 h-14 text-lg' : 'w-10 h-10 text-sm';
  return (
    <div className={`${dims} ${color} rounded-full flex items-center justify-center font-bold shrink-0 ${className}`}>
      {initialsOf(name)}
    </div>
  );
};

/* ---------- Status pill ---------- */
export const StatusPill: React.FC<{ tone: 'teal' | 'amber' | 'red' | 'slate' | 'violet' | 'sky'; children: React.ReactNode }> = ({
  tone,
  children,
}) => {
  const tones: Record<string, string> = {
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
    violet: 'bg-violet-50 text-violet-700 border-violet-200',
    sky: 'bg-sky-50 text-sky-700 border-sky-200',
  };
  return <span className={`pill border ${tones[tone]}`}>{children}</span>;
};

/* ---------- KPI stat card ---------- */
export const StatCard: React.FC<{
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  accent: string;
  iconBg: string;
}> = ({ icon: Icon, label, value, hint, iconBg }) => (
  <div className="card card-hover p-4 flex items-start gap-3 animate-rise">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="font-display text-xl font-800 font-bold text-slate-900 leading-tight">{value}</p>
      <p className="text-[11px] text-slate-400 truncate">{hint}</p>
    </div>
  </div>
);

/* ---------- Page header ---------- */
export const PageHeader: React.FC<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}> = ({ eyebrow, title, subtitle, actions }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
    <div>
      {eyebrow && (
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-teal-600 mb-1">{eyebrow}</p>
      )}
      <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-1 max-w-2xl">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
  </div>
);

/* ---------- Empty state ---------- */
export const EmptyState: React.FC<{
  icon: LucideIcon;
  title: string;
  message: string;
  action?: React.ReactNode;
}> = ({ icon: Icon, title, message, action }) => (
  <div className="card p-10 text-center">
    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="font-display font-bold text-slate-900">{title}</h3>
    <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">{message}</p>
    {action}
  </div>
);

/* ---------- Friendly skeleton ---------- */
export const SkeletonList: React.FC = () => (
  <div className="space-y-2.5 animate-pulse">
    {[0, 1, 2].map((i) => (
      <div key={i} className="card p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-200 rounded w-1/2" />
          <div className="h-2.5 bg-slate-100 rounded w-1/3" />
        </div>
      </div>
    ))}
  </div>
);
