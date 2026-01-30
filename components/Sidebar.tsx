
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CITIZEN_NAV_ITEMS } from '../constants';
import { X, LogOut, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  closeMobileMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeMobileMenu }) => {
  const { language, logout } = useApp();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50
        h-screen w-[280px]
        bg-white/90 dark:bg-slate-900/95
        backdrop-blur-2xl
        border-r border-slate-200/80 dark:border-slate-800/80
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
        shadow-2xl lg:shadow-none
      `}>
        {/* Logo Area */}
        <div className="h-24 flex-none flex items-center justify-between px-6">
          <div className="flex items-center gap-3.5 group cursor-pointer">
            <div className="relative w-11 h-11">
              <div className="absolute inset-0 bg-emerald-500 rounded-xl rotate-6 opacity-20 group-hover:rotate-12 transition-transform duration-300"></div>
              <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-500/30">
                না
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-slate-800 dark:text-slate-100 leading-none tracking-tight">
                নাগরিক সেবা
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mt-1.5">
                Civic Tech Platform
              </span>
            </div>
          </div>
          <button 
            onClick={closeMobileMenu}
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-2 mt-2">Menu</div>
          {CITIZEN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) => `
                relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 group overflow-hidden
                ${isActive 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md shadow-slate-900/10' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}
              `}
            >
              {({ isActive }) => (
                <>
                  {/* Icon */}
                  <item.icon 
                    size={22} 
                    strokeWidth={isActive ? 2 : 1.5}
                    className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} 
                  />
                  
                  {/* Label */}
                  <span className={`text-sm font-medium ${isActive ? 'font-bold' : ''}`}>
                    {language === 'bn' ? item.labelBn : item.labelEn}
                  </span>

                  {/* Active Indicator (Right Arrow) */}
                  {isActive && (
                    <ChevronRight size={16} className="ml-auto opacity-80" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        {/* Bottom Area */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
           <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:opacity-10 transition-opacity"></div>
            
            <h4 className="font-bold text-sm mb-1 relative z-10">
              {language === 'bn' ? 'মতামত দিন' : 'Give Feedback'}
            </h4>
            <p className="text-[11px] opacity-80 mb-3 leading-relaxed relative z-10">
              {language === 'bn' 
                ? 'আপনার এলাকার সমস্যা আমাদের জানান।'
                : 'Report issues in your local area.'}
            </p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-xs font-bold transition-all border border-white/10 relative z-10">
              {language === 'bn' ? 'রিপোর্ট করুন' : 'Report Now'}
            </button>
          </div>

          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 mt-4 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-sm font-bold"
          >
            <LogOut size={18} />
            <span>{language === 'bn' ? 'লগ আউট' : 'Logout'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
