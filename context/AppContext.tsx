import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Theme } from '../types';
import { TRANSLATIONS } from '../constants';

interface AppContextType {
  language: Language;
  toggleLanguage: () => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('bn');
  const [theme, setTheme] = useState<Theme>('light');

  // Load theme from local storage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Apply theme class to html element
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

  const t = (key: string): string => {
    if (!TRANSLATIONS[key]) return key;
    return TRANSLATIONS[key][language];
  };

  return (
    <AppContext.Provider value={{ language, toggleLanguage, theme, toggleTheme, t }}>
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