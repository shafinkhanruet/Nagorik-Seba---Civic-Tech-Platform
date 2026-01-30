import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { LiveReports } from './pages/LiveReports';
import { ProjectProposals } from './pages/ProjectProposals';
import { GovtProjects } from './pages/GovtProjects';
import { TenderAnalysis } from './pages/TenderAnalysis';
import { IntegrityIndex } from './pages/IntegrityIndex';
import { HospitalMonitor } from './pages/HospitalMonitor';
import { CommunityRepair } from './pages/CommunityRepair';

// Placeholder components for other routes
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
    <div className="w-24 h-24 mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
      <span className="text-4xl">🚧</span>
    </div>
    <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">{title}</h2>
    <p>This page is currently under development.</p>
  </div>
);

const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useApp();

  return (
    <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <Sidebar 
        isOpen={sidebarOpen} 
        closeMobileMenu={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reports" element={<LiveReports />} />
              <Route path="/proposals" element={<ProjectProposals />} />
              <Route path="/govt-projects" element={<GovtProjects />} />
              <Route path="/tenders" element={<TenderAnalysis />} />
              <Route path="/integrity" element={<IntegrityIndex />} />
              <Route path="/hospitals" element={<HospitalMonitor />} />
              <Route path="/repair" element={<CommunityRepair />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>

        <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200/50 dark:border-slate-800/50">
          <p>{t('footerDisclaimer')}</p>
        </footer>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppLayout />
      </HashRouter>
    </AppProvider>
  );
};

export default App;