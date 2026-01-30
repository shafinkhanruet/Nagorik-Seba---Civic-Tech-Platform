
import React from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Users,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight,
  Activity
} from 'lucide-react';

const dataActivity = [
  { name: 'Jan', reports: 40, resolved: 24 },
  { name: 'Feb', reports: 30, resolved: 13 },
  { name: 'Mar', reports: 20, resolved: 48 },
  { name: 'Apr', reports: 27, resolved: 39 },
  { name: 'May', reports: 18, resolved: 48 },
  { name: 'Jun', reports: 23, resolved: 38 },
  { name: 'Jul', reports: 34, resolved: 43 },
];

const dataEngagement = [
  { name: 'Week 1', value: 400 },
  { name: 'Week 2', value: 300 },
  { name: 'Week 3', value: 500 },
  { name: 'Week 4', value: 450 },
];

export const Dashboard: React.FC = () => {
  const { t, language } = useApp();

  const stats = [
    { 
      title: t('activeProjects'), 
      value: '124', 
      icon: TrendingUp, 
      gradient: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/30' 
    },
    { 
      title: t('resolvedIssues'), 
      value: '8,432', 
      icon: CheckCircle2, 
      gradient: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/30' 
    },
    { 
      title: t('pendingReports'), 
      value: '45', 
      icon: AlertCircle, 
      gradient: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/30' 
    },
    { 
      title: t('citizenEngagement'), 
      value: '92%', 
      icon: Users, 
      gradient: 'from-violet-500 to-purple-600',
      shadow: 'shadow-violet-500/30' 
    },
  ];

  const recentReports = [
    { id: 1, title: 'রাস্তা মেরামত প্রয়োজন', location: 'ধানমন্ডি ২৭', status: 'pending', time: '২ ঘণ্টা আগে' },
    { id: 2, title: 'স্ট্রিট লাইট নষ্ট', location: 'মিরপুর ১০', status: 'resolved', time: '৫ ঘণ্টা আগে' },
    { id: 3, title: 'পানির লাইনে সমস্যা', location: 'উত্তরা সেক্টর ৪', status: 'processing', time: '১ দিন আগে' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            {t('dashboard')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            {language === 'bn' ? 'আজকের নাগরিক সেবার সংক্ষিপ্ত বিবরণ' : 'Overview of todays civic services'}
          </p>
        </div>
        <div className="flex gap-3">
           <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0">
             <span>+</span> {language === 'bn' ? 'নতুন রিপোর্ট' : 'New Report'}
           </button>
        </div>
      </div>

      {/* Stats Grid - Modern Gradient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300`}></div>
            <GlassCard className="relative flex items-center justify-between h-full hover:-translate-y-1 transition-transform duration-300" noPadding>
              <div className="p-6">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{stat.title}</p>
                <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100">{stat.value}</h3>
              </div>
              <div className={`h-full w-20 flex items-center justify-center bg-gradient-to-br ${stat.gradient} text-white rounded-r-2xl`}>
                <stat.icon size={28} className="drop-shadow-md" />
              </div>
            </GlassCard>
          </div>
        ))}
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-8">
          <GlassCard className="border-t-4 border-t-emerald-500">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Activity className="text-emerald-500" />
                {t('monthlyTrend')}
              </h3>
              <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-xs font-bold px-3 py-1.5 outline-none text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataActivity}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', background: '#1e293b', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="reports" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorReports)" 
                    name="Reports"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorResolved)" 
                    name="Resolved"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="relative group overflow-hidden rounded-2xl shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 transition-transform duration-500 group-hover:scale-105"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                
                <div className="relative p-6 flex flex-col h-full justify-between text-white">
                   <div>
                      <span className="inline-block px-2 py-1 bg-white/20 rounded text-[10px] font-bold uppercase mb-3 backdrop-blur-sm">Featured</span>
                      <h3 className="font-bold text-xl mb-2 opacity-95 leading-tight">কমিউনিটি ইভেন্ট</h3>
                      <p className="text-sm opacity-80 leading-relaxed font-medium">আগামী শুক্রবার ধানমন্ডি লেকে পরিচ্ছন্নতা অভিযান। অংশগ্রহন করুন এবং আপনার শহর সুন্দর রাখুন।</p>
                   </div>
                   <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold backdrop-blur-md transition-all border border-white/10 flex items-center justify-center gap-2">
                      বিস্তারিত দেখুন <ArrowRight size={16} />
                   </button>
                </div>
             </div>

             <GlassCard>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <Users className="text-indigo-500" /> {t('satisfactionRate')}
                </h3>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataEngagement} barSize={20}>
                      <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                      <XAxis dataKey="name" hide />
                      <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', background: '#1e293b', color: '#fff' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </GlassCard>
          </div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="lg:col-span-1">
          <GlassCard className="h-full flex flex-col" noPadding>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('recentActivity')}</h3>
                <button className="text-xs text-emerald-600 hover:text-emerald-700 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg transition-colors">
                  সব দেখুন
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-3 flex-1 overflow-y-auto">
              {recentReports.map((report) => (
                <div key={report.id} className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider
                      ${report.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                      ${report.status === 'resolved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                      ${report.status === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                    `}>
                      {report.status}
                    </span>
                    <span className="flex items-center text-[10px] text-slate-400 font-medium bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-700">
                      <Clock size={10} className="mr-1" /> {report.time}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {report.title}
                  </h4>
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                    <MapPin size={12} className="mr-1 text-slate-400" />
                    {report.location}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
              <button className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-slate-500 hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                আরও লোড করুন <ChevronRight size={14} />
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
