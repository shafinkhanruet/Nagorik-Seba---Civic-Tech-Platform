import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useMockApi } from '../hooks/useMockApi';
import { useToast } from '../context/ToastContext';
import { GlassCard } from '../components/GlassCard';
import { RestrictedButton } from '../components/RestrictedWrapper';
import { ProjectProposalData } from '../types';
import { MoralImpactPanel } from '../components/MoralImpactPanel';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Snowflake, 
  RefreshCw, 
  Gavel, 
  Search, 
  Filter, 
  BrainCircuit, 
  MapPin, 
  Users, 
  Leaf, 
  TrendingUp,
  ShieldAlert,
  Lock,
  Loader2
} from 'lucide-react';

export const ProjectApprovals: React.FC = () => {
  const { t, user } = useApp();
  const api = useMockApi();
  const { addToast } = useToast();
  
  const [proposals, setProposals] = useState<ProjectProposalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [publicNotice, setPublicNotice] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await api.getProjects();
      setProposals(data);
      if (data.length > 0) setSelectedId(data[0].id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectedProject = proposals.find(p => p.id === selectedId);

  const handleAction = async (type: 'approve' | 'reject' | 'freeze') => {
    if (!selectedId || !reason) {
      addToast('Please provide a reason code and note.', 'error');
      return;
    }
    
    setActionLoading(true);
    try {
      const actor = user?.name || 'Admin';
      const fullReason = `${reason} - ${publicNotice}`;
      
      if (type === 'approve') await api.approveProject(selectedId, actor, fullReason);
      if (type === 'reject') await api.rejectProject(selectedId, actor, fullReason);
      if (type === 'freeze') await api.freezeProject(selectedId, actor, fullReason);

      addToast(`Project ${type}d successfully`, 'success');
      
      // Refresh list
      await loadProjects();
      setPublicNotice('');
      
    } catch (e) {
      addToast('Action failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMoralRecalculate = () => {
    addToast('Recalculating score based on updated sensors...', 'info');
    // Mock update: in real app this would call API
    setTimeout(() => addToast('Score updated successfully', 'success'), 1500);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-500 text-white';
      case 'Medium': return 'bg-amber-500 text-white';
      default: return 'bg-emerald-500 text-white';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': 
      case 'open':
        return <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-emerald-200 dark:border-emerald-800">Voting Open</span>;
      case 'frozen': return <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-blue-200 dark:border-blue-800">Frozen</span>;
      case 'approved': return <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-indigo-200 dark:border-indigo-800">Approved</span>;
      case 'rejected': return <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-red-200 dark:border-red-800">Rejected</span>;
      default: return <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Archived</span>;
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 animate-fade-in">
      
      {/* 1) Proposal List (Left Column) */}
      <div className="lg:w-1/3 flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileText className="text-slate-500" /> Project Proposals
          </h2>
          <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded-full">
            {proposals.length} Items
          </span>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {loading ? (
             <div className="flex justify-center p-10"><Loader2 className="animate-spin text-slate-400" /></div>
          ) : (
            proposals.map((project) => (
              <div 
                key={project.id}
                onClick={() => setSelectedId(project.id)}
                className={`
                  p-4 rounded-xl cursor-pointer border transition-all duration-200
                  ${selectedId === project.id 
                    ? 'bg-white dark:bg-slate-800 border-indigo-500 shadow-lg shadow-indigo-500/10' 
                    : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'}
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono text-slate-500">{project.id}</span>
                  {getStatusBadge(project.status)}
                </div>
                
                <h3 className={`font-bold text-sm mb-1 ${selectedId === project.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-200'}`}>
                  {project.title}
                </h3>
                
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <MapPin size={12} /> {project.location}
                </div>

                {/* Progress Bar Mini */}
                <div className="flex items-center gap-2">
                   <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${project.approvalStats.current >= project.approvalStats.required ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                        style={{ width: `${project.approvalStats.current}%` }}
                      ></div>
                   </div>
                   <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{project.approvalStats.current}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2) Detail Panel & Controls (Right Column) */}
      <div className="lg:w-2/3 h-full flex flex-col">
        {selectedProject ? (
          <GlassCard className="flex-1 flex flex-col overflow-hidden border-slate-200 dark:border-slate-700" noPadding>
            
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
               
               {/* Header */}
               <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                     <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded uppercase tracking-wider">
                          {selectedProject.ministry}
                        </span>
                     </div>
                     <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">{selectedProject.title}</h1>
                     <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><MapPin size={14} /> {selectedProject.location}</span>
                        <span className="flex items-center gap-1"><Users size={14} /> {selectedProject.approvalStats.totalVotes.toLocaleString()} Votes</span>
                     </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                     <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Approval Score</p>
                        <div className="flex items-baseline justify-end gap-1">
                           <span className={`text-3xl font-bold ${selectedProject.approvalStats.current >= selectedProject.approvalStats.required ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                             {selectedProject.approvalStats.current}%
                           </span>
                           <span className="text-xs text-slate-400">/ {selectedProject.approvalStats.required}% req</span>
                        </div>
                     </div>
                     <div className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getRiskColor(selectedProject.budget.risk)}`}>
                        {selectedProject.budget.risk} Risk
                     </div>
                  </div>
               </div>

               {/* Body */}
               <div className="space-y-4">
                  <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                     <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2 flex items-center gap-2">
                       <BrainCircuit size={14} /> AI Executive Summary
                     </h3>
                     <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                       {selectedProject.aiSummary}
                     </p>
                  </div>

                  {/* Moral Impact Analysis */}
                  {selectedProject.moralMetrics && (
                    <MoralImpactPanel 
                      metrics={selectedProject.moralMetrics} 
                      isAdmin={true} 
                      onRecalculate={handleMoralRecalculate}
                    />
                  )}
               </div>
            </div>

            {/* 3) Control Panel (Fixed Bottom) */}
            <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
               
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  {/* Inputs */}
                  <div className="md:col-span-2 space-y-2">
                     <label className="text-[10px] font-bold text-slate-500 uppercase">Public Notice (Transparency Log)</label>
                     <textarea 
                       value={publicNotice}
                       onChange={(e) => setPublicNotice(e.target.value)}
                       className="w-full h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-slate-400 resize-none"
                       placeholder="Reason for administrative action..."
                     />
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-500 uppercase">Reason Code</label>
                     <select 
                       value={reason}
                       onChange={(e) => setReason(e.target.value)}
                       className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-slate-400 h-[38px]"
                     >
                       <option value="">Select Reason...</option>
                       <option value="legal">Legal Compliance</option>
                       <option value="security">National Security Risk</option>
                       <option value="data">Data Integrity Issue</option>
                       <option value="public_interest">Public Interest</option>
                     </select>
                  </div>

                  {/* Main Actions */}
                  <div className="flex flex-col gap-2">
                     <div className="flex gap-2">
                       <RestrictedButton 
                         permission="action:approve_project"
                         onClick={() => handleAction('approve')}
                         disabled={actionLoading}
                         className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1"
                       >
                         {actionLoading ? <Loader2 className="animate-spin" size={12} /> : <><CheckCircle2 size={12} /> Approve</>}
                       </RestrictedButton>
                       <RestrictedButton 
                         permission="action:approve_project"
                         onClick={() => handleAction('reject')}
                         disabled={actionLoading}
                         className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1"
                       >
                         <XCircle size={12} /> Reject
                       </RestrictedButton>
                     </div>
                     <div className="flex gap-2">
                        <RestrictedButton 
                          permission="action:freeze_project"
                          onClick={() => handleAction('freeze')}
                          disabled={actionLoading}
                          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1"
                        >
                          <Snowflake size={12} /> Freeze
                        </RestrictedButton>
                     </div>
                  </div>
               </div>
            </div>

          </GlassCard>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">Select a project to review</div>
        )}
      </div>
    </div>
  );
};