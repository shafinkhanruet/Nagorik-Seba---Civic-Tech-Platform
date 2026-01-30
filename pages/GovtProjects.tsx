import React from 'react';
import { useApp } from '../context/AppContext';
import { GovtProjectCard, GovtProjectData } from '../components/GovtProjectCard';
import { Filter, PieChart } from 'lucide-react';

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
    aiExplanation: 'মাটির ধরন ও আন্তর্জাতিক বাজারে স্টিলের দাম কমায় এই বাজেটে প্রায় ৩০০ কোটি টাকা সাশ্রয় করা সম্ভব। তবে জমির অধিগ্রহণ খরচ বাড়তে পারে।'
  },
  {
    id: '102',
    name: 'জেলা মডেল মসজিদ নির্মাণ (৫০টি)',
    location: 'সারাদেশ',
    ministry: 'ধর্ম বিষয়ক মন্ত্রণালয়',
    status: 'planning',
    govtBudget: 850,
    baseAiEstimate: 920,
    baseDuration: 24,
    materials: [
      { name: 'Cement', value: 300 },
      { name: 'Bricks', value: 200 },
      { name: 'Labor', value: 250 },
      { name: 'Finishing', value: 170 },
    ],
    aiExplanation: 'বর্তমান বাজারদরে রড ও সিমেন্টের দাম বৃদ্ধির কারণে সরকারি বাজেট অপ্রতুল হতে পারে। গুণমান বজায় রাখতে বাজেট বাড়ানো প্রয়োজন।'
  },
  {
    id: '103',
    name: 'স্মার্ট স্কুল আইসিটি ল্যাব',
    location: 'সিলেট বিভাগ',
    ministry: 'শিক্ষা মন্ত্রণালয়',
    status: 'active',
    govtBudget: 120,
    baseAiEstimate: 95,
    baseDuration: 12,
    materials: [
      { name: 'Hardware', value: 60 },
      { name: 'Furniture', value: 20 },
      { name: 'Network', value: 10 },
      { name: 'Training', value: 5 },
    ],
    aiExplanation: 'হার্ডওয়্যার আমদানিতে শুল্ক হ্রাসের কারণে খরচ কমার সম্ভাবনা রয়েছে। তবে রক্ষণাবেক্ষণ খাতের জন্য অতিরিক্ত বরাদ্দ রাখা উচিত।'
  }
];

export const GovtProjects: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <PieChart className="text-emerald-500" />
            {t('govtProjects')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            সরকারি প্রকল্পের ব্যয়ের স্বচ্ছতা ও গুণমান যাচাই করুন। AI সিমুলেটরের মাধ্যমে দেখুন কিভাবে উপাদানের মান ও সময়সীমা খরচে প্রভাব ফেলে।
          </p>
        </div>
        <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
           <Filter size={16} /> মন্ত্রণালয় ফিল্টার
        </button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-8">
        {MOCK_GOVT_PROJECTS.map((project) => (
          <GovtProjectCard key={project.id} project={project} />
        ))}
      </div>

    </div>
  );
};