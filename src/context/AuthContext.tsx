import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Role } from '../types';
import { EhrApi } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  loginAsDemo: (role: Role) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<Role, User> = {
  DOCTOR: {
    userId: 'doc-user-1',
    email: 'dr.jenkins@stjude.org',
    role: 'DOCTOR',
    profileId: 'doc-prof-1',
    fullName: 'Dr. Sarah Jenkins, MD, FACC',
    licenseVerified: true,
  },
  PATIENT: {
    userId: 'pat-user-1',
    email: 'john.doe@email.com',
    role: 'PATIENT',
    profileId: 'p1-uuid-4471',
    fullName: 'Johnathon Edward Doe',
  },
  ADMIN: {
    userId: 'admin-user-1',
    email: 'admin@national-ehr.gov',
    role: 'ADMIN',
    profileId: 'admin-prof-1',
    fullName: 'Maya Rao, Compliance Lead',
  },
  AUDITOR: {
    userId: 'auditor-user-1',
    email: 'auditor@national-ehr.gov',
    role: 'AUDITOR',
    profileId: 'auditor-prof-1',
    fullName: 'Senior Clinical Auditor',
  },
};

export const DEMO_CREDENTIALS: { role: Role; email: string; password: string; name: string; blurb: string }[] = [
  { role: 'DOCTOR', email: 'dr.jenkins@stjude.org', password: 'Doctor@123456', name: 'Dr. Sarah Jenkins', blurb: 'Cardiologist · St. Jude' },
  { role: 'PATIENT', email: 'john.doe@email.com', password: 'Patient@123456', name: 'Johnathon Doe', blurb: 'Patient · NHID-9821-4471' },
  { role: 'ADMIN', email: 'admin@national-ehr.gov', password: 'Admin@123456', name: 'Maya Rao', blurb: 'Compliance & safety' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('ehr_token');
      const savedUser = localStorage.getItem('ehr_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch {
      localStorage.removeItem('ehr_token');
      localStorage.removeItem('ehr_user');
    }
    setIsLoading(false);
  }, []);

  const persist = (u: User, t: string) => {
    setUser(u);
    setToken(t);
    localStorage.setItem('ehr_token', t);
    localStorage.setItem('ehr_user', JSON.stringify(u));
  };

  const login = async (username: string, password: string) => {
    const res = await EhrApi.login(username, password);
    persist(res.data.user, res.data.token);
  };

  const loginAsDemo = useCallback((role: Role) => {
    persist(DEMO_USERS[role], 'mock-jwt-token-2026');
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ehr_token');
    localStorage.removeItem('ehr_user');
  };

  const switchRole = (newRole: Role) => {
    loginAsDemo(newRole);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, loginAsDemo, logout, switchRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
