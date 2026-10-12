export type Role = 'DOCTOR' | 'PATIENT' | 'ADMIN' | 'AUDITOR';

export interface User {
  userId: string;
  email: string;
  role: Role;
  profileId: string;
  fullName: string;
  licenseVerified?: boolean;
}

export interface PatientSummary {
  id: string;
  nationalHealthId: string;
  fullName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  emergencyContactPhone: string;
  allergies?: string;
  chronicConditions?: string;
  activeConsent: boolean;
  breakGlassActive: boolean;
}

export interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  instructions?: string;
}

export interface LabResult {
  id: string;
  testName: string;
  resultValue: string;
  unit?: string;
  referenceRange?: string;
  status: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
  performedAt: string;
}

export interface DocumentAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  storageUri: string;
  uploadedAt: string;
}

export interface MedicalRecordTimeline {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  hospitalName: string;
  encounterType: 'OUTPATIENT' | 'INPATIENT' | 'EMERGENCY' | 'TELEMEDICINE';
  primaryDiagnosis: string;
  icd10Code?: string;
  clinicalNotes: string;
  encounterDate: string;
  prescriptions: Prescription[];
  labResults: LabResult[];
  documents: DocumentAttachment[];
}

export interface ConsentRequest {
  consentRequestId: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  purpose: string;
  accessLevel: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'REVOKED';
  consentToken?: string;
  requestedAt: string;
  expiresAt: string;
}

export interface BreakGlassEvent {
  eventId: string;
  overrideToken: string;
  patientId: string;
  patientName: string;
  emergencyReason: string;
  triggeredAt: string;
  complianceAlert: string;
}

export interface Citation {
  documentName: string;
  encounterDate: string;
  excerpt: string;
  similarityScore: number;
}

export interface ClinicalQueryResponse {
  answer: string;
  citations: Citation[];
  processingTimeMs: number;
}

export interface AuditLogItem {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  patientId?: string;
  patientName?: string;
  ipAddress: string;
  userAgent: string;
  details: string;
  loggedAt: string;
}
