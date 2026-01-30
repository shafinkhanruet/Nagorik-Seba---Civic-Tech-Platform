import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
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
  Lock
} from 'lucide-react';

// --- Types & Mock Data ---

interface AdminProposal {
  id: string;
  title: string;
  ministry: string;
  location: string;
  approvalScore: number; // %
  requiredScore: number; // %
  status: 'active' | 'frozen' | 'approved' | 'rejected' | 'revision';
  riskLevel: 'Low' | 'Medium' | 'High';
  aiSummary: string;
  feedbackThemes: { label: string; sentiment: 'positive' | 'negative' | 'neutral' }[];
  moralImpact: string;
  totalVotes: number;
  submittedDate: string;
}

const MOCK_PROPOSALS: AdminProposal[] = [
  {
    id: 'PRJ-2024-105',
    title: 'Meghna 2nd Bridge Construction',
    ministry: 'Roads & Highways',
    location: 'Munshiganj',
    approvalScore: 58,
    requiredScore: 60,
    status: 'active',
    riskLevel: 'Medium',
    aiSummary: 'Project aims to reduce congestion by 30%. However, significant displacement of 200 families is predicted. Economic benefits outweight costs in long term (10yr+).',
    feedbackThemes: [
      { label: 'Economic Growth', sentiment: 'positive' },
      { label: 'Displacement', sentiment: 'negative' },
      { label: 'Toll Cost', sentiment: 'neutral' }
    ],
    moralImpact: 'Utilitarian Benefit vs Minority Cost',
    totalVotes: 12543,
    submittedDate: '2023-11-15'
  },
  {
    id: 'PRJ-2024-108',
    title: 'Sheikh Russel IT Park',
    ministry: 'ICT Division',
    location: 'Gazipur',
    approvalScore: 82,
    requiredScore: 60,
    status: 'approved',
    riskLevel: 'Low',
    aiSummary: 'High youth employment potential. Minimal environmental impact. Strong local support verified.',
    feedbackThemes: [
      { label: 'Employment', sentiment: 'positive' },
      { label: 'Innovation', sentiment: 'positive' }
    ],
    moralImpact: 'Empowerment & Education',
    totalVotes: 8900,
    submittedDate: '2023-10-20'
  },
  {
    id: 'PRJ-2024-112',
    title: 'River Embankment & Dam',
    ministry: 'Water Resources',
    location: 'Sirajganj',
    approvalScore: 45,
    requiredScore: 55,
    status: 'frozen',
    riskLevel: 'High',
    aiSummary: 'Critical for flood prevention but budget transparency flagged by AI. Local contractors have high corruption risk index.',
    feedbackThemes: [
      { label: 'Safety', sentiment: 'positive' },
      { label: 'Corruption', sentiment: 'negative' },
      { label: 'Budget Inflation', sentiment: 'negative' }
    ],
    moralImpact: 'Public Safety vs Integrity Risk',
    totalVotes: 15600,
    submittedDate: '2023-11-01'
  }
];

export const ProjectApprovals: React.FC = () => {
  const { t } = useApp();
  const [selectedId, setSelectedId] = useState<string>(MOCK_PROPOSALS[0].id);
  const [reason, setReason] = useState('');
  const [publicNotice, setPublicNotice] = useState('');

  const selectedProject = MOCK_PROPOSALS.find(p => p.id === selectedId) || MOCK_PROPOSALS[0];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-500 text-white';
      case 'Medium': return 'bg-amber-500 text-white';
      default: return 'bg-emerald-500 text-white';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-emerald-200 dark:border-emerald-800">Voting Open</span>;
      case 'frozen': return <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-blue-200 dark:border-blue-800">Frozen</span>;
      case 'approved': return <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-indigo-200 dark:border-indigo-800">Approved</span>;
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
            {MOCK_PROPOSALS.length} Active
          </span>
        </div>

        {/* Search */}
        <div className="relative">
           <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search Project ID or Name..." 
             className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 transition-colors"
           />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {MOCK_PROPOSALS.map((project) => (
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
                      className={`h-full rounded-full ${project.approvalScore >= project.requiredScore ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                      style={{ width: `${project.approvalScore}%` }}
                    ></div>
                 </div>
                 <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{project.approvalScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2) Detail Panel & Controls (Right Column) */}
      <div className="lg:w-2/3 h-full flex flex-col">
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
                      <span className="flex items-center gap-1"><Users size={14} /> {selectedProject.totalVotes.toLocaleString()} Votes</span>
                   </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Approval Score</p>
                      <div className="flex items-baseline justify-end gap-1">
                         <span className={`text-3xl font-bold ${selectedProject.approvalScore >= selectedProject.requiredScore ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                           {selectedProject.approvalScore}%
                         </span>
                         <span className="text-xs text-slate-400">/ {selectedProject.requiredScore}% req</span>
                      </div>
                   </div>
                   <div className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getRiskColor(selectedProject.riskLevel)}`}>
                      {selectedProject.riskLevel} Risk
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                {/* AI Summary */}
                <div className="space-y-4">
                   <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                      <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2 flex items-center gap-2">
                        <BrainCircuit size={14} /> AI Executive Summary
                      </h3>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {selectedProject.aiSummary}
                      </p>
                   </div>

                   <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <TrendingUp size={14} /> Citizen Feedback Themes
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.feedbackThemes.map((theme, idx) => (
                           <span 
                             key={idx} 
                             className={`px-3 py-1 rounded-full text-xs font-medium border ${
                               theme.sentiment === 'positive' 
                               ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                               : theme.sentiment === 'negative'
                                 ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                                 : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                             }`}
                           >
                             {theme.label}
                           </span>
                        ))}
                      </div>
                   </div>
                </div>

                {/* Moral Impact & Details */}
                <div className="space-y-4">
                   <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30">
                      <h3 className="text-xs font-bold text-amber-700 dark:text-amber-500 uppercase mb-2 flex items-center gap-2">
                        <Leaf size={14} /> Moral Impact Label
                      </h3>
                      <p className="text-lg font-serif italic text-amber-900 dark:text-amber-200 leading-tight">
                        "{selectedProject.moralImpact}"
                      </p>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                         <p className="text-[10px] text-slate-500 uppercase font-bold">Data Integrity</p>
                         <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                           <CheckCircle2 size={12} /> Verified
                         </p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                         <p className="text-[10px] text-slate-500 uppercase font-bold">Submission</p>
                         <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedProject.submittedDate}</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* 3) Control Panel (Fixed Bottom) */}
          <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
             {/* Override Banner */}
             <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px bg-red-300 dark:bg-red-900 w-16"></div>
                <span className="text-[10px] font-bold text-red-600 dark:text-red-500 uppercase tracking-widest flex items-center gap-1">
                  <Lock size={10} /> Emergency / Legal Override Only
                </span>
                <div className="h-px bg-red-300 dark:bg-red-900 w-16"></div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Inputs */}
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase">Public Notice (Transparency Log)</label>
                   <textarea 
                     value={publicNotice}
                     onChange={(e) => setPublicNotice(e.target.value)}
                     className="w-full h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-slate-400 resize-none"
                     placeholder="State reason for administrative action..."
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
                   </select>
                   <button className="w-full py-2 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                      <RefreshCw size={12} /> Request Revision
                   </button>
                </div>

                {/* Main Actions */}
                <div className="flex flex-col gap-2">
                   <div className="flex gap-2">
                     <button className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1">
                       <CheckCircle2 size={12} /> Approve
                     </button>
                     <button className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1">
                       <XCircle size={12} /> Reject
                     </button>
                   </div>
                   <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1">
                        <Snowflake size={12} /> Freeze
                      </button>
                      <button className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1">
                        <Gavel size={12} /> Override
                      </button>
                   </div>
                </div>
             </div>
          </div>

        </GlassCard>
      </div>
    </div>
  );
};