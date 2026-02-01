
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from '../types';
import { mockApi } from '../services/mockApi';
import { TRANSLATIONS } from '../constants';

interface AppContextType {
  user: User | null;
  isLoading: boolean;
  crisisMode: boolean;
  login: (identifier: string | any) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => void;
  setCrisisMode: (active: boolean) => void;
  // Added properties
  language: 'bn' | 'en';
  toggleLanguage: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  t: (key: string) => string;
  role: Role;
  setRole: (role: Role) => void;
  timeLeft: number;
  extendSession: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [crisisMode, setCrisisMode] = useState<boolean>(false);
  
  // New States
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [role, setRole] = useState<Role>('citizen');
  const [timeLeft, setTimeLeft] = useState<number>(1800000); // 30 mins

  useEffect(() => {
    // Check for persisted session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setRole(parsedUser.role);
    }
    
    // Check system status
    mockApi.admin.getCrisisStatus().then(status => setCrisisMode(status.active));
    setIsLoading(false);

    // Theme init
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Timer Effect
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const login = async (identifier: string | any) => {
    // Handle object based login (admin bypass)
    if (typeof identifier === 'object' && identifier.id) {
        setUser(identifier);
        setRole(identifier.role);
        localStorage.setItem('user', JSON.stringify(identifier));
        localStorage.setItem('auth_token', identifier.token || 'mock-token');
        return;
    }
    // Normal flow
    await mockApi.auth.login(identifier);
  };

  const verifyOtp = async (otp: string) => {
    const { user, token } = await mockApi.auth.verifyOtp(otp);
    setUser(user);
    setRole(user.role);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('auth_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'bn' ? 'en' : 'bn');
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      if (newTheme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return newTheme;
    });
  };

  const t = (key: string): string => {
    // Fallback translation if key missing
    if (!TRANSLATIONS[key]) return key;
    return TRANSLATIONS[key][language];
  };

  const extendSession = () => {
    setTimeLeft(1800000);
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      isLoading, 
      crisisMode, 
      login, 
      verifyOtp, 
      logout, 
      setCrisisMode,
      language,
      toggleLanguage,
      theme,
      toggleTheme,
      t,
      role,
      setRole,
      timeLeft,
      extendSession
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
