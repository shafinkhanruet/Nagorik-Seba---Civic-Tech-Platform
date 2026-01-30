import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from './GlassCard';
import { 
  Building2, 
  MapPin, 
  BrainCircuit, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Lock, 
  ArrowRight,
  Calculator,
  Leaf,
  Users,
  Home
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
    open: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400',
    closed: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
    approved: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
    rejected: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400',
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'High': return 'text-red-600 dark:text-red-400';
      case 'Medium': return 'text-amber-600 dark:text-amber-400';
      default: return 'text-emerald-600 dark:text-emerald-400';
    }
  };

  const getImpactIcon = (type: string) => {
    switch(type) {
      case 'environment': return <Leaf size={14} />;
      case 'displacement': return <Home size={14} />;
      case 'social': return <Users size={14} />;
      default: return <Building2 size={14} />;
    }
  };

  const handleSubmit = () => {
    if (selectedVote) {
      setHasSubmitted(true);
      // API call would go here
    }
  };

  return (
    <GlassCard className="transition-all duration-300 hover:shadow-xl border-l-4 border-l-emerald-500/50">
      {/* 1) Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {proposal.ministry}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 leading-tight">
            {proposal.title}
          </h2>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <MapPin size={16} />
            {proposal.location}
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${statusColors[proposal.status]} self-start`}>
          {t(`status_${proposal.status}`)}
        </div>
      </div>

      {/* 2) AI Citizen Summary Card */}
      <div className="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-4 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-300 font-bold text-sm">
          <BrainCircuit size={18} />
          {t('aiSimpleExplain')}
        </div>
        <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
          {proposal.aiSummary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 3) Map Placeholder */}
        <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative group">
          <div className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-slate-600">
            <MapPin size={48} className="opacity-50" />
          </div>
          {/* Mock Map Texture */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-slate-900/90 px-2 py-1 rounded text-[10px] font-mono shadow-sm">
            Lat: 23.8103 N, Long: 90.4125 E
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-[1px]">
             <button className="bg-white dark:bg-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
                View Full Map
             </button>
          </div>
        </div>

        {/* 4) Budget & Impacts */}
        <div className="flex flex-col justify-between">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 mb-4">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3 flex items-center gap-1">
              <Calculator size={14} /> বাজেট বিশ্লেষণ
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-300">{t('govtBudget')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{proposal.budget.govt}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-300">{t('aiEstimate')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{proposal.budget.aiEstimate}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                <span className="text-slate-500">{t('budgetRisk')}</span>
                <span className={`font-bold px-2 py-0.5 rounded ${getRiskColor(proposal.budget.risk)} bg-opacity-10 bg-current`}>
                  {t(`risk_${proposal.budget.risk.toLowerCase()}`)}
                </span>
              </div>
            </div>
          </div>

          {/* 5) Impact Tags */}
          <div className="flex flex-wrap gap-2">
            {proposal.impacts.map((impact) => (
              <span key={impact} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
                {getImpactIcon(impact)}
                {t(`impact_${impact}`)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 7) Weighted Approval Meter */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
           <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
             {t('weightedApproval')}: <span className="text-emerald-600 dark:text-emerald-400">{proposal.approvalStats.current}%</span>
           </span>
           <span className="text-xs text-slate-500 dark:text-slate-400">
             {t('requiredThreshold')}: {proposal.approvalStats.required}%
           </span>
        </div>
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
           {/* Threshold Marker */}
           <div 
             className="absolute top-0 bottom-0 w-0.5 bg-slate-800 dark:bg-slate-400 z-10 opacity-50"
             style={{ left: `${proposal.approvalStats.required}%` }}
           ></div>
           
           <div 
             className={`h-full rounded-full transition-all duration-1000 ${
                proposal.approvalStats.current >= proposal.approvalStats.required 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                : 'bg-gradient-to-r from-amber-500 to-amber-400'
             }`}
             style={{ width: `${proposal.approvalStats.current}%` }}
           ></div>
        </div>
        <p className="text-[10px] text-right text-slate-400 mt-1">{proposal.approvalStats.totalVotes.toLocaleString()} votes cast</p>
      </div>

      {/* 6) Citizen Opinion Panel */}
      {!hasSubmitted ? (
        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">{t('submitOpinion')}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <button 
              onClick={() => setSelectedVote('support')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                selectedVote === 'support' 
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/30' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-500/50'
              }`}
            >
              <CheckCircle2 size={24} />
              <span className="text-xs font-bold">{t('needed')}</span>
            </button>
            <button 
              onClick={() => setSelectedVote('modify')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                selectedVote === 'modify' 
                ? 'bg-amber-500 text-white border-amber-600 shadow-lg shadow-amber-500/30' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-500/50'
              }`}
            >
              <AlertTriangle size={24} />
              <span className="text-xs font-bold">{t('neededButChange')}</span>
            </button>
            <button 
              onClick={() => setSelectedVote('reject')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                selectedVote === 'reject' 
                ? 'bg-red-500 text-white border-red-600 shadow-lg shadow-red-500/30' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-red-500/50'
              }`}
            >
              <XCircle size={24} />
              <span className="text-xs font-bold">{t('notNeeded')}</span>
            </button>
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${selectedVote ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('yourReason')}
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none mb-3 min-h-[80px]"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">
                <Lock size={10} />
                {t('voteLockNotice')}
              </div>
              <button 
                onClick={handleSubmit}
                className="px-6 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                {t('submitOpinion')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-6 border border-emerald-100 dark:border-emerald-800/30 text-center animate-fade-in">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-3">
            <CheckCircle2 size={24} />
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