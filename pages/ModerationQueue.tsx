import React from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { 
  ShieldAlert, 
  Flag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  AlertTriangle,
  FileText,
  MessageSquare
} from 'lucide-react';

interface ModerationItem {
  id: string;
  type: 'Report' | 'Comment';
  contentSnippet: string;
  flagReason: string;
  reportCount: number;
  status: 'pending' | 'removed' | 'restored';
  timeFlagged: string;
}

const MOCK_QUEUE: ModerationItem[] = [
  {
    id: 'M-001',
    type: 'Comment',
    contentSnippet: 'এই প্রকল্পটি সম্পূর্ণ ভুয়া, টাকা চুরির ফন্দি। মন্ত্রীর সাথে ঠিকাদারের গোপন আঁতাত আছে...',
    flagReason: 'Defamation',
    reportCount: 12,
    status: 'pending',
    timeFlagged: '2 hrs ago'
  },
  {
    id: 'M-002',
    type: 'Report',
    contentSnippet: 'ভুল তথ্য দিয়ে বিভ্রান্ত ছড়ানো হচ্ছে।',
    flagReason: 'Misinformation',
    reportCount: 5,
    status: 'pending',
    timeFlagged: '5 hrs ago'
  },
  {
    id: 'M-003',
    type: 'Comment',
    contentSnippet: '[Hate speech content redacted]',
    flagReason: 'Hate Speech',
    reportCount: 45,
    status: 'removed',
    timeFlagged: '1 day ago'
  }
];

export const ModerationQueue: React.FC = () => {
  const { t } = useApp();

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{t('status_pending')}</span>;
      case 'removed': return <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{t('status_removed')}</span>;
      case 'restored': return <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{t('status_restored')}</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <ShieldAlert className="text-red-500" />
          {t('moderationQueue')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Review reported content and manage platform integrity.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_QUEUE.map((item) => (
          <GlassCard key={item.id} className="relative overflow-hidden group">
             {/* Header */}
             <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-2">
                 <div className={`p-2 rounded-lg ${item.type === 'Report' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                   {item.type === 'Report' ? <FileText size={16} /> : <MessageSquare size={16} />}
                 </div>
                 <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.type}</p>
                   <p className="text-xs font-mono text-slate-500">{item.id}</p>
                 </div>
               </div>
               {getStatusBadge(item.status)}
             </div>

             {/* Content Snippet */}
             <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 mb-4">
                <p className="text-sm text-slate-700 dark:text-slate-300 italic line-clamp-3">
                  "{item.contentSnippet}"
                </p>
             </div>

             {/* Details */}
             <div className="grid grid-cols-2 gap-3 mb-4">
               <div className="bg-red-50 dark:bg-red-900/10 p-2 rounded-lg border border-red-100 dark:border-red-900/30">
                  <p className="text-[10px] font-bold text-red-400 uppercase mb-1">Reason</p>
                  <p className="text-xs font-bold text-red-700 dark:text-red-400 flex items-center gap-1">
                    <Flag size={12} /> {item.flagReason}
                  </p>
               </div>
               <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Reports</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <AlertTriangle size={12} /> {item.reportCount} Users
                  </p>
               </div>
             </div>

             <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
               <span className="flex items-center gap-1"><Clock size={12} /> {item.timeFlagged}</span>
             </div>

             {/* Actions */}
             <div className="flex gap-2">
               <button className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-lg text-xs flex items-center justify-center gap-1">
                 <Eye size={14} /> View
               </button>
               {item.status === 'pending' && (
                 <>
                  <button className="flex-1 py-2 bg-emerald-100 dark:bg-emerald-900/20 hover:bg-emerald-200 text-emerald-700 dark:text-emerald-400 font-bold rounded-lg text-xs flex items-center justify-center gap-1">
                    <CheckCircle2 size={14} /> Keep
                  </button>
                  <button className="flex-1 py-2 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 text-red-700 dark:text-red-400 font-bold rounded-lg text-xs flex items-center justify-center gap-1">
                    <XCircle size={14} /> Remove
                  </button>
                 </>
               )}
             </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};