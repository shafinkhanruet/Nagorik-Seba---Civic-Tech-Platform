import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileSearch, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Activity,
  Link,
  Edit3
} from 'lucide-react';

export interface EvidenceMetrics {
  credibilityScore: number; // 0-100
  forensicResult: 'authentic' | 'edited' | 'unclear';
  tamperingRisk: 'low' | 'medium' | 'high';
  freshness: 'recent' | 'old';
  chainStatus: 'verified' | 'pending';
}

interface EvidenceAnalysisProps {
  metrics: EvidenceMetrics;
  isAdmin?: boolean;
  onVerify?: () => void;
  onFlag?: () => void;
}

export const EvidenceAnalysis: React.FC<EvidenceAnalysisProps> = ({ 
  metrics, 
  isAdmin = false,
  onVerify,
  onFlag
}) => {
  const { t, language } = useApp();

  const getForensicColor = (result: string) => {
    switch(result) {
      case 'authentic': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
      case 'edited': return 'text-red-500 bg-red-500/10 border-red-500/30';
      default: return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    }
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      
      {/* Header */}
      <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <FileSearch size={16} className="text-indigo-500" />
          {t('evidence_analysis')}
        </h4>
        <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400 font-mono">
          AI-V3.2
        </span>
      </div>

      <div className="p-4 space-y-5">
        
        {/* 1. Credibility Score */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t('credibility_score')}</span>
          <div className="flex items-center gap-3">
            <div className="flex-1 w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  metrics.credibilityScore > 80 ? 'bg-emerald-500' : 
                  metrics.credibilityScore > 50 ? 'bg-amber-500' : 'bg-red-500'
                }`} 
                style={{ width: `${metrics.credibilityScore}%` }}
              ></div>
            </div>
            <span className="text-lg font-black text-slate-800 dark:text-slate-100">{metrics.credibilityScore}%</span>
          </div>
        </div>

        {/* 2. Grid Stats */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Forensic Result */}
          <div className={`p-3 rounded-lg border flex flex-col items-center text-center gap-1 ${getForensicColor(metrics.forensicResult)}`}>
            <Activity size={18} />
            <span className="text-[10px] font-bold uppercase opacity-70">{t('forensic_result')}</span>
            <span className="text-xs font-bold">{t(`result_${metrics.forensicResult}`)}</span>
          </div>

          {/* Tampering Risk */}
          <div className="p-3 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-center gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">{t('tampering_risk')}</span>
              <AlertTriangle size={14} className={metrics.tamperingRisk === 'high' ? 'text-red-500' : 'text-slate-400'} />
            </div>
            <div className="flex items-center gap-1 h-2">
              <div className={`flex-1 h-1.5 rounded-full ${getRiskColor(metrics.tamperingRisk)}`}></div>
              <span className="text-[10px] font-bold uppercase">{t(`ev_risk_${metrics.tamperingRisk}`)}</span>
            </div>
          </div>

          {/* Freshness */}
          <div className="p-3 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full">
              <Clock size={16} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">{t('upload_freshness')}</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 capitalize">{metrics.freshness}</span>
            </div>
          </div>

          {/* Chain Status */}
          <div className="p-3 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className={`p-2 rounded-full ${metrics.chainStatus === 'verified' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
              <Link size={16} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">{t('chain_custody')}</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 capitalize">{t(`ev_status_${metrics.chainStatus}`)}</span>
            </div>
          </div>
        </div>

        {/* 3. Admin Controls */}
        {isAdmin && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex gap-2">
              <button 
                onClick={onVerify}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <CheckCircle2 size={14} /> {t('mark_verified')}
              </button>
              <button 
                onClick={onFlag}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <XCircle size={14} /> {t('mark_suspicious')}
              </button>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder={t('override_note')} 
                className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Edit3 size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};