import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../context/NotificationContext';
import { Search, Bell, Menu, Sun, Moon, Languages, User, LogOut, Check, Settings, ChevronDown, Activity, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, toggleTheme, language, toggleLanguage, t, user, logout } = useApp();
  const { unreadCount, notifications, markAllAsRead, markAsRead } = useNotifications();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setShowProfileMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-[50] px-4 sm:px-8 py-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <div className="flex items-center gap-6 pointer-events-auto">
          <button 
            onClick={toggleSidebar}
            className="p-4 lg:hidden rounded-[1.5rem] glass border-white/20 shadow-2xl text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform active:scale-95"
          >
            <Menu size={24} />
          </button>

          {/* Floating Search Island */}
          <div className={`
            hidden md:flex items-center gap-4 px-6 py-4 rounded-[1.5rem] glass border transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
            ${isSearchFocused 
              ? 'w-[450px] border-indigo-500 shadow-2xl shadow-indigo-500/20 scale-[1.02]' 
              : 'w-80 border-white/40 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-black/20'}
          `}>
            <Search size={20} className={isSearchFocused ? 'text-indigo-500' : 'text-slate-400'} />
            <input 
              type="text"
              placeholder={t('searchPlaceholder')}
              className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder-slate-400 font-black tracking-tight"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pointer-events-auto">
          {/* Quick Stats / Theme / Language Mini Island */}
          <div className="hidden sm:flex items-center gap-2 p-2 rounded-[1.5rem] glass shadow-xl">
            <button 
              onClick={toggleLanguage}
              className="px-4 py-2 rounded-[1rem] text-[10px] font-black uppercase tracking-widest bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              {language === 'bn' ? 'EN' : 'BN'}
            </button>
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-[1rem] transition-all hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 hover:text-amber-500"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          {/* Notifications Glow Trigger */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-4 rounded-[1.5rem] glass shadow-xl transition-all duration-300 ${showNotifications ? 'border-indigo-500 ring-4 ring-indigo-500/10' : ''}`}
            >
              <div className="relative">
                <Bell size={24} className="text-slate-600 dark:text-slate-300 group-hover:rotate-12 transition-transform" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] flex items-center justify-center bg-rose-500 text-white text-[10px] font-black rounded-full ring-4 ring-white dark:ring-slate-900 shadow-lg animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </div>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-6 w-96 glass border-indigo-500/20 rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in origin-top-right">
                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <div className="space-y-1">
                    <h4 className="font-black text-xs uppercase tracking-[0.2em]">Activity Feed</h4>
                    <p className="text-xs opacity-70 font-medium">You have {unreadCount} new updates</p>
                  </div>
                  <button onClick={markAllAsRead} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                    <Check size={18} />
                  </button>
                </div>
                <div className="max-h-[450px] overflow-y-auto custom-scrollbar p-2">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`m-2 p-6 rounded-[1.5rem] transition-all hover:bg-indigo-50 dark:hover:bg-white/5 group/item cursor-pointer ${!notif.read ? 'bg-indigo-50/50 dark:bg-white/5 border border-indigo-500/20' : ''}`}
                        onClick={() => { markAsRead(notif.id); setShowNotifications(false); }}
                      >
                        <div className="flex gap-4">
                          <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${!notif.read ? 'bg-indigo-500 shadow-[0_0_10px_#6366f1]' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                          <div>
                            <p className={`text-sm ${!notif.read ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-500'}`}>
                              {notif.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed font-medium">{notif.message}</p>
                            <span className="text-[10px] text-indigo-500/60 mt-3 block font-black uppercase tracking-widest">{notif.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-16 text-center text-slate-400"><p className="text-sm font-black uppercase tracking-widest opacity-40">System Idle</p></div>
                  )}
                </div>
                <Link to="/app/notifications" onClick={() => setShowNotifications(false)} className="block p-6 text-center text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500 hover:text-white border-t border-white/10 transition-all">
                   View Full Center
                </Link>
              </div>
            )}
          </div>

          {/* Stylized User Profile Island */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex items-center gap-4 p-2 rounded-full glass shadow-xl transition-all duration-300 hover:scale-105 ${showProfileMenu ? 'border-emerald-500 ring-4 ring-emerald-500/10' : ''}`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 p-1 shadow-inner overflow-hidden">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'demo'}`} className="w-full h-full rounded-full object-cover bg-white" alt="User" />
              </div>
              <div className="hidden lg:block text-left mr-2">
                 <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tighter truncate w-24">{user?.name || 'Citizen'}</p>
                 <div className="flex items-center gap-1.5 mt-0.5">
                   <Zap size={10} className="text-amber-500" />
                   <span className="text-[10px] font-black text-emerald-500">Gold Tier</span>
                 </div>
              </div>
              <ChevronDown size={18} className={`text-slate-400 mr-2 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-6 w-64 glass border-emerald-500/20 rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in origin-top-right">
                <div className="p-8 border-b border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                  <p className="font-black text-lg text-white truncate tracking-tighter uppercase">{user?.name || 'Citizen User'}</p>
                  <div className="flex items-center gap-2 mt-2 bg-emerald-500/20 w-fit px-3 py-1 rounded-full border border-emerald-500/30">
                     <Activity size={12} className="text-emerald-400" />
                     <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Score: 8,450</span>
                  </div>
                </div>
                <div className="p-3">
                  <Link to="/app/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-4 px-6 py-4 text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white rounded-[1.5rem] transition-all uppercase tracking-widest">
                    <User size={18} /> {t('profile')}
                  </Link>
                  <Link to="/app/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-4 px-6 py-4 text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-indigo-500 hover:text-white rounded-[1.5rem] transition-all uppercase tracking-widest">
                    <Settings size={18} /> {t('settings')}
                  </Link>
                </div>
                <div className="p-3 border-t border-white/10">
                  <button onClick={logout} className="w-full flex items-center gap-4 px-6 py-4 text-xs font-black text-rose-500 hover:bg-rose-500 hover:text-white rounded-[1.5rem] transition-all uppercase tracking-widest">
                    <LogOut size={18} /> {t('logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};