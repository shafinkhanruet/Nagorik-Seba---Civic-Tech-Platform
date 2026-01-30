import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bell, Menu, Sun, Moon, Languages, Shield, User } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, toggleTheme, language, toggleLanguage, t, user, role } = useApp();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Role Badge Config
  const getRoleBadge = () => {
    switch (role) {
      case 'admin':
      case 'superadmin':
        return { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: Shield, label: 'Admin' };
      case 'moderator':
        return { color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', icon: Shield, label: 'Mod' };
      default:
        return { color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', icon: User, label: 'Citizen' };
    }
  };

  const badge = getRoleBadge();

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

        {/* Profile & Role Badge */}
        <div className="flex items-center gap-3 pl-2 ml-2 border-l border-slate-200 dark:border-slate-700">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.name || 'Guest'}</p>
            <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${badge.color}`}>
               <badge.icon size={8} /> {badge.label}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden">
            {user ? (
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full" />
            ) : (
               <User size={20} className="text-slate-400" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};