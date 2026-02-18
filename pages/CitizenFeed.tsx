
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useReports } from '../hooks/api/useReports';
import { ReportCard } from '../components/ReportCard';
import { GlassCard } from '../components/GlassCard';
import { EthicsBanner } from '../components/EthicsBanner';
import { 
  Image, 
  Video, 
  Filter, 
  TrendingUp, 
  Phone, 
  Flame,
  User,
  Loader2
} from 'lucide-react';

export const CitizenFeed: React.FC = () => {
  const { t, language } = useApp();
  const { reports, loading, fetchReports, submitReport } = useReports();
  const [reportText, setReportText] = useState('');

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handlePostReport = async () => {
    if (!reportText.trim()) return;
    await submitReport({
        description: reportText,
        category: 'General',
        isAnonymous: true,
        location: { address: 'Detecting...' },
        evidence: []
    });
    setReportText('');
  };

  return (
    <div className="pb-20 animate-fade-in space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
           <EthicsBanner />
        </div>
        <div className="lg:col-span-3">
           <div className="bg-gradient-to-br from-rose-600 to-red-700 rounded-2xl p-4 text-white shadow-lg flex items-center gap-4 h-full">
              <div className="p-3 bg-white/20 rounded-full animate-pulse shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-black text-lg uppercase tracking-tight">Emergency?</h3>
                <p className="text-[10px] font-bold opacity-80 uppercase leading-none">Call 999 Immediately</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <GlassCard className="p-5 border-t-4 border-t-emerald-500 shadow-2xl">
            <div className="flex gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                 <User size={20} className="text-slate-400" />
              </div>
              <div className="flex-1">
                <input 
                  type="text" 
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder={language === 'bn' ? "আপনার এলাকায় কী ঘটছে?" : "Report issue anonymously..."} 
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm outline-none dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
               <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase"><Image size={16} /> Photo</button>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase"><Video size={16} /> Video</button>
               </div>
               <button 
                onClick={handlePostReport}
                disabled={loading || !reportText.trim()}
                className="px-8 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2"
               >
                 {loading ? <Loader2 className="animate-spin" size={14} /> : 'Post Report'}
               </button>
            </div>
          </GlassCard>

          <div className="flex justify-between items-center px-2">
             <h3 className="font-black text-2xl text-slate-800 dark:text-white tracking-tighter flex items-center gap-3">
               <Flame className="text-orange-500" /> {t('dashboard')}
             </h3>
             <button onClick={() => fetchReports({ filter: 'trending' })} className="flex items-center gap-2 text-[10px] font-black uppercase bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"><Filter size={14} /> Filter</button>
          </div>

          <div className="space-y-8">
            {loading && reports.length === 0 ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>
            ) : reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <GlassCard>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <TrendingUp className="text-emerald-500" size={20} />
              <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter">Trending Topics</h3>
            </div>
            <div className="space-y-4">
              {['#TrafficJam', '#WaterLeak', '#RoadRepair'].map((tag, i) => (
                <div key={i} className="flex justify-between items-center cursor-pointer" onClick={() => fetchReports({ tag })}>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{tag}</span>
                  <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">HOT</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
