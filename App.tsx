
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { CitizenLayout } from './layouts/CitizenLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { RoleSwitcher } from './components/RoleSwitcher';
import { SessionWarning } from './components/SessionWarning';
import { DemoModeIndicator } from './components/DemoModeIndicator';
import { checkPermission, Permission } from './config/permissions';

// Pages
import { CitizenFeed } from './pages/CitizenFeed';
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
import { ReportReview } from './pages/ReportReview';
import { EvidenceVault } from './pages/EvidenceVault';
import { VoteAnomalies } from './pages/VoteAnomalies';
import { ProjectApprovals } from './pages/ProjectApprovals';
import { DistrictControls } from './pages/DistrictControls';
import { CrisisControl } from './pages/CrisisControl';
import { NotificationCenter } from './pages/NotificationCenter';
import { Settings } from './pages/Settings';
import { MinistryTransparency } from './pages/MinistryTransparency';
import { RTIRequestPage } from './pages/RTIRequest';
import { AdminRTI } from './pages/AdminRTI';
import { Profile } from './pages/Profile';

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
interface ProtectedRouteProps {
  requiredPermission?: Permission;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredPermission }) => {
  const { role, user } = useApp();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check centralized permissions
  if (requiredPermission && !checkPermission(role, requiredPermission)) {
    if (role === 'citizen') {
      // Redirect citizen trying to access admin to app
      return <Navigate to="/app" replace />;
    }
    // Stay on current page or go to root if nowhere else
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

// Intelligent Root Redirector
const RootRedirect: React.FC = () => {
  const { user, role } = useApp();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (checkPermission(role, 'view:admin_panel')) {
    return <Navigate to="/admin" replace />;
  }
  
  return <Navigate to="/app" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Intelligent Root Redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Citizen Panel Routes - Accessible by users with basic access (all logged in) */}
      <Route path="/app" element={<ProtectedRoute />}>
        <Route element={<CitizenLayout />}>
          <Route index element={<CitizenFeed />} />
          <Route path="analytics" element={<Dashboard />} />
          <Route path="notifications" element={<NotificationCenter />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="ministries" element={<MinistryTransparency />} />
          <Route path="rti" element={<RTIRequestPage />} />
          <Route path="reports" element={<LiveReports />} />
          <Route path="proposals" element={<ProjectProposals />} />
          <Route path="govt-projects" element={<GovtProjects />} />
          <Route path="tenders" element={<TenderAnalysis />} /> {/* Public View */}
          <Route path="integrity" element={<IntegrityIndex />} />
          <Route path="hospitals" element={<HospitalMonitor />} />
          <Route path="repair" element={<CommunityRepair />} />
          <Route path="digital-oath" element={<DigitalOath />} />
        </Route>
      </Route>

      {/* Admin Panel Routes - Protected via 'view:admin_panel' permission */}
      <Route path="/admin" element={<ProtectedRoute requiredPermission="view:admin_panel" />}>
        <Route element={<AdminLayout />}>
          <Route index element={<PlaceholderAdminPage title="Admin Dashboard" />} />
          
          <Route path="moderation" element={<ModerationQueue />} />
          <Route path="reports" element={<ReportReview />} />
          <Route path="evidence" element={<EvidenceVault />} />
          <Route path="anomalies" element={<VoteAnomalies />} />
          <Route path="bots" element={<PlaceholderAdminPage title="Bot Activity" />} />
          <Route path="approvals" element={<ProjectApprovals />} />
          <Route path="tenders" element={<TenderAnalysis />} />
          <Route path="districts" element={<DistrictControls />} />
          <Route path="crisis-mode" element={<CrisisControl />} />
          <Route path="rti" element={<AdminRTI />} />
          
          {/* High Security Areas */}
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="court-orders" element={<CourtOrders />} />
          <Route path="identity-unlock" element={<IdentityUnlock />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <ToastProvider>
        <NotificationProvider>
          <HashRouter>
            <AppRoutes />
            <SessionWarning />
            <DemoModeIndicator />
            <RoleSwitcher />
          </HashRouter>
        </NotificationProvider>
      </ToastProvider>
    </AppProvider>
  );
};

export default App;
