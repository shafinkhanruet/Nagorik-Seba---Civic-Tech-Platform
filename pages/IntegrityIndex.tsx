import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  ArrowRight,
  Activity,
  Award,
  AlertOctagon
} from 'lucide-react';

// --- MOCK DATA ---

interface DistrictData {
  id: string;
  name: string;
  nameBn: string;
  score: number;
  trend: 'up' | 'down';
  trendValue: number;
  riskSector: string;
  riskSectorBn: string;
  solvedCases: number;
  path: string; // SVG Path
}

// Simplified Paths for Divisions acting as major regions
const BANGLADESH_DIVISIONS: DistrictData[] = [
  { 
    id: 'rangpur', name: 'Rangpur', nameBn: 'রংপুর', score: 72, trend: 'up', trendValue: 4.2, riskSector: 'Agriculture', riskSectorBn: 'কৃষি', solvedCases: 420,
    path: "M 40,10 L 80,10 L 90,30 L 70,50 L 30,40 Z" 
  },
  { 
    id: 'rajshahi', name: 'Rajshahi', nameBn: 'রাজশাহী', score: 65, trend: 'up', trendValue: 1.5, riskSector: 'Education', riskSectorBn: 'শিক্ষা', solvedCases: 550,
    path: "M 30,40 L 70,50 L 75,90 L 20,80 L 20,50 Z" 
  },
  { 
    id: 'mymensingh', name: 'Mymensingh', nameBn: 'ময়মনসিংহ', score: 58, trend: 'down', trendValue: 2.1, riskSector: 'Health', riskSectorBn: 'স্বাস্থ্য', solvedCases: 310,
    path: "M 80,10 L 120,20 L 110,60 L 70,50 Z" 
  },
  { 
    id: 'sylhet', name: 'Sylhet', nameBn: 'সিলেট', score: 82, trend: 'up', trendValue: 6.5, riskSector: 'Environment', riskSectorBn: 'পরিবেশ', solvedCases: 620,
    path: "M 120,20 L 160,30 L 150,70 L 110,60 Z" 
  },
  { 
    id: 'dhaka', name: 'Dhaka', nameBn: 'ঢাকা', score: 45, trend: 'down', trendValue: 5.4, riskSector: 'Transport', riskSectorBn: 'পরিবহন', solvedCases: 1540,
    path: "M 70,50 L 110,60 L 100,100 L 60,90 Z" 
  },
  { 
    id: 'khulna', name: 'Khulna', nameBn: 'খুলনা', score: 68, trend: 'up', trendValue: 3.2, riskSector: 'Water', riskSectorBn: 'পানি', solvedCases: 480,
    path: "M 20,80 L 60,90 L 70,140 L 20,130 Z" 
  },
  { 
    id: 'barisal', name: 'Barisal', nameBn: 'বরিশাল', score: 75, trend: 'up', trendValue: 2.8, riskSector: 'Roads', riskSectorBn: 'সড়ক', solvedCases: 290,
    path: "M 60,90 L 100,100 L 90,140 L 70,140 Z" 
  },
  { 
    id: 'chittagong', name: 'Chittagong', nameBn: 'চট্টগ্রাম', score: 55, trend: 'down', trendValue: 1.8, riskSector: 'Port', riskSectorBn: 'বন্দর', solvedCases: 980,
    path: "M 100,100 L 150,70 L 170,130 L 120,160 L 90,140 Z" 
  },
];

const TREND_DATA = [
  { year: '2019', score: 52 },
  { year: '2020', score: 54 },
  { year: '2021', score: 51 },
  { year: '2022', score: 58 },
  { year: '2023', score: 62 },
];

const SECTOR_DATA = [
  { name: 'Health', value: 45, color: '#ef4444' },
  { name: 'Education', value: 65, color: '#f59e0b' },
  { name: 'Roads', value: 55, color: '#f97316' },
  { name: 'Water', value: 75, color: '#10b981' },
  { name: 'Power', value: 70, color: '#10b981' },
];

export const IntegrityIndex: React.FC = () => {
  const { t, language } = useApp();
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#10b981'; // Emerald
    if (score >= 50) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const nationalAvg = Math.round(BANGLADESH_DIVISIONS.reduce((acc, curr) => acc + curr.score, 0) / BANGLADESH_DIVISIONS.length);
  const topDistrict = BANGLADESH_DIVISIONS.reduce((prev, current) => (prev.score > current.score) ? prev : current);

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
              ? 'সারাদেশের সুশাসন ও সততা সূচকের বিশ্লেষণ চিত্র' 
              : 'Analysis of governance and integrity index across the country'}
          </p>
        </div>
        
        <div className="flex gap-2">
           <select className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500">
             <option>2023-2024</option>
             <option>2022-2023</option>
           </select>
           <select className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500">
             <option>{language === 'bn' ? 'সকল খাত' : 'All Sectors'}</option>
             <option>Health</option>
             <option>Education</option>
           </select>
        </div>
      </div>

      {/* 2) Stats Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* National Average */}
        <GlassCard className="flex items-center gap-4">
           <div className="relative w-16 h-16 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="32" cy="32" r="28" stroke="#e2e8f0" strokeWidth="4" fill="none" className="dark:stroke-slate-700" />
               <circle 
                 cx="32" cy="32" r="28" 
                 stroke={getScoreColor(nationalAvg)} 
                 strokeWidth="4" 
                 fill="none" 
                 strokeDasharray={`${(nationalAvg / 100) * 175} 175`}
                 className="transition-all duration-1000 ease-out"
               />
             </svg>
             <span className="absolute text-sm font-bold text-slate-700 dark:text-slate-200">{nationalAvg}%</span>
           </div>
           <div>
             <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase">{t('nationalAvg')}</h3>
             <p className="text-xs text-slate-400 mt-1">+2.4% from last year</p>
           </div>
        </GlassCard>

        {/* Top Performer */}
        <GlassCard className="flex items-center gap-4 border-l-4 border-l-emerald-500">
           <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full">
             <Activity size={24} />
           </div>
           <div>
             <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase">{t('topPerforming')}</h3>
             <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
               {language === 'bn' ? topDistrict.nameBn : topDistrict.name}
             </div>
             <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{topDistrict.score}% Score</p>
           </div>
        </GlassCard>

        {/* Critical Sector */}
        <GlassCard className="flex items-center gap-4 border-l-4 border-l-red-500">
           <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
             <AlertOctagon size={24} />
           </div>
           <div>
             <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase">{t('criticalSector')}</h3>
             <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
               {language === 'bn' ? 'পরিবহন' : 'Transport'}
             </div>
             <p className="text-xs text-red-500 font-semibold">High Corruption Risk</p>
           </div>
        </GlassCard>
      </div>

      {/* 3) Main Visuals: Map & Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Interactive Map Section */}
        <GlassCard className="bg-slate-50 dark:bg-slate-900/40 relative min-h-[400px] flex items-center justify-center">
           <div className="absolute top-4 left-4">
             <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-2">
               <MapPin size={14} /> Regional Integrity Map
             </h3>
           </div>
           
           <div className="w-full h-full flex items-center justify-center p-4">
             {/* Stylized SVG Map of Bangladesh Divisions */}
             <svg viewBox="0 0 200 180" className="w-full h-full max-w-md drop-shadow-xl">
               {BANGLADESH_DIVISIONS.map((district) => (
                 <g 
                   key={district.id}
                   onMouseEnter={() => setHoveredDistrict(district.id)}
                   onMouseLeave={() => setHoveredDistrict(null)}
                   className="transition-all duration-300 cursor-pointer hover:opacity-90"
                 >
                   <path 
                     d={district.path} 
                     fill={getScoreColor(district.score)} 
                     stroke="white" 
                     strokeWidth="1"
                     className="dark:stroke-slate-800"
                   />
                   {/* Label */}
                   {/* Simplified centroid calculation for label placement */}
                   <text 
                     x="0" y="0" 
                     className="text-[4px] fill-white font-bold pointer-events-none uppercase text-shadow"
                     style={{ transform: 'translate(0,0)' }} // Placeholder
                   />
                 </g>
               ))}
             </svg>
             
             {/* Hover Tooltip Overlay */}
             {hoveredDistrict && (
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur text-white p-3 rounded-xl shadow-2xl pointer-events-none z-10 animate-scale-in">
                 {(() => {
                   const d = BANGLADESH_DIVISIONS.find(x => x.id === hoveredDistrict)!;
                   return (
                     <>
                       <div className="text-lg font-bold mb-1">{language === 'bn' ? d.nameBn : d.name}</div>
                       <div className="flex items-center gap-2 mb-2">
                         <div className={`px-2 py-0.5 rounded text-xs font-bold ${d.score >= 50 ? 'bg-emerald-500' : 'bg-red-500'}`}>
                           {d.score}%
                         </div>
                         <span className="text-xs opacity-80 uppercase">Score</span>
                       </div>
                       <div className="text-xs opacity-70">
                         {t('solvedCases')}: {d.solvedCases}
                       </div>
                     </>
                   );
                 })()}
               </div>
             )}
           </div>

           {/* Map Legend */}
           <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-slate-800/80 p-2 rounded-lg backdrop-blur text-[10px] space-y-1 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#10b981]"></span> High Integrity (70+)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#f59e0b]"></span> Moderate (50-69)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#ef4444]"></span> Critical (&lt;50)
              </div>
           </div>
        </GlassCard>

        {/* Charts Section */}
        <div className="space-y-6">
          
          {/* Trend Chart */}
          <GlassCard className="h-[200px]">
             <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-4">
               {t('trendAnalysis')}
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

          {/* Sector Chart */}
          <GlassCard className="h-[200px]">
             <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-4">
               {t('sectorBreakdown')}
             </h3>
             <div className="h-full w-full -ml-2">
               <ResponsiveContainer width="100%" height="80%">
                 <BarChart data={SECTOR_DATA} layout="vertical">
                   <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                   <XAxis type="number" hide domain={[0, 100]} />
                   <YAxis dataKey="name" type="category" width={70} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                   <Tooltip 
                     cursor={{fill: 'transparent'}}
                     contentStyle={{ borderRadius: '8px', border: 'none', background: '#1e293b', color: '#fff', fontSize: '12px' }}
                   />
                   <Bar dataKey="value" barSize={12} radius={[0, 4, 4, 0]}>
                     {SECTOR_DATA.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </GlassCard>
        </div>
      </div>

      {/* 4) District Grid */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <TrendingUp className="text-slate-500" />
          {t('districtInsights')}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BANGLADESH_DIVISIONS.map((district) => (
            <GlassCard 
              key={district.id} 
              className={`transition-all duration-300 hover:shadow-lg border-t-4 ${
                district.score >= 70 ? 'border-t-emerald-500' : district.score >= 50 ? 'border-t-amber-500' : 'border-t-red-500'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                  {language === 'bn' ? district.nameBn : district.name}
                </h4>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                  district.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {district.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {district.trendValue}%
                </div>
              </div>

              <div className="flex items-end gap-2 mb-4">
                <span className={`text-3xl font-bold ${
                   district.score >= 70 ? 'text-emerald-500' : district.score >= 50 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {district.score}
                </span>
                <span className="text-xs text-slate-400 mb-1.5 uppercase font-semibold">Integrity Score</span>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">{t('riskFactor')}</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {language === 'bn' ? district.riskSectorBn : district.riskSector}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">{t('solvedCases')}</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{district.solvedCases}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

    </div>
  );
};