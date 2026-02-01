import React from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, CartesianGrid, Cell
} from 'recharts';
import { 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Zap,
  Activity,
  Calendar,
  Flame,
  Globe
} from 'lucide-react';

const dataActivity = [
  { name: 'জানু', reports: 40, resolved: 24 },
  { name: 'ফেব্রু', reports: 30, resolved: 13 },
  { name: 'মার্চ', reports: 20, resolved: 48 },
  { name: 'এপ্রিল', reports: 27, resolved: 39 },
  { name: 'মে', reports: 18, resolved: 48 },
  { name: 'জুন', reports: 23, resolved: 38 },
];

export const Dashboard: React.FC = () => {
  const { t, language } = useApp();

  const stats = [
    { label: t('activeProjects'), value: '124', icon: Zap, color: 'emerald', trend: '+12%', gradient: 'from-emerald-400 to-cyan-500' },
    { label: t('resolvedIssues'), value: '8,432', icon: CheckCircle2, color: 'indigo', trend: '+5%', gradient: 'from-indigo-500 to-purple-600' },
    { label: t('pendingReports'), value: '45', icon: AlertCircle, color: 'rose', trend: '-2%', gradient: 'from-rose-500 to-orange-500' },
    { label: t('citizenEngagement'), value: '92%', icon: Users, color: 'amber', trend: '+8%', gradient: 'from-amber-400 to-yellow-600' },
  ];

  return (
    <div className="space-y-10 animate-fade-in py-4">
      {/* Hero Branding / Welcome */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-tight">
            {language === 'bn' ? 'সুপ্রভাত, নাগরিক!' : 'Good Morning, Citizen!'}
          </h1>
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs bg-white/40 dark:bg-white/5 w-fit px-4 py-2 rounded-full backdrop-blur-md">
             <Calendar size={14} className="text-indigo-500" />
             <span>{new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
             <span className="text-emerald-500 flex items-center gap-1"><Globe size={12} /> System Online</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white text-sm font-black rounded-3xl transition-all shadow-xl shadow-emerald-500/30 active:scale-95 flex items-center gap-3 uppercase tracking-widest">
            <TrendingUp size={20} className="group-hover:scale-125 transition-transform" /> 
            {language === 'bn' ? 'লাইভ রিপোর্ট' : 'Live Feed'}
          </button>
        </div>
      </div>

      {/* Grid Stats with Gradients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <GlassCard key={i} className="group relative overflow-hidden h-full" accent={stat.color as any}>
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg group-hover:rotate-12 transition-transform duration-500`}>
                <stat.icon size={28} />
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
              <h3 className="text-4xl font-black text-slate-800 dark:text-white">{stat.value}</h3>
            </div>
            {/* Geometric Decoration */}
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`}></div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Analytics Island */}
        <div className="lg:col-span-8">
          <GlassCard className="h-full min-h-[500px] flex flex-col group/chart" noPadding>
            <div className="p-8 border-b border-white/20 dark:border-white/5 flex justify-between items-center bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-900/50">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3 tracking-tighter">
                  <Activity className="text-indigo-500 animate-pulse" size={24} />
                  {t('monthlyTrend')}
                </h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest opacity-60">Citizen Verification Network</p>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-xl border border-white/20">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase">Verified</span>
                 </div>
                 <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-xl border border-white/20">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase">Reports</span>
                 </div>
              </div>
            </div>
            
            <div className="flex-1 p-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataActivity} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartEmerald" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="chartIndigo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#64748b" opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 800}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 800}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', color: '#fff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                  />
                  <Area 
                    type="monotone" dataKey="reports" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#chartIndigo)"
                    animationDuration={2000}
                  />
                  <Area 
                    type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#chartEmerald)"
                    animationDuration={2500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Action / Trending Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <GlassCard className="h-full flex flex-col bg-gradient-to-b from-indigo-500 to-purple-600 text-white border-none shadow-indigo-500/20" noPadding>
            <div className="p-8 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                <Flame className="text-amber-300 animate-bounce" size={24} />
                Trending Now
              </h3>
              <Globe size={20} className="opacity-40 animate-spin-slow" />
            </div>
            
            <div className="px-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar pb-8">
              {[
                { id: 1, title: 'Road Repair Request', loc: 'Dhanmondi 27', pts: 850, type: 'Infrastructure' },
                { id: 2, title: 'Water Leakage Alert', loc: 'Uttara Sec 4', pts: 420, type: 'WASA' },
                { id: 3, title: 'Street Light Failure', loc: 'Mirpur 10', pts: 120, type: 'Electric' },
                { id: 4, title: 'Uncollected Trash', loc: 'Gulshan 2', pts: 95, type: 'Environment' },
              ].map((item) => (
                <div key={item.id} className="p-5 rounded-[1.5rem] bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 cursor-pointer group/item">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 bg-black/20 rounded-full border border-white/10">{item.type}</span>
                    <div className="flex items-center gap-1 text-amber-300">
                       <TrendingUp size={12} />
                       <span className="text-[10px] font-bold">HOT</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-black leading-tight group-hover/item:text-amber-200 transition-colors">{item.title}</h4>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold opacity-70">
                       <MapPin size={14} /> {item.loc}
                    </div>
                    <div className="text-xs font-black bg-white text-indigo-600 px-3 py-1 rounded-xl shadow-lg">
                       +{item.pts} Impact
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 pt-0">
               <button className="w-full py-5 bg-white text-indigo-600 font-black rounded-[1.5rem] shadow-2xl transition-all hover:scale-[1.03] active:scale-95 uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                 View Global Map <ArrowRight size={18} />
               </button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* District Leaders Island */}
      <GlassCard className="relative overflow-hidden group/leaders" accent="amber">
         <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">Civic Health Leaderboard</h3>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest opacity-60">Top performing regions this quarter</p>
            </div>
            <div className="flex -space-x-4">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 overflow-hidden shadow-xl">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                 </div>
               ))}
               <div className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-indigo-500 flex items-center justify-center text-white text-xs font-black shadow-xl">
                 +12k
               </div>
            </div>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
           {[
             { name: 'Sylhet', score: 92, icon: '🌲', color: 'emerald' },
             { name: 'Dhaka', score: 45, icon: '🏙️', color: 'rose' },
             { name: 'Khulna', score: 78, icon: '🦐', color: 'indigo' },
             { name: 'Barisal', score: 65, icon: '🚤', color: 'amber' },
             { name: 'Rangpur', score: 82, icon: '🌾', color: 'cyan' },
           ].map((d) => (
             <div key={d.name} className="p-6 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all text-center group/dist cursor-pointer shadow-sm hover:shadow-xl">
                <span className="text-4xl mb-4 block group-hover/dist:scale-125 transition-transform duration-500">{d.icon}</span>
                <h4 className="text-xl font-black text-slate-800 dark:text-white mb-2">{d.name}</h4>
                <div className="space-y-2">
                   <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full bg-vibrant-${d.color} rounded-full`} style={{ width: `${d.score}%` }}></div>
                   </div>
                   <span className={`text-lg font-black text-vibrant-${d.color}`}>{d.score}%</span>
                </div>
             </div>
           ))}
         </div>
      </GlassCard>
    </div>
  );
};