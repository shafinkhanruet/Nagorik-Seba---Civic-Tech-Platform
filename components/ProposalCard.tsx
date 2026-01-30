
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from './GlassCard';
import { MoralImpactPanel, MoralMetrics } from './MoralImpactPanel';
import { 
  Building2, 
  MapPin, 
  BrainCircuit, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Lock, 
  Calculator,
  Leaf,
  Users,
  Home,
  ArrowRight
} from 'lucide-react';

export interface ProjectProposalData {
  id: string;
  title: string;
  ministry: string;
  location: string;
  status: 'open' | 'closed' | 'approved' | 'rejected';
  aiSummary: string;
  budget: {
    govt: string;
    aiEstimate: string;
    risk: 'Low' | 'Medium' | 'High';
  };
  impacts: ('environment' | 'displacement' | 'social' | 'economic')[];
  approvalStats: {
    current: number; // percentage
    required: number; // percentage
    totalVotes: number;
  };
  hasVoted?: boolean;
  moralMetrics?: MoralMetrics;
}

interface ProposalCardProps {
  proposal: ProjectProposalData;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({ proposal }) => {
  const { t, language } = useApp();
  const [selectedVote, setSelectedVote] = useState<'support' | 'modify' | 'reject' | null>(null);
  const [reason, setReason] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(proposal.hasVoted || false);

  const statusColors = {
    open: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    closed: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    approved: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    rejected: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'High': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30';
      case 'Medium': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30';
      default: return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30';
    }
  };

  const getImpactIcon = (type: string) => {
    switch(type) {
      case 'environment': return <Leaf size={14} className="text-emerald-500" />;
      case 'displacement': return <Home size={14} className="text-orange-500" />;
      case 'social': return <Users size={14} className="text-blue-500" />;
      default: return <Building2 size={14} className="text-indigo-500" />;
    }
  };

  const handleSubmit = () => {
    if (selectedVote) {
      setHasSubmitted(true);
    }
  };

  return (
    <GlassCard className="transition-all duration-300 hover:shadow-2xl border-t-0 relative group">
      
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-500"></div>

      {/* 1) Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase tracking-wider">
              {proposal.ministry}
            </span>
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${statusColors[proposal.status]}`}>
              {t(`status_${proposal.status}`)}
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {proposal.title}
          </h2>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <MapPin size={14} className="text-slate-400" />
            {proposal.location}
          </div>
        </div>
      </div>

      {/* 2) AI Citizen Summary Card */}
      <div className="mb-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-5">
          <BrainCircuit size={60} />
        </div>
        <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wide relative z-10">
          <BrainCircuit size={16} />
          {t('aiSimpleExplain')}
        </div>
        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed relative z-10">
          {proposal.aiSummary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* 3) Map Placeholder */}
        <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative group/map border border-slate-200 dark:border-slate-700">
          {/* Mock Map Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:12px_12px]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center animate-ping absolute"></div>
             <MapPin size={24} className="text-emerald-500 relative z-10" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-2 flex justify-between items-center border-t border-slate-200 dark:border-slate-700 transform translate-y-full group-hover/map:translate-y-0 transition-transform duration-300">
             <span className="text-[10px] font-mono text-slate-500">23.8103° N, 90.4125° E</span>
             <button className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Expand Map</button>
          </div>
        </div>

        {/* 4) Budget & Impacts */}
        <div className="flex flex-col justify-between gap-3">
          <div className="bg-white dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-700 shadow-sm flex-1">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-1">
              <Calculator size={12} /> বাজেট বিশ্লেষণ
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">{t('govtBudget')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">{proposal.budget.govt}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">{t('aiEstimate')}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded">{proposal.budget.aiEstimate}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs mt-auto">
                <span className="text-slate-400 font-bold uppercase text-[9px]">{t('budgetRisk')}</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase border ${getRiskColor(proposal.budget.risk)}`}>
                  {t(`risk_${proposal.budget.risk.toLowerCase()}`)}
                </span>
              </div>
            </div>
          </div>

          {/* 5) Impact Tags */}
          <div className="flex flex-wrap gap-2">
            {proposal.impacts.map((impact) => (
              <span key={impact} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-700 uppercase tracking-wide">
                {getImpactIcon(impact)}
                {t(`impact_${impact}`)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* NEW: Moral Impact Panel */}
      {proposal.moralMetrics && (
        <div className="mb-6">
          <MoralImpactPanel metrics={proposal.moralMetrics} />
        </div>
      )}

      {/* 7) Weighted Approval Meter */}
      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/50">
        <div className="flex justify-between items-end mb-2">
           <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
             {t('weightedApproval')}
           </span>
           <div className="text-right">
             <span className={`text-2xl font-black ${proposal.approvalStats.current >= proposal.approvalStats.required ? 'text-emerald-500' : 'text-amber-500'}`}>
               {proposal.approvalStats.current}%
             </span>
             <span className="text-[10px] text-slate-400 ml-1 font-medium">/ {proposal.approvalStats.required}% req</span>
           </div>
        </div>
        <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
           {/* Threshold Marker */}
           <div 
             className="absolute top-0 bottom-0 w-0.5 bg-slate-800 dark:bg-slate-400 z-10 opacity-50 dashed"
             style={{ left: `${proposal.approvalStats.required}%` }}
           ></div>
           
           <div 
             className={`h-full rounded-full transition-all duration-1000 shadow-sm ${
                proposal.approvalStats.current >= proposal.approvalStats.required 
                ? 'bg-emerald-500' 
                : 'bg-amber-500'
             }`}
             style={{ width: `${proposal.approvalStats.current}%` }}
           ></div>
        </div>
        <p className="text-[9px] text-right text-slate-400 mt-1 font-mono uppercase tracking-wider">{proposal.approvalStats.totalVotes.toLocaleString()} votes cast</p>
      </div>

      {/* 6) Citizen Opinion Panel */}
      {!hasSubmitted ? (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-sm flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            {t('submitOpinion')}
          </h3>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <button 
              onClick={() => setSelectedVote('support')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:shadow-md ${
                selectedVote === 'support' 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/30 transform scale-105' 
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-500/50 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 size={20} />
              <span className="text-[10px] font-bold uppercase">{t('needed')}</span>
            </button>
            <button 
              onClick={() => setSelectedVote('modify')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:shadow-md ${
                selectedVote === 'modify' 
                ? 'bg-amber-500 text-white border-amber-600 shadow-lg shadow-amber-500/30 transform scale-105' 
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-amber-500/50 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <AlertTriangle size={20} />
              <span className="text-[10px] font-bold uppercase">{t('neededButChange')}</span>
            </button>
            <button 
              onClick={() => setSelectedVote('reject')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:shadow-md ${
                selectedVote === 'reject' 
                ? 'bg-red-500 text-white border-red-600 shadow-lg shadow-red-500/30 transform scale-105' 
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-red-500/50 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <XCircle size={20} />
              <span className="text-[10px] font-bold uppercase">{t('notNeeded')}</span>
            </button>
          </div>

          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${selectedVote ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('yourReason')}
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none mb-3 min-h-[80px] resize-none transition-shadow"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                <Lock size={10} />
                {t('voteLockNotice')}
              </div>
              <button 
                onClick={handleSubmit}
                className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                {t('submitOpinion')} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-6 border border-emerald-100 dark:border-emerald-800/30 text-center animate-fade-in">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-3 shadow-sm ring-4 ring-emerald-50 dark:ring-emerald-900/20">
            <CheckCircle2 size={28} />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
            {language === 'bn' ? 'আপনার মতামত গ্রহণ করা হয়েছে' : 'Your opinion has been recorded'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {language === 'bn' ? 'এই প্রকল্পে অংশগ্রহণের জন্য ধন্যবাদ।' : 'Thank you for participating in this project.'}
          </p>
        </div>
      )}
    </GlassCard>
  );
};
