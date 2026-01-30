import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ADMIN_NAV_ITEMS } from '../constants';
import { SessionBanner } from '../components/SessionBanner';
import { 
  Shield, 
  Menu, 
  X, 
  LogOut, 
  Bell, 
  Search,
  ChevronRight,
  Lock
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t, language, role, user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-red-900 selection:text-white flex-col">
      
      {/* Security Banner */}
      <SessionBanner />

      <div className="flex flex-1">
        {/* Admin Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 z-50
          h-[calc(100vh-30px)] top-[30px] w-72
          bg-slate-900 border-r border-slate-800
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col shadow-2xl
        `}>
          {/* Admin Logo Area */}
          <div className="h-16 flex-none flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-red-900/50 flex items-center justify-center text-red-500 border border-red-800">
                <Shield size={18} />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-100">
                SECURE<span className="text-red-600">.ADMIN</span>
              </span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-500 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Admin User Profile Snippet */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/50">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                   <span className="font-bold text-sm text-slate-400">
                     {user?.name ? user.name.charAt(0) : 'OP'}
                   </span>
                </div>
                <div className="overflow-hidden">
                   <p className="text-sm font-bold text-white truncate">{user?.name || 'Operator'}</p>
                   <p className="text-[10px] uppercase font-bold text-red-500 tracking-wider flex items-center gap-1">
                     <Lock size={8} /> {role.toUpperCase()}
                   </p>
                </div>
             </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto custom-scrollbar">
            {ADMIN_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group
                  ${isActive 
                    ? 'bg-red-900/20 text-red-400 border-l-2 border-red-600' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-l-2 border-transparent'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className={isActive ? 'text-red-500' : 'text-slate-500 group-hover:text-slate-300'} />
                      <span className="text-sm font-medium">
                        {language === 'bn' ? item.labelBn : item.labelEn}
                      </span>
                    </div>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-800">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Security Banner */}
          <div className="h-8 bg-red-950/50 border-b border-red-900/30 flex items-center justify-center gap-2 px-4">
             <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-[0.2em]">
               {t('restricted_area')}
             </span>
             <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
          </div>

          {/* Admin Header */}
          <header className="h-16 px-6 flex items-center justify-between bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
             <button 
               onClick={() => setSidebarOpen(true)}
               className="lg:hidden p-2 text-slate-400 hover:text-white"
             >
               <Menu size={24} />
             </button>

             {/* Search */}
             <div className="hidden md:flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-full px-4 py-1.5 w-96 focus-within:border-red-900/50 transition-colors">
                <Search size={14} className="text-slate-600" />
                <input 
                  type="text" 
                  placeholder="Search case files, IDs, or logs..." 
                  className="bg-transparent border-none outline-none text-xs w-full text-slate-300 placeholder-slate-600 font-mono"
                />
             </div>

             <div className="flex items-center gap-4">
                <div className="relative">
                   <Bell size={20} className="text-slate-400 hover:text-white cursor-pointer transition-colors" />
                   <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                <div className="text-right hidden sm:block">
                   <p className="text-xs text-slate-500 font-mono">{new Date().toLocaleTimeString()}</p>
                   <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wide">System Operational</p>
                </div>
             </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 overflow-x-hidden bg-slate-950 relative">
             {/* Grid Background Effect */}
             <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
             <div className="relative z-10 max-w-7xl mx-auto">
               <Outlet />
             </div>
          </main>
        </div>
      </div>

    </div>
  );
};