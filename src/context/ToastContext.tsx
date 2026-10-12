import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export type ToastKind = 'success' | 'info' | 'warning';

interface Toast {
  id: number;
  title: string;
  message?: string;
  kind: ToastKind;
}

interface ToastContextType {
  notify: (title: string, opts?: { message?: string; kind?: ToastKind }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let nextId = 1;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((title: string, opts?: { message?: string; kind?: ToastKind }) => {
    const id = nextId++;
    const toast: Toast = { id, title, message: opts?.message, kind: opts?.kind ?? 'success' };
    setToasts((prev) => [...prev.slice(-2), toast]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-[min(360px,calc(100vw-2.5rem))]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-rise bg-slate-900 text-white rounded-2xl p-3.5 pl-4 shadow-xl flex items-start gap-3"
          >
            <span
              className={`mt-0.5 shrink-0 ${
                t.kind === 'success' ? 'text-emerald-300' : t.kind === 'warning' ? 'text-amber-300' : 'text-sky-300'
              }`}
            >
              {t.kind === 'success' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : t.kind === 'warning' ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <Info className="w-5 h-5" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-snug">{t.title}</p>
              {t.message && <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{t.message}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="text-slate-400 hover:text-white transition shrink-0" aria-label="Dismiss">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
