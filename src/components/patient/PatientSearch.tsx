import React, { useState } from 'react';
import { Search, ChevronRight, Users, ShieldCheck, Siren } from 'lucide-react';
import { PatientSummary } from '../../types';
import { Avatar } from '../ui/ProductUI';

interface PatientSearchProps {
  patients: PatientSummary[];
  selectedPatientId: string | null;
  onSelectPatient: (patient: PatientSummary) => void;
  onSearch: (query: string) => void;
}

export const PatientSearch: React.FC<PatientSearchProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearch(val);
  };

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-teal-600" /> People in your care
        </h2>
        <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {patients.length} found
        </span>
      </div>
      <p className="text-[11px] text-slate-400 mb-3">Pick someone to see their visits, labs & medicines.</p>

      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search name, NHID, phone..."
          className="input-friendly pl-10"
        />
      </div>

      <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-0.5">
        {patients.map((p) => {
          const isSelected = p.id === selectedPatientId;
          return (
            <div
              key={p.id}
              onClick={() => onSelectPatient(p)}
              className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition border ${
                isSelected
                  ? 'bg-teal-50/70 border-teal-300 shadow-[0_2px_10px_-4px_rgba(13,148,136,0.4)]'
                  : 'hover:bg-slate-50 border-transparent hover:border-slate-200'
              }`}
            >
              <Avatar name={p.fullName} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[13px] text-slate-900 truncate">{p.fullName}</div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono bg-slate-100 px-1.5 py-px rounded">{p.nationalHealthId}</span>
                  <span>·</span>
                  <span>{p.bloodGroup}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {p.breakGlassActive ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                      <Siren className="w-3 h-3" /> Emergency access
                    </span>
                  ) : p.activeConsent ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> Can view records
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      Needs permission
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-teal-600' : 'text-slate-300'}`} />
            </div>
          );
        })}

        {patients.length === 0 && (
          <div className="text-center py-8 px-4">
            <p className="text-sm font-semibold text-slate-700">No matches for &ldquo;{searchTerm}&rdquo;</p>
            <p className="text-xs text-slate-400 mt-1">Try a different spelling, NHID, or phone number.</p>
          </div>
        )}
      </div>
    </div>
  );
};
