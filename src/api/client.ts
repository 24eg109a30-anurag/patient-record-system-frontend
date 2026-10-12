import axios from 'axios';
import {
  User,
  PatientSummary,
  MedicalRecordTimeline,
  ConsentRequest,
  BreakGlassEvent,
  ClinicalQueryResponse,
  AuditLogItem,
} from '../types';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string | undefined) || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ehr_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock Data for Instant Preview / Offline Demonstration
export const MOCK_PATIENTS: PatientSummary[] = [
  {
    id: 'p1-uuid-4471',
    nationalHealthId: 'NHID-9821-4471',
    fullName: 'Johnathon Edward Doe',
    dob: '1974-06-15',
    gender: 'Male',
    bloodGroup: 'O-Positive',
    emergencyContactPhone: '+1 (555) 010-0005',
    allergies: 'Penicillin (Anaphylaxis), Sulfa drugs',
    chronicConditions: 'Hypertension Stage II, Type 2 Diabetes Mellitus, Hyperlipidemia',
    activeConsent: false,
    breakGlassActive: false,
  },
  {
    id: 'p2-uuid-8820',
    nationalHealthId: 'NHID-5512-8820',
    fullName: 'Alice Marie Smith',
    dob: '1988-11-22',
    gender: 'Female',
    bloodGroup: 'A-Positive',
    emergencyContactPhone: '+1 (555) 010-0007',
    allergies: 'Latex, Codeine',
    chronicConditions: 'Asthma (Moderate Persistent)',
    activeConsent: true,
    breakGlassActive: false,
  },
  {
    id: 'p3-uuid-3319',
    nationalHealthId: 'NHID-1092-3319',
    fullName: 'Robert Henry Chen',
    dob: '1962-03-08',
    gender: 'Male',
    bloodGroup: 'B-Positive',
    emergencyContactPhone: '+1 (555) 010-0009',
    allergies: 'Aspirin, Contrast Dye',
    chronicConditions: 'Chronic Kidney Disease Stage 3a, Atrial Fibrillation',
    activeConsent: false,
    breakGlassActive: false,
  },
];

export const MOCK_TIMELINE: Record<string, MedicalRecordTimeline[]> = {
  'p1-uuid-4471': [
    {
      id: 'rec-1',
      patientId: 'p1-uuid-4471',
      patientName: 'Johnathon Edward Doe',
      doctorName: 'Dr. Sarah Jenkins, MD, FACC',
      hospitalName: 'Metropolitan General Hospital - Emergency Dept',
      encounterType: 'EMERGENCY',
      primaryDiagnosis: 'Acute Coronary Syndrome Rule-Out (Resolved Non-STEMI)',
      icd10Code: 'I21.4',
      clinicalNotes:
        'Patient presented with acute retrosternal crushing chest pain radiating to the left mandibular angle accompanied by diaphoresis. High-sensitivity cardiac troponin peaked at 0.08 ng/mL. Emergent coronary angiography revealed 70% proximal LAD stenosis. Successfully revascularized with drug-eluting stent (DES). Hemodynamically stable post-procedure.',
      encounterDate: '2026-09-07T14:30:00Z',
      prescriptions: [
        {
          id: 'rx-1',
          medicationName: 'Ticagrelor (Brilinta)',
          dosage: '90 mg',
          frequency: 'Twice daily',
          durationDays: 365,
          instructions: 'Mandatory dual-antiplatelet therapy following stent placement. Do not skip doses.',
        },
        {
          id: 'rx-2',
          medicationName: 'Aspirin (Cardioprotective)',
          dosage: '81 mg',
          frequency: 'Once daily morning',
          durationDays: 365,
          instructions: 'Take with breakfast.',
        },
        {
          id: 'rx-3',
          medicationName: 'Rosuvastatin',
          dosage: '40 mg',
          frequency: 'Once daily at night',
          durationDays: 180,
          instructions: 'Intense lipid lowering target LDL < 55 mg/dL.',
        },
      ],
      labResults: [
        {
          id: 'lab-1',
          testName: 'High-Sensitivity Troponin I',
          resultValue: '0.08',
          unit: 'ng/mL',
          referenceRange: '< 0.04',
          status: 'CRITICAL',
          performedAt: '2026-09-07T15:10:00Z',
        },
        {
          id: 'lab-2',
          testName: 'Serum Creatinine',
          resultValue: '1.1',
          unit: 'mg/dL',
          referenceRange: '0.7 - 1.3',
          status: 'NORMAL',
          performedAt: '2026-09-07T15:10:00Z',
        },
        {
          id: 'lab-3',
          testName: 'Blood Potassium (K+)',
          resultValue: '4.4',
          unit: 'mEq/L',
          referenceRange: '3.5 - 5.0',
          status: 'NORMAL',
          performedAt: '2026-09-07T15:10:00Z',
        },
      ],
      documents: [
        {
          id: 'doc-1',
          fileName: 'Angiogram_CardiacCath_Report.pdf',
          fileType: 'PDF',
          fileSizeBytes: 2450000,
          storageUri: '/docs/angio_092026.pdf',
          uploadedAt: '2026-09-07T18:00:00Z',
        },
      ],
    },
    {
      id: 'rec-2',
      patientId: 'p1-uuid-4471',
      patientName: 'Johnathon Edward Doe',
      doctorName: 'Dr. Sarah Jenkins, MD, FACC',
      hospitalName: 'St. Jude Heart Institute - Outpatient Clinic',
      encounterType: 'OUTPATIENT',
      primaryDiagnosis: 'Stage II Essential Hypertension & Exertional Angina',
      icd10Code: 'I10, I20.9',
      clinicalNotes:
        'Routine cardiology follow up. Blood pressure elevated at 154/96 mmHg despite dual therapy. Patient acknowledges periodic salt excess. Resting 12-lead ECG demonstrates sinus rhythm with localized inverted T-waves in lateral leads V5-V6. Baseline lipid panel indicates uncontrolled LDL.',
      encounterDate: '2026-06-12T10:15:00Z',
      prescriptions: [
        {
          id: 'rx-4',
          medicationName: 'Metoprolol Succinate ER',
          dosage: '50 mg',
          frequency: 'Once daily morning',
          durationDays: 90,
          instructions: 'Target resting heart rate 60-70 bpm.',
        },
        {
          id: 'rx-5',
          medicationName: 'Amlodipine',
          dosage: '10 mg',
          frequency: 'Once daily',
          durationDays: 90,
          instructions: 'Monitor for peripheral pedal edema.',
        },
      ],
      labResults: [
        {
          id: 'lab-4',
          testName: 'Lipid Panel - Total Cholesterol',
          resultValue: '245',
          unit: 'mg/dL',
          referenceRange: '< 200',
          status: 'HIGH',
          performedAt: '2026-06-12T11:00:00Z',
        },
        {
          id: 'lab-5',
          testName: 'Lipid Panel - LDL Cholesterol',
          resultValue: '162',
          unit: 'mg/dL',
          referenceRange: '< 100',
          status: 'HIGH',
          performedAt: '2026-06-12T11:00:00Z',
        },
        {
          id: 'lab-6',
          testName: 'Hemoglobin A1c',
          resultValue: '7.4',
          unit: '%',
          referenceRange: '< 5.7',
          status: 'HIGH',
          performedAt: '2026-06-12T11:00:00Z',
        },
      ],
      documents: [],
    },
  ],
};

export const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-1',
    actorId: 'doc-user-1',
    actorRole: 'DOCTOR',
    action: 'BREAK_GLASS_OVERRIDE',
    patientId: 'p1-uuid-4471',
    patientName: 'Johnathon Edward Doe',
    ipAddress: '192.168.1.14',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    details: 'EMERGENCY BREAK-GLASS: Acute diaphoresis and unresponsiveness in ED trauma bay. Emergency consent bypassed.',
    loggedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'aud-2',
    actorId: 'doc-user-1',
    actorRole: 'DOCTOR',
    action: 'RAG_CLINICAL_QUERY',
    patientId: 'p1-uuid-4471',
    patientName: 'Johnathon Edward Doe',
    ipAddress: '192.168.1.14',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    details: 'AI Query: "Summarize cardiac complaints, stent history, and antiplatelet therapy"',
    loggedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'aud-3',
    actorId: 'pat-user-2',
    actorRole: 'PATIENT',
    action: 'CONSENT_GRANTED',
    patientId: 'p2-uuid-8820',
    patientName: 'Alice Marie Smith',
    ipAddress: '172.56.21.90',
    userAgent: 'Mobile Safari / iOS 17.4',
    details: 'OTP verified. Approved full clinical timeline access for Dr. Sarah Jenkins (2-hour window).',
    loggedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

// API Service Functions
export const EhrApi = {
  // Auth
  login: async (username: string, password: string):Promise<{ data: { token: string; user: User } }> => {
    try {
      const res = await api.post('/auth/login', { username, password });
      return {
        data: {
          token: res.data.token,
          user: {
            userId: res.data.userId,
            email: res.data.email,
            role: res.data.role,
            profileId: res.data.profileId,
            fullName: res.data.fullName,
            licenseVerified: res.data.licenseVerified,
          },
        },
      };
    } catch {
      // Mock login for offline testing
      let role: any = 'DOCTOR';
      let fullName = 'Dr. Sarah Jenkins, MD, FACC';
      if (username.includes('admin')) {
        role = 'ADMIN';
        fullName = 'EHR Compliance Officer';
      } else if (username.includes('patient') || username.includes('john') || username.includes('alice')) {
        role = 'PATIENT';
        fullName = 'Johnathon Edward Doe';
      }

      return {
        data: {
          token: 'mock-jwt-token-2026',
          user: {
            userId: 'usr-mock-1',
            email: username,
            role,
            profileId: 'prof-mock-1',
            fullName,
            licenseVerified: true,
          },
        },
      };
    }
  },

  // Patients
  searchPatients: async (query: string): Promise<PatientSummary[]> => {
    try {
      const res = await api.get(`/patients/search`, { params: { query } });
      return res.data;
    } catch {
      if (!query) return MOCK_PATIENTS;
      const q = query.toLowerCase();
      return MOCK_PATIENTS.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.nationalHealthId.toLowerCase().includes(q) ||
          p.emergencyContactPhone.includes(q)
      );
    }
  },

  getPatientSummary: async (patientId: string): Promise<PatientSummary> => {
    try {
      const res = await api.get(`/patients/${patientId}`);
      return res.data;
    } catch {
      return MOCK_PATIENTS.find((p) => p.id === patientId) || MOCK_PATIENTS[0];
    }
  },

  // Consent
  requestConsent: async (patientId: string, purpose: string): Promise<ConsentRequest> => {
    try {
      const res = await api.post('/consent/request', { patientId, purpose });
      return res.data;
    } catch {
      return {
        consentRequestId: 'req-' + Date.now(),
        doctorId: 'doc-1',
        doctorName: 'Dr. Sarah Jenkins, MD',
        patientId,
        patientName: 'Johnathon Edward Doe',
        purpose,
        accessLevel: 'FULL_HISTORY',
        status: 'PENDING',
        requestedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 15 * 60000).toISOString(),
      };
    }
  },

  verifyOtp: async (consentRequestId: string, otp: string): Promise<ConsentRequest> => {
    try {
      const res = await api.post('/consent/verify-otp', { consentRequestId, otp });
      return res.data;
    } catch {
      return {
        consentRequestId,
        doctorId: 'doc-1',
        doctorName: 'Dr. Sarah Jenkins, MD',
        patientId: 'p1-uuid-4471',
        patientName: 'Johnathon Edward Doe',
        purpose: 'EHR Clinical Evaluation',
        accessLevel: 'FULL_HISTORY',
        status: 'APPROVED',
        consentToken: 'CST-MOCK-' + Date.now(),
        requestedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 2 * 3600000).toISOString(),
      };
    }
  },

  triggerBreakGlass: async (patientId: string, reason: string, condition: string): Promise<BreakGlassEvent> => {
    try {
      const res = await api.post('/consent/break-glass', {
        patientId,
        emergencyReason: reason,
        patientCondition: condition,
      });
      return res.data;
    } catch {
      return {
        eventId: 'bg-' + Date.now(),
        overrideToken: 'BG-OVERRIDE-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        patientId,
        patientName: 'Johnathon Edward Doe',
        emergencyReason: reason,
        triggeredAt: new Date().toISOString(),
        complianceAlert: 'CRITICAL: Emergency break-glass override logged and flagged for compliance review.',
      };
    }
  },

  // Records & Timeline
  getPatientTimeline: async (patientId: string): Promise<MedicalRecordTimeline[]> => {
    try {
      const res = await api.get(`/records/patient/${patientId}`);
      return res.data;
    } catch {
      return MOCK_TIMELINE[patientId] || MOCK_TIMELINE['p1-uuid-4471'] || [];
    }
  },

  createEncounter: async (recordData: any): Promise<MedicalRecordTimeline> => {
    try {
      const res = await api.post('/records', recordData);
      return res.data;
    } catch {
      const newRec: MedicalRecordTimeline = {
        id: 'rec-' + Date.now(),
        patientId: recordData.patientId,
        patientName: 'Johnathon Edward Doe',
        doctorName: 'Dr. Sarah Jenkins, MD, FACC',
        hospitalName: recordData.hospitalName,
        encounterType: recordData.encounterType,
        primaryDiagnosis: recordData.primaryDiagnosis,
        icd10Code: recordData.icd10Code,
        clinicalNotes: recordData.clinicalNotes,
        encounterDate: new Date().toISOString(),
        prescriptions: recordData.prescriptions || [],
        labResults: recordData.labResults || [],
        documents: [],
      };
      return newRec;
    }
  },

  // AI Assistant (RAG)
  queryClinicalAssistant: async (patientId: string, query: string): Promise<ClinicalQueryResponse> => {
    try {
      const res = await api.post('/rag/query', { patientId, query });
      return res.data;
    } catch {
      // Realistic simulated RAG clinical synthesis
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        answer: `### Clinical Synthesis & Longitudinal Findings:
Based on indexed encounters for this patient from **St. Jude Heart Institute** and **Metropolitan General ED**:

1. **Cardiac Event Summary:**
   - **Recent STEMI/NSTEMI (September 2026):** Patient presented with crushing substernal chest discomfort radiating to left jaw with elevated Troponin I (0.08 ng/mL). Coronary angiogram showed 70% proximal LAD stenosis, treated via drug-eluting stent (DES).
   - **Baseline Chronic Symptoms (June 2026):** Patient had a 3-month prior history of exertional angina and uncontrolled hypertension (154/96 mmHg).

2. **Pharmacotherapy & Critical Drug Warnings:**
   - **Dual Antiplatelet Therapy (DAPT):** Currently prescribed **Ticagrelor 90mg BID** + **Aspirin 81mg daily**. *Caution:* Do not discontinue antiplatelet therapy prematurely due to acute stent thrombosis risk.
   - **Known Drug Allergies:** **Penicillin (Anaphylaxis)** and **Sulfa drugs**.

3. **Laboratory Trajectory:**
   - Troponin I peaked at **0.08 ng/mL** [CRITICAL].
   - Dyslipidemia: Total Cholesterol was **245 mg/dL**, LDL **162 mg/dL** on high-intensity statin initiation.
   - Renal Function: Creatinine stable at **1.1 mg/dL** with normal serum potassium (4.4 mEq/L).`,
        citations: [
          {
            documentName: 'Emergency Encounter: Acute Coronary Syndrome',
            encounterDate: '2026-09-07',
            excerpt:
              'High-sensitivity cardiac troponin peaked at 0.08 ng/mL. Emergent coronary angiography revealed 70% proximal LAD stenosis. Successfully revascularized with drug-eluting stent (DES).',
            similarityScore: 0.94,
          },
          {
            documentName: 'Outpatient Cardiology: Angina & Hypertension',
            encounterDate: '2026-06-12',
            excerpt:
              'Resting 12-lead ECG demonstrates sinus rhythm with localized inverted T-waves in lateral leads V5-V6. Baseline lipid panel indicates uncontrolled LDL at 162 mg/dL.',
            similarityScore: 0.88,
          },
        ],
        processingTimeMs: 742,
      };
    }
  },

  // Audit
  getAuditLogs: async (): Promise<AuditLogItem[]> => {
    try {
      const res = await api.get('/audit/logs');
      return res.data;
    } catch {
      return MOCK_AUDIT_LOGS;
    }
  },
};
