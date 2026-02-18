
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useRTI } from '../hooks/api/useRTI';
import { GlassCard } from '../components/GlassCard';
import { RTIRequest, RTIStatus } from '../types';
import { 
  FileQuestion, 
  Send, 
  CheckCircle2, 
  Lock, 
  Globe, 
  Loader2
} from 'lucide-react';

const RTIStatusTracker: React.FC<{ status: RTIStatus; deadline: string }> = ({ status, deadline }) => {
  const { t } = useApp();
  const steps: RTIStatus[] = ['submitted', 'acknowledged', 'review', 'responded'];
  const currentIdx = steps.indexOf(status === 'closed' ? 'responded' : status);
  const daysLeft = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysLeft < 0;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-xs font-bold text-slate-500 uppercase">{t('status_pending')}</span>
        <span className={`text-xs font-bold ${isOverdue ? 'text-red-500' : 'text-emerald-500'}`}>
          {status === 'responded' || status === 'closed' ? 'Completed' : `${t('daysRemaining')}: ${daysLeft}`}
        </span>
      </div>
      <div className="relative flex items-center justify-between mb-6">
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-200 dark:bg-slate-700 -z-10"></div>
        {steps.map((step, idx) => {
          const completed = idx <= currentIdx;
          return (
            <div key={step} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white dark:bg-slate-900 border-slate-300 text-slate-400'}`}>
                {completed ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const RTIRequestPage: React.FC = () => {
  const { t, user } = useApp();
  const { submitRTI, fetchRequests, loading } = useRTI();
  
  const [activeTab, setActiveTab] = useState<'new' | 'mine' | 'public'>('new');
  const [requests, setRequests] = useState<RTIRequest[]>([]);
  const [listLoading, setListLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    department: '',
    subject: '',
    details: '',
    category: 'Budget',
    isPublic: true
  });

  useEffect(() => {
    if (activeTab !== 'new') {
      setListLoading(true);
      fetchRequests({ type: activeTab }).then(data => {
        setRequests(data);
        setListLoading(false);
      });
    }
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitRTI({
        ...formData,
        applicantName: user?.name || 'Citizen'
      });
      setFormData({ department: '', subject: '', details: '', category: 'Budget', isPublic: true });
      setActiveTab('mine');
    } catch (e) {}
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileQuestion className="text-emerald-500" /> {t('rtiRequest')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">{t('rtiDescription')}</p>
        </div>
        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200">
          {(['new', 'mine', 'public'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-xs font-bold rounded-md ${activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>
              {t(`${tab === 'new' ? 'newRequest' : tab === 'mine' ? 'myRequests' : 'publicLibrary'}`)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'new' && (
        <GlassCard className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input 
                placeholder="Department" 
                value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none" required 
              />
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none"
              >
                <option>Budget</option><option>Tender</option><option>Policy</option>
              </select>
            </div>
            <input 
              placeholder="Subject" 
              value={formData.subject}
              onChange={e => setFormData({...formData, subject: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none" required 
            />
            <textarea 
              placeholder="Details" 
              value={formData.details}
              onChange={e => setFormData({...formData, details: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none min-h-[120px]" required 
            />
            <button type="submit" disabled={loading} className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : <>{t('submitRTI')} <Send size={18} /></>}
            </button>
          </form>
        </GlassCard>
      )}

      {activeTab !== 'new' && (
        <div className="space-y-4">
          {listLoading ? <div className="flex justify-center"><Loader2 className="animate-spin" /></div> : requests.map(req => (
            <GlassCard key={req.id}>
              <div className="flex justify-between">
                <div>
                   <h3 className="font-bold">{req.subject}</h3>
                   <p className="text-sm text-slate-500">{req.department}</p>
                </div>
                {req.isPublic ? <Globe size={16} /> : <Lock size={16} />}
              </div>
              <div className="mt-4"><RTIStatusTracker status={req.status} deadline={req.deadline} /></div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
