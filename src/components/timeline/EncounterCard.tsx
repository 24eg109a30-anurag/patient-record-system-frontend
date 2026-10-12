import React, { useState } from 'react';
import { Calendar, Building2, Stethoscope, ChevronDown, Siren, Video, BedDouble, Footprints, FileText } from 'lucide-react';
import { MedicalRecordTimeline } from '../../types';
import { LabResultCard } from './LabResultCard';
import { PrescriptionList } from './PrescriptionList';

interface EncounterCardProps {
  record: MedicalRecordTimeline;
}

const TYPE_STYLE: Record<string, { icon: typeof Footprints; chip: string; dot: string }> = {
  EMERGENCY: { icon: Siren, chip: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  INPATIENT: { icon: BedDouble, chip: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
  TELEMEDICINE: { icon: Video, chip: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500' },
  OUTPATIENT: { icon: Footprints, chip: 'bg-teal-50 text-teal-700 border-teal-200', dot: 'bg-teal-500' },
};

const FRIENDLY_TYPE: Record<string, string> = {
  EMERGENCY: 'Emergency visit',
  INPATIENT: 'Hospital stay',
  OUTPATIENT: 'Clinic visit',
  TELEMEDICINE: 'Video visit',
};

export const EncounterCard: React.FC<EncounterCardProps> = ({ record }) => {
  const [expanded, setExpanded] = useState(true);
  const style = TYPE_STYLE[record.encounterType] ?? TYPE_STYLE.OUTPATIENT;
  const TypeIcon = style.icon;

  const dateStr = new Date(record.encounterDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const criticalCount = record.labResults?.filter((l) => l.status === 'CRITICAL').length ?? 0;

  return (
    <div className="card card-hover p-0 overflow-hidden animate-rise">
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${style.chip}`}>
            <TypeIcon className="w-3.5 h-3.5" /> {FRIENDLY_TYPE[record.encounterType] ?? record.encounterType}
            <span className="font-medium opacity-70 hidden sm:inline">· {record.encounterType}</span>
          </span>
          <span className="text-xs text-slate-400 inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {dateStr}
          </span>
          {criticalCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
              {criticalCount} critical lab{criticalCount > 1 ? 's' : ''}
            </span>
          )}
          <span className="ml-auto text-xs text-slate-500 inline-flex items-center gap-1.5 max-w-full">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{record.hospitalName}</span>
          </span>
        </div>

        <div className="flex items-start justify-between gap-3 mt-3">
          <h3 className="font-display text-[15px] font-bold text-slate-900 leading-snug">{record.primaryDiagnosis}</h3>
          {record.icd10Code && (
            <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded-lg shrink-0" title="Diagnosis code">
              {record.icd10Code}
            </span>
          )}
        </div>

        <p className="text-[13px] text-slate-600 mt-1.5 leading-relaxed">{record.clinicalNotes}</p>

        <div className="text-xs text-slate-400 mt-2.5 flex items-center gap-1.5">
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Cared for by <strong className="text-slate-600 font-semibold">{record.doctorName}</strong></span>
        </div>

        {record.documents && record.documents.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {record.documents.map((d) => (
              <span key={d.id} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition px-2.5 py-1.5 rounded-lg cursor-pointer">
                <FileText className="w-3.5 h-3.5 text-slate-400" /> {d.fileName}
              </span>
            ))}
          </div>
        )}
      </div>

      {(record.prescriptions?.length > 0 || record.labResults?.length > 0) && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-4 sm:px-5 py-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            <span>
              {expanded ? 'Hide medicines & labs' : 'Show medicines & labs'}
              <span className="text-slate-400 font-normal"> · {record.prescriptions.length} medicines, {record.labResults.length} labs</span>
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
          {expanded && (
            <div className="mt-1 animate-fade">
              <PrescriptionList prescriptions={record.prescriptions} />
              <LabResultCard labResults={record.labResults} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
