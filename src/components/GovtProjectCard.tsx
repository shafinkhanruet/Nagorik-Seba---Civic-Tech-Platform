
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from './GlassCard';
import { InfoTooltip } from './InfoTooltip';
import { BudgetExecutionTracker, BudgetExecutionData } from './BudgetExecutionTracker';
import { FollowButton } from './FollowButton';
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  BarChart3,
  BrainCircuit,
  Settings,
  ShieldCheck,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';

export interface MaterialData {
  name: string;
  value: number; // in Crore
}

export interface GovtProjectData {
  id: string;
  name: string;
  location: string;
  ministry: string;
  status: 'active' | 'planning' | 'stalled';
  govtBudget: number; // in Crore
  baseAiEstimate: number; // in Crore
  baseDuration: number; // in Months
  materials: MaterialData[];
  aiExplanation: string;
  budgetData?: BudgetExecutionData;
}

interface GovtProjectCardProps {
  project: GovtProjectData;
}

export const GovtProjectCard: React.FC<GovtProjectCardProps> = ({ project }) => {
  const { t } = useApp();
  const [qualityLevel, setQualityLevel] = useState<'low' | 'standard' | 'high'>('standard');
  const [duration, setDuration] = useState(project.baseDuration);
  const [showTracker, setShowTracker] = useState(false);

  // Simulation Logic
  const simulation = useMemo(() => {
    let costMultiplier = 1;
    let durabilityText = '';
    let durabilityColor = '';

    // Quality Multiplier
    if (qualityLevel === 'low') {
      costMultiplier *= 0.85;
      durabilityText = '৫-৭ বছর (ঝুঁকিপূর্ণ)';
      durabilityColor = 'text-red-500';
    } else if (qualityLevel === 'high') {
      costMultiplier *= 1.30;
      durabilityText = '২০+ বছর (টেকসই)';
      durabilityColor = 'text-emerald-500';
    } else {
      durabilityText = '১০-১৫ বছর (আদর্শ)';
      durabilityColor = 'text-blue-500';
    }

    // Duration Multiplier (Faster = more expensive usually due to overtime/resources, Slower = inflation/overhead)
    // Simplified model: Optimal duration is base. +/- adds cost.
    const durationRatio = duration / project.baseDuration;
    if (durationRatio < 1) {
      // Rushed job increases cost
      costMultiplier += (1 - durationRatio) * 0.5;
    } else if (durationRatio > 1) {
      // Delayed job increases cost slightly
      costMultiplier += (durationRatio - 1) * 0.1; 
    }

    const estimatedCost = Math.round(project.baseAiEstimate * costMultiplier);
    
    // Determine Risk based on diff with Govt Budget
    const diffPercent = ((project.govtBudget - estimatedCost) / project.govtBudget) * 100;
    let riskLevel = 'Low';
    if (diffPercent > 20) riskLevel = 'High'; // Govt asking way more than needed
    else if (diffPercent < -20) riskLevel = 'High'; // Underbudgeting risk
    else if (Math.abs(diffPercent) > 10) riskLevel = 'Medium';

    return { estimatedCost, durabilityText, durabilityColor, riskLevel };
  }, [project, qualityLevel, duration]);

  const getRiskBadgeColor = (risk: string) => {
    switch(risk) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400';
    }
  };

  const statusColors = {
    active: 'bg-emerald-100 text-emerald-700',
    planning: 'bg-blue-100 text-blue-700',
    stalled: 'bg-red-100 text-red-700',
  };

  return (
    <GlassCard className="transition-all duration-300 hover:shadow-xl relative overflow-hidden group">
      {/* 1) Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 border-b border-slate-100 dark:border-slate-800/50 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Building2 size={12} />
              {project.ministry}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 leading-tight">
            {project.name}
          </h2>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <MapPin size={16} />
            {project.location}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusColors[project.status]}`}>
            {project.status.toUpperCase()}
          </div>
          <FollowButton id={project.id} type="project" name={project.name} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        
        {/* Left Column: Stats & Charts */}
        <div className="space-y-6">
          
          {/* 2) Budget Comparison Panel */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase">{t('govtProposed')}</p>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                ৳{project.govtBudget}
                <span className="text-sm font-normal text-slate-500 ml-1">{t('croreTaka')}</span>
              </div>
            </div>
            
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30 text-center relative overflow-hidden">
               {/* Risk Badge Absolute */}
              <div className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded border ${getRiskBadgeColor(simulation.riskLevel)}`}>
                {simulation.riskLevel} RISK
              </div>

              <div className="flex items-center justify-center gap-1 mb-1">
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase flex items-center gap-1">
                  <BrainCircuit size={14} /> {t('aiEstimate')}
                </p>
                <InfoTooltip text="অতীতের প্রকল্পের খরচ, বর্তমান বাজারদর এবং সময়সীমার বিশ্লেষণের ভিত্তিতে এই ঝুঁকি ও খরচ নির্ণয় করা হয়েছে।" />
              </div>
              <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                ৳{simulation.estimatedCost}
                <span className="text-sm font-normal text-indigo-500/80 ml-1">{t('croreTaka')}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {project.baseAiEstimate !== simulation.estimatedCost && (
                  <span>(Base: ৳{project.baseAiEstimate})</span>
                )}
              </div>
            </div>
          </div>

          {/* 3) Material Breakdown Chart */}
          <div className="bg-white dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-4 flex items-center gap-2">
              <BarChart3 size={14} /> {t('materialBreakdown')}
            </h4>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={project.materials} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', background: '#1e293b', color: '#fff' }}
                  />
                  <Bar dataKey="value" barSize={12} radius={[0, 4, 4, 0]}>
                    {project.materials.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Simulator & Analysis */}
        <div className="space-y-6">
          
          {/* 4) Quality Scenario Simulator */}
          <div className="bg-slate-50 dark:bg-slate-800/30 p-5 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
               <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase flex items-center gap-2">
                 <Settings size={14} className="animate-spin-slow" /> {t('qualityScenario')}
               </h4>
               <span className={`text-xs font-bold ${simulation.durabilityColor}`}>
                 {t('durability')}: {simulation.durabilityText}
               </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {['low', 'standard', 'high'].map((q) => (
                <button
                  key={q}
                  onClick={() => setQualityLevel(q as any)}
                  className={`py-2 rounded-lg text-xs font-bold capitalize transition-all duration-300
                    ${qualityLevel === q 
                      ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-lg scale-105' 
                      : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600'}
                  `}
                >
                  {t(`scenario_${q}`)}
                </button>
              ))}
            </div>

            {/* 5) Timeline Slider */}
            <div className="mt-6">
               <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                 <span>{t('timelineAdjust')}</span>
                 <span>{duration} {t('months')}</span>
               </div>
               <input 
                 type="range" 
                 min={Math.round(project.baseDuration * 0.5)} 
                 max={Math.round(project.baseDuration * 2)} 
                 value={duration} 
                 onChange={(e) => setDuration(Number(e.target.value))}
                 className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
               />
               <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                 <span>Fast (Expensive)</span>
                 <span>Slow (Overhead)</span>
               </div>
            </div>
          </div>

          {/* 6) AI Explanation Box */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30 flex gap-3">
             <div className="mt-1 bg-emerald-100 dark:bg-emerald-900/40 p-1.5 rounded-lg h-fit text-emerald-600 dark:text-emerald-400">
               <Zap size={16} />
             </div>
             <div>
                <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-200 mb-1">AI Insight</h5>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {project.aiExplanation}
                </p>
             </div>
          </div>

          {/* 7) Transparency Notice */}
          <div className="text-center p-2">
             <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
               <ShieldCheck size={10} />
               All data sources are public and verified via Blockchain
             </p>
          </div>

        </div>
      </div>

      {/* NEW: Expandable Budget Tracker */}
      {project.budgetData && (
        <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
          <button 
            onClick={() => setShowTracker(!showTracker)}
            className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
          >
            {showTracker ? (
              <><ChevronUp size={14} /> Hide Budget Details</>
            ) : (
              <><ChevronDown size={14} /> View Detailed Budget Execution Tracker</>
            )}
          </button>
          
          {showTracker && (
            <div className="mt-4 animate-fade-in-down">
              <BudgetExecutionTracker data={project.budgetData} />
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
};
