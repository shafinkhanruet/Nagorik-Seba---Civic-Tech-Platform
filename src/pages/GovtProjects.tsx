
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GovtProjectCard, GovtProjectData } from '../components/GovtProjectCard';
import { ProposalCard } from '../components/ProposalCard';
import { ProjectProposalData } from '../types';
import { 
    Filter, 
    PieChart, 
    FileText, 
    Building2, 
    SlidersHorizontal, 
    Activity,
    CheckCircle2
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

const MOCK_GOVT_PROJECTS: GovtProjectData[] = [
  {
    id: '101',
    name: 'ঢাকা এলিভেটেড এক্সপ্রেসওয়ে (৩য় ধাপ)',
    location: 'তেজগাঁও - কুতুবখালী',
    ministry: 'সেতু বিভাগ',
    status: 'active',
    govtBudget: 4500,
    baseAiEstimate: 4200,
    baseDuration: 36,
    materials: [
      { name: 'Steel', value: 1200 },
      { name: 'Cement', value: 900 },
      { name: 'Labor', value: 800 },
      { name: 'Land', value: 1100 },
      { name: 'Other', value: 200 },
    ],
    aiExplanation: 'মাটির ধরন ও আন্তর্জাতিক বাজারে স্টিলের দাম কমায় এই বাজেটে প্রায় ৩০০ কোটি টাকা সাশ্রয় করা সম্ভব।',
    budgetData: {
      approvedBudget: 4500,
      aiEstimatedBudget: 4200,
      spentSoFar: 2100,
      delayRisk: 'Medium',
      monthlySpending: [
        { month: 'Jan', planned: 200, actual: 210 },
        { month: 'Feb', planned: 220, actual: 230 },
      ],
      milestones: [
        { phase: 'Land Acquisition', plannedCost: 1000, actualCost: 1100, status: 'completed' },
        { phase: 'Piling Works', plannedCost: 1500, actualCost: 1450, status: 'ongoing' },
      ]
    }
  }
];

const MOCK_PROPOSALS: ProjectProposalData[] = [
  {
    id: 'p1',
    title: 'মেঘনা দ্বিতীয় সেতু নির্মাণ প্রকল্প',
    ministry: 'সড়ক পরিবহন ও সেতু মন্ত্রণালয়',
    location: 'গজারিয়া, মুন্সিগঞ্জ',
    status: 'open',
    aiSummary: 'এই সেতু নির্মিত হলে ঢাকা-চট্টগ্রাম মহাসড়কের যানজট ৩০% কমবে।',
    budget: {
      govt: '১,২০০ কোটি টাকা',
      aiEstimate: '১,০৫০ কোটি টাকা',
      risk: 'Medium'
    },
    impacts: ['economic', 'displacement', 'social'],
    approvalStats: {
      current: 58,
      required: 60,
      totalVotes: 12543
    },
    hasVoted: false
  }
];

export const GovtProjects: React.FC = () => {
  const { t, language } = useApp();
  const [activeTab, setActiveTab] = useState<'active' | 'proposals'>('active');

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-200 dark:border-indigo-800">
             <Activity size={10} /> Governance Monitoring
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">
            {t('govtProjects')}
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex items-center gap-3 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${
            activeTab === 'active'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Building2 size={16} />
          {language === 'bn' ? 'চলমান প্রকল্প' : 'Active Projects'}
        </button>
        <button
          onClick={() => setActiveTab('proposals')}
          className={`flex items-center gap-3 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${
            activeTab === 'proposals'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileText size={16} />
          {language === 'bn' ? 'নতুন প্রস্তাবনা' : 'New Proposals'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {activeTab === 'active' ? (
          MOCK_GOVT_PROJECTS.map((project) => (
            <GovtProjectCard key={project.id} project={project} />
          ))
        ) : (
          MOCK_PROPOSALS.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))
        )}
      </div>
    </div>
  );
};
