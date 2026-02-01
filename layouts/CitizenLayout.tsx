import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { SessionWarning } from '../components/SessionWarning';
import { DemoModeIndicator } from '../components/DemoModeIndicator';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { AlertTriangle, Siren } from 'lucide-react';

export const CitizenLayout: React.FC = () => {
  const { crisisMode, language } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans selection:bg-emerald-500/30">
      <Sidebar isOpen={sidebarOpen} closeMobileMenu={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(true)} />
        
        {crisisMode && (
          <div className="bg-red-600 text-white px-6 py-2.5 font-bold flex items-center gap-3 justify-center shadow-lg animate-pulse z-20">
            <Siren size={18} className="animate-bounce" />
            <span className="text-sm tracking-wide">
              {language === 'bn' 
                ? 'জরুরি অবস্থা সক্রিয়: নতুন রিপোর্ট এবং ভোট সাময়িকভাবে বন্ধ আছে' 
                : 'CRISIS MODE ACTIVE: Voting and Reporting Disabled'}
            </span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-20">
            <Outlet />
          </div>
        </main>
      </div>

      <SessionWarning />
      <DemoModeIndicator />
      <RoleSwitcher />
    </div>
  );
};