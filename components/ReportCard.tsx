import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from './GlassCard';
import { 
  LineChart, Line, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { 
  MapPin, 
  Clock, 
  EyeOff, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Image as ImageIcon,
  FileText,
  PlayCircle,
  ThumbsUp,
  AlertOctagon,
  MoreHorizontal,
  Activity,
  ShieldAlert,
  BrainCircuit,
  Map as MapIcon
} from 'lucide-react';

export interface InfluenceData {
  riskLevel: 'Low' | 'Medium' | 'High';
  timelineData: { time: string; value: number; isSpike?: boolean }[];
  explanation?: string;
}

export interface ReportData {
  id: string;
  category: string;
  categoryIcon?: React.ReactNode;
  location: { district: string; upazila: string };
  timePosted: string;
  isAnonymous: boolean;
  description: string;
  truthScore: number; // 0-100
  aiBreakdown: {
    credibility: number;
    evidenceQuality: number;
    mediaCheck: number;
    historyMatch: number;
  };
  evidence: { type: 'image' | 'video' | 'doc'; url: string }[];
  weightedSupport: number;
  status: 'review' | 'verified' | 'disputed';
  influenceAnalysis?: InfluenceData;
}

interface ReportCardProps {
  report: ReportData;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const { t, language } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInfluence, setShowInfluence] = useState(false);

  // Helper for Truth Score Color
  const getScoreColor = (score: number) => {
    if (score <= 40) return 'text-red-500 bg-red-500';
    if (score <= 70) return 'text-amber-500 bg-amber-500';
    return 'text-emerald-500 bg-emerald-500';
  };

  const scoreColorClass = getScoreColor(report.truthScore);
  const statusColors = {
    review: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    verified: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    disputed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 text-white p-2 rounded-lg text-xs shadow-xl border border-slate-700">
          <p className="font-bold">{label}</p>
          <p>{`${t('weightedSupport')}: ${payload[0].value}`}</p>
          {data.isSpike && (
            <p className="text-amber-400 font-bold mt-1 flex items-center gap-1">
              <AlertTriangle size={10} /> {t('abnormalSpike')}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <GlassCard className="transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
             {report.categoryIcon || <AlertTriangle size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base sm:text-lg">
                {report.category}
              </h3>
              {report.isAnonymous && (
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                  <EyeOff size={12} />
                  {t('anonymous')}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {report.location.upazila}, {report.location.district}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {report.timePosted}
              </span>
            </div>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${statusColors[report.status]}`}>
          {t(`status_${report.status}`)}
        </div>
      </div>

      {/* Main Body */}
      <div className="mb-5">
        <p className={`text-slate-700 dark:text-slate-300 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
          {report.description}
        </p>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          {isExpanded ? (
            <>{t('showLess')} <ChevronUp size={12} /></>
          ) : (
            <>{t('readMore')} <ChevronDown size={12} /></>
          )}
        </button>
      </div>

      {/* Truth Probability Section */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-5 border border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{t('truthProbability')}</span>
            <div className="group relative">
              <Info size={14} className="text-slate-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center shadow-lg">
                {t('truthTooltip')}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
              </div>
            </div>
          </div>
          <span className={`text-lg font-bold ${scoreColorClass.split(' ')[0]}`}>
            {report.truthScore}%
          </span>
        </div>

        {/* Main Progress Bar */}
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full mb-4 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${scoreColorClass.split(' ')[1]}`}
            style={{ width: `${report.truthScore}%` }}
          />
        </div>

        {/* AI Breakdown Panel */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 transition-all duration-300 ${isExpanded ? 'opacity-100 max-h-40' : 'opacity-80 max-h-20 sm:max-h-40'}`}>
          {Object.entries(report.aiBreakdown).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                <span>{t(key)}</span>
                <span className="font-medium">{value}%</span>
              </div>
              <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-slate-400 dark:bg-slate-500 rounded-full"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Influence Monitoring Panel (New Section) */}
      {report.influenceAnalysis && (
        <div className="mb-5 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/60">
          <button 
            onClick={() => setShowInfluence(!showInfluence)}
            className={`w-full flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/80 transition-colors ${showInfluence ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
              <Activity size={16} className="text-blue-500" />
              {t('influencePanel')}
            </div>
            {showInfluence ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>
          
          <div className={`bg-slate-50 dark:bg-slate-900/40 transition-all duration-500 ease-in-out overflow-hidden ${showInfluence ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-4 space-y-4">
              
              {/* Risk Badge */}
              <div className={`flex items-start gap-3 p-3 rounded-lg border ${getRiskColor(report.influenceAnalysis.riskLevel)}`}>
                <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">{t(`risk_${report.influenceAnalysis.riskLevel.toLowerCase()}`)}</span>
                  </div>
                  <p className="text-xs font-medium opacity-90">{t('coordinatedEffort')}</p>
                </div>
              </div>

              {/* Charts & Map Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Timeline */}
                <div className="bg-white dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
                  <h5 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">{t('voteSpike')}</h5>
                  <div className="h-24 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={report.influenceAnalysis.timelineData}>
                        <defs>
                          <linearGradient id="colorSpike" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <RechartsTooltip content={<CustomTooltip />} cursor={{stroke: '#94a3b8', strokeWidth: 1}} />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke={report.influenceAnalysis.riskLevel === 'High' ? '#ef4444' : '#10b981'} 
                          fill={report.influenceAnalysis.riskLevel === 'High' ? 'url(#colorSpike)' : 'url(#colorNormal)'} 
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Geo Cluster Placeholder */}
                <div className="bg-white dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm relative overflow-hidden group">
                   <h5 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-1">
                     <MapIcon size={12} /> {t('geoCluster')}
                   </h5>
                   <div className="h-24 w-full flex items-center justify-center relative bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                      {/* Simple SVG Map Placeholder */}
                      <svg viewBox="0 0 100 100" className="w-full h-full text-slate-300 dark:text-slate-700 fill-current p-2">
                        <path d="M40,20 Q60,10 80,30 T60,80 Q40,90 20,70 T40,20 Z" />
                      </svg>
                      {/* Heat dots */}
                      <div className="absolute top-1/3 left-1/3 w-2 h-2 rounded-full bg-red-500/60 animate-ping"></div>
                      <div className="absolute top-1/3 left-1/3 w-2 h-2 rounded-full bg-red-500"></div>
                      
                      <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-amber-500/60 animate-ping delay-300"></div>
                      <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                   </div>
                </div>
              </div>

              {/* AI Explanation Box */}
              <div className="flex gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                <BrainCircuit size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div>
                   <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed font-medium">
                     {t('aiExplanation')}
                   </p>
                </div>
              </div>
              
              <div className="text-[10px] text-center text-slate-400 italic">
                {t('transparencyNote')}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Evidence Preview - Only visible when expanded or if explicitly designed to show always. Let's show always but small. */}
      {report.evidence.length > 0 && (
        <div className="mb-5">
           <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('evidence')}</h4>
           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
             {report.evidence.map((item, idx) => (
               <div key={idx} className="flex-shrink-0 w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors relative group overflow-hidden">
                  {item.type === 'image' && <ImageIcon size={20} className="text-slate-400" />}
                  {item.type === 'video' && <PlayCircle size={20} className="text-slate-400" />}
                  {item.type === 'doc' && <FileText size={20} className="text-slate-400" />}
                  {/* Mock Image Content */}
                  {item.type === 'image' && (
                    <img src={item.url} alt="evidence" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  )}
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Footer / Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-medium uppercase">{t('weightedSupport')}</span>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{report.weightedSupport}</span>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors text-xs font-bold">
            <ThumbsUp size={14} />
            {t('support')}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors text-xs font-bold">
            <AlertOctagon size={14} />
            {t('doubt')}
          </button>
        </div>
      </div>
    </GlassCard>
  );
};