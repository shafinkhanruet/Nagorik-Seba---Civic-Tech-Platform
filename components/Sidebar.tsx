import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { NAV_ITEMS } from '../constants';
import { X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  closeMobileMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeMobileMenu }) => {
  const { language } = useApp();

  // Split nav items to separate auth links
  const mainNavItems = NAV_ITEMS.filter(item => !['login', 'signup'].includes(item.id));
  const authNavItems = NAV_ITEMS.filter(item => ['login', 'signup'].includes(item.id));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50
        h-screen w-72
        bg-white/80 dark:bg-slate-900/90
        backdrop-blur-2xl
        border-r border-slate-200/60 dark:border-slate-800/60
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo Area */}
        <div className="h-20 flex-none flex items-center justify-between px-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/30">
              না
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight">
                নাগরিক সেবা
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                সিভিক টেক প্ল্যাটফর্ম
              </span>
            </div>
          </div>
          <button 
            onClick={closeMobileMenu}
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items - Scrollable Area */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}
              `}
            >
              <item.icon 
                size={22} 
                strokeWidth={1.5}
                className="group-hover:scale-110 transition-transform duration-200" 
              />
              <span className="text-sm font-medium">
                {language === 'bn' ? item.labelBn : item.labelEn}
              </span>
            </NavLink>
          ))}

          <div className="pt-4 mt-4 border-t border-slate-200/50 dark:border-slate-800/50">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {language === 'bn' ? 'অ্যাকাউন্ট' : 'Account'}
            </p>
            {authNavItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={closeMobileMenu}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}
                `}
              >
                <item.icon 
                  size={22} 
                  strokeWidth={1.5}
                  className="group-hover:scale-110 transition-transform duration-200" 
                />
                <span className="text-sm font-medium">
                  {language === 'bn' ? item.labelBn : item.labelEn}
                </span>
              </NavLink>
            ))}
          </div>
        </nav>
        
        {/* Bottom CTA */}
        <div className="p-4">
           <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
            <h4 className="font-bold text-sm mb-1 opacity-90">
              {language === 'bn' ? 'মতামত দিন' : 'Give Feedback'}
            </h4>
            <p className="text-xs opacity-75 mb-3 leading-relaxed">
              {language === 'bn' 
                ? 'আপনার এলাকার সমস্যা আমাদের জানান।'
                : 'Report issues in your local area.'}
            </p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-xs font-semibold transition-colors">
              {language === 'bn' ? 'রিপোর্ট করুন' : 'Report Now'}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};