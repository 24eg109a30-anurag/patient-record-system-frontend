import React, { useState, useEffect, useMemo } from 'react';
import { PatientSearch } from '../components/patient/PatientSearch';
import { PatientHeader } from '../components/patient/PatientHeader';
import { MedicalTimeline } from '../components/timeline/MedicalTimeline';
import { ConsentModal } from '../components/consent/ConsentModal';
import { BreakGlassModal } from '../components/consent/BreakGlassModal';
import { AiClinicalAssistantDrawer } from '../components/rag/AiClinicalAssistantDrawer';
import { EhrApi } from '../api/client';
import { PatientSummary, MedicalRecordTimeline } from '../types';
import { Lock, X, Users, ShieldCheck, FlaskConical, Siren, Sparkles, PlusCircle, CalendarCheck, Clock3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatCard, PageHeader, SkeletonList } from '../components/ui/ProductUI';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { notify } = useToast();
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);
  const [timeline, setTimeline] = useState<MedicalRecordTimeline[]>([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [isBreakGlassOpen, setIsBreakGlassOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isNewEncounterOpen, setIsNewEncounterOpen] = useState(false);

  const [hospitalName, setHospitalName] = useState('St. Jude Medical Center');
  const [encounterType, setEncounterType] = useState('OUTPATIENT');
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState('');
  const [icd10Code, setIcd10Code] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');

  useEffect(() => {
    loadPatients('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPatients = async (query: string) => {
    setIsLoading(true);
    try {
      const data = await EhrApi.searchPatients(query);
      setPatients(data);
      if (!selectedPatient && data.length > 0) {
        await handleSelectPatient(data[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPatient = async (patient: PatientSummary) => {
    setSelectedPatient(patient);
    const accessAllowed = patient.activeConsent || patient.breakGlassActive;
    setHasAccess(accessAllowed);
    if (accessAllowed) {
      const records = await EhrApi.getPatientTimeline(patient.id);
      setTimeline(records);
    } else {
      setTimeline([]);
    }
  };

  const handleConsentGranted = async (_token: string) => {
    if (!selectedPatient) return;
    const updated = { ...selectedPatient, activeConsent: true };
    setSelectedPatient(updated);
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setHasAccess(true);
    const records = await EhrApi.getPatientTimeline(selectedPatient.id);
    setTimeline(records);
    notify('Access approved 🎉', { message: `${selectedPatient.fullName} shared their records for 2 hours.` });
  };

  const handleBreakGlassTriggered = async (reason: string, condition: string) => {
    if (!selectedPatient) return;
    await EhrApi.triggerBreakGlass(selectedPatient.id, reason, condition);
    const updated = { ...selectedPatient, breakGlassActive: true };
    setSelectedPatient(updated);
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setHasAccess(true);
    const records = await EhrApi.getPatientTimeline(selectedPatient.id);
    setTimeline(records);
    notify('Emergency access opened', {
      message: 'Logged to the safety board for review.',
      kind: 'warning',
    });
  };

  const handleCreateEncounter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !primaryDiagnosis) return;
    const newEncounter = await EhrApi.createEncounter({
      patientId: selectedPatient.id,
      hospitalName,
      encounterType,
      primaryDiagnosis,
      icd10Code,
      clinicalNotes,
      prescriptions: [],
      labResults: [],
    });
    setTimeline([newEncounter, ...timeline]);
    setIsNewEncounterOpen(false);
    setPrimaryDiagnosis('');
    setClinicalNotes('');
    notify('Visit note saved', { message: 'Added to the patient timeline.' });
  };

  const stats = useMemo(() => {
    const authorized = patients.filter((p) => p.activeConsent).length;
    const criticalLabs = timeline.flatMap((t) => t.labResults).filter((l) => l.status === 'CRITICAL').length;
    const emergencies = patients.filter((p) => p.breakGlassActive).length;
    return { authorized, criticalLabs, emergencies };
  }, [patients, timeline]);

  const firstName = user?.fullName?.replace(/^Dr\.\s*/, '').split(' ')[0] ?? 'Doctor';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="animate-fade">
      <PageHeader
        eyebrow={today}
        title={`Good to see you, ${firstName} 👋`}
        subtitle="Here's your day at a glance — pick a person below to catch up on their care."
        actions={
          <>
            <button onClick={() => setIsAiDrawerOpen(true)} className="btn-secondary !py-2.5 hidden sm:inline-flex" disabled={!selectedPatient}>
              <Sparkles className="w-4 h-4 text-teal-600" /> Ask AI
            </button>
            <button onClick={() => setIsNewEncounterOpen(true)} className="btn-primary !py-2.5" disabled={!selectedPatient || !hasAccess}>
              <PlusCircle className="w-4 h-4" /> New visit note
            </button>
          </>
        }
      />

      {/* Friendly KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
        <StatCard icon={Users} label="People in your care" value={String(patients.length)} hint="Across the network" accent="" iconBg="bg-teal-50 text-teal-600" />
        <StatCard icon={ShieldCheck} label="Sharing with you" value={String(stats.authorized)} hint="Consented · 2-hr windows" accent="" iconBg="bg-emerald-50 text-emerald-600" />
        <StatCard icon={FlaskConical} label="Critical labs" value={String(stats.criticalLabs)} hint={stats.criticalLabs > 0 ? 'Needs your eyes today' : 'All clear right now'} accent="" iconBg="bg-red-50 text-red-600" />
        <StatCard icon={Siren} label="Emergency overrides" value={String(stats.emergencies)} hint="Logged & reviewed" accent="" iconBg="bg-amber-50 text-amber-600" />
      </div>

      {/* Today's rhythm strip */}
      <div className="card p-4 mb-5 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2.5 text-sm">
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
            <CalendarCheck className="w-[18px] h-[18px]" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-[13px]">3 visits today · next at 10:30 AM</p>
            <p className="text-xs text-slate-400">Cardiology clinic · Room 4B · running on time</p>
          </div>
        </div>
        <div className="sm:ml-auto flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <Clock3 className="w-4 h-4 text-slate-400" />
          Avg. chart prep with AI: <strong className="text-slate-800">38 sec</strong> (was 9 min)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4">
          {isLoading && patients.length === 0 ? (
            <SkeletonList />
          ) : (
            <PatientSearch
              patients={patients}
              selectedPatientId={selectedPatient?.id || null}
              onSelectPatient={handleSelectPatient}
              onSearch={loadPatients}
            />
          )}

          <div className="card p-4 mt-4 bg-gradient-to-br from-teal-600 to-teal-800 !border-0 text-white">
            <p className="text-sm font-bold flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> New: AI visit prep</p>
            <p className="text-xs text-teal-100 mt-1 leading-relaxed">
              Get a 30-second catch-up before every appointment — recent visits, med changes, and labs to recheck.
            </p>
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              disabled={!selectedPatient}
              className="mt-3 w-full py-2.5 rounded-xl bg-white text-teal-800 text-xs font-bold hover:bg-teal-50 transition disabled:opacity-60"
            >
              Try it with {selectedPatient ? selectedPatient.fullName.split(' ')[0] + '’s chart' : 'a patient'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8 min-w-0">
          {selectedPatient ? (
            <>
              <PatientHeader
                patient={selectedPatient}
                hasAccess={hasAccess}
                onRequestConsent={() => setIsConsentOpen(true)}
                onTriggerBreakGlass={() => setIsBreakGlassOpen(true)}
                onOpenAiAssistant={() => setIsAiDrawerOpen(true)}
              />

              {hasAccess ? (
                <MedicalTimeline
                  timeline={timeline}
                  onAddEncounter={() => setIsNewEncounterOpen(true)}
                  onOpenAiAssistant={() => setIsAiDrawerOpen(true)}
                />
              ) : (
                <div className="card p-8 sm:p-10 text-center">
                  <div className="w-14 h-14 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900">A quick permission step first</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 mb-5 leading-relaxed">
                    <strong className="text-slate-700">{selectedPatient.fullName}</strong> keeps control of their
                    story. Send them a one-tap code, or use emergency access if they can&apos;t respond.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                    <button onClick={() => setIsConsentOpen(true)} className="btn-primary w-full sm:w-auto">
                      Text them a code
                    </button>
                    <button
                      onClick={() => setIsBreakGlassOpen(true)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 text-sm font-semibold border border-slate-200 transition w-full sm:w-auto"
                    >
                      Emergency access instead
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-4">Codes expire in 15 minutes · access lasts 2 hours</p>
                </div>
              )}
            </>
          ) : (
            <div className="card p-10 text-center text-sm text-slate-400">
              Choose someone from your care list to get started.
            </div>
          )}
        </div>
      </div>

      {selectedPatient && (
        <ConsentModal
          isOpen={isConsentOpen}
          onClose={() => setIsConsentOpen(false)}
          patient={selectedPatient}
          onConsentGranted={handleConsentGranted}
        />
      )}
      {selectedPatient && (
        <BreakGlassModal
          isOpen={isBreakGlassOpen}
          onClose={() => setIsBreakGlassOpen(false)}
          patient={selectedPatient}
          onBreakGlassTriggered={handleBreakGlassTriggered}
        />
      )}
      {selectedPatient && (
        <AiClinicalAssistantDrawer
          isOpen={isAiDrawerOpen}
          onClose={() => setIsAiDrawerOpen(false)}
          patientId={selectedPatient.id}
          patientName={selectedPatient.fullName}
        />
      )}

      {isNewEncounterOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-rise max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsNewEncounterOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-display text-lg font-bold text-slate-900">Add a visit note</h3>
            <p className="text-[13px] text-slate-500 mt-1 mb-4">For <strong className="text-slate-700">{selectedPatient.fullName}</strong> · visible across the network instantly.</p>

            <form onSubmit={handleCreateEncounter} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="label-friendly">Visit type</label>
                  <select value={encounterType} onChange={(e) => setEncounterType(e.target.value)} className="input-friendly">
                    <option value="OUTPATIENT">Clinic visit</option>
                    <option value="INPATIENT">Hospital stay</option>
                    <option value="EMERGENCY">Emergency</option>
                    <option value="TELEMEDICINE">Video visit</option>
                  </select>
                </div>
                <div>
                  <label className="label-friendly">Location</label>
                  <input type="text" required value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} className="input-friendly" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-2">
                  <label className="label-friendly">What&apos;s going on? (diagnosis)</label>
                  <input type="text" required placeholder="E.g., Chest pain follow-up" value={primaryDiagnosis} onChange={(e) => setPrimaryDiagnosis(e.target.value)} className="input-friendly" />
                </div>
                <div>
                  <label className="label-friendly">Code</label>
                  <input type="text" placeholder="I21.4" value={icd10Code} onChange={(e) => setIcd10Code(e.target.value)} className="input-friendly font-mono" />
                </div>
              </div>
              <div>
                <label className="label-friendly">Notes for the care team</label>
                <textarea required rows={3} placeholder="How are they feeling? What did you find? What's next?" value={clinicalNotes} onChange={(e) => setClinicalNotes(e.target.value)} className="input-friendly resize-none" />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button type="button" onClick={() => setIsNewEncounterOpen(false)} className="btn-secondary flex-1">Not now</button>
                <button type="submit" className="btn-primary flex-[2]">Save visit note</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
