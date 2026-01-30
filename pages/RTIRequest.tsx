import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useMockApi } from '../hooks/useMockApi';
import { GlassCard } from '../components/GlassCard';
import { useToast } from '../context/ToastContext';
import { RTIRequest, RTIStatus } from '../types';
import { 
  FileQuestion, 
  Send, 
  Clock, 
  CheckCircle2, 
  Lock, 
  Globe, 
  Building2, 
  FileText,
  Search,
  Filter,
  Eye,
  Loader2,
  Calendar
} from 'lucide-react';

// --- COMPONENTS ---

// 1. Status Tracker Component
const RTIStatusTracker: React.FC<{ status: RTIStatus; deadline: string }> = ({ status, deadline }) => {
  const { t } = useApp();
  
  const steps: RTIStatus[] = ['submitted', 'acknowledged', 'review', 'responded'];
  const currentIdx = steps.indexOf(status === 'closed' ? 'responded' : status);
  
  // Calculate days remaining
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
          const active = idx === currentIdx;
          
          return (
            <div key={step} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                completed 
                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-400'
              }`}>
                {completed ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
              </div>
              <span className={`text-[10px] font-bold uppercase hidden sm:block ${active ? 'text-emerald-600' : 'text-slate-400'}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 2. Main Page Component
export const RTIRequestPage: React.FC = () => {
  const { t, language, user } = useApp();
  const api = useMockApi();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'new' | 'mine' | 'public'>('new');
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [department, setDepartment] = useState('');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [category, setCategory] = useState<'Budget' | 'Tender' | 'Policy' | 'Hospital' | 'Other'>('Budget');
  const [isPublic, setIsPublic] = useState(true);

  // Data State
  const [myRequests, setMyRequests] = useState<RTIRequest[]>([]);
  const [publicRequests, setPublicRequests] = useState<RTIRequest[]>([]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const allReqs = await api.getRTIRequests(false);
      setPublicRequests(allReqs.filter(r => r.isPublic));
      // Mock filtering for "My Requests" since we don't have real user ID link in mock data easily
      // We'll just show the ones created recently or a subset for demo
      setMyRequests(allReqs); 
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department || !subject || !details) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.submitRTIRequest({
        department,
        subject,
        details,
        category,
        isPublic,
        applicantName: user?.name || 'Citizen'
      });
      addToast('Request submitted successfully', 'success');
      setDepartment('');
      setSubject('');
      setDetails('');
      setActiveTab('mine');
    } catch (e) {
      addToast('Failed to submit request', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileQuestion className="text-emerald-500" />
            {t('rtiRequest')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {t('rtiDescription')}
          </p>
        </div>
        
        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          {(['new', 'mine', 'public'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
                activeTab === tab 
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab === 'new' ? t('newRequest') : tab === 'mine' ? t('myRequests') : t('publicLibrary')}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* TAB: NEW REQUEST */}
        {activeTab === 'new' && (
          <GlassCard className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                    {t('department')}
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Ministry of Land"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                    {t('category')}
                  </label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                  >
                    <option>Budget</option>
                    <option>Tender</option>
                    <option>Policy</option>
                    <option>Hospital</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                  {t('subject')}
                </label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Summary of information required..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                  {t('details')}
                </label>
                <textarea 
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe specifically what record, document or information you need..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none min-h-[120px] resize-none"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{t('privacySetting')}</h4>
                  <p className="text-xs text-slate-500">Do you want this request to be visible in the public library?</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPublic(true)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isPublic 
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                      : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <Globe size={14} /> {t('public')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPublic(false)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      !isPublic 
                      ? 'bg-slate-800 text-white border border-slate-700' 
                      : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <Lock size={14} /> {t('private')}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>{t('submitRTI')} <Send size={18} /></>}
                </button>
              </div>
            </form>
          </GlassCard>
        )}

        {/* TAB: MY REQUESTS */}
        {activeTab === 'mine' && (
          <div className="space-y-4">
            {myRequests.length > 0 ? (
              myRequests.map(req => (
                <GlassCard key={req.id} className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">{req.id}</span>
                        <span className="text-xs text-slate-400">{req.dateFiled.split('T')[0]}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{req.subject}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <Building2 size={14} /> {req.department}
                      </p>
                    </div>
                    <div className="text-right">
                      {req.isPublic ? <Globe size={16} className="text-slate-400 inline-block mb-2" /> : <Lock size={16} className="text-slate-400 inline-block mb-2" />}
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <RTIStatusTracker status={req.status} deadline={req.deadline} />
                  </div>

                  {req.response && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                      <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase mb-2 flex items-center gap-2">
                        <FileText size={14} /> Official Response
                      </h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {req.response}
                      </p>
                    </div>
                  )}
                </GlassCard>
              ))
            ) : (
              <div className="text-center py-10 text-slate-500">No requests found.</div>
            )}
          </div>
        )}

        {/* TAB: PUBLIC LIBRARY */}
        {activeTab === 'public' && (
          <GlassCard noPadding className="overflow-hidden min-h-[500px] flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex gap-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search public requests..." 
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-2 text-sm font-bold">
                <Filter size={16} /> Filter
              </button>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold sticky top-0">
                  <tr>
                    <th className="p-4">{t('subject')}</th>
                    <th className="p-4">{t('department')}</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                  {publicRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-slate-700 dark:text-slate-200 line-clamp-1">{req.subject}</p>
                        <span className="text-xs text-slate-500">{req.category}</span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{req.department}</td>
                      <td className="p-4 text-slate-500 font-mono text-xs">{req.dateFiled.split('T')[0]}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          req.status === 'responded' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-slate-400 hover:text-emerald-600 transition-colors">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}

      </div>
    </div>
  );
};