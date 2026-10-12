import React from 'react';
import { FlaskConical } from 'lucide-react';
import { LabResult } from '../../types';

interface LabResultCardProps {
  labResults: LabResult[];
}

export const LabResultCard: React.FC<LabResultCardProps> = ({ labResults }) => {
  if (!labResults || labResults.length === 0) return null;

  return (
    <div className="mt-3 bg-slate-50/80 rounded-xl p-3 border border-slate-200/80">
      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-2">
        <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
        <span>Diagnostic & Laboratory Results</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {labResults.map((lab) => {
          const isCritical = lab.status === 'CRITICAL';
          const isHigh = lab.status === 'HIGH';

          return (
            <div
              key={lab.id}
              className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                isCritical
                  ? 'bg-red-50/90 border-red-300 text-red-950'
                  : isHigh
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div>
                <span className="font-semibold block">{lab.testName}</span>
                <span className="text-[10px] text-slate-500">
                  Ref: {lab.referenceRange || 'N/A'} {lab.unit || ''}
                </span>
              </div>

              <div className="text-right">
                <div className="font-mono font-bold text-sm">
                  {lab.resultValue} <span className="text-[10px] font-normal">{lab.unit}</span>
                </div>
                <span
                  className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase tracking-wide ${
                    isCritical
                      ? 'bg-red-600 text-white'
                      : isHigh
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {lab.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
