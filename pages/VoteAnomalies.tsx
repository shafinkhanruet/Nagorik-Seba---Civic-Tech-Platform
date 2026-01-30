import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { 
  AlertOctagon, 
  Activity, 
  Bot, 
  ShieldAlert, 
  Filter, 
  Calendar, 
  MapPin, 
  Zap, 
  Search,
  Eye,
  CornerDownRight,
  UserX
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  ReferenceLine
} from 'recharts';

// --- Mock Data ---

const TIME_SERIES_DATA = [
  { time: '10:00', votes: 45, baseline: 40 },
  { time: '10:10', votes: 52, baseline: 42 },
  { time: '10:20', votes: 48, baseline: 45 },
  { time: '10:30', votes: 350, baseline: 48, anomaly: true }, // Spike
  { time: '10:40', votes: 410, baseline: 50, anomaly: true },
  { time: '10:50', votes: 120, baseline: 52 },
  { time: '11:00', votes: 55, baseline: 55 },
  { time: '11:10', votes: 60, baseline: 53 },
  { time: '11:20', votes: 58, baseline: 50 },
];

interface Cluster {
  id: string;
  accountAgeAvg: string; // e.g., "2 days"
  geoConcentration: number; // %
  voteType: 'Support' | 'Reject';
  riskScore: number; // 0-100
  status: 'Active' | 'Dampened' | 'Banned';
  location: string;
}

const CLUSTERS: Cluster[] = [
  { id: 'CLS-9921', accountAgeAvg: '< 24 Hours', geoConcentration: 98, voteType: 'Support', riskScore: 95, status: 'Dampened', location: 'Uttara, Dhaka' },
  { id: 'CLS-9925', accountAgeAvg: '3 Days', geoConcentration: 85, voteType: 'Reject', riskScore: 78, status: 'Active', location: 'Muradpur, Chittagong' },
  { id: 'CLS-9930', accountAgeAvg: '1 Week', geoConcentration: 40, voteType: 'Support', riskScore: 45, status: 'Active', location: 'Sylhet Sadar' },
  { id: 'CLS-9932', accountAgeAvg: '< 1 Hour', geoConcentration: 92, voteType: 'Reject', riskScore: 92, status: 'Banned', location: 'Mirpur 10' },
];

export const VoteAnomalies: React.FC = () => {
  const { t, language } = useApp();
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  const getRiskColor = (score: number) => {
    if (score >= 90) return 'text-red-500 bg-red-500/10 border-red-500/30';
    if (score >= 70) return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* 1) Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <AlertOctagon className="text-red-500" />
            {t('admin_anomalies')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Real-time detection of coordinated inauthentic behavior (CIB).
          </p>
        </div>
        
        <GlassCard className="p-3 flex flex-wrap gap-3 items-center bg-slate-900/80" noPadding>
           <div className="flex items-center gap-2 px-3 text-slate-400 border-r border-slate-700">
             <Filter size={16} />
           </div>
           <div className="flex items-center gap-2 bg-slate-800 rounded px-2 py-1">
             <Calendar size={14} className="text-slate-400" />
             <span className="text-xs text-slate-300">Today</span>
           </div>
           <select className="bg-transparent text-slate-300 text-xs outline-none cursor-pointer border border-slate-700 rounded px-2 py-1">
             <option>Project: Meghna Bridge</option>
             <option>Project: IT Park</option>
           </select>
           <select className="bg-transparent text-slate-300 text-xs outline-none cursor-pointer border border-slate-700 rounded px-2 py-1">
             <option>Region: All</option>
             <option>Dhaka</option>
             <option>Chittagong</option>
           </select>
        </GlassCard>
      </div>

      {/* 2) Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="border-l-4 border-l-red-500 flex items-center justify-between">
           <div>
             <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Suspicious Clusters</p>
             <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">12</p>
           </div>
           <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
             <Activity size={24} />
           </div>
        </GlassCard>
        
        <GlassCard className="border-l-4 border-l-amber-500 flex items-center justify-between">
           <div>
             <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Votes Dampened</p>
             <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">452</p>
           </div>
           <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
             <UserX size={24} />
           </div>
        </GlassCard>

        <GlassCard className="border-l-4 border-l-purple-500 flex items-center justify-between">
           <div>
             <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Bot Risk Level</p>
             <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">HIGH</p>
           </div>
           <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400 animate-pulse">
             <Bot size={24} />
           </div>
        </GlassCard>

        <GlassCard className="border-l-4 border-l-blue-500 flex items-center justify-between">
           <div>
             <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Under Review</p>
             <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">5 Cases</p>
           </div>
           <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
             <ShieldAlert size={24} />
           </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3) Time Spike Chart & Geo Map */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Zap size={16} className="text-amber-500" /> Vote Velocity (Spike Detection)
              </h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-slate-500"></div> Baseline
                </span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div> Anomaly
                </span>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TIME_SERIES_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', background: '#1e293b', color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="baseline" stroke="#64748b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="votes" stroke="#ef4444" strokeWidth={2} dot={{r: 4, strokeWidth: 0, fill: '#ef4444'}} activeDot={{r: 6}} />
                  
                  {/* Highlight Anomaly Zone */}
                  <ReferenceLine x="10:30" stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Attack Start', fill: '#ef4444', fontSize: 10 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* 4) Geo Heatmap Placeholder */}
          <GlassCard className="relative overflow-hidden min-h-[300px] bg-slate-900 border-slate-800">
             <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur px-3 py-1 rounded border border-slate-800">
               <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                 <MapPin size={14} className="text-emerald-500" /> Geo-Concentration Heatmap
               </h3>
             </div>
             
             {/* Mock Map Visual */}
             <div className="absolute inset-0 flex items-center justify-center opacity-30">
                {/* Abstract Bangladesh Shape Mockup using SVG paths */}
                <svg viewBox="0 0 200 300" className="h-full w-auto fill-slate-700 stroke-slate-600">
                  <path d="M50,50 Q80,20 120,60 T150,150 Q120,250 80,280 T20,200 Q10,100 50,50 Z" />
                </svg>
             </div>

             {/* Hotspots */}
             <div className="absolute top-[40%] left-[45%]">
                <div className="w-16 h-16 rounded-full bg-red-500/20 animate-ping absolute"></div>
                <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-slate-900 relative z-10 flex items-center justify-center group cursor-pointer">
                   <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                     Dhaka (98% Cluster)
                   </div>
                </div>
             </div>

             <div className="absolute top-[60%] left-[70%]">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 animate-pulse absolute"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500 border-2 border-slate-900 relative z-10 group cursor-pointer">
                   <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                     Chittagong (Suspicious)
                   </div>
                </div>
             </div>
          </GlassCard>
        </div>

        {/* 5) Cluster Table & AI Panel (Right Column) */}
        <div className="space-y-6">
          
          {/* Cluster List */}
          <GlassCard className="flex flex-col h-[400px]" noPadding>
             <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
               <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Identified Clusters</h3>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
               {CLUSTERS.map((cluster) => (
                 <div 
                   key={cluster.id}
                   onClick={() => setSelectedCluster(cluster.id)}
                   className={`p-3 rounded-lg border cursor-pointer transition-all ${
                     selectedCluster === cluster.id 
                     ? 'bg-slate-800 border-slate-600 ring-1 ring-slate-500' 
                     : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                   }`}
                 >
                   <div className="flex justify-between items-start mb-2">
                     <span className="font-mono text-[10px] font-bold text-slate-500">{cluster.id}</span>
                     <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getRiskColor(cluster.riskScore)}`}>
                       Risk: {cluster.riskScore}%
                     </span>
                   </div>
                   <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 mb-2">
                     <div>
                       <span className="text-[10px] text-slate-500 block uppercase">Avg Age</span>
                       <span className="font-bold">{cluster.accountAgeAvg}</span>
                     </div>
                     <div>
                       <span className="text-[10px] text-slate-500 block uppercase">Geo Conc.</span>
                       <span className="font-bold">{cluster.geoConcentration}%</span>
                     </div>
                   </div>
                   <div className="flex justify-between items-center text-[10px]">
                      <span className={`px-2 py-0.5 rounded ${cluster.voteType === 'Support' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        Type: {cluster.voteType}
                      </span>
                      <span className="text-slate-400">{cluster.location}</span>
                   </div>
                 </div>
               ))}
             </div>
          </GlassCard>

          {/* 6) AI Explanation Panel */}
          <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-3 opacity-10">
               <Bot size={80} />
             </div>
             
             <div className="relative z-10">
               <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Bot size={16} /> AI Forensic Analysis
               </h4>
               
               {selectedCluster ? (
                 <div className="space-y-3 animate-fade-in">
                   <p className="text-sm text-slate-300 leading-relaxed">
                     <span className="text-indigo-400 font-bold">Cluster {selectedCluster}</span> shows clear signs of coordinated inauthentic behavior.
                   </p>
                   <div className="pl-3 border-l-2 border-indigo-500/50 space-y-2">
                     <p className="text-xs text-slate-400">
                       <CornerDownRight size={12} className="inline mr-1" />
                       98% of accounts created within the last 24 hours.
                     </p>
                     <p className="text-xs text-slate-400">
                       <CornerDownRight size={12} className="inline mr-1" />
                       Voting timestamps are synchronized within 5ms variance.
                     </p>
                     <p className="text-xs text-slate-400">
                       <CornerDownRight size={12} className="inline mr-1" />
                       Device fingerprints match known botnet signatures.
                     </p>
                   </div>
                   <div className="pt-2">
                     <p className="text-xs font-bold text-slate-300">Recommendation:</p>
                     <p className="text-xs text-red-400 font-mono mt-1">> PURGE VOTES & BAN ACCOUNTS</p>
                   </div>
                 </div>
               ) : (
                 <div className="text-center py-6 text-slate-500 text-xs">
                   Select a cluster to view detailed forensic analysis.
                 </div>
               )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};