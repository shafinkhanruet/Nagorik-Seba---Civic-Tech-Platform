
import React from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Users,
  MapPin,
  Zap,
  Calendar,
  Flame,
  Globe,
  ArrowRight,
  ShieldCheck,
  Building2,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { t, language, user } = useApp();

  const stats = [
    { label: t('activeProjects'), value: '124', icon: Zap, color: 'emerald', trend: '+12%', gradient: 'from-emerald-400 to-cyan-500' },
    { label: t('resolvedIssues'), value: '8,432', icon: CheckCircle2, color: 'indigo', trend: '+5%', gradient: 'from-indigo-500 to-purple-600' },
    { label: t('pendingReports'), value: '45', icon: AlertCircle, color: 'rose', trend: '-2%', gradient: 'from-rose-500 to-orange-500' },
    { label: t('citizenEngagement'), value: '92%', icon: Users, color: 'amber', trend: '+8%', gradient: 'from-amber-400 to-yellow-600' },
  ];

  const trendingTopics = [
    { id: 1, title: 'Road Repair Request', loc: 'Dhanmondi 27', pts: 850, type: 'Infrastructure' },
    { id: 2, title: 'Water Leakage Alert', loc: 'Uttara Sec 4', pts: 420, type: 'WASA' },
    { id: 3, title: 'Street Light Failure', loc: 'Mirpur 10', pts: 120, type: 'Electric' },
    { id: 4, title: 'Uncollected Trash', loc: 'Gulshan 2', pts: 95, type: 'Environment' },
  ];

  return (
    <div className="space-y-8 animate-fade-in py-4">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-tight">
            {language === 'bn' ? `সুপ্রভাত, ${user?.name || 'নাগরিক'}!` : `Good Morning, ${user?.name || 'Citizen'}!`}
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs bg-white/40 dark:bg-white/5 w-fit px-4 py-2 rounded-full backdrop-blur-md">
             <Calendar size={14} className="text-indigo-500" />
             <span>{new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
             <span className="text-emerald-500 flex items-center gap-1"><Globe size={12} /> System Online</span>
          </div>
        </div>
        <div className="flex gap-4">
          <Link to="/app" className="group px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white text-xs md:text-sm font-black rounded-3xl transition-all shadow-xl shadow-emerald-500/30 active:scale-95 flex items-center gap-3 uppercase tracking-widest">
            <TrendingUp size={18} className="group-hover:scale-125 transition-transform" /> 
            {language === 'bn' ? 'লাইভ রিপোর্ট' : 'Live Feed'}
          </Link>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <GlassCard key={i} className="group relative overflow-hidden h-full" accent={stat.color as any}>
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 md:p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg group-hover:rotate-12 transition-transform duration-500`}>
                <stat.icon size={24} />
              </div>
              <div className="flex flex-col items-end">
                 <span className={`text-xs font-black px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm`}>
                  {stat.trend}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">vs Last Month</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-1">{stat.label}</p>
              <h3 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100">{stat.value}</h3>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* District Leaders - 2/3 width */}
        <div className="lg:col-span-2">
          <GlassCard className="relative overflow-hidden group/leaders h-full" accent="amber">
             <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                <div className="space-y-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tighter">Civic Health Leaderboard</h3>
                  <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest opacity-60">Top performing regions this quarter</p>
                </div>
                <div className="flex -space-x-3">
                   {[1,2,3,4,5].map(i => (
                     <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 overflow-hidden shadow-xl">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                     </div>
                   ))}
                </div>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
               {[
                 { name: 'Sylhet', score: 92, icon: '🌲', color: 'emerald', desc: 'Excellence in Sanitation' },
                 { name: 'Dhaka', score: 45, icon: '🏙️', color: 'rose', desc: 'Critical Infrastructure Gap' },
                 { name: 'Khulna', score: 78, icon: '🦐', color: 'indigo', desc: 'Water Management Progress' },
                 { name: 'Barisal', score: 65, icon: '🚤', color: 'amber', desc: 'River Transport Upgrades' },
               ].map((d) => (
                 <div key={d.name} className="p-4 md:p-6 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all group/dist cursor-pointer shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-3xl block group-hover/dist:scale-125 transition-transform duration-500">{d.icon}</span>
                        <div className={`px-2 py-1 rounded-lg bg-vibrant-${d.color}/10 text-vibrant-${d.color} text-[10px] font-black uppercase`}>Score {d.score}%</div>
                    </div>
                    <h4 className="text-base md:text-lg font-black text-slate-800 dark:text-white mb-1">{d.name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mb-4">{d.desc}</p>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                       <div className={`h-full bg-vibrant-${d.color} rounded-full`} style={{ width: `${d.score}%` }}></div>
                    </div>
                 </div>
               ))}
             </div>
          </GlassCard>
        </div>

        {/* Trending Pulse - 1/3 width */}
        <div className="lg:col-span-1">
          <GlassCard className="h-full flex flex-col bg-gradient-to-b from-indigo-500 to-purple-600 text-white border-none shadow-indigo-500/20" noPadding>
            <div className="p-6 md:p-8 flex justify-between items-center">
              <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                <Flame className="text-amber-300 animate-bounce" size={20} />
                Trending Pulse
              </h3>
              <Globe size={18} className="opacity-40 animate-spin-slow" />
            </div>
            
            <div className="px-6 md:px-8 space-y-4 flex-1 pb-6">
              {trendingTopics.map((item) => (
                <div key={item.id} className="p-4 rounded-[1.25rem] bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 cursor-pointer group/item">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 bg-black/20 rounded-full border border-white/10">{item.type}</span>
                    <TrendingUp size={12} className="text-amber-300" />
                  </div>
                  <h4 className="text-sm font-black leading-tight group-hover/item:text-amber-200 transition-colors">{item.title}</h4>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-[10px] font-bold opacity-70">
                       <MapPin size={12} /> {item.loc}
                    </div>
                    <div className="text-[10px] font-black bg-white text-indigo-600 px-2 py-0.5 rounded shadow-lg">
                       +{item.pts} Impact
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 pt-0 mt-auto">
               <button className="w-full py-4 bg-white text-indigo-600 font-black rounded-[1.25rem] shadow-2xl transition-all hover:scale-[1.03] active:scale-95 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                 Map Overview <ArrowRight size={14} />
               </button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Link to="/app" className="group">
           <GlassCard className="group-hover:border-emerald-500/50" accent="emerald">
              <div className="flex items-center gap-4">
                  <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
                     <ShieldCheck size={28} />
                  </div>
                  <div>
                     <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Verified Reports</h4>
                     <p className="text-xs text-slate-500 font-bold uppercase opacity-60">Citizen Pulse</p>
                  </div>
              </div>
           </GlassCard>
         </Link>
         <Link to="/app/govt-projects" className="group">
           <GlassCard className="group-hover:border-indigo-500/50" accent="indigo">
              <div className="flex items-center gap-4">
                  <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform">
                     <Building2 size={28} />
                  </div>
                  <div>
                     <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Development Projects</h4>
                     <p className="text-xs text-slate-500 font-bold uppercase opacity-60">Track Spending</p>
                  </div>
              </div>
           </GlassCard>
         </Link>
         <Link to="/app/notifications" className="group">
           <GlassCard className="group-hover:border-rose-500/50" accent="rose">
              <div className="flex items-center gap-4">
                  <div className="p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl group-hover:scale-110 transition-transform">
                     <Bell size={28} />
                  </div>
                  <div>
                     <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">System Alerts</h4>
                     <p className="text-xs text-slate-500 font-bold uppercase opacity-60">Realtime Updates</p>
                  </div>
              </div>
           </GlassCard>
         </Link>
      </div>
    </div>
  );
};
