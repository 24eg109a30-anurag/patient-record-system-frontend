import React from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, KeyRound, AlertTriangle, Phone, Cake, Droplets } from 'lucide-react';
import { PatientSummary } from '../../types';
import { Avatar, StatusPill } from '../ui/ProductUI';

interface PatientHeaderProps {
  patient: PatientSummary;
  hasAccess: boolean;
  onRequestConsent: () => void;
  onTriggerBreakGlass: () => void;
  onOpenAiAssistant: () => void;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({
  patient,
  hasAccess,
  onRequestConsent,
  onTriggerBreakGlass,
  onOpenAiAssistant,
}) => {
  return (
    <div className="card p-5 mb-4 animate-rise overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <Avatar name={patient.fullName} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-lg font-bold text-slate-900">{patient.fullName}</h1>
              <span className="font-mono text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg">
                {patient.nationalHealthId}
              </span>
            </div>
            <div className="mt-1.5">
              {patient.breakGlassActive ? (
                <StatusPill tone="red"><ShieldAlert className="w-3 h-3" /> Emergency access active</StatusPill>
              ) : patient.activeConsent ? (
                <StatusPill tone="teal"><ShieldCheck className="w-3 h-3" /> Sharing records with you</StatusPill>
              ) : (
                <StatusPill tone="amber"><AlertTriangle className="w-3 h-3" /> Waiting for permission</StatusPill>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 mt-2.5">
              <span className="inline-flex items-center gap-1.5"><Cake className="w-3.5 h-3.5 text-slate-400" /> Born <strong className="text-slate-700">{patient.dob}</strong></span>
              <span className="inline-flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-rose-400" /><strong className="text-slate-700">{patient.bloodGroup}</strong></span>
              <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /><strong className="text-slate-700">{patient.emergencyContactPhone}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!hasAccess ? (
            <>
              <button onClick={onRequestConsent} className="btn-primary !py-2.5">
                <KeyRound className="w-4 h-4" />
                <span>Ask for access</span>
              </button>
              <button
                onClick={onTriggerBreakGlass}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 text-sm font-semibold border border-slate-200 hover:border-red-200 transition"
              >
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <span>Break-Glass</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={onOpenAiAssistant} className="btn-primary !py-2.5">
                <Sparkles className="w-4 h-4" />
                <span>AI Care Summary</span>
              </button>
              <button onClick={onRequestConsent} className="btn-secondary !py-2.5 !px-3.5" title="Manage consent">
                <KeyRound className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {patient.allergies && (
        <div className="mt-4 flex items-start gap-2.5 bg-red-50/70 border border-red-200 rounded-xl px-3.5 py-2.5">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-800 leading-relaxed">
            <strong>Allergies to know:</strong> {patient.allergies}
            {patient.chronicConditions && (
              <span className="block text-red-700/80 mt-0.5">Ongoing conditions: {patient.chronicConditions}</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
