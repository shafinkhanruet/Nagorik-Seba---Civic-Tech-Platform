
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { BrainCircuit, RefreshCw, Heart } from 'lucide-react';
import { MoralMetrics } from '../types';

interface Props {
  metrics: MoralMetrics;
  isAdmin?: boolean;
  onRecalculate?: () => void;
  className?: string;
}

export const MoralImpactPanel: React.FC<Props> = ({ metrics, isAdmin = false, onRecalculate, className = '' }) => {
  const { language } = useApp();
  const [isCalculating, setIsCalculating] = useState(false);

  // Mock calculation for label
  const benefit = metrics.povertyBenefit + metrics.socialJustice;
  const risk = metrics.displacementRisk + metrics.environmentalImpact;
  
  const netScore = benefit - risk;
  
  let status: 'high' | 'mixed' | 'harmful' = 'mixed';
  if (netScore > 30) status = 'high';
  else if (netScore < -30) status = 'harmful';

  const getStatusLabel = () => {
    if (status === 'high') return { text: language === 'bn' ? 'উচ্চ সামাজিক সুফল' : 'High Social Benefit', color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' };
    if (status === 'harmful') return { text: language === 'bn' ? 'ক্ষতিকারক প্রভাব' : 'Harmful Impact', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' };
    return { text: language === 'bn' ? 'মিশ্র প্রভাব' : 'Mixed Impact', color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' };
  };

  const chartData = [
    { subject: language === 'bn' ? 'দারিদ্র্য বিমোচন' : 'Poverty Benefit', A: metrics.povertyBenefit, fullMark: 100 },
    { subject: language === 'bn' ? 'বাস্তুচ্যুতি ঝুঁকি' : 'Displacement', A: metrics.displacementRisk, fullMark: 100 },
    { subject: language === 'bn' ? 'পরিবেশ' : 'Environment', A: metrics.environmentalImpact, fullMark: 100 },
    { subject: language === 'bn' ? 'সামাজিক ন্যায়বিচার' : 'Social Justice', A: metrics.socialJustice, fullMark: 100 },
  ];

  const handleRecalc = () => {
    if (onRecalculate) {
        setIsCalculating(true);
        setTimeout(() => {
            setIsCalculating(false);
            onRecalculate();
        }, 1500);
    }
  }

  const label = getStatusLabel();

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 ${className}`}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Heart className="text-rose-500" size={16} />
                    {language === 'bn' ? 'নৈতিক প্রভাব স্কোর' : 'Moral Impact Score'}
                </h4>
                <p className="text-[10px] text-slate-500 mt-1">AI-Ethic Module v2.1</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${label.color}`}>
                {label.text}
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
            <div className="h-48 w-full sm:w-1/2 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                        <PolarGrid stroke="#94a3b8" strokeOpacity={0.3} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Impact" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="w-full sm:w-1/2 flex flex-col justify-center space-y-3">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <BrainCircuit size={14} className="text-indigo-500" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">AI Explanation</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {status === 'high' 
                            ? (language === 'bn' ? 'প্রকল্পটি নিম্ন আয়ের মানুষের কর্মসংস্থান সৃষ্টি করবে এবং পরিবেশের ক্ষতি ন্যূনতম।' : 'Project creates employment for low-income groups with minimal environmental harm.') 
                            : status === 'harmful'
                            ? (language === 'bn' ? 'উচ্চ বাস্তুচ্যুতি ঝুঁকি এবং পরিবেশগত ক্ষতির সম্ভাবনা রয়েছে। পুনর্বিবেচনা প্রয়োজন।' : 'High displacement risk and potential environmental damage. Reconsideration advised.')
                            : (language === 'bn' ? 'অর্থনৈতিক সুবিধা থাকলেও কিছু সামাজিক ঝুঁকি রয়েছে। প্রশমন পরিকল্পনা প্রয়োজন।' : 'Economic benefits exist but come with social risks. Mitigation plan required.')
                        }
                    </p>
                </div>

                {isAdmin && (
                    <button 
                        onClick={handleRecalc}
                        disabled={isCalculating}
                        className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-70"
                    >
                        <RefreshCw size={12} className={isCalculating ? 'animate-spin' : ''} />
                        {isCalculating ? 'Recalculating...' : 'Recalculate Score'}
                    </button>
                )}
            </div>
        </div>
    </div>
  );
};
