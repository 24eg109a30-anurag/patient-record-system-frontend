import React, { useState } from 'react';
import { X, ShieldAlert, Siren, FileWarning } from 'lucide-react';
import { PatientSummary } from '../../types';
import { Avatar } from '../ui/ProductUI';

interface BreakGlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientSummary;
  onBreakGlassTriggered: (reason: string, condition: string) => void;
}

export const BreakGlassModal: React.FC<BreakGlassModalProps> = ({
  isOpen,
  onClose,
  patient,
  onBreakGlassTriggered,
}) => {
  const [reason, setReason] = useState('Acute trauma / patient unconscious in emergency bay');
  const [condition, setCondition] = useState('GCS 6, unstable hemodynamics');
  const [acknowledged, setAcknowledged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acknowledged) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onBreakGlassTriggered(reason, condition);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/40 backdrop-blur-sm animate-fade">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-rise border-t-4 border-t-red-500 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition" aria-label="Close">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Siren className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900 leading-tight">Emergency Break-Glass Override</h3>
            <p className="text-xs text-red-600 font-semibold">Use only when consent isn&apos;t possible</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl p-3 my-4">
          <Avatar name={patient.fullName} size="sm" />
          <p className="text-xs text-slate-600">
            Opening records for <strong className="text-slate-900">{patient.fullName}</strong> without their code.
          </p>
        </div>

        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-3.5 py-3 mb-4">
          <FileWarning className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            This bypass is <strong>permanently logged</strong> with your name, time, and reason — and sent to the
            safety board for review. Only continue for genuine emergencies.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="label-friendly" htmlFor="bg-reason">Emergency Reason:</label>
            <input
              id="bg-reason"
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Cardiac arrest in resuscitation bay"
              className="input-friendly focus:ring-red-500/30 focus:border-red-400"
            />
          </div>

          <div>
            <label className="label-friendly" htmlFor="bg-condition">Patient Condition:</label>
            <input
              id="bg-condition"
              type="text"
              required
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="e.g. Unconscious, unstable vitals"
              className="input-friendly focus:ring-red-500/30 focus:border-red-400"
            />
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-red-600 focus:ring-red-500"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              I confirm this person needs urgent care right now and can&apos;t approve access themselves.
              I take responsibility for this override.
            </span>
          </label>

          <div className="flex items-center gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={!acknowledged || isLoading} className="btn-danger flex-[2]">
              <ShieldAlert className="w-4 h-4" />
              {isLoading ? 'Opening…' : 'Override & Open Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
