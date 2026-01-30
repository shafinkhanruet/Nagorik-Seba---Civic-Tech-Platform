import React from 'react';
import { useApp } from '../context/AppContext';
import { ReportCard, ReportData } from '../components/ReportCard';
import { GlassCard } from '../components/GlassCard';
import { EthicsBanner } from '../components/EthicsBanner';
import { Filter, Map, Plus } from 'lucide-react';
import { 
  AlertTriangle, 
  Stethoscope, 
  Droplets,
  Zap,
  HardHat
} from 'lucide-react';

const MOCK_REPORTS: ReportData[] = [
  {
    id: '1',
    category: 'রাস্তা ও জনপদ',
    categoryIcon: <HardHat size={20} />,
    location: { district: 'ঢাকা', upazila: 'মিরপুর' },
    timePosted: '২ ঘণ্টা আগে',
    isAnonymous: true,
    description: 'মিরপুর ১০ গোলচত্বরের কাছে প্রধান সড়কে বিশাল গর্ত তৈরি হয়েছে। গত তিন দিন ধরে এই অবস্থা, গতকাল রাতে একটি রিকশা উল্টে দুর্ঘটনা ঘটেছে। দ্রুত মেরামত প্রয়োজন।',
    truthScore: 88,
    aiBreakdown: {
      credibility: 92,
      evidenceQuality: 85,
      mediaCheck: 78,
      historyMatch: 95
    },
    evidence: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=200' }, 
      { type: 'image', url: 'https://images.unsplash.com/photo-1584463635296-6e1b6c7a3366?auto=format&fit=crop&q=80&w=200' }
    ],
    weightedSupport: 1240,
    status: 'verified',
    influenceAnalysis: {
      riskLevel: 'Low',
      timelineData: [
        { time: '10am', value: 120 },
        { time: '11am', value: 140 },
        { time: '12pm', value: 300 },
        { time: '1pm', value: 350 },
        { time: '2pm', value: 330 }
      ]
    }
  },
  {
    id: '2',
    category: 'স্বাস্থ্যসেবা',
    categoryIcon: <Stethoscope size={20} />,
    location: { district: 'চট্টগ্রাম', upazila: 'পতেঙ্গা' },
    timePosted: '৪ ঘণ্টা আগে',
    isAnonymous: false,
    description: 'সরকারি হাসপাতালে নির্ধারিত সময়ে ডাক্তার পাওয়া যাচ্ছে না। জরুরি বিভাগে গত ২ ঘণ্টায় কোনো ডাক্তার আসেননি। রোগীরা চরম ভোগান্তিতে আছেন।',
    truthScore: 65,
    aiBreakdown: {
      credibility: 70,
      evidenceQuality: 60,
      mediaCheck: 50,
      historyMatch: 80
    },
    evidence: [
      { type: 'video', url: '#' },
      { type: 'doc', url: '#' }
    ],
    weightedSupport: 850,
    status: 'review',
    influenceAnalysis: {
      riskLevel: 'Medium',
      timelineData: [
        { time: '10am', value: 50 },
        { time: '11am', value: 60 },
        { time: '12pm', value: 250, isSpike: true },
        { time: '1pm', value: 280 },
        { time: '2pm', value: 210 }
      ]
    }
  },
  {
    id: '3',
    category: 'বিদ্যুৎ',
    categoryIcon: <Zap size={20} />,
    location: { district: 'কুমিল্লা', upazila: 'সদর' },
    timePosted: '১ দিন আগে',
    isAnonymous: true,
    description: 'আমাদের এলাকায় গত ৫ দিন ধরে লোডশেডিং চরম আকার ধারণ করেছে। দিনে মাত্র ৪-৫ ঘণ্টা বিদ্যুৎ থাকে। গরমে জনজীবন অতিষ্ঠ।',
    truthScore: 35,
    aiBreakdown: {
      credibility: 40,
      evidenceQuality: 30,
      mediaCheck: 20,
      historyMatch: 50
    },
    evidence: [],
    weightedSupport: 120,
    status: 'disputed',
    influenceAnalysis: {
      riskLevel: 'High',
      timelineData: [
        { time: '10am', value: 20 },
        { time: '11am', value: 25 },
        { time: '12pm', value: 90, isSpike: true },
        { time: '1pm', value: 5 },
        { time: '2pm', value: 2 }
      ]
    }
  },
  {
    id: '4',
    category: 'পানি সরবরাহ',
    categoryIcon: <Droplets size={20} />,
    location: { district: 'খুলনা', upazila: 'সোনাডাঙ্গা' },
    timePosted: '৬ ঘণ্টা আগে',
    isAnonymous: false,
    description: 'পানির পাম্প নষ্ট হয়ে আছে ১ সপ্তাহ ধরে। ওয়াসাতে অভিযোগ দিয়েও কোনো কাজ হচ্ছে না। বিশুদ্ধ পানির তীব্র সংকট।',
    truthScore: 94,
    aiBreakdown: {
      credibility: 98,
      evidenceQuality: 90,
      mediaCheck: 88,
      historyMatch: 100
    },
    evidence: [
       { type: 'image', url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=200' }
    ],
    weightedSupport: 3402,
    status: 'verified',
    influenceAnalysis: {
      riskLevel: 'Low',
      timelineData: [
        { time: '10am', value: 500 },
        { time: '11am', value: 600 },
        { time: '12pm', value: 750 },
        { time: '1pm', value: 800 },
        { time: '2pm', value: 850 }
      ]
    }
  }
];

export const LiveReports: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Ethics Banner */}
      <div className="-mx-4 md:-mx-8 -mt-4 md:-mt-8 mb-6">
        <EthicsBanner />
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {t('liveReports')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            নাগরিকদের সরাসরি অভিযোগ এবং সমস্যার তালিকা
          </p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
             <Filter size={16} /> ফিল্টার
           </button>
           <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-500/30 flex items-center gap-2">
             <Plus size={16} /> নতুন রিপোর্ট
           </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Feed Column */}
        <div className="lg:col-span-2 space-y-6">
          {MOCK_REPORTS.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Map Widget */}
          <GlassCard className="h-64 flex flex-col items-center justify-center text-slate-400">
             <Map size={48} className="mb-2 opacity-50" />
             <p className="text-sm font-medium">লাইভ ম্যাপ (শীঘ্রই আসছে)</p>
          </GlassCard>

          {/* Guidelines */}
          <GlassCard className="bg-gradient-to-br from-slate-800 to-slate-900 text-slate-100 border-none">
            <h3 className="font-bold text-lg mb-3">রিপোর্ট করার নির্দেশিকা</h3>
            <ul className="space-y-2 text-sm opacity-80 list-disc list-inside">
              <li>সঠিক তথ্য ও প্রমাণ দিন</li>
              <li>ভুল তথ্য দিলে ট্রাস্ট স্কোর কমবে</li>
              <li>ব্যক্তিগত আক্রমণ থেকে বিরত থাকুন</li>
              <li>জরুরি প্রয়োজনে ৯৯৯ এ কল করুন</li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};