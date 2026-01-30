import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { GlassCard } from '../components/GlassCard';
import { ActionButton } from '../components/ActionButton';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { usePermission } from '../hooks/usePermission';
import { 
  ShieldAlert, 
  Flag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  AlertTriangle,
  FileText,
  MessageSquare,
  Undo2
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
  const { addToast } = useToast();
  const { can } = usePermission();
  const [queue, setQueue] = useState(MOCK_QUEUE);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [actionType, setActionType] = useState<'remove' | 'keep' | 'restore'>('keep');

  const handleActionClick = (item: ModerationItem, type: 'remove' | 'keep' | 'restore') => {
    setSelectedItem(item);
    setActionType(type);
    setIsModalOpen(true);
  };

  const executeAction = async (reason: string) => {
    if (!selectedItem) return;

    // 1. Optimistic UI Update
    const previousQueue = [...queue];
    setQueue(prev => prev.map(item => {
      if (item.id === selectedItem.id) {
        return { 
          ...item, 
          status: actionType === 'remove' ? 'removed' : actionType === 'restore' ? 'restored' : 'pending' 
        };
      }
      return item;
    }));

    // 2. Mock API Call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // Success Notification
      const message = actionType === 'remove' 
        ? 'Content removed successfully' 
        : actionType === 'restore' 
          ? 'Content restored' 
          : 'Content verified';
      
      addToast(message, 'success');

    } catch (error) {
      // Revert on error
      setQueue(previousQueue);
      addToast('Failed to execute action', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{t('status_pending')}</span>;
      case 'removed': return <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{t('status_removed')}</span>;
      case 'restored': return <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{t('status_restored')}</span>;
      default: return null;
    }
  };

  const hasModeratePermission = can('action:moderate');

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
        {queue.map((item) => (
          <GlassCard key={item.id} className="relative overflow-hidden group flex flex-col h-full">
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
             <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 mb-4 flex-1">
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

             {/* Actions using ActionButton */}
             <div className="flex gap-2 mt-auto">
               <ActionButton 
                 variant="ghost" 
                 className="flex-1"
               >
                 <Eye size={14} /> View
               </ActionButton>
               
               {item.status === 'pending' && (
                 <>
                  <ActionButton 
                    variant="success"
                    className="flex-1"
                    onClick={() => handleActionClick(item, 'keep')}
                    disabled={!hasModeratePermission}
                    disabledTooltip="You do not have moderation permissions"
                  >
                    <CheckCircle2 size={14} /> Keep
                  </ActionButton>
                  <ActionButton 
                    variant="danger"
                    className="flex-1"
                    onClick={() => handleActionClick(item, 'remove')}
                    disabled={!hasModeratePermission}
                    disabledTooltip="You do not have moderation permissions"
                  >
                    <XCircle size={14} /> Remove
                  </ActionButton>
                 </>
               )}

               {item.status === 'removed' && (
                 <ActionButton 
                   variant="outline"
                   className="flex-1"
                   onClick={() => handleActionClick(item, 'restore')}
                   disabled={!hasModeratePermission}
                   disabledTooltip="Permission denied"
                 >
                   <Undo2 size={14} /> Restore
                 </ActionButton>
               )}
             </div>
          </GlassCard>
        ))}
      </div>

      {/* Admin Confirmation Modal */}
      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={executeAction}
        title={actionType === 'remove' ? 'Remove Content?' : actionType === 'restore' ? 'Restore Content?' : 'Verify Content'}
        description={
          actionType === 'remove' 
            ? 'This action will hide the content from the public feed. The user will be notified.' 
            : 'This will restore the content to the public view.'
        }
        confirmLabel={actionType === 'remove' ? 'Remove' : actionType === 'restore' ? 'Restore' : 'Verify'}
        impactLevel={actionType === 'remove' ? 'high' : 'low'}
      />
    </div>
  );
};