import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AppShell } from './components/layout/AppShell';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { PatientDashboard } from './pages/PatientDashboard';
import { ComplianceAuditPage } from './pages/ComplianceAuditPage';
import { LoginPage } from './pages/LoginPage';
import { HeartHandshake } from 'lucide-react';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8F7]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto mb-3 animate-pulse">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-500">Getting your care ready…</p>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <>{children}</>;
};

const NotFound: React.FC = () => (
  <div className="card p-12 text-center max-w-md mx-auto mt-10">
    <p className="font-display text-5xl font-bold text-teal-600">404</p>
    <h1 className="font-display text-lg font-bold text-slate-900 mt-2">This page took a sick day 🤒</h1>
    <p className="text-sm text-slate-500 mt-1 mb-5">The page you&apos;re looking for isn&apos;t here. Let&apos;s get you back to care.</p>
    <a href="/" className="btn-primary">Back to home</a>
  </div>
);

const Shelled: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RequireAuth>
    <AppShell>{children}</AppShell>
  </RequireAuth>
);

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Shelled><DoctorDashboard /></Shelled>} />
            <Route path="/patient-portal" element={<Shelled><PatientDashboard /></Shelled>} />
            <Route path="/compliance" element={<Shelled><ComplianceAuditPage /></Shelled>} />
            <Route path="*" element={<Shelled><NotFound /></Shelled>} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
