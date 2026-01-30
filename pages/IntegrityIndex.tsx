import React from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Shield, 
  Users, 
  Eye, 
  ArrowUpRight,
  Filter
} from 'lucide-react';

// --- MOCK DATA (15 Districts) ---

interface DistrictRank {
  rank: number;
  name: string;
  nameBn: string;
  score: number;
  volunteerism: number; // %
  avgResolutionDays: number;
  fairnessScore: number; // %
}

const DISTRICT_RANKS: DistrictRank[] = [
  { rank: 1, name: 'Sylhet', nameBn: 'সিলেট', score: 85, volunteerism: 78, avgResolutionDays: 3, fairnessScore: 82 },
  { rank: 2, name: 'Rangpur', nameBn: 'রংপুর', score: 82, volunteerism: 72, avgResolutionDays: 4, fairnessScore: 80 },
  { rank: 3, name: 'Barisal', nameBn: 'বরিশাল', score: 79, volunteerism: 68, avgResolutionDays: 5, fairnessScore: 78 },
  { rank: 4, name: 'Rajshahi', nameBn: 'রাজশাহী', score: 76, volunteerism: 65, avgResolutionDays: 5, fairnessScore: 75 },
  { rank: 5, name: 'Khulna', nameBn: 'খুলনা', score: 74, volunteerism: 70, avgResolutionDays: 6, fairnessScore: 73 },
  { rank: 6, name: 'Comilla', nameBn: 'কুমিল্লা', score: 72, volunteerism: 62, avgResolutionDays: 6, fairnessScore: 70 },
  { rank: 7, name: 'Mymensingh', nameBn: 'ময়মনসিংহ', score: 70, volunteerism: 58, avgResolutionDays: 7, fairnessScore: 68 },
  { rank: 8, name: 'Bogra', nameBn: 'বগুড়া', score: 68, volunteerism: 55, avgResolutionDays: 7, fairnessScore: 66 },
  { rank: 9, name: 'Dinajpur', nameBn: 'দিনাজপুর', score: 65, volunteerism: 54, avgResolutionDays: 8, fairnessScore: 65 },
  { rank: 10, name: 'Jessore', nameBn: 'যশোর', score: 62, volunteerism: 50, avgResolutionDays: 9, fairnessScore: 62 },
  { rank: 11, name: 'Chittagong', nameBn: 'চট্টগ্রাম', score: 58, volunteerism: 48, avgResolutionDays: 10, fairnessScore: 55 },
  { rank: 12, name: 'Gazipur', nameBn: 'গাজীপুর', score: 55, volunteerism: 45, avgResolutionDays: 12, fairnessScore: 52 },
  { rank: 13, name: 'Cox\'s Bazar', nameBn: 'কক্সবাজার', score: 52, volunteerism: 42, avgResolutionDays: 14, fairnessScore: 50 },
  { rank: 14, name: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ', score: 48, volunteerism: 38, avgResolutionDays: 15, fairnessScore: 45 },
  { rank: 15, name: 'Dhaka', nameBn: 'ঢাকা', score: 45, volunteerism: 35, avgResolutionDays: 18, fairnessScore: 40 },
];

const TREND_DATA = [
  { year: '2020', score: 58 },
  { year: '2021', score: 61 },
  { year: '2022', score: 63 },
  { year: '2023', score: 66 },
  { year: '2024', score: 68 },
];

// Civic Health Data for Radial Charts
const CIVIC_HEALTH = [
  { name: 'Solidarity', value: 75, color: '#10b981' },
  { name: 'Transparency', value: 62, color: '#3b82f6' },
  { name: 'Trust', value: 58, color: '#8b5cf6' },
];

export const IntegrityIndex: React.FC = () => {
  const { t, language } = useApp();

  const nationalAvg = Math.round(DISTRICT_RANKS.reduce((acc, curr) => acc + curr.score, 0) / DISTRICT_RANKS.length);
  const highest = DISTRICT_RANKS[0];
  const lowest = DISTRICT_RANKS[DISTRICT_RANKS.length - 1];

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      
      {/* 1) Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Award className="text-emerald-500" />
            {t('integrityTitle')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {language === 'bn' 
              ? 'সারাদেশের সুশাসন, স্বচ্ছতা ও নাগরিক আস্থার সামগ্রিক চিত্র' 
              : 'Comprehensive overview of governance, transparency, and public trust'}
          </p>
        </div>
        
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
             <Filter size={16} /> Filter: 2024
           </button>
        </div>
      </div>

      {/* 2) Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <Activity size={20} />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase">{t('nationalAvg')}</span>
          </div>
          <div>
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{nationalAvg}%</span>
            <div className="flex items-center text-xs font-bold text-emerald-500 mt-1">
               <TrendingUp size={12} className="mr-1" /> +2.5%
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <Award size={20} />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase">{t('highestRanked')}</span>
          </div>
          <div>
            <span className="text-xl font-bold text-slate-800 dark:text-slate-100 truncate">
              {language === 'bn' ? highest.nameBn : highest.name}
            </span>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
               {highest.score}% Score
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between border-l-4 border-l-red-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <TrendingDown size={20} />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase">{t('lowestRanked')}</span>
          </div>
          <div>
            <span className="text-xl font-bold text-slate-800 dark:text-slate-100 truncate">
              {language === 'bn' ? lowest.nameBn : lowest.name}
            </span>
            <div className="text-sm font-bold text-red-600 dark:text-red-400">
               {lowest.score}% Score
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between">
           <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold text-slate-500 uppercase">{t('trendAnalysis')}</span>
             <ArrowUpRight size={16} className="text-emerald-500" />
           </div>
           <div className="h-16 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={TREND_DATA}>
                 <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={false} />
               </LineChart>
             </ResponsiveContainer>
           </div>
           <p className="text-[10px] text-slate-400 text-right mt-1">5 Year Trajectory</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3) District Ranking Table */}
        <div className="lg:col-span-2">
          <GlassCard className="h-full flex flex-col" noPadding>
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
               <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                 {t('districtInsights')}
               </h3>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">
                    <th className="p-4">{t('rank')}</th>
                    <th className="p-4">{t('district')}</th>
                    <th className="p-4 text-center">{t('score')}</th>
                    <th className="p-4 text-center hidden sm:table-cell">{t('volunteerism')}</th>
                    <th className="p-4 text-center hidden sm:table-cell">{t('resolutionTime')}</th>
                    <th className="p-4 text-center hidden md:table-cell">{t('fairnessPerception')}</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700/50">
                  {DISTRICT_RANKS.map((district) => (
                    <tr key={district.rank} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-bold text-slate-400">#{district.rank}</td>
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                        {language === 'bn' ? district.nameBn : district.name}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                          district.score >= 75 ? 'bg-emerald-100 text-emerald-700' :
                          district.score >= 60 ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {district.score}%
                        </span>
                      </td>
                      <td className="p-4 text-center font-medium text-slate-600 dark:text-slate-400 hidden sm:table-cell">
                        {district.volunteerism}%
                      </td>
                      <td className="p-4 text-center font-medium text-slate-600 dark:text-slate-400 hidden sm:table-cell">
                        {district.avgResolutionDays} {t('days')}
                      </td>
                      <td className="p-4 text-center hidden md:table-cell">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 max-w-[80px] mx-auto overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${district.fairnessScore >= 70 ? 'bg-blue-500' : 'bg-slate-400'}`} 
                            style={{ width: `${district.fairnessScore}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Civic Health & Charts */}
        <div className="space-y-6">
          
          {/* 5) Civic Health Panel */}
          <GlassCard>
             <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
               <Activity className="text-purple-500" size={18} />
               {t('civicHealth')}
             </h3>
             
             <div className="grid grid-cols-1 gap-6">
                {/* Solidarity */}
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                       <Users size={18} />
                     </div>
                     <div>
                       <p className="text-xs font-bold text-slate-500 uppercase">{t('communitySolidarity')}</p>
                       <p className="text-lg font-bold text-slate-800 dark:text-slate-100">75%</p>
                     </div>
                   </div>
                   <div className="h-12 w-12">
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie data={[{value: 75}, {value: 25}]} innerRadius={15} outerRadius={24} dataKey="value" startAngle={90} endAngle={-270}>
                           <Cell fill="#10b981" />
                           <Cell fill="#e2e8f0" />
                         </Pie>
                       </PieChart>
                     </ResponsiveContainer>
                   </div>
                </div>

                {/* Transparency */}
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                       <Eye size={18} />
                     </div>
                     <div>
                       <p className="text-xs font-bold text-slate-500 uppercase">{t('transparency')}</p>
                       <p className="text-lg font-bold text-slate-800 dark:text-slate-100">62%</p>
                     </div>
                   </div>
                   <div className="h-12 w-12">
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie data={[{value: 62}, {value: 38}]} innerRadius={15} outerRadius={24} dataKey="value" startAngle={90} endAngle={-270}>
                           <Cell fill="#3b82f6" />
                           <Cell fill="#e2e8f0" />
                         </Pie>
                       </PieChart>
                     </ResponsiveContainer>
                   </div>
                </div>

                {/* Trust */}
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                       <Shield size={18} />
                     </div>
                     <div>
                       <p className="text-xs font-bold text-slate-500 uppercase">{t('publicTrust')}</p>
                       <p className="text-lg font-bold text-slate-800 dark:text-slate-100">58%</p>
                     </div>
                   </div>
                   <div className="h-12 w-12">
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie data={[{value: 58}, {value: 42}]} innerRadius={15} outerRadius={24} dataKey="value" startAngle={90} endAngle={-270}>
                           <Cell fill="#8b5cf6" />
                           <Cell fill="#e2e8f0" />
                         </Pie>
                       </PieChart>
                     </ResponsiveContainer>
                   </div>
                </div>
             </div>
          </GlassCard>

          {/* 4) Expanded Trend Chart */}
          <GlassCard className="h-64">
             <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-4">
               {t('trendAnalysis')} (National)
             </h3>
             <div className="h-full w-full -ml-2">
               <ResponsiveContainer width="100%" height="80%">
                 <LineChart data={TREND_DATA}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} opacity={0.5} />
                   <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                   <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} domain={[0, 100]} />
                   <Tooltip 
                     contentStyle={{ borderRadius: '8px', border: 'none', background: '#1e293b', color: '#fff', fontSize: '12px' }}
                   />
                   <Line 
                     type="monotone" 
                     dataKey="score" 
                     stroke="#10b981" 
                     strokeWidth={3} 
                     dot={{r: 4, strokeWidth: 0, fill: '#10b981'}} 
                     activeDot={{r: 6}}
                   />
                 </LineChart>
               </ResponsiveContainer>
             </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};