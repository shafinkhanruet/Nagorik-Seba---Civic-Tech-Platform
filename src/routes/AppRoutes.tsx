
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CitizenLayout } from '../layouts/CitizenLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { Loader2 } from 'lucide-react';

// Pages
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { AdminLogin } from '../pages/AdminLogin';
import { CitizenFeed } from '../pages/CitizenFeed';
import { Dashboard } from '../pages/Dashboard';
import { LiveReports } from '../pages/LiveReports';
import { ProjectProposals } from '../pages/ProjectProposals';
import { ProjectApprovals } from '../pages/ProjectApprovals';
import { RTIRequestPage } from '../pages/RTIRequest';
import { AdminRTI } from '../pages/AdminRTI';
import { AuditLogs } from '../pages/AuditLogs';
import { CrisisControl } from '../pages/CrisisControl';
import { IdentityUnlock } from '../pages/IdentityUnlock';
import { CourtOrders } from '../pages/CourtOrders';
import { ModerationQueue } from '../pages/ModerationQueue';
import { VoteAnomalies } from '../pages/VoteAnomalies';
import { EvidenceVault } from '../pages/EvidenceVault';
import { NotificationCenter } from '../pages/NotificationCenter';
import { Profile } from '../pages/Profile';
import { Settings } from '../pages/Settings';
import { GovtProjects } from '../pages/GovtProjects';
import { MinistryTransparency } from '../pages/MinistryTransparency';
import { HospitalMonitor } from '../pages/HospitalMonitor';
import { CommunityRepair } from '../pages/CommunityRepair';
import { DigitalOath } from '../pages/DigitalOath';
import { IntegrityIndex } from '../pages/IntegrityIndex';
import { TenderAnalysis } from '../pages/TenderAnalysis';
import { ReportReview } from '../pages/ReportReview';
import { DistrictControls } from '../pages/DistrictControls';

/**
 * Fixed: Updated children to React.ReactNode and made it optional in type to prevent 
 * "children is missing" error when used in Route element props.
 */
const ProtectedRoute = ({ children, allowedRole }: { children?: React.ReactNode, allowedRole?: string }) => {
  const { user, isLoading } = useApp();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  
  if (allowedRole && user.role !== allowedRole && (user.role as string) !== 'superadmin') {
    if (user.role === 'admin' || user.role === 'moderator' || user.role === 'superadmin') {
       return allowedRole === 'admin' ? <>{children}</> : <Navigate to="/admin" replace />;
    }
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      
      {/* Citizen Routes */}
      <Route path="/app" element={<ProtectedRoute><CitizenLayout /></ProtectedRoute>}>
        <Route index element={<CitizenFeed />} />
        <Route path="analytics" element={<Dashboard />} />
        <Route path="reports" element={<LiveReports />} />
        <Route path="proposals" element={<ProjectProposals />} />
        <Route path="rti" element={<RTIRequestPage />} />
        <Route path="notifications" element={<NotificationCenter />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="govt-projects" element={<GovtProjects />} />
        <Route path="ministries" element={<MinistryTransparency />} />
        <Route path="hospitals" element={<HospitalMonitor />} />
        <Route path="repair" element={<CommunityRepair />} />
        <Route path="digital-oath" element={<DigitalOath />} />
        <Route path="integrity" element={<IntegrityIndex />} />
        <Route path="tenders" element={<TenderAnalysis />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="moderation" element={<ModerationQueue />} />
        <Route path="tenders" element={<TenderAnalysis />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="crisis-mode" element={<CrisisControl />} />
        <Route path="approvals" element={<ProjectApprovals />} />
        <Route path="rti" element={<AdminRTI />} />
        <Route path="reports" element={<ReportReview />} />
        <Route path="identity-unlock" element={<IdentityUnlock />} />
        <Route path="court-orders" element={<CourtOrders />} />
        <Route path="anomalies" element={<VoteAnomalies />} />
        <Route path="evidence" element={<EvidenceVault />} />
        <Route path="districts" element={<DistrictControls />} />
        <Route path="bots" element={<div>Bot Activity</div>} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
