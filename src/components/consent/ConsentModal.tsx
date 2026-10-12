import React, { useState } from 'react';
import { X, KeyRound, Check, Smartphone, ShieldCheck, ArrowLeft } from 'lucide-react';
import { PatientSummary } from '../../types';
import { Avatar } from '../ui/ProductUI';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientSummary;
  onConsentGranted: (consentToken: string) => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  onClose,
  patient,
  onConsentGranted,
}) => {
  const [step, setStep] = useState<'REQUEST' | 'OTP'>('REQUEST');
  const [otp, setOtp] = useState('749210');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP');
    }, 600);
  };

  const handleVerify = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onConsentGranted('CST-APPROVED-' + Math.random().toString(36).substring(2, 9).toUpperCase());
      onClose();
    }, 600);
  };

  const handleClose = () => {
    setStep('REQUEST');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-rise">
        <button onClick={handleClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition" aria-label="Close">
          <X className="w-4 h-4" />
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mb-5">
          <span className="h-1.5 flex-1 rounded-full bg-teal-500" />
          <span className={`h-1.5 flex-1 rounded-full ${step === 'OTP' ? 'bg-teal-500' : 'bg-slate-200'}`} />
        </div>

        {step === 'REQUEST' ? (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900">Authorize Record Access</h3>
            <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">
              We&apos;ll text a 6-digit code to <strong className="text-slate-700">{patient.fullName}</strong> so they can
              approve sharing their records with you for the next <strong className="text-slate-700">2 hours</strong>.
            </p>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-3 mt-4">
              <Avatar name={patient.fullName} />
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-slate-900 truncate">{patient.fullName}</p>
                <p className="text-xs text-slate-500 font-mono">{patient.emergencyContactPhone}</p>
              </div>
            </div>

            <button onClick={handleSendOtp} disabled={isLoading} className="btn-primary w-full mt-4">
              {isLoading ? 'Sending code…' : 'Send OTP to Patient'}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-3 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> The patient can revoke this anytime.
            </p>
          </div>
        ) : (
          <div>
            <button onClick={() => setStep('REQUEST')} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-700 mb-3 transition">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900">Enter Verification Code</h3>
            <p className="text-[13px] text-slate-500 mt-1">
              Code sent to <span className="font-mono font-medium text-slate-700">{patient.emergencyContactPhone}</span> · expires in 15 min
            </p>

            <div className="mt-3 text-xs text-teal-700 bg-teal-50 p-2.5 rounded-xl border border-teal-200 flex items-center gap-1.5">
              <Check className="w-4 h-4 shrink-0" />
              <span>Demo OTP: <strong className="font-mono tracking-widest">749210</strong> — pre-filled for you</span>
            </div>

            <div className="my-4">
              <input
                type="text"
                maxLength={6}
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit OTP"
                aria-label="6-digit OTP"
                className="w-full text-center tracking-[0.4em] font-mono text-2xl font-bold py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>

            <button onClick={handleVerify} disabled={isLoading || otp.length < 6} className="btn-primary w-full">
              {isLoading ? 'Checking code…' : 'Verify & Unlock'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
