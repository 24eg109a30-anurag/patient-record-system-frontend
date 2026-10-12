import React from 'react';
import { Pill, Clock } from 'lucide-react';
import { Prescription } from '../../types';

interface PrescriptionListProps {
  prescriptions: Prescription[];
}

export const PrescriptionList: React.FC<PrescriptionListProps> = ({ prescriptions }) => {
  if (!prescriptions || prescriptions.length === 0) return null;

  return (
    <div className="mt-3 bg-teal-50/40 rounded-xl p-3 border border-teal-100">
      <div className="flex items-center space-x-1.5 text-xs font-bold text-teal-800 mb-2">
        <Pill className="w-3.5 h-3.5 text-teal-600" />
        <span>Active Prescriptions & Regimen</span>
      </div>

      <div className="space-y-1.5">
        {prescriptions.map((rx) => (
          <div
            key={rx.id}
            className="p-2.5 rounded-lg bg-white border border-teal-200/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 shadow-2xs"
          >
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900">{rx.medicationName}</span>
                <span className="font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                  {rx.dosage}
                </span>
                <span className="text-slate-500 text-[11px]">• {rx.frequency}</span>
              </div>
              {rx.instructions && (
                <p className="text-[11px] text-slate-500 mt-0.5 italic">{rx.instructions}</p>
              )}
            </div>

            <div className="flex items-center space-x-1 text-[11px] text-slate-500 shrink-0">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{rx.durationDays} Days Duration</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
