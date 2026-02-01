
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from './GlassCard';
import { InfoTooltip } from './InfoTooltip';
import { SensitiveContentWrapper } from './SensitiveContentWrapper';
import { EvidenceAnalysis, EvidenceMetrics } from './EvidenceAnalysis';
import { AuthorityResponsePanel } from './AuthorityResponsePanel';
import { FollowButton } from './FollowButton';
import { usePermission } from '../hooks/usePermission';
import { useToast } from '../context/ToastContext';
import { Report } from '../types';
import { 
  AreaChart, Area, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { 
  MapPin, 
  Clock, 
  EyeOff, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  CheckCircle2, 
  ImageIcon,
  PlayCircle,
  ThumbsUp,
  ThumbsDown,
  AlertOctagon,
  Activity,
  ShieldAlert,
  BrainCircuit,
  Map as MapIcon,
  MessageSquare,
  FileUp,
  History,
  MoreHorizontal,
  Filter,
  Flag,
  X,
  Gavel
} from 'lucide-react';

interface ReportCardProps {
  report: Report;
}

// Mock User Stats for Weight Calculation
const USER_STATS = {
  trustScore: 78,
  areaFactor: 1.2,
  accountAgeFactor: 1.05
};

type Profession = 'engineer' | 'doctor' | 'lawyer' | 'accountant' | null;

interface Comment {
  id: number;
  author: string;
  trustScore: number;
  isLocal: boolean;
  content: string;
  time: string;
  agrees: number;
  disagrees: number;
  profession?: Profession;
  weightImpact: number;
}

const MOCK_COMMENTS: Comment[] = [
  { 
    id: 1, 
    author: 'Engr. Rahman', 
    trustScore: 92, 
    isLocal: true, 
    content: 'আমি এই রাস্তা দিয়ে প্রতিদিন যাই। বিটুমিনের লেয়ার ঠিকমতো দেওয়া হয়নি, তাই এই অবস্থা।', 
    time: '1 hr ago', 
    agrees: 12, 
    disagrees: 1, 
    profession: 'engineer',
    weightImpact: 1.5
  },
  { 
    id: 2, 
    author: 'User_902', 
    trustScore: 65, 
    isLocal: false, 
    content: 'ছবিটা কি আজকের? গত মাসেও এমন দেখেছিলাম।', 
    time: '2 hrs ago', 
    agrees: 3, 
    disagrees: 5,
    weightImpact: 0.8
  },
  {
    id: 3,
    author: 'Adv. Hasan',
    trustScore: 88,
    isLocal: true,
    content: 'টেন্ডার প্রক্রিয়ায় কোনো গাফিলতি ছিল কিনা তা খতিয়ে দেখা দরকার।',
    time: '3 hrs ago',
    agrees: 8,
    disagrees: 0,
    profession: 'lawyer',
    weightImpact: 1.35
  }
];

const MOCK_TIMELINE = [
  { id: 1, title: 'event_created', time: '2 days ago', icon: AlertTriangle, color: 'text-blue-500' },
  { id: 2, title: 'event_ai_check', time: '2 days ago', icon: BrainCircuit, color: 'text-purple-500' },
  { id: 3, title: 'event_evidence', time: '1 day ago', icon: FileUp, color: 'text-amber-500' },
  { id: 4, title: 'event_review', time: '5 hours ago', icon: ShieldAlert, color: 'text-emerald-500' },
];

const getMockAnalysis = (id: number): EvidenceMetrics => ({
  credibilityScore: 85 + (id % 10),
  forensicResult: 'authentic',
  tamperingRisk: 'low',
  freshness: 'recent',
  chainStatus: 'verified'
});

interface ReportModalProps {
  onClose: () => void;
  onSubmit: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ onClose, onSubmit }) => {
  const { t } = useApp();
  const [reason, setReason] = useState('reason_misinfo');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-scale-in">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Flag size={18} className="text-red-500" /> {t('report_abuse')}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
             <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">{t('flag_reason')}</label>
             <select 
               value={reason} 
               onChange={(e) => setReason(e.target.value)}
               className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
             >
               <option value="reason_misinfo">{t('reason_misinfo')}</option>
               <option value="reason_defamation">{t('reason_defamation')}</option>
               <option value="reason_hate">{t('reason_hate')}</option>
               <option value="reason_fake">{t('reason_fake')}</option>
               <option value="reason_other">{t('reason_other')}</option>
             </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Description (Optional)</label>
            <textarea 
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 min-h-[80px]"
              placeholder="..."
            />
          </div>
          <button 
            onClick={onSubmit}
            className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-lg shadow-red-500/30 transition-all active:scale-[0.98]"
          >
            {t('submit_report')}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const { t } = useApp();
  const { addToast } = useToast();
  const { can } = usePermission();
  
  const [localReport, setLocalReport] = useState(report);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInfluence, setShowInfluence] = useState(false);
  const [activeTab, setActiveTab] = useState<'discussion' | 'evidence' | 'timeline'>('discussion');
  const [showReportModal, setShowReportModal] = useState(false);
  
  const [selectedEvidence, setSelectedEvidence] = useState<any | null>(null);

  // Fallback defaults for missing data
  const weightedSupport = report.weightedSupport || 0;
  const locationString = report.location.address || `${report.location.upazila || ''}, ${report.location.district || ''}`;
  const status = (report.status === 'pending_ai_review' ? 'review' : report.status) as 'verified' | 'review' | 'disputed';

  const [voteState, setVoteState] = useState<'none' | 'supported' | 'doubted'>('none');
  const [currentWeightedScore, setCurrentWeightedScore] = useState(weightedSupport);
  const [rawSupportCount, setRawSupportCount] = useState(Math.floor(weightedSupport * 0.85));
  const [animateScore, setAnimateScore] = useState(false);

  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [sortMode, setSortMode] = useState<'trusted' | 'recent'>('trusted');
  const [showLocalOnly, setShowLocalOnly] = useState(false);
  const [showExpertOnly, setShowExpertOnly] = useState(false);

  const canManageReport = can('action:moderate');
  const userWeight = (USER_STATS.trustScore / 100) * USER_STATS.areaFactor * USER_STATS.accountAgeFactor;

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

  const handleVote = (type: 'supported' | 'doubted') => {
    if (voteState !== 'none') return;
    setVoteState(type);
    if (type === 'supported') {
      setAnimateScore(true);
      setCurrentWeightedScore(prev => prev + userWeight);
      setRawSupportCount(prev => prev + 1);
      setTimeout(() => setAnimateScore(false), 500);
    }
    addToast(t('iFixedIt') === 'I Fixed It' ? 'Opinion Recorded' : 'আপনার মতামত গ্রহণ করা হয়েছে', 'success');
  };

  const handleReportSubmit = () => {
    setShowReportModal(false);
    addToast(t('report_submitted'), 'success');
  }

  const handleAuthoritySubmit = (data: any) => {
    setLocalReport(prev => ({ ...prev, authorityResponse: data }));
    addToast('Authority response submitted successfully', 'success');
  };

  const handleCommentVote = (id: number, type: 'agree' | 'disagree') => {
    setComments(prev => prev.map(c => {
      if (c.id === id) {
        return type === 'agree' ? { ...c, agrees: c.agrees + 1 } : { ...c, disagrees: c.disagrees + 1 };
      }
      return c;
    }));
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

  const renderDiscussion = () => {
    let filteredComments = comments;
    if (showLocalOnly) filteredComments = filteredComments.filter(c => c.isLocal);
    if (showExpertOnly) filteredComments = filteredComments.filter(c => c.profession);

    filteredComments.sort((a, b) => sortMode === 'trusted' ? b.trustScore - a.trustScore : 0);

    return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{filteredComments.length} Comments</span>
          <button 
            onClick={() => setSortMode(prev => prev === 'trusted' ? 'recent' : 'trusted')}
            className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <Filter size={12} /> {t(`sort_${sortMode}`)}
          </button>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={showLocalOnly} onChange={(e) => setShowLocalOnly(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 transition-colors" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 transition-colors">{t('filter_local_only')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={showExpertOnly} onChange={(e) => setShowExpertOnly(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 transition-colors" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 transition-colors">{t('filter_expert_only')}</span>
          </label>
        </div>
      </div>
      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <div key={comment.id} className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors relative group">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${comment.trustScore > 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                {comment.trustScore}%
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{comment.author}</span>
                {comment.isLocal && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] rounded-full font-bold uppercase cursor-help" title={t('verification_tooltip')}>
                    <MapPin size={10} />
                    {t('local_resident')}
                  </div>
                )}
                <span className="text-[10px] text-slate-400 ml-auto">{comment.time}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                {comment.content}
              </p>
              <div className="flex items-center gap-4">
                <button onClick={() => handleCommentVote(comment.id, 'agree')} className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors">
                  <ThumbsUp size={12} /> {comment.agrees} <span className="hidden sm:inline">{t('agree')}</span>
                </button>
                <button onClick={() => handleCommentVote(comment.id, 'disagree')} className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">
                  <ThumbsDown size={12} /> {comment.disagrees} <span className="hidden sm:inline">{t('disagree')}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )};

  const renderEvidence = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-3 text-slate-400 group-hover:text-emerald-500 transition-colors">
          <FileUp size={24} />
        </div>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{t('dragDrop')}</p>
        <p className="text-xs text-slate-400 mb-4">JPG, PNG, MP4 (Max 10MB)</p>
        <div className="w-full max-w-xs space-y-2">
          <input type="text" placeholder={t('addDesc')} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
          <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors">
            {t('submitEvidence')}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {report.evidence.map((item, idx) => (
          <SensitiveContentWrapper key={idx} isSensitive={item.isSensitive} className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-slate-100 dark:bg-slate-800 cursor-pointer">
            <div className="relative group w-full h-full" onClick={() => setSelectedEvidence(item)}>
               {item.type === 'image' && <img src={item.url} alt="proof" className="w-full h-full object-cover" />}
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/40"><MoreHorizontal size={16} /></button>
               </div>
               <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur rounded text-[9px] font-bold text-white uppercase flex items-center gap-1">
                 {item.type === 'image' ? <ImageIcon size={10} /> : <PlayCircle size={10} />} {item.type}
               </div>
            </div>
          </SensitiveContentWrapper>
        ))}
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="py-2 pl-2 animate-fade-in">
      <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-8">
        {MOCK_TIMELINE.map((event, idx) => (
          <div key={event.id} className="relative pl-6">
            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 bg-white dark:bg-slate-900 flex items-center justify-center`}>
              <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <event.icon size={14} className={event.color} /> {t(event.title)}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{event.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <GlassCard className="transition-all duration-300 hover:shadow-xl relative overflow-hidden">
      {selectedEvidence && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedEvidence(null)}></div>
          <div className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl animate-scale-in flex flex-col max-h-[90vh]">
             <div className="relative bg-black flex items-center justify-center min-h-[200px]">
               <button onClick={() => setSelectedEvidence(null)} className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"><X size={20} /></button>
               {selectedEvidence.type === 'image' ? <img src={selectedEvidence.url} className="max-h-[300px] w-auto object-contain" /> : <div className="text-white">Preview Unavailable</div>}
             </div>
             <div className="p-4 overflow-y-auto"><EvidenceAnalysis metrics={getMockAnalysis(1)} isAdmin={false} /></div>
          </div>
        </div>
      )}

      {showReportModal && <ReportModal onClose={() => setShowReportModal(false)} onSubmit={handleReportSubmit} />}

      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
             {report.categoryIcon || <AlertTriangle size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base sm:text-lg">{report.category}</h3>
              {report.isAnonymous && <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium"><EyeOff size={12} />{t('anonymous')}</span>}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1"><MapPin size={12} /> {locationString}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {report.timePosted || report.timestamp}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${statusColors[status] || statusColors.review}`}>
            {t(`status_${status}`)}
          </div>
          <FollowButton id={report.id} type="report" name={report.category} />
        </div>
      </div>

      {(status === 'disputed' || report.isFlagged) && (
        <div className="mb-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600 dark:text-amber-400"><Gavel size={16} /></div>
              <div>
                 <p className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">{t('appeal_status')}</p>
                 <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{t('status_pending')}</p>
              </div>
           </div>
        </div>
      )}

      <div className="mb-5">
        <p className={`text-slate-700 dark:text-slate-300 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
          {report.description}
        </p>
        <button onClick={() => setIsExpanded(!isExpanded)} className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
          {isExpanded ? <>{t('showLess')} <ChevronUp size={12} /></> : <>{t('readMore')} <ChevronDown size={12} /></>}
        </button>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-5 border border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{t('truthProbability')}</span>
            <InfoTooltip text="এই স্কোর তৈরি হয়েছে আপনার এলাকার তথ্য, প্রমাণের মান, ব্যবহারকারীর বিশ্বাসযোগ্যতা এবং AI বিশ্লেষণের মাধ্যমে।" />
          </div>
          <span className={`text-lg font-bold ${scoreColorClass.split(' ')[0]}`}>{report.truthScore}%</span>
        </div>
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full mb-4 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ease-out ${scoreColorClass.split(' ')[1]}`} style={{ width: `${report.truthScore}%` }} />
        </div>
        
        {report.aiBreakdown && (
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 transition-all duration-300 ${isExpanded ? 'opacity-100 max-h-40' : 'opacity-80 max-h-20 sm:max-h-40'}`}>
            {Object.entries(report.aiBreakdown).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                  <span>{t(key)}</span>
                  <span className="font-medium">{value}%</span>
                </div>
                <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 dark:bg-slate-500 rounded-full" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {report.influenceAnalysis && (
        <div className="mb-5 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/60">
          <button onClick={() => setShowInfluence(!showInfluence)} className={`w-full flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/80 transition-colors ${showInfluence ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200"><Activity size={16} className="text-blue-500" />{t('influencePanel')}</div>
            {showInfluence ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>
          
          <div className={`bg-slate-50 dark:bg-slate-900/40 transition-all duration-500 ease-in-out overflow-hidden ${showInfluence ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
                  <h5 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">{t('voteSpike')}</h5>
                  <div className="h-24 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={report.influenceAnalysis.timelineData}>
                        <defs>
                          <linearGradient id="colorSpike" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                          <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                        </defs>
                        <RechartsTooltip content={<CustomTooltip />} cursor={{stroke: '#94a3b8', strokeWidth: 1}} />
                        <Area type="monotone" dataKey="value" stroke={report.influenceAnalysis.riskLevel === 'High' ? '#ef4444' : '#10b981'} fill={report.influenceAnalysis.riskLevel === 'High' ? 'url(#colorSpike)' : 'url(#colorNormal)'} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col group relative">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400 font-medium uppercase">{t('weightedSupport')}</span>
            <InfoTooltip position="top" text="ব্যবহারকারীর ট্রাস্ট স্কোর এবং ভৌগলিক অবস্থানের ভিত্তিতে এই সমর্থন গণনা করা হয়েছে।" />
          </div>
          <div className="flex items-end gap-1.5">
             <span className={`text-xl font-bold text-slate-800 dark:text-slate-100 transition-all duration-500 ${animateScore ? 'scale-110 text-emerald-500' : ''}`}>
               {currentWeightedScore.toLocaleString(undefined, { maximumFractionDigits: 1 })}
             </span>
             <span className="text-xs text-slate-400 mb-1">({rawSupportCount} raw)</span>
          </div>
        </div>

        <div className="flex gap-2">
           <button onClick={() => setShowReportModal(true)} className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" title={t('report_abuse')}><Flag size={14} /></button>
          <button onClick={() => handleVote('supported')} disabled={voteState !== 'none'} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${voteState === 'supported' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'}`}><ThumbsUp size={14} />{t('support')}</button>
          <button onClick={() => handleVote('doubted')} disabled={voteState !== 'none'} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${voteState === 'doubted' ? 'bg-amber-500 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}><AlertOctagon size={14} />{t('doubt')}</button>
        </div>
      </div>

      <AuthorityResponsePanel data={localReport.authorityResponse} canManage={canManageReport} onSave={handleAuthoritySubmit} />

      <div className="mt-6">
        <div className="flex border-b border-slate-100 dark:border-slate-800 mb-4">
           {[ { id: 'discussion', icon: MessageSquare, label: 'tab_discussion' }, { id: 'evidence', icon: FileUp, label: 'tab_evidence' }, { id: 'timeline', icon: History, label: 'tab_timeline' } ].map((tab) => (
             <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === tab.id ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}>
               <tab.icon size={16} /> {t(tab.label)}
             </button>
           ))}
        </div>
        <div className="min-h-[200px]">
          {activeTab === 'discussion' && renderDiscussion()}
          {activeTab === 'evidence' && renderEvidence()}
          {activeTab === 'timeline' && renderTimeline()}
        </div>
      </div>
    </GlassCard>
  );
};
