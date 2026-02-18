
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useReports } from '../hooks/api/useReports';
import { GlassCard } from './GlassCard';
import { InfoTooltip } from './InfoTooltip';
import { Report } from '../types';
import { 
  MapPin, 
  Clock, 
  EyeOff, 
  ChevronDown, 
  ChevronUp, 
  ThumbsUp,
  AlertOctagon,
  ShieldAlert,
  BrainCircuit,
  Signal,
  Loader2
} from 'lucide-react';

interface ReportCardProps {
  report: Report;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const { t, language } = useApp();
  const { castVote } = useReports();
  const [isExpanded, setIsExpanded] = useState(false);
  const [voting, setVoting] = useState(false);

  const handleVote = async (type: 'support' | 'doubt') => {
    setVoting(true);
    await castVote(report.id, type);
    setVoting(false);
  };

  const getScoreColor = (score: number) => {
    if (score <= 40) return 'text-red-500 bg-red-500';
    if (score <= 70) return 'text-amber-500 bg-amber-500';
    return 'text-emerald-500 bg-emerald-500';
  };

  const scoreColorClass = getScoreColor(report.truthScore);

  return (
    <GlassCard className="transition-all duration-300 hover:shadow-xl relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
             <ShieldAlert size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">{report.category}</h3>
              {report.isAnonymous && <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">{t('anonymous')}</span>}
            </div>
            <div className="flex items-center gap-x-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1"><MapPin size={12} /> {report.location.address}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {report.timestamp}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <p className={`text-slate-700 dark:text-slate-300 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
          {report.description}
        </p>
        <button onClick={() => setIsExpanded(!isExpanded)} className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
          {isExpanded ? t('showLess') : t('readMore')}
        </button>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-5 border border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Signal size={16} className={scoreColorClass.split(' ')[0]} />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{t('truthProbability')}</span>
          </div>
          <span className={`text-lg font-bold ${scoreColorClass.split(' ')[0]}`}>{report.truthScore}%</span>
        </div>
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ease-out ${scoreColorClass.split(' ')[1]}`} style={{ width: `${report.truthScore}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-medium uppercase">{t('weightedSupport')}</span>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {report.weightedSupport?.toLocaleString()}
          </span>
        </div>

        <div className="flex gap-2">
          <button 
            disabled={voting}
            onClick={() => handleVote('support')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
          >
            {voting ? <Loader2 className="animate-spin" size={14} /> : <ThumbsUp size={14} />}
            {t('support')}
          </button>
          <button 
            disabled={voting}
            onClick={() => handleVote('doubt')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200"
          >
            <AlertOctagon size={14} />
            {t('doubt')}
          </button>
        </div>
      </div>
    </GlassCard>
  );
};
