import React, { useState, useEffect, useMemo } from 'react';
import { EhrApi } from '../api/client';
import { AuditLogItem } from '../types';
import { ShieldCheck, Siren, Sparkles, KeyRound, Search, Download, Filter } from 'lucide-react';
import { PageHeader, StatCard, Avatar } from '../components/ui/ProductUI';
import { useToast } from '../context/ToastContext';

const FILTERS = [
  { key: 'ALL', label: 'Everything' },
  { key: 'BREAK_GLASS_OVERRIDE', label: 'Emergency access' },
  { key: 'RAG_CLINICAL_QUERY', label: 'AI summaries' },
  { key: 'CONSENT_GRANTED', label: 'Approvals' },
];

const ACTION_META: Record<string, { label: string; tone: string; icon: typeof ShieldCheck }> = {
  BREAK_GLASS_OVERRIDE: { label: 'Emergency access', tone: 'bg-red-50 text-red-700 border-red-200', icon: Siren },
  RAG_CLINICAL_QUERY: { label: 'AI summary', tone: 'bg-violet-50 text-violet-700 border-violet-200', icon: Sparkles },
  CONSENT_GRANTED: { label: 'Patient approved', tone: 'bg-teal-50 text-teal-700 border-teal-200', icon: KeyRound },
};

export const ComplianceAuditPage: React.FC = () => {
  const { notify } = useToast();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [filterAction, setFilterAction] = useState('ALL');
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const data = await EhrApi.getAuditLogs();
    setLogs(data);
  };

  const filteredLogs = useMemo(
    () =>
      logs.filter((log) => {
        if (filterAction !== 'ALL' && log.action !== filterAction) return false;
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          log.details.toLowerCase().includes(q) ||
          (log.patientName ?? '').toLowerCase().includes(q) ||
          log.actorRole.toLowerCase().includes(q) ||
          log.ipAddress.includes(q)
        );
      }),
    [logs, filterAction, query]
  );

  const counts = useMemo(
    () => ({
      total: logs.length,
      emergency: logs.filter((l) => l.action.includes('BREAK_GLASS')).length,
      ai: logs.filter((l) => l.action.includes('RAG')).length,
      consent: logs.filter((l) => l.action.includes('CONSENT')).length,
    }),
    [logs]
  );

  const exportCsv = () => {
    const rows = [['time', 'action', 'actor', 'patient', 'ip', 'details']];
    filteredLogs.forEach((l) =>
      rows.push([l.loggedAt, l.action, `${l.actorRole} ${l.actorId}`, l.patientName ?? '', l.ipAddress, `"${l.details.replace(/"/g, '""')}"`])
    );
    const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'carepoint-safety-log.csv';
    a.click();
    URL.revokeObjectURL(url);
    notify('Report downloaded', { message: `${filteredLogs.length} events exported for review.` });
  };

  return (
    <div className="animate-fade">
      <PageHeader
        eyebrow="Trust & safety"
        title="Safety & Activity 🛡️"
        subtitle="A plain-English record of who saw what, when, and why — so patients and clinics always feel safe."
        actions={
          <button onClick={exportCsv} className="btn-secondary !py-2.5">
            <Download className="w-4 h-4" /> Download report
          </button>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
        <StatCard icon={ShieldCheck} label="Events tracked" value={String(counts.total)} hint="100% of views logged" accent="" iconBg="bg-teal-50 text-teal-600" />
        <StatCard icon={Siren} label="Emergency access" value={String(counts.emergency)} hint="Flagged for review" accent="" iconBg="bg-red-50 text-red-600" />
        <StatCard icon={Sparkles} label="AI summaries" value={String(counts.ai)} hint="With sources attached" accent="" iconBg="bg-violet-50 text-violet-600" />
        <StatCard icon={KeyRound} label="Patient approvals" value={String(counts.consent)} hint="Given by code" accent="" iconBg="bg-emerald-50 text-emerald-600" />
      </div>

      <div className="card p-3 mb-4 flex flex-col md:flex-row md:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by patient, doctor, detail, or IP…"
            className="input-friendly pl-10"
          />
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 shrink-0" />
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterAction(f.key)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${filterAction === f.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="hidden sm:grid grid-cols-12 gap-2 px-5 py-2.5 bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span className="col-span-3">What happened</span>
          <span className="col-span-2">Who</span>
          <span className="col-span-2">Patient</span>
          <span className="col-span-4">Details</span>
          <span className="col-span-1 text-right">When</span>
        </div>
        <div className="divide-y divide-slate-100">
          {filteredLogs.map((log) => {
            const meta = ACTION_META[log.action] ?? { label: log.action.replace(/_/g, ' '), tone: 'bg-slate-100 text-slate-600 border-slate-200', icon: ShieldCheck };
            const Icon = meta.icon;
            return (
              <div key={log.id} className="px-5 py-3.5 grid sm:grid-cols-12 gap-2 items-center hover:bg-slate-50/60 transition text-[13px]">
                <div className="sm:col-span-3">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${meta.tone}`}>
                    <Icon className="w-3 h-3" /> {meta.label}
                  </span>
                </div>
                <div className="sm:col-span-2 flex items-center gap-2 min-w-0">
                  <Avatar name={log.actorId} size="sm" />
                  <span className="font-semibold text-slate-800 truncate">{log.actorRole}</span>
                </div>
                <div className="sm:col-span-2 text-slate-500 truncate">{log.patientName ?? '—'}</div>
                <div className="sm:col-span-4 text-slate-600 leading-snug line-clamp-2">{log.details}</div>
                <div className="sm:col-span-1 text-right">
                  <p className="text-xs text-slate-500 font-medium">
                    {new Date(log.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">{log.ipAddress}</p>
                </div>
              </div>
            );
          })}
          {filteredLogs.length === 0 && (
            <div className="p-10 text-center">
              <ShieldCheck className="w-8 h-8 mx-auto text-teal-500 mb-2" />
              <h3 className="font-display font-bold text-slate-900">Nothing matches</h3>
              <p className="text-sm text-slate-500 mt-1">Try a different search or filter — every view is still being logged.</p>
            </div>
          )}
        </div>
      </div>
      <p className="text-[11px] text-slate-400 mt-3 text-center">
        Logs are tamper-proof and kept for 7 years · Questions? Contact safety@carepoint.health
      </p>
    </div>
  );
};
