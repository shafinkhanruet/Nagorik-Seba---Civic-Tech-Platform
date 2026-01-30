import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from './GlassCard';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Bell,
  BellRing
} from 'lucide-react';
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export interface BudgetMilestone {
  phase: string;
  plannedCost: number;
  actualCost: number;
  status: 'completed' | 'ongoing' | 'pending' | 'delayed';
}

export interface BudgetExecutionData {
  approvedBudget: number;
  aiEstimatedBudget: number;
  spentSoFar: number;
  delayRisk: 'Low' | 'Medium' | 'High';
  monthlySpending: { month: string; planned: number; actual: number }[];
  milestones: BudgetMilestone[];
}

interface Props {
  data: BudgetExecutionData;
}

export const BudgetExecutionTracker: React.FC<Props> = ({ data }) => {
  const { t } = useApp();
  const [isFollowing, setIsFollowing] = useState(false);

  const remaining = data.approvedBudget - data.spentSoFar;
  const isOverrun = data.spentSoFar > data.approvedBudget || 
    data.monthlySpending.some(m => m.actual > m.planned * 1.2); // Simple heuristic

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'ongoing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'delayed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'High': return 'text-red-500 bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-900/30';
      case 'Medium': return 'text-amber-500 bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/30';
      default: return 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/30';
    }
  };

  return (
    <GlassCard className="border-t-4 border-t-indigo-500" noPadding>
      {/* Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <TrendingUp className="text-indigo-500" />
          {t('budget_tracker')}
        </h3>
        <button 
          onClick={() => setIsFollowing(!isFollowing)}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            isFollowing 
            ? 'bg-emerald-600 text-white shadow-lg' 
            : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-emerald-500'
          }`}
        >
          {isFollowing ? <BellRing size={14} /> : <Bell size={14} />}
          {isFollowing ? t('following') : t('follow_project')}
        </button>
      </div>

      <div className="p-5 space-y-6">
        
        {/* 1) Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{t('approved_budget')}</p>
            <p className="text-lg font-mono font-bold text-slate-800 dark:text-slate-100">৳{data.approvedBudget}</p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-bold mb-1">{t('ai_estimate')}</p>
            <p className="text-lg font-mono font-bold text-indigo-700 dark:text-indigo-300">৳{data.aiEstimatedBudget}</p>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{t('spent_so_far')}</p>
            <p className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">৳{data.spentSoFar}</p>
          </div>
          <div className={`p-3 rounded-xl border flex flex-col justify-center ${getRiskColor(data.delayRisk)}`}>
            <p className="text-[10px] uppercase font-bold mb-1">{t('delay_risk')}</p>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span className="text-lg font-bold">{data.delayRisk}</span>
            </div>
          </div>
        </div>

        {/* 3) Overrun Alert */}
        {isOverrun && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-3 rounded-lg flex items-center gap-3 animate-pulse">
            <AlertTriangle className="text-red-500 shrink-0" />
            <span className="text-sm font-bold text-red-700 dark:text-red-300">
              {t('overrun_alert')}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 2) Monthly Spending Chart */}
          <div className="h-64 w-full bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-4">Monthly Expenditure</h4>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.monthlySpending}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} opacity={0.5} />
                <XAxis dataKey="month" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', background: '#1e293b', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="actual" name={t('actual')} barSize={12} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="planned" name={t('planned')} stroke="#94a3b8" strokeWidth={2} dot={{r: 3}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* 4) Milestone Table */}
          <div className="flex flex-col h-64 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
             <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
               <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t('milestones')}</h4>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar">
               <table className="w-full text-left text-xs">
                 <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold sticky top-0">
                   <tr>
                     <th className="p-3">{t('phase')}</th>
                     <th className="p-3 text-right">{t('planned_cost')}</th>
                     <th className="p-3 text-right">{t('actual_cost')}</th>
                     <th className="p-3 text-center">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                   {data.milestones.map((m, idx) => (
                     <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                       <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{m.phase}</td>
                       <td className="p-3 text-right font-mono text-slate-500">৳{m.plannedCost}</td>
                       <td className="p-3 text-right font-mono font-bold text-slate-700 dark:text-slate-200">৳{m.actualCost}</td>
                       <td className="p-3 text-center">
                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(m.status)}`}>
                           {m.status}
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>

        </div>
      </div>
    </GlassCard>
  );
};