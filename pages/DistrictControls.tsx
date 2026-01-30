import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { FollowButton } from '../components/FollowButton';
import { 
  Settings, 
  Map, 
  TrendingUp, 
  RotateCcw, 
  Save, 
  Upload, 
  ShieldAlert, 
  Sliders, 
  Activity, 
  ArrowRight,
  Database
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  ReferenceLine
} from 'recharts';

// --- Types & Mock Data ---

interface DistrictScoreProfile {
  id: string;
  name: string;
  nameBn: string;
  scores: {
    overall: number;
    health: number;
    roads: number;
    education: number;
    water: number;
  };
  metrics: {
    complaints: number;
    resolutionTime: number; // hours
    activeVolunteers: number;
    auditIssues: number;
  };
}

const DISTRICTS: DistrictScoreProfile[] = [
  {
    id: 'dhaka',
    name: 'Dhaka',
    nameBn: 'ঢাকা',
    scores: { overall: 45, health: 50, roads: 30, education: 60, water: 40 },
    metrics: { complaints: 12500, resolutionTime: 48, activeVolunteers: 5000, auditIssues: 120 }
  },
  {
    id: 'chittagong',
    name: 'Chittagong',
    nameBn: 'চট্টগ্রাম',
    scores: { overall: 58, health: 55, roads: 45, education: 65, water: 60 },
    metrics: { complaints: 8000, resolutionTime: 36, activeVolunteers: 3200, auditIssues: 80 }
  },
  {
    id: 'sylhet',
    name: 'Sylhet',
    nameBn: 'সিলেট',
    scores: { overall: 85, health: 80, roads: 85, education: 90, water: 88 },
    metrics: { complaints: 1200, resolutionTime: 12, activeVolunteers: 1500, auditIssues: 10 }
  },
  {
    id: 'khulna',
    name: 'Khulna',
    nameBn: 'খুলনা',
    scores: { overall: 74, health: 70, roads: 75, education: 72, water: 80 },
    metrics: { complaints: 3000, resolutionTime: 24, activeVolunteers: 2000, auditIssues: 25 }
  }
];

interface Weights {
  complaint: number; // 0-100
  resolution: number; // 0-100
  volunteer: number; // 0-100
  audit: number; // 0-100
}

const DEFAULT_WEIGHTS: Weights = {
  complaint: 50,
  resolution: 50,
  volunteer: 50,
  audit: 50
};

export const DistrictControls: React.FC = () => {
  const { t, language } = useApp();
  const [selectedId, setSelectedId] = useState<string>('dhaka');
  const [weights, setWeights] = useState<Weights>({ ...DEFAULT_WEIGHTS });
  const [simulatedScores, setSimulatedScores] = useState<DistrictScoreProfile['scores'] | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const selectedDistrict = DISTRICTS.find(d => d.id === selectedId) || DISTRICTS[0];

  // Simulation Effect
  useEffect(() => {
    // Simple simulation logic:
    // Increasing 'complaint' weight penalizes score if complaints are high.
    // Increasing 'resolution' weight penalizes score if resolution time is high.
    // Increasing 'volunteer' weight boosts score if volunteers are high.
    // Increasing 'audit' weight penalizes score drastically if audit issues exist.

    const base = selectedDistrict.scores;
    const m = selectedDistrict.metrics;

    // Normalizing factors (arbitrary for mock)
    const complaintFactor = (m.complaints / 10000) * (weights.complaint - 50) * 0.2; // Penalty
    const resolutionFactor = (m.resolutionTime / 24) * (weights.resolution - 50) * 0.15; // Penalty
    const volunteerFactor = (m.activeVolunteers / 2000) * (weights.volunteer - 50) * 0.1; // Bonus
    const auditFactor = (m.auditIssues / 50) * (weights.audit - 50) * 0.3; // Penalty

    const delta = volunteerFactor - complaintFactor - resolutionFactor - auditFactor;

    const newScores = {
      overall: Math.min(100, Math.max(0, base.overall + delta)),
      health: Math.min(100, Math.max(0, base.health + delta * 0.8)),
      roads: Math.min(100, Math.max(0, base.roads + delta * 1.2)), // Roads sensitive to complaints
      education: Math.min(100, Math.max(0, base.education + delta * 0.5)),
      water: Math.min(100, Math.max(0, base.water + delta * 0.9)),
    };

    setSimulatedScores(newScores);
    
    // Check dirtiness
    const isChanged = Object.keys(DEFAULT_WEIGHTS).some(
      (k) => weights[k as keyof Weights] !== DEFAULT_WEIGHTS[k as keyof Weights]
    );
    setIsDirty(isChanged);

  }, [weights, selectedDistrict]);

  const handleWeightChange = (key: keyof Weights, val: number) => {
    setWeights(prev => ({ ...prev, [key]: val }));
  };

  const handleReset = () => {
    setWeights({ ...DEFAULT_WEIGHTS });
  };

  // Chart Data Preparation
  const comparisonData = [
    { name: 'Overall', current: selectedDistrict.scores.overall, simulated: Math.round(simulatedScores?.overall || 0) },
    { name: 'Health', current: selectedDistrict.scores.health, simulated: Math.round(simulatedScores?.health || 0) },
    { name: 'Roads', current: selectedDistrict.scores.roads, simulated: Math.round(simulatedScores?.roads || 0) },
    { name: 'Edu', current: selectedDistrict.scores.education, simulated: Math.round(simulatedScores?.education || 0) },
    { name: 'Water', current: selectedDistrict.scores.water, simulated: Math.round(simulatedScores?.water || 0) },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* 6) Audit Banner */}
      <div className="bg-slate-900 border-b border-slate-800 p-3 flex items-center justify-center gap-3 rounded-lg shadow-lg">
        <ShieldAlert size={18} className="text-amber-500 animate-pulse" />
        <span className="text-xs font-mono font-bold text-slate-300 tracking-wide uppercase">
          "সব পরিবর্তন লগ করা হবে এবং জনসম্মুখে প্রকাশযোগ্য।" (AUDIT LOG ENABLED)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        
        {/* LEFT COLUMN: Selector & Stats (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <GlassCard className="h-full flex flex-col" noPadding>
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">
                Target District
              </label>
              <div className="relative">
                <Map size={16} className="absolute left-3 top-3 text-slate-400" />
                <select 
                  value={selectedId}
                  onChange={(e) => {
                    setSelectedId(e.target.value);
                    handleReset();
                  }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                >
                  {DISTRICTS.map(d => (
                    <option key={d.id} value={d.id}>{language === 'bn' ? d.nameBn : d.name}</option>
                  ))}
                </select>
              </div>
              <div className="mt-3">
                <FollowButton 
                  id={selectedId} 
                  type="district" 
                  name={language === 'bn' ? selectedDistrict.nameBn : selectedDistrict.name} 
                  className="w-full justify-center"
                />
              </div>
            </div>

            <div className="p-5 flex-1 space-y-6">
               {/* Overall Badge */}
               <div className="text-center">
                 <p className="text-xs font-bold text-slate-400 uppercase">Current Integrity Score</p>
                 <div className={`text-5xl font-black mt-2 ${selectedDistrict.scores.overall >= 70 ? 'text-emerald-500' : selectedDistrict.scores.overall >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                   {selectedDistrict.scores.overall}%
                 </div>
               </div>

               {/* Metrics List */}
               <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                   <span className="text-slate-500">Active Complaints</span>
                   <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{selectedDistrict.metrics.complaints.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                   <span className="text-slate-500">Resolution Time</span>
                   <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{selectedDistrict.metrics.resolutionTime}h</span>
                 </div>
                 <div className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                   <span className="text-slate-500">Audit Flags</span>
                   <span className="font-mono font-bold text-red-500">{selectedDistrict.metrics.auditIssues}</span>
                 </div>
               </div>
            </div>
          </GlassCard>
        </div>

        {/* MIDDLE COLUMN: Controls (5 cols) */}
        <div className="lg:col-span-5">
          <GlassCard className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="text-slate-400" />
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Algorithm Calibration</h2>
            </div>

            <div className="space-y-8 flex-1">
              {/* Slider 1 */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Complaint Weight</label>
                  <span className="text-xs font-mono font-bold text-indigo-500">{weights.complaint}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={weights.complaint} 
                  onChange={(e) => handleWeightChange('complaint', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Impact: Higher weight increases penalty for unresolved complaints.</p>
              </div>

              {/* Slider 2 */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Resolution Speed Weight</label>
                  <span className="text-xs font-mono font-bold text-indigo-500">{weights.resolution}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={weights.resolution} 
                  onChange={(e) => handleWeightChange('resolution', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Impact: Higher weight rewards faster resolution times.</p>
              </div>

              {/* Slider 3 */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Volunteer Credit Weight</label>
                  <span className="text-xs font-mono font-bold text-indigo-500">{weights.volunteer}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={weights.volunteer} 
                  onChange={(e) => handleWeightChange('volunteer', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Impact: Boosts score based on citizen engagement levels.</p>
              </div>

              {/* Slider 4 */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Audit Severity Weight</label>
                  <span className="text-xs font-mono font-bold text-red-500">{weights.audit}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={weights.audit} 
                  onChange={(e) => handleWeightChange('audit', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Impact: Critical. High weight severely penalizes audit failures.</p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between">
               <button 
                 onClick={handleReset} 
                 disabled={!isDirty}
                 className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-50 transition-colors"
               >
                 <RotateCcw size={14} /> Revert
               </button>
               <button 
                 disabled={!isDirty}
                 className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-lg transition-all"
               >
                 <Save size={14} /> Save Draft
               </button>
            </div>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: Preview & Publish (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Chart */}
          <GlassCard className="flex flex-col h-[350px]">
             <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
               <Activity size={16} className="text-emerald-500" /> Score Simulation
             </h3>
             <div className="flex-1 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} layout="vertical" barGap={2} margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" width={50} tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '10px' }}
                    />
                    <Bar dataKey="current" fill="#64748b" radius={[0, 4, 4, 0]} name="Current" barSize={10} />
                    <Bar dataKey="simulated" fill="#10b981" radius={[0, 4, 4, 0]} name="Simulated" barSize={10}>
                      {comparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.simulated < entry.current ? '#ef4444' : '#10b981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
             
             {/* Key Difference Stat */}
             <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Projected Overall</span>
                <div className="flex items-center gap-2">
                   <span className="text-slate-400 line-through text-xs font-bold">{selectedDistrict.scores.overall}</span>
                   <ArrowRight size={12} className="text-slate-500" />
                   <span className={`text-lg font-black ${simulatedScores?.overall && simulatedScores.overall >= selectedDistrict.scores.overall ? 'text-emerald-500' : 'text-red-500'}`}>
                     {Math.round(simulatedScores?.overall || 0)}
                   </span>
                </div>
             </div>
          </GlassCard>

          {/* Publish Action */}
          <GlassCard className="bg-slate-900 border-slate-800">
             <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
               <Database size={16} className="text-blue-500" /> Commit Changes
             </h3>
             <p className="text-xs text-slate-400 mb-4 leading-relaxed">
               Publishing will update the live integrity index for this district immediately. All citizens will be notified of the policy shift.
             </p>
             <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all">
               <Upload size={16} /> Publish Update
             </button>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};