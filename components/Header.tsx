
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../context/NotificationContext';
import { Search, Bell, Menu, Sun, Moon, Languages, Shield, User, LogOut, Check, Settings, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, toggleTheme, language, toggleLanguage, t, user, role, logout } = useApp();
  const { unreadCount, notifications, markAllAsRead } = useNotifications();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const badge = {
    admin: { color: 'bg-red-100 text-red-700 border-red-200', icon: Shield, label: 'ADMIN' },
    superadmin: { color: 'bg-red-100 text-red-700 border-red-200', icon: Shield, label: 'ROOT' },
    moderator: { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: Shield, label: 'MOD' },
    citizen: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: User, label: 'CITIZEN' },
  }[role] || { color: 'bg-slate-100 text-slate-700', icon: User, label: 'GUEST' };

  return (
    <header className="sticky top-0 z-30 px-6 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg shadow-slate-200/20 dark:shadow-slate-950/20 rounded-2xl px-4 py-3 flex items-center justify-between pointer-events-auto transition-all duration-300">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 lg:hidden rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            >
              <Menu size={24} />
            </button>

            {/* Search Bar */}
            <div className={`
              hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl
              bg-slate-100/50 dark:bg-slate-950/50 
              border transition-all duration-300
              ${isSearchFocused 
                ? 'w-80 border-emerald-500/50 ring-2 ring-emerald-500/10 bg-white dark:bg-slate-900' 
                : 'w-64 border-transparent hover:border-slate-300 dark:hover:border-slate-700'}
            `}>
              <Search size={18} className={`transition-colors ${isSearchFocused ? 'text-emerald-500' : 'text-slate-400'}`} />
              <input 
                type="text"
                placeholder={t('searchPlaceholder')}
                className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder-slate-400"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold
                bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700
                hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all"
            >
              <Languages size={16} />
              <span>{language === 'bn' ? 'EN' : 'বাংলা'}</span>
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-orange-500 dark:hover:text-yellow-400 transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 rounded-xl transition-all ${showNotifications ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <div className="relative">
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full shadow-sm ring-2 ring-white dark:ring-slate-900">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-scale-in origin-top-right z-50">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{t('notifications')}</h4>
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-2 py-1 rounded transition-colors flex items-center gap-1"
                    >
                      <Check size={14} /> {t('markAllRead')}
                    </button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`p-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors relative group ${!notif.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                          onClick={() => navigate('/app/notifications')}
                        >
                          <div className="flex gap-3">
                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notif.read ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-transparent'}`}></div>
                            <div>
                              <div className="flex justify-between items-start gap-4 mb-1">
                                <span className={`text-sm ${!notif.read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                                  {notif.title}
                                </span>
                                <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{notif.timestamp}</span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                                {notif.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400">
                        <Bell size={32} className="opacity-20 mb-3" />
                        <p className="text-xs font-medium">{t('noNotifications')}</p>
                      </div>
                    )}
                  </div>
                  <Link 
                    to="/app/notifications" 
                    onClick={() => setShowNotifications(false)}
                    className="block p-3 text-center text-xs font-bold text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 bg-slate-50 dark:bg-slate-950/50 transition-colors border-t border-slate-100 dark:border-slate-800"
                  >
                    {t('viewAll')}
                  </Link>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative pl-2" ref={profileRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 p-[2px] shadow-sm">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 overflow-hidden">
                    {user ? (
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                        <User size={18} className="text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-none mb-1">{user?.name || 'Guest User'}</p>
                  <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[9px] font-black uppercase tracking-wider ${badge.color}`}>
                     {badge.label}
                  </div>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 hidden lg:block ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-4 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-scale-in origin-top-right z-50">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 lg:hidden">
                    <p className="font-bold text-slate-800 dark:text-slate-100">{user?.name || 'Guest User'}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.id || 'ID: --'}</p>
                  </div>
                  
                  <div className="p-2 space-y-1">
                    <Link to="/app/profile" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <User size={16} /> {t('profile')}
                    </Link>
                    <Link to="/app/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <Settings size={16} /> {t('settings')}
                    </Link>
                  </div>
                  
                  <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <LogOut size={16} /> {t('logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
