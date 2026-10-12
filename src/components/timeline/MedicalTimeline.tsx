import React, { useState } from 'react';
import { MedicalRecordTimeline } from '../../types';
import { EncounterCard } from './EncounterCard';
import { PlusCircle, Sparkles, FolderHeart, SearchX } from 'lucide-react';

interface MedicalTimelineProps {
  timeline: MedicalRecordTimeline[];
  onAddEncounter?: () => void;
  onOpenAiAssistant?: () => void;
}

const FILTERS = [
  { key: 'ALL', label: 'Everything' },
  { key: 'EMERGENCY', label: 'Emergency' },
  { key: 'OUTPATIENT', label: 'Clinic visits' },
  { key: 'INPATIENT', label: 'Hospital stays' },
];

export const MedicalTimeline: React.FC<MedicalTimelineProps> = ({
  timeline,
  onAddEncounter,
  onOpenAiAssistant,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredRecords = timeline.filter((rec) => {
    if (filterType === 'ALL') return true;
    return rec.encounterType === filterType;
  });

  return (
    <div className="space-y-4">
      <div className="card p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterType(f.key)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                filterType === f.key
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {onOpenAiAssistant && (
            <button
              onClick={onOpenAiAssistant}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-teal-700 hover:bg-teal-50 text-[13px] font-semibold border border-teal-200 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI</span>
            </button>
          )}
          {onAddEncounter && (
            <button
              onClick={onAddEncounter}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[13px] font-semibold transition shadow-[0_2px_8px_-2px_rgba(13,148,136,0.5)]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Encounter</span>
            </button>
          )}
        </div>
      </div>

      {filteredRecords.length > 0 ? (
        <div className="space-y-3.5">
          <p className="text-xs text-slate-400 px-1 flex items-center gap-1.5">
            <FolderHeart className="w-3.5 h-3.5" />
            {filteredRecords.length} visit{filteredRecords.length > 1 ? 's' : ''} · newest first
          </p>
          {filteredRecords.map((record) => (
            <EncounterCard key={record.id} record={record} />
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-slate-900">Nothing here yet</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1">
            No records found for &ldquo;{filterType.toLowerCase()}&rdquo;. Try another filter or add a visit.
          </p>
        </div>
      )}
    </div>
  );
};
