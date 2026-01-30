import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Theme, Role, User } from '../types';
import { TRANSLATIONS } from '../constants';

interface AppContextType {
  language: Language;
  toggleLanguage: () => void;
  theme: Theme;
  toggleTheme: () => void;
  user: User | null;
  role: Role; // Derived from user or default to citizen
  login: (userData: User) => void;
  logout: () => void;
  setRole: (role: Role) => void; // Dev helper
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('bn');
  const [theme, setTheme] = useState<Theme>('light');
  const [user, setUser] = useState<User | null>(null);

  // Load settings and auth from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    const savedUserStr = localStorage.getItem('auth_user');
    if (savedUserStr) {
      try {
        const savedUser = JSON.parse(savedUserStr);
        // Simple expiry check (mock)
        if (savedUser.expiresAt > Date.now()) {
          setUser(savedUser);
        } else {
          localStorage.removeItem('auth_user');
        }
      } catch (e) {
        console.error("Failed to parse auth user", e);
      }
    }
  }, []);

  // Apply theme class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'bn' ? 'en' : 'bn');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    // Force redirect to the unified login page
    window.location.href = '/#/login'; 
  };

  // Dev helper to switch roles quickly, updates the user object strictly for dev
  const setRole = (role: Role) => {
    const mockUser: User = {
      id: 'dev-user',
      name: 'Developer',
      role: role,
      token: 'mock-dev-token',
      expiresAt: Date.now() + 86400000
    };
    login(mockUser);
  };

  const t = (key: string): string => {
    if (!TRANSLATIONS[key]) return key;
    return TRANSLATIONS[key][language];
  };

  // Default role is citizen if not logged in (for public view pages), but auth guards will block protected routes
  const role = user?.role || 'citizen';

  return (
    <AppContext.Provider value={{ language, toggleLanguage, theme, toggleTheme, user, role, login, logout, setRole, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};