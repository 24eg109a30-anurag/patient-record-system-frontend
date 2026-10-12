import React, { useState, useEffect } from 'react';
import { ShieldCheck, History, HeartPulse, Pill, FlaskConical, BellRing, CheckCircle2, XCircle, Clock3 } from 'lucide-react';
import { MOCK_TIMELINE } from '../api/client';
import { MedicalRecordTimeline } from '../types';
import { MedicalTimeline } from '../components/timeline/MedicalTimeline';
import { useToast } from '../context/ToastContext';
import { Avatar, PageHeader, StatCard, StatusPill } from '../components/ui/ProductUI';

interface ConsentItem {
  id: string;
  doctorName: string;
  hospital: string;
  purpose: string;
  status: 'APPROVED' | 'PENDING';
  validUntil: string;
}

export const PatientDashboard: React.FC = () => {
  const { notify } = useToast();
  const [activeTab, setActiveTab] = useState<'CONSENTS' | 'RECORDS'>('CONSENTS');
  const [timeline, setTimeline] = useState<MedicalRecordTimeline[]>([]);
  const [consents, setConsents] = useState<ConsentItem[]>([
    {
      id: 'cst-1',
      doctorName: 'Dr. Sarah Jenkins, MD',
      hospital: 'St. Jude Heart Institute',
      purpose: 'Cardiology Review · full history for 2 hours',
      status: 'APPROVED',
      validUntil: '1h 45m left',
    },
    {
      id: 'cst-2',
      doctorName: 'Dr. Marcus Vance, DO',
      hospital: 'Metropolitan General Hospital',
      purpose: 'Follow-up Consultation · recent visits only',
      status: 'PENDING',
      validUntil: 'Waiting on your 6-digit code',
    },
  ]);

  useEffect(() => {
    setTimeline(MOCK_TIMELINE['p1-uuid-4471'] || []);
  }, []);

  const approve = (id: string) => {
    setConsents((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'APPROVED', validUntil: '2h 00m left' } : c)));
    notify('You approved access ✅', { message: 'The doctor can now see your records for 2 hours.' });
  };

  const handleRevoke = (id: string) => {
    const item = consents.find((c) => c.id === id);
    setConsents(consents.filter((c) => c.id !== id));
    notify('Access taken back', { message: `${item?.doctorName ?? 'Doctor'} can no longer see your records.`, kind: 'info' });
  };

  const medCount = timeline.reduce((n, t) => n + t.prescriptions.length, 0);
  const labCount = timeline.reduce((n, t) => n + t.labResults.length, 0);

  return (
    <div className="animate-fade">
      <PageHeader
        eyebrow="Your health home"
        title="Hi, Johnathon — here's your health at a glance 💚"
        subtitle="See who's caring for you, approve access in one tap, and revisit any visit."
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
        <StatCard icon={HeartPulse} label="Visits on file" value={String(timeline.length)} hint="Across 2 hospitals" accent="" iconBg="bg-teal-50 text-teal-600" />
        <StatCard icon={Pill} label="Medicines" value={String(medCount)} hint="Currently prescribed" accent="" iconBg="bg-violet-50 text-violet-600" />
        <StatCard icon={FlaskConical} label="Lab results" value={String(labCount)} hint="All in one place" accent="" iconBg="bg-sky-50 text-sky-600" />
        <StatCard icon={ShieldCheck} label="Doctors approved" value={String(consents.filter((c) => c.status === 'APPROVED').length)} hint="You're in control" accent="" iconBg="bg-emerald-50 text-emerald-600" />
      </div>

      {/* Profile hero */}
      <div className="card p-5 mb-5 flex flex-col md:flex-row md:items-center gap-4">
        <Avatar name="Johnathon Edward Doe" size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-lg font-bold text-slate-900">Johnathon Edward Doe</h2>
            <span className="font-mono text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg">NHID-9821-4471</span>
            <StatusPill tone="teal"><CheckCircle2 className="w-3 h-3" /> Verified identity</StatusPill>
          </div>
          <p className="text-xs text-slate-500 mt-1.5">
            Born Jun 15, 1974 · O-Positive · Emergency contact <strong className="text-slate-700">+1 (555) 010-0005</strong>
          </p>
          <p className="text-xs text-red-600 font-medium mt-1">⚠ Allergies: Penicillin (severe), Sulfa drugs — shown to every doctor you approve.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setActiveTab('CONSENTS')} className="btn-primary !py-2.5">
            <ShieldCheck className="w-4 h-4" /> Review approvals
          </button>
          <button onClick={() => setActiveTab('RECORDS')} className="btn-secondary !py-2.5">
            <History className="w-4 h-4" /> My visits
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-slate-200/70 p-1 rounded-2xl text-sm font-semibold w-fit mb-4">
        <button
          onClick={() => setActiveTab('CONSENTS')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${activeTab === 'CONSENTS' ? 'bg-teal-600 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <ShieldCheck className="w-4 h-4" /> Who can see my records
        </button>
        <button
          onClick={() => setActiveTab('RECORDS')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${activeTab === 'RECORDS' ? 'bg-teal-600 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <History className="w-4 h-4" /> My visits & results
        </button>
      </div>

      {activeTab === 'CONSENTS' ? (
        <div className="space-y-3">
          <div className="card p-4 flex items-start gap-3 bg-teal-50/50 !border-teal-200">
            <BellRing className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <p className="text-[13px] text-slate-600 leading-relaxed">
              <strong className="text-slate-900">You&apos;re in charge.</strong> Nothing is shared without your 6-digit
              code. Approvals last 2 hours, and you can take them back anytime — instantly.
            </p>
          </div>

          {consents.map((item) => (
            <div key={item.id} className="card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3.5 animate-rise">
              <Avatar name={item.doctorName} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-[15px] text-slate-900">{item.doctorName}</span>
                  <StatusPill tone={item.status === 'APPROVED' ? 'teal' : 'amber'}>
                    {item.status === 'APPROVED' ? <CheckCircle2 className="w-3 h-3" /> : <Clock3 className="w-3 h-3" />}
                    {item.status === 'APPROVED' ? 'Can see your records' : 'Waiting for you'}
                  </StatusPill>
                </div>
                <p className="text-xs text-slate-500 mt-1">{item.hospital}</p>
                <p className="text-[13px] text-slate-600 mt-0.5">{item.purpose}</p>
                <p className="text-[11px] text-slate-400 mt-1">{item.validUntil}</p>
              </div>
              <div className="shrink-0">
                {item.status === 'APPROVED' ? (
                  <button onClick={() => handleRevoke(item.id)} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-[13px] font-semibold transition">
                    <XCircle className="w-4 h-4" /> Take back access
                  </button>
                ) : (
                  <button onClick={() => approve(item.id)} className="btn-primary">
                    <CheckCircle2 className="w-4 h-4" /> Approve with code
                  </button>
                )}
              </div>
            </div>
          ))}

          {consents.length === 0 && (
            <div className="card p-10 text-center">
              <ShieldCheck className="w-8 h-8 mx-auto text-teal-500 mb-2" />
              <h3 className="font-display font-bold text-slate-900">All quiet — nobody has access</h3>
              <p className="text-sm text-slate-500 mt-1">When a doctor asks to see your records, they&apos;ll show up here.</p>
            </div>
          )}
        </div>
      ) : (
        <MedicalTimeline timeline={timeline} />
      )}
    </div>
  );
};
