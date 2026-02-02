
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { 
  Landmark, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  Filter, 
  Shield,
  Users,
  Activity,
  ArrowLeftRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface MinistryData {
  id: string;
  rank: number;
  nameEn: string;
  nameBn: string;
  integrityScore: number;
  complaints: number;
  avgDelayDays: number;
  budgetOverrunPct: number;
  trustScore: number;
  trendData: { year: string; score: number }[];
}

const MOCK_MINISTRIES: MinistryData[] = [
  {
    id: 'm1',
    rank: 1,
    nameEn: 'Ministry of ICT',
    nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি বিভাগ',
    integrityScore: 92,
    complaints: 120,
    avgDelayDays: 5,
    budgetOverrunPct: 2,
    trustScore: 88,
    trendData: [{ year: '2020', score: 70 }, { year: '2021', score: 75 }, { year: '2022', score: 82 }, { year: '2023', score: 88 }, { year: '2024', score: 92 }]
  },
  {
    id: 'm2',
    rank: 2,
    nameEn: 'Ministry of Agriculture',
    nameBn: 'কৃষি মন্ত্রণালয়',
    integrityScore: 85,
    complaints: 450,
    avgDelayDays: 12,
    budgetOverrunPct: 5,
    trustScore: 82,
    trendData: [{ year: '2020', score: 78 }, { year: '2021', score: 80 }, { year: '2022', score: 79 }, { year: '2023', score: 83 }, { year: '2024', score: 85 }]
  },
  {
    id: 'm3',
    rank: 3,
    nameEn: 'Ministry of Power & Energy',
    nameBn: 'বিদ্যুৎ, জ্বালানি ও খনিজ সম্পদ মন্ত্রণালয়',
    integrityScore: 78,
    complaints: 1200,
    avgDelayDays: 8,
    budgetOverrunPct: 15,
    trustScore: 75,
    trendData: [{ year: '2020', score: 65 }, { year: '2021', score: 68 }, { year: '2022', score: 72 }, { year: '2023', score: 75 }, { year: '2024', score: 78 }]
  },
  {
    id: 'm4',
    rank: 4,
    nameEn: 'Ministry of Education',
    nameBn: 'শিক্ষা মন্ত্রণালয়',
    integrityScore: 74,
    complaints: 3500,
    avgDelayDays: 25,
    budgetOverrunPct: 8,
    trustScore: 70,
    trendData: [{ year: '2020', score: 60 }, { year: '2021', score: 62 }, { year: '2022', score: 68 }, { year: '2023', score: 71 }, { year: '2024', score: 74 }]
  },
  {
    id: 'm5',
    rank: 5,
    nameEn: 'Ministry of Finance',
    nameBn: 'অর্থ মন্ত্রণালয়',
    integrityScore: 70,
    complaints: 800,
    avgDelayDays: 15,
    budgetOverrunPct: 0,
    trustScore: 68,
    trendData: [{ year: '2020', score: 75 }, { year: '2021', score: 74 }, { year: '2022', score: 72 }, { year: '2023', score: 71 }, { year: '2024', score: 70 }]
  },
  {
    id: 'm6',
    rank: 6,
    nameEn: 'Ministry of Local Govt (LGRD)',
    nameBn: 'স্থানীয় সরকার বিভাগ',
    integrityScore: 65,
    complaints: 5600,
    avgDelayDays: 45,
    budgetOverrunPct: 22,
    trustScore: 55,
    trendData: [{ year: '2020', score: 55 }, { year: '2021', score: 58 }, { year: '2022', score: 60 }, { year: '2023', score: 63 }, { year: '2024', score: 65 }]
  },
  {
    id: 'm7',
    rank: 7,
    nameEn: 'Ministry of Health',
    nameBn: 'স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রণালয়',
    integrityScore: 58,
    complaints: 8900,
    avgDelayDays: 30,
    budgetOverrunPct: 18,
    trustScore: 48,
    trendData: [{ year: '2020', score: 45 }, { year: '2021', score: 48 }, { year: '2022', score: 52 }, { year: '2023', score: 55 }, { year: '2024', score: 58 }]
  },
  {
    id: 'm8',
    rank: 8,
    nameEn: 'Ministry of Commerce',
    nameBn: 'বাণিজ্য মন্ত্রণালয়',
    integrityScore: 52,
    complaints: 2300,
    avgDelayDays: 20,
    budgetOverrunPct: 10,
    trustScore: 45,
    trendData: [{ year: '2020', score: 60 }, { year: '2021', score: 58 }, { year: '2022', score: 55 }, { year: '2023', score: 53 }, { year: '2024', score: 52 }]
  },
  {
    id: 'm9',
    rank: 9,
    nameEn: 'Ministry of Road Transport',
    nameBn: 'সড়ক পরিবহন ও সেতু মন্ত্রণালয়',
    integrityScore: 48,
    complaints: 6700,
    avgDelayDays: 90,
    budgetOverrunPct: 45,
    trustScore: 40,
    trendData: [{ year: '2020', score: 35 }, { year: '2021', score: 38 }, { year: '2022', score: 42 }, { year: '2023', score: 45 }, { year: '2024', score: 48 }]
  },
  {
    id: 'm10',
    rank: 10,
    nameEn: 'Ministry of Railways',
    nameBn: 'রেলপথ মন্ত্রণালয়',
    integrityScore: 45,
    complaints: 4100,
    avgDelayDays: 60,
    budgetOverrunPct: 35,
    trustScore: 38,
    trendData: [{ year: '2020', score: 30 }, { year: '2021', score: 35 }, { year: '2022', score: 38 }, { year: '2023', score: 40 }, { year: '2024', score: 45 }]
  }
];

export const MinistryTransparency: React.FC = () => {
  const { t, language } = useApp();
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMinistryFilter, setSelectedMinistryFilter] = useState('all');
  const [compareMode, setCompareMode] = useState(false);
  const [compareSelection, setCompareSelection] = useState<string[]>([MOCK_MINISTRIES[0].id, MOCK_MINISTRIES[1].id]);

  const filteredMinistries = selectedMinistryFilter === 'all' 
    ? MOCK_MINISTRIES 
    : MOCK_MINISTRIES.filter(m => m.id === selectedMinistryFilter);

  // Averages for Summary Cards
  const avgIntegrity = Math.round(MOCK_MINISTRIES.reduce((acc, m) => acc + m.integrityScore, 0) / MOCK_MINISTRIES.length);
  const totalComplaints = MOCK_MINISTRIES.reduce((acc, m) => acc + m.complaints, 0);
  const avgDelay = Math.round(MOCK_MINISTRIES.reduce((acc, m) => acc + m.avgDelayDays, 0) / MOCK_MINISTRIES.length);
  const avgOverrun = Math.round(MOCK_MINISTRIES.reduce((acc, m) => acc + m.budgetOverrunPct, 0) / MOCK_MINISTRIES.length);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getMinData = (id: string) => MOCK_MINISTRIES.find(m => m.id === id);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* 1) Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Landmark className="text-emerald-500" />
            {t('ministryTransparency')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {language === 'bn' 
              ? 'সরকারি মন্ত্রণালয়গুলোর স্বচ্ছতা, জবাবদিহিতা এবং কর্মক্ষমতার তুলনামূলক চিত্র' 
              : 'Comparative analysis of transparency, accountability, and performance of government ministries'}
          </p>
        </div>
        
        <GlassCard className="p-3 flex gap-3 items-center bg-white dark:bg-slate-900/80" noPadding>
           <div className="flex items-center gap-2 px-3 text-slate-400 border-r border-slate-200 dark:border-slate-700">
             <Filter size={16} />
           </div>
           <select 
             className="bg-transparent text-slate-600 dark:text-slate-300 text-sm outline-none cursor-pointer font-medium"
             value={selectedYear}
             onChange={(e) => setSelectedYear(e.target.value)}
           >
             <option value="2024">2024</option>
             <option value="2023">2023</option>
             <option value="2022">2022</option>
           </select>
           <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
           <select 
             className="bg-transparent text-slate-600 dark:text-slate-300 text-sm outline-none cursor-pointer font-medium max-w-[150px] truncate"
             value={selectedMinistryFilter}
             onChange={(e) => setSelectedMinistryFilter(e.target.value)}
           >
             <option value="all">{language === 'bn' ? 'সব মন্ত্রণালয়' : 'All Ministries'}</option>
             {MOCK_MINISTRIES.map(m => (
               <option key={m.id} value={m.id}>{language === 'bn' ? m.nameBn : m.nameEn}</option>
             ))}
           </select>
        </GlassCard>
      </div>

      {/* 2) Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <Shield size={20} />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase">{t('overallScore')}</span>
          </div>
          <div>
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{avgIntegrity}%</span>
            <div className="flex items-center text-xs font-bold text-emerald-500 mt-1">
               <TrendingUp size={12} className="mr-1" /> +3.2%
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <AlertCircle size={20} />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase">{t('complaintsCount')}</span>
          </div>
          <div>
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{totalComplaints.toLocaleString()}</span>
            <div className="flex items-center text-xs font-bold text-red-500 mt-1">
               <TrendingUp size={12} className="mr-1" /> +12% vs last year
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Clock size={20} />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase">{t('avgDelay')}</span>
          </div>
          <div>
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{avgDelay} Days</span>
            <div className="flex items-center text-xs font-bold text-emerald-500 mt-1">
               <TrendingUp size={12} className="mr-1 rotate-180" /> -2 days improvement
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <DollarSign size={20} />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase">{t('budgetOverrun')}</span>
          </div>
          <div>
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{avgOverrun}%</span>
            <div className="flex items-center text-xs font-bold text-slate-400 mt-1">
               Avg across all projects
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 3) Ranking Table (Left - 7 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <GlassCard className="flex flex-col h-full" noPadding>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
               <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                 <Activity size={18} className="text-blue-500" />
                 Performance Ranking
               </h3>
               <button 
                 onClick={() => setCompareMode(!compareMode)}
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${compareMode ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
               >
                 <ArrowLeftRight size={14} /> {t('compareMinistries')}
               </button>
            </div>
            
            {!compareMode ? (
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">
                      <th className="p-4 w-16 text-center">{t('rank')}</th>
                      <th className="p-4">{t('ministry')}</th>
                      <th className="p-4 text-center">{t('overallScore')}</th>
                      <th className="p-4 text-center hidden sm:table-cell">{t('avgDelay')}</th>
                      <th className="p-4 text-center hidden md:table-cell">{t('budgetOverrun')}</th>
                      <th className="p-4 text-center hidden lg:table-cell">{t('citizenTrust')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700/50">
                    {filteredMinistries.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="p-4 text-center font-bold text-slate-400">#{m.rank}</td>
                        <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                          {language === 'bn' ? m.nameBn : m.nameEn}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 ${getScoreColor(m.integrityScore)}`}>
                            {m.integrityScore}%
                          </span>
                        </td>
                        <td className="p-4 text-center font-medium text-slate-600 dark:text-slate-400 hidden sm:table-cell">
                          {m.avgDelayDays}d
                        </td>
                        <td className="p-4 text-center font-medium hidden md:table-cell">
                          <span className={`${m.budgetOverrunPct > 15 ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'}`}>
                            +{m.budgetOverrunPct}%
                          </span>
                        </td>
                        <td className="p-4 text-center hidden lg:table-cell">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${getScoreColor(m.trustScore).replace('text-', 'bg-')}`} 
                                style={{ width: `${m.trustScore}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-500">{m.trustScore}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 p-6 animate-fade-in">
                 <div className="grid grid-cols-2 gap-6 mb-8">
                    {[0, 1].map(index => (
                      <div key={index}>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t('selectMinistry')} {index + 1}</label>
                        <select 
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                          value={compareSelection[index]}
                          onChange={(e) => {
                            const newSel = [...compareSelection];
                            newSel[index] = e.target.value;
                            setCompareSelection(newSel);
                          }}
                        >
                          {MOCK_MINISTRIES.map(m => (
                            <option key={m.id} value={m.id}>{language === 'bn' ? m.nameBn : m.nameEn}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                 </div>

                 {/* Comparison Stats */}
                 <div className="grid grid-cols-3 gap-y-6 gap-x-2 text-center items-center">
                    {/* Headers */}
                    <div className="text-xs text-slate-400 font-mono">{getMinData(compareSelection[0])?.id}</div>
                    <div className="text-xs font-bold uppercase text-slate-500">Metric</div>
                    <div className="text-xs text-slate-400 font-mono">{getMinData(compareSelection[1])?.id}</div>

                    {/* Integrity */}
                    <div className={`text-xl font-bold ${getScoreColor(getMinData(compareSelection[0])?.integrityScore || 0)}`}>
                      {getMinData(compareSelection[0])?.integrityScore}%
                    </div>
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 py-1 rounded">{t('overallScore')}</div>
                    <div className={`text-xl font-bold ${getScoreColor(getMinData(compareSelection[1])?.integrityScore || 0)}`}>
                      {getMinData(compareSelection[1])?.integrityScore}%
                    </div>

                    {/* Delay */}
                    <div className="text-lg font-bold text-slate-700 dark:text-slate-200">
                      {getMinData(compareSelection[0])?.avgDelayDays} days
                    </div>
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 py-1 rounded">{t('avgDelay')}</div>
                    <div className="text-lg font-bold text-slate-700 dark:text-slate-200">
                      {getMinData(compareSelection[1])?.avgDelayDays} days
                    </div>

                    {/* Budget */}
                    <div className={`text-lg font-bold ${getMinData(compareSelection[0])!.budgetOverrunPct > 15 ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
                      +{getMinData(compareSelection[0])?.budgetOverrunPct}%
                    </div>
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 py-1 rounded">{t('budgetOverrun')}</div>
                    <div className={`text-lg font-bold ${getMinData(compareSelection[1])!.budgetOverrunPct > 15 ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
                      +{getMinData(compareSelection[1])?.budgetOverrunPct}%
                    </div>
                 </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Column: Charts (5 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Trend Chart - FIXED HEIGHT */}
          <GlassCard className="h-[280px] flex flex-col">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                 <TrendingUp size={16} className="text-emerald-500" /> Integrity Trend
               </h3>
               <div className="flex items-center gap-2 text-[10px] text-slate-500">
                 <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Top 3 Avg
               </div>
             </div>
             
             <div className="flex-1 w-full text-xs min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_MINISTRIES[0].trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} opacity={0.5} />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '10px' }}
                    />
                    {/* Just visualising top 3 for demo to avoid clutter */}
                    <Line type="monotone" data={MOCK_MINISTRIES[0].trendData} dataKey="score" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" data={MOCK_MINISTRIES[1].trendData} dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={false} strokeOpacity={0.7} />
                    <Line type="monotone" data={MOCK_MINISTRIES[3].trendData} dataKey="score" stroke="#f59e0b" strokeWidth={2} dot={false} strokeOpacity={0.5} />
                  </LineChart>
                </ResponsiveContainer>
             </div>
          </GlassCard>

          {/* Trust vs Budget Scatter/Bar - FIXED HEIGHT */}
          <GlassCard className="h-[250px] flex flex-col">
             <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
               <Users size={16} className="text-purple-500" /> Trust vs Complaints
             </h3>
             <div className="flex-1 w-full text-xs min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={MOCK_MINISTRIES.slice(0, 5)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" opacity={0.5} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="id" type="category" width={40} tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '10px' }}
                    />
                    <Bar dataKey="trustScore" name="Trust %" barSize={12} radius={[0, 4, 4, 0]}>
                      {MOCK_MINISTRIES.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.trustScore > 75 ? '#8b5cf6' : '#64748b'} />
                      ))}
                    </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};
