
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useMockApi } from '../hooks/useMockApi';
import { ReportCard } from '../components/ReportCard';
import { Report } from '../types';
import { GlassCard } from '../components/GlassCard';
import { EthicsBanner } from '../components/EthicsBanner';
import { 
  Image, 
  Video, 
  Filter, 
  TrendingUp, 
  Award, 
  Phone, 
  MapPin,
  Flame,
  ShieldCheck,
  User,
  Loader2,
  Plus
} from 'lucide-react';

export const CitizenFeed: React.FC = () => {
  const { t, language } = useApp();
  const api = useMockApi();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await api.getReports();
      setReports(data);
    } catch (e) {
      console.error("Failed to load reports", e);
    } finally {
      setLoading(false);
    }
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
          {/* Create Report */}
          <GlassCard className="p-5 border-t-4 border-t-emerald-500 shadow-2xl">
            <div className="flex gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-emerald-100 dark:border-emerald-900/50">
                 <User size={20} className="text-slate-400" />
              </div>
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder={language === 'bn' ? "আপনার এলাকায় কী ঘটছে? রিপোর্ট করুন..." : "What's happening in your area? Report anonymously..."} 
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-all font-medium"
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-between items-center pt-2 gap-4">
               <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors text-[10px] font-black uppercase tracking-widest">
                    <Image size={16} /> Photo
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-[10px] font-black uppercase tracking-widest">
                    <Video size={16} /> Video
                  </button>
               </div>
               <button className="px-8 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-xl text-[10px] uppercase tracking-[0.2em] hover:shadow-xl transition-all shadow-lg">
                 {language === 'bn' ? 'রিপোর্ট করুন' : 'Post Report'}
               </button>
            </div>
          </GlassCard>

          {/* Feed List */}
          <div className="flex justify-between items-center px-2">
             <h3 className="font-black text-2xl text-slate-800 dark:text-white tracking-tighter flex items-center gap-3">
               <Flame className="text-orange-500" /> {t('dashboard')}
             </h3>
             <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:text-emerald-600 transition-colors">
               <Filter size={14} /> Filter
             </button>
          </div>

          <div className="space-y-8">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-emerald-500" size={32} />
              </div>
            ) : reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <TrendingUp className="text-emerald-500" size={20} />
              <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter">Trending Topics</h3>
            </div>
            <div className="space-y-4">
              {[
                { tag: '#TrafficJam_Mirpur', count: '2.5k' },
                { tag: '#DengueAlert', count: '1.2k' },
                { tag: '#WASA_Water', count: '620' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-emerald-600">
                    {item.tag}
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                    {item.count} reports
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard accent="indigo">
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Award className="text-amber-500" size={20} />
              <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter">Top Guardians</h3>
            </div>
            <div className="space-y-5">
              {[
                { name: 'Guardian_992', score: 98 },
                { name: 'Reporter_X', score: 96 },
                { name: 'Citizen_110', score: 95 }
              ].map((user, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tighter">{user.name}</p>
                      <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                        <ShieldCheck size={10} /> {user.score}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
