
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { ActionButton } from '../components/ActionButton';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { usePermission } from '../hooks/usePermission';
import { useAdmin } from '../hooks/api/useAdmin';
import apiClient from '../services/apiClient';
import { 
  ShieldAlert, 
  FileText,
  Loader2
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

export const ModerationQueue: React.FC = () => {
  const { t } = useApp();
  const { can } = usePermission();
  const { moderateContent } = useAdmin();
  const [queue, setQueue] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [actionType, setActionType] = useState<'remove' | 'keep' | 'restore'>('keep');

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/moderation');
      setQueue(res.data);
    } catch (e) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchQueue(); }, []);

  const executeAction = async (reason: string) => {
    if (!selectedItem) return;
    await moderateContent(selectedItem.id, actionType, reason);
    fetchQueue(); 
  };

  const handleActionClick = (item: ModerationItem, type: 'remove' | 'keep' | 'restore') => {
    setSelectedItem(item);
    setActionType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <ShieldAlert className="text-red-500" /> {t('moderationQueue')}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <div className="col-span-full flex justify-center"><Loader2 className="animate-spin" /></div> : queue.map((item) => (
          <GlassCard key={item.id} className="flex flex-col h-full">
             <div className="flex justify-between items-start mb-4">
               <div className="flex gap-2">
                 <div className="p-2 bg-blue-100 rounded-lg"><FileText size={16} /></div>
                 <div><p className="text-xs font-bold uppercase">{item.type}</p></div>
               </div>
               <span className="text-[10px] font-bold uppercase">{item.status}</span>
             </div>
             <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg flex-1 mb-4">
                <p className="text-sm italic">"{item.contentSnippet}"</p>
             </div>
             <div className="flex gap-2">
               <ActionButton variant="success" onClick={() => handleActionClick(item, 'keep')} disabled={!can('action:moderate')}>Keep</ActionButton>
               <ActionButton variant="danger" onClick={() => handleActionClick(item, 'remove')} disabled={!can('action:moderate')}>Remove</ActionButton>
             </div>
          </GlassCard>
        ))}
      </div>

      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={executeAction}
        title="Moderation Decision"
        description="This action is permanently logged in the audit trail."
      />
    </div>
  );
};
