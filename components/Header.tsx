import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bell, Menu, Sun, Moon, Languages } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, toggleTheme, language, toggleLanguage, t } = useApp();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-20 px-6 flex items-center justify-between
      bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl
      border-b border-slate-200/60 dark:border-slate-800/60"
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 lg:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
        >
          <Menu size={24} />
        </button>

        {/* Search Bar */}
        <div className={`
          hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full
          bg-slate-100/50 dark:bg-slate-800/50 
          border transition-all duration-300
          ${isSearchFocused 
            ? 'w-96 border-emerald-500/50 ring-2 ring-emerald-500/10' 
            : 'w-64 border-transparent hover:border-slate-300 dark:hover:border-slate-700'}
        `}>
          <Search size={18} className="text-slate-400" />
          <input 
            type="text"
            placeholder={t('searchPlaceholder')}
            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder-slate-400"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold
            bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300
            hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Languages size={16} />
          <span>{language === 'bn' ? 'EN' : 'বাংলা'}</span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-900"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-2 ml-2 border-l border-slate-200 dark:border-slate-700">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">আব্দুর রহিম</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">নাগরিক</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm">
            <img 
              src="https://picsum.photos/40/40" 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};