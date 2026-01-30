import React from 'react';
import { useApp } from '../context/AppContext';
import { ProposalCard, ProjectProposalData } from '../components/ProposalCard';
import { Filter, SlidersHorizontal } from 'lucide-react';

const MOCK_PROPOSALS: ProjectProposalData[] = [
  {
    id: '1',
    title: 'মেঘনা দ্বিতীয় সেতু নির্মাণ প্রকল্প',
    ministry: 'সড়ক পরিবহন ও সেতু মন্ত্রণালয়',
    location: 'গজারিয়া, মুন্সিগঞ্জ',
    status: 'open',
    aiSummary: 'এই সেতু নির্মিত হলে ঢাকা-চট্টগ্রাম মহাসড়কের যানজট ৩০% কমবে এবং তিনটি গ্রামের যাতায়াত সহজ হবে। তবে প্রকল্পের জন্য প্রায় ২ একর কৃষি জমি অধিগ্রহণ করার প্রয়োজন হবে যা স্থানীয় কৃষকদের প্রভাবিত করতে পারে।',
    budget: {
      govt: '১,২০০ কোটি টাকা',
      aiEstimate: '১,০৫০ - ১,১৫০ কোটি টাকা',
      risk: 'Medium'
    },
    impacts: ['economic', 'displacement', 'social'],
    approvalStats: {
      current: 58,
      required: 60,
      totalVotes: 12543
    },
    hasVoted: false
  },
  {
    id: '2',
    title: 'শেখ রাসেল হাই-টেক পার্ক',
    ministry: 'তথ্য ও যোগাযোগ প্রযুক্তি বিভাগ',
    location: 'কালিয়াকৈর, গাজীপুর',
    status: 'approved',
    aiSummary: 'নতুন আইটি পার্কটি প্রায় ৫,০০০ তরুণের কর্মসংস্থান তৈরি করবে। পরিবেশগত প্রভাব নগণ্য, এবং এটি স্থানীয় অর্থনীতিতে বড় অবদান রাখবে। সরকার ইতিমধ্যে প্রাথমিক বাজেট অনুমোদন করেছে।',
    budget: {
      govt: '৪৫০ কোটি টাকা',
      aiEstimate: '৪৪০ - ৪৬০ কোটি টাকা',
      risk: 'Low'
    },
    impacts: ['economic', 'social'],
    approvalStats: {
      current: 82,
      required: 60,
      totalVotes: 8900
    },
    hasVoted: true
  },
  {
    id: '3',
    title: 'যমুনা নদী তীর রক্ষা বাঁধ',
    ministry: 'পানি সম্পদ মন্ত্রণালয়',
    location: 'সিরাজগঞ্জ সদর',
    status: 'open',
    aiSummary: 'আসন্ন বর্ষার আগে বাঁধটি নির্মাণ করা জরুরি। এটি প্রায় ১০,০০০ পরিবারকে নদী ভাঙন থেকে রক্ষা করবে। তবে দ্রুত কাজের জন্য বাজেটের স্বচ্ছতা নিশ্চিত করা প্রয়োজন।',
    budget: {
      govt: '৭৮০ কোটি টাকা',
      aiEstimate: '৬৫০ - ৭০০ কোটি টাকা',
      risk: 'High'
    },
    impacts: ['social', 'environment', 'displacement'],
    approvalStats: {
      current: 45,
      required: 55,
      totalVotes: 15600
    },
    hasVoted: false
  }
];

export const ProjectProposals: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {t('projectProposals')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            সরকারের প্রস্তাবিত উন্নয়ন প্রকল্পগুলোতে আপনার মতামত দিন। আপনার ভোট প্রকল্পের অনুমোদন বা বাতিলের ক্ষেত্রে ভূমিকা রাখবে।
          </p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
             <Filter size={16} /> স্ট্যাটাস
           </button>
           <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
             <SlidersHorizontal size={16} /> সর্ট করুন
           </button>
        </div>
      </div>

      {/* Proposals List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_PROPOSALS.map((proposal) => (
          <ProposalCard key={proposal.id} proposal={proposal} />
        ))}
      </div>
      
      {/* Pagination / Load More */}
      <div className="flex justify-center pt-6">
        <button className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium rounded-lg transition-colors">
           আরও লোড করুন
        </button>
      </div>
    </div>
  );
};