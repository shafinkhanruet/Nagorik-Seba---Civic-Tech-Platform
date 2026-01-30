import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { CitizenLayout } from './layouts/CitizenLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { RoleSwitcher } from './components/RoleSwitcher';

// Pages
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
import { DigitalOath } from './pages/DigitalOath';
import { ModerationQueue } from './pages/ModerationQueue';
import { AuditLogs } from './pages/AuditLogs';
import { CourtOrders } from './pages/CourtOrders';
import { IdentityUnlock } from './pages/IdentityUnlock';

// Placeholder Component for Admin Pages not yet implemented
const PlaceholderAdminPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
    <div className="w-20 h-20 mb-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center animate-pulse">
      <span className="text-3xl">🚧</span>
    </div>
    <h2 className="text-2xl font-bold text-slate-300 mb-2">{title}</h2>
    <p className="text-slate-600 font-mono">Module Under Construction</p>
  </div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ allowedRoles: string[] }> = ({ allowedRoles }) => {
  const { role } = useApp();
  
  if (!allowedRoles.includes(role)) {
    // If user is trying to access admin but is citizen, redirect to app dashboard
    if (role === 'citizen') return <Navigate to="/app" replace />;
    // If unauthorized admin level, maybe just redirect to admin dashboard
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Navigate to="/app" replace />} />

      {/* Citizen Panel Routes */}
      <Route path="/app" element={<CitizenLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="reports" element={<LiveReports />} />
        <Route path="proposals" element={<ProjectProposals />} />
        <Route path="govt-projects" element={<GovtProjects />} />
        <Route path="tenders" element={<TenderAnalysis />} /> {/* Public View */}
        <Route path="integrity" element={<IntegrityIndex />} />
        <Route path="hospitals" element={<HospitalMonitor />} />
        <Route path="repair" element={<CommunityRepair />} />
        <Route path="digital-oath" element={<DigitalOath />} />
      </Route>

      {/* Admin Panel Routes - Protected */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['moderator', 'admin', 'superadmin']} />}>
        <Route element={<AdminLayout />}>
          <Route index element={<PlaceholderAdminPage title="Admin Dashboard" />} />
          
          <Route path="moderation" element={<ModerationQueue />} />
          <Route path="reports" element={<PlaceholderAdminPage title="Report Review" />} />
          <Route path="evidence" element={<PlaceholderAdminPage title="Evidence Vault" />} />
          <Route path="anomalies" element={<PlaceholderAdminPage title="Vote Anomalies" />} />
          <Route path="bots" element={<PlaceholderAdminPage title="Bot Activity" />} />
          <Route path="approvals" element={<PlaceholderAdminPage title="Project Approvals" />} />
          <Route path="tenders" element={<TenderAnalysis />} /> {/* Admin Context reuse for now, ideally separate */}
          <Route path="districts" element={<PlaceholderAdminPage title="District Controls" />} />
          
          {/* High Security Areas */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
             <Route path="audit-logs" element={<AuditLogs />} />
             <Route path="court-orders" element={<CourtOrders />} />
             <Route path="identity-unlock" element={<IdentityUnlock />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
        <RoleSwitcher />
      </HashRouter>
    </AppProvider>
  );
};

export default App;