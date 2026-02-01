import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CITIZEN_NAV_ITEMS } from '../constants';
import { X, LogOut, ChevronRight, LayoutGrid, Sparkles } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  closeMobileMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeMobileMenu }) => {
  const { language, logout, t } = useApp();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-indigo-950/40 backdrop-blur-md z-[60] lg:hidden animate-fade-in"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-[70]
        h-screen w-[300px]
        bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl
        border-r border-indigo-500/10
        transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col shadow-2xl lg:shadow-none p-6
      `}>
        {/* Logo Area */}
        <div className="h-28 flex-none flex items-center justify-between px-4 mb-8">
          <div className="flex items-center gap-4 group">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 bg-indigo-500 rounded-[1.25rem] rotate-12 opacity-20 group-hover:rotate-45 transition-transform duration-700"></div>
              <div className="relative w-full h-full rounded-[1.25rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-500 flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-indigo-500/20 overflow-hidden">
                <span className="relative z-10">না</span>
                <div className="absolute inset-0 bg-white/10 group-hover:opacity-100 opacity-0 transition-opacity"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-slate-800 dark:text-white leading-none tracking-tighter uppercase">
                নাগরিক সেবা
              </span>
              <span className="text-[10px] uppercase tracking-[0.4em] text-indigo-500 font-black mt-2">
                PLATFORM
              </span>
            </div>
          </div>
          <button 
            onClick={closeMobileMenu}
            className="lg:hidden p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
          <div className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] px-4 mb-6">
            Main Menu
          </div>
          
          {CITIZEN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={closeMobileMenu}
              end={item.path === '/app'}
              className={({ isActive }) => `
                relative flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 group
                ${isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-600/30 scale-[1.02]' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-white'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon 
                    size={22} 
                    strokeWidth={isActive ? 2.5 : 1.5}
                    className={`transition-all duration-500 ${isActive ? 'rotate-0' : 'group-hover:-rotate-12 group-hover:scale-110'}`} 
                  />
                  <span className={`text-sm tracking-tight font-black ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                    {language === 'bn' ? item.labelBn : item.labelEn}
                  </span>
                  {isActive && (
                    <Sparkles size={14} className="ml-auto text-amber-300 animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        {/* Colorful Banner Area */}
        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
           <div className="p-6 rounded-[2rem] bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden group cursor-pointer shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            
            <div className="flex items-center gap-2 mb-4">
               <div className="p-2 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/40">
                  <LayoutGrid size={16} />
               </div>
               <h4 className="font-black text-xs uppercase tracking-widest text-emerald-400">
                 Pro Account
               </h4>
            </div>
            <p className="text-[11px] text-slate-400 mb-6 leading-relaxed font-bold">
              Level up your status by helping your local community.
            </p>
            <button className="w-full py-3 bg-white text-indigo-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.05] active:scale-95">
              Check Rank
            </button>
          </div>

          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 mt-6 rounded-[1.25rem] text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all text-xs font-black uppercase tracking-widest"
          >
            <LogOut size={18} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};