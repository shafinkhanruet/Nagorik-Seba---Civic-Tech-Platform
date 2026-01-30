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
  ArrowRight
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
      value: '১২৪', 
      icon: TrendingUp, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50 dark:bg-blue-500/10' 
    },
    { 
      title: t('resolvedIssues'), 
      value: '৮,৪৩২', 
      icon: CheckCircle2, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-50 dark:bg-emerald-500/10' 
    },
    { 
      title: t('pendingReports'), 
      value: '৪৫', 
      icon: AlertCircle, 
      color: 'text-amber-500', 
      bg: 'bg-amber-50 dark:bg-amber-500/10' 
    },
    { 
      title: t('citizenEngagement'), 
      value: '৯২%', 
      icon: Users, 
      color: 'text-purple-500', 
      bg: 'bg-purple-50 dark:bg-purple-500/10' 
    },
  ];

  const recentReports = [
    { id: 1, title: 'রাস্তা মেরামত প্রয়োজন', location: 'ধানমন্ডি ২৭', status: 'pending', time: '২ ঘণ্টা আগে' },
    { id: 2, title: 'স্ট্রিট লাইট নষ্ট', location: 'মিরপুর ১০', status: 'resolved', time: '৫ ঘণ্টা আগে' },
    { id: 3, title: 'পানির লাইনে সমস্যা', location: 'উত্তরা সেক্টর ৪', status: 'processing', time: '১ দিন আগে' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {t('dashboard')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {language === 'bn' ? 'আজকের নাগরিক সেবার সংক্ষিপ্ত বিবরণ' : 'Overview of todays civic services'}
          </p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-500/30">
             {language === 'bn' ? '+ নতুন রিপোর্ট' : '+ New Report'}
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <GlassCard key={idx} className="flex items-center gap-4 hover:-translate-y-1">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stat.value}</h3>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('monthlyTrend')}</h3>
              <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-xs px-2 py-1 outline-none text-slate-600 dark:text-slate-300">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataActivity}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="reports" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorReports)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={0} 
                    fill="transparent" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <GlassCard className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
                <div className="flex flex-col h-full justify-between">
                   <div>
                      <h3 className="font-bold text-lg mb-2 opacity-95">কমিউনিটি ইভেন্ট</h3>
                      <p className="text-sm opacity-80 leading-relaxed">আগামী শুক্রবার ধানমন্ডি লেকে পরিচ্ছন্নতা অভিযান। অংশগ্রহন করুন এবং আপনার শহর সুন্দর রাখুন।</p>
                   </div>
                   <button className="mt-6 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold backdrop-blur-md transition-colors">
                      বিস্তারিত দেখুন
                   </button>
                </div>
             </GlassCard>
             <GlassCard>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">{t('satisfactionRate')}</h3>
                <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataEngagement}>
                      <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <XAxis dataKey="name" hide />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </GlassCard>
          </div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="lg:col-span-1">
          <GlassCard className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('recentActivity')}</h3>
              <button className="text-xs text-emerald-500 hover:text-emerald-600 font-medium">সব দেখুন</button>
            </div>
            
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="group p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/50 cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${report.status === 'pending' ? 'bg-amber-100 text-amber-700' : ''}
                      ${report.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${report.status === 'processing' ? 'bg-blue-100 text-blue-700' : ''}
                    `}>
                      {report.status}
                    </span>
                    <span className="flex items-center text-[10px] text-slate-400">
                      <Clock size={10} className="mr-1" /> {report.time}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {report.title}
                  </h4>
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                    <MapPin size={12} className="mr-1" />
                    {report.location}
                  </div>
                </div>
              ))}

              <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-700">
                <button className="w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors">
                  আরও লোড করুন <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};