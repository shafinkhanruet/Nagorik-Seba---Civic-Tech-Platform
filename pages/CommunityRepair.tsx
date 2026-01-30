import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { 
  Wrench, 
  MapPin, 
  Lightbulb, 
  Droplets, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  Upload, 
  X,
  Award,
  ThumbsUp,
  AlertCircle,
  Hammer,
  ShieldCheck
} from 'lucide-react';

interface RepairIssue {
  id: string;
  title: string;
  titleBn: string;
  category: 'road' | 'light' | 'drain' | 'trash';
  location: string;
  locationBn: string;
  status: 'open' | 'verifying' | 'fixed';
  urgency: number; // 0-100
  credits: number;
  reportedTime: string;
  reportedTimeBn: string;
  verifiers: number;
  requiredVerifiers: number;
}

const MOCK_ISSUES: RepairIssue[] = [
  {
    id: '1',
    title: 'Broken Street Light',
    titleBn: 'রাস্তার ল্যাম্পপোস্ট নষ্ট',
    category: 'light',
    location: 'Road 5, Dhanmondi',
    locationBn: 'রোড ৫, ধানমন্ডি',
    status: 'open',
    urgency: 85,
    credits: 50,
    reportedTime: '2 days ago',
    reportedTimeBn: '২ দিন আগে',
    verifiers: 0,
    requiredVerifiers: 3
  },
  {
    id: '2',
    title: 'Small Pothole Repair',
    titleBn: 'ছোট গর্ত মেরামত',
    category: 'road',
    location: 'Mirpur 11 Bus Stand',
    locationBn: 'মিরপুর ১১ বাস স্ট্যান্ড',
    status: 'verifying',
    urgency: 70,
    credits: 80,
    reportedTime: '5 hours ago',
    reportedTimeBn: '৫ ঘণ্টা আগে',
    verifiers: 2,
    requiredVerifiers: 5
  },
  {
    id: '3',
    title: 'Clogged Drain',
    titleBn: 'ড্রেন পরিষ্কার প্রয়োজন',
    category: 'drain',
    location: 'Sector 4, Uttara',
    locationBn: 'সেক্টর ৪, উত্তরা',
    status: 'open',
    urgency: 60,
    credits: 40,
    reportedTime: '1 day ago',
    reportedTimeBn: '১ দিন আগে',
    verifiers: 0,
    requiredVerifiers: 3
  },
  {
    id: '4',
    title: 'Garbage Pileup',
    titleBn: 'ময়লার স্তূপ পরিষ্কার',
    category: 'trash',
    location: 'Mohammadpur Krishi Market',
    locationBn: 'মোহাম্মদপুর কৃষি মার্কেট',
    status: 'fixed',
    urgency: 95,
    credits: 60,
    reportedTime: '3 days ago',
    reportedTimeBn: '৩ দিন আগে',
    verifiers: 8,
    requiredVerifiers: 5
  },
  {
    id: '5',
    title: 'Loose Manhole Cover',
    titleBn: 'ম্যানহোলের ঢাকনা নড়বড়ে',
    category: 'road',
    location: 'Gulshan 1 Circle',
    locationBn: 'গুলশান ১ সার্কেল',
    status: 'open',
    urgency: 90,
    credits: 100,
    reportedTime: '6 hours ago',
    reportedTimeBn: '৬ ঘণ্টা আগে',
    verifiers: 0,
    requiredVerifiers: 4
  },
  {
    id: '6',
    title: 'Park Bench Repair',
    titleBn: 'পার্কের বেঞ্চ মেরামত',
    category: 'road',
    location: 'Ramna Park',
    locationBn: 'রমনা পার্ক',
    status: 'verifying',
    urgency: 45,
    credits: 30,
    reportedTime: '1 week ago',
    reportedTimeBn: '১ সপ্তাহ আগে',
    verifiers: 1,
    requiredVerifiers: 3
  }
];

export const CommunityRepair: React.FC = () => {
  const { t, language } = useApp();
  const [selectedIssue, setSelectedIssue] = useState<RepairIssue | null>(null);
  const [showFixModal, setShowFixModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'light': return <Lightbulb size={20} />;
      case 'drain': return <Droplets size={20} />;
      case 'trash': return <Trash2 size={20} />;
      default: return <Hammer size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fixed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'verifying': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const openFixModal = (issue: RepairIssue) => {
    setSelectedIssue(issue);
    setSubmitted(false);
    setShowFixModal(true);
  };

  const handleSubmitFix = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowFixModal(false);
      // In a real app, you would update the state here
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* 1) Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Wrench className="text-emerald-500" />
            {t('repairTitle')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {language === 'bn' ? 'নিজে সমস্যার সমাধান করুন এবং কমিউনিটি হিরো হোন।' : 'Fix issues yourself and become a community hero.'}
          </p>
        </div>
        
        {/* Stats */}
        <div className="flex gap-4">
           <GlassCard noPadding className="px-4 py-2 flex items-center gap-3">
             <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full">
               <Award size={18} />
             </div>
             <div>
               <p className="text-[10px] uppercase font-bold text-slate-400">My Credits</p>
               <p className="font-bold text-slate-800 dark:text-slate-100">1,250</p>
             </div>
           </GlassCard>
        </div>
      </div>

      {/* 2) Issues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_ISSUES.map((issue) => (
          <GlassCard key={issue.id} noPadding className="flex flex-col h-full group transition-all hover:shadow-xl hover:border-emerald-500/30">
            {/* Top Bar */}
            <div className="p-4 pb-0 flex justify-between items-start mb-3">
               <div className={`p-2 rounded-xl text-white shadow-lg ${
                 issue.category === 'light' ? 'bg-amber-500' : 
                 issue.category === 'drain' ? 'bg-blue-500' :
                 issue.category === 'trash' ? 'bg-rose-500' : 'bg-slate-600'
               }`}>
                 {getCategoryIcon(issue.category)}
               </div>
               <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(issue.status)}`}>
                 {issue.status}
               </div>
            </div>

            {/* Content */}
            <div className="px-5 flex-1">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-1 leading-tight">
                {language === 'bn' ? issue.titleBn : issue.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-4">
                <MapPin size={12} /> {language === 'bn' ? issue.locationBn : issue.location}
              </p>

              {/* Urgency */}
              <div className="mb-4">
                <div className="flex justify-between text-[10px] font-bold uppercase mb-1 text-slate-400">
                  <span>{t('urgency')}</span>
                  <span>{issue.urgency}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${issue.urgency > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${issue.urgency}%` }}
                  ></div>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center justify-between mb-6 relative">
                 <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-100 dark:bg-slate-800 -z-10"></div>
                 {['reported', 'attempt', 'verify', 'closed'].map((step, idx) => {
                    const statusIdx = issue.status === 'open' ? 0 : issue.status === 'verifying' ? 2 : 3;
                    const active = idx <= statusIdx;
                    return (
                      <div key={step} className="flex flex-col items-center gap-1 group/tooltip relative">
                         <div className={`w-3 h-3 rounded-full border-2 transition-colors ${active ? 'bg-emerald-500 border-emerald-500' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'}`}></div>
                         {/* Tooltip for step */}
                         <span className="absolute -bottom-6 text-[8px] bg-slate-800 text-white px-1.5 py-0.5 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10">
                           {t(`step_${step}`)}
                         </span>
                      </div>
                    );
                 })}
              </div>
            </div>

            {/* Action Footer */}
            <div className="mt-auto p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/50">
               {issue.status === 'open' && (
                 <button 
                   onClick={() => openFixModal(issue)}
                   className="w-full py-2.5 bg-slate-900 dark:bg-emerald-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                 >
                   <Hammer size={16} /> {t('iFixedIt')}
                 </button>
               )}

               {issue.status === 'verifying' && (
                 <div className="space-y-3">
                   <button className="w-full py-2.5 bg-white dark:bg-slate-800 border border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                     <ShieldCheck size={16} /> {t('verifyFix')}
                   </button>
                   <div className="flex items-center justify-between text-xs">
                     <div className="flex -space-x-2">
                       {[1,2].map(i => (
                         <div key={i} className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-800"></div>
                       ))}
                     </div>
                     <span className="text-slate-400">
                       {issue.verifiers}/{issue.requiredVerifiers} Verified
                     </span>
                   </div>
                 </div>
               )}

               {issue.status === 'fixed' && (
                  <div className="w-full py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold rounded-lg flex items-center justify-center gap-2 text-sm">
                    <CheckCircle2 size={16} /> Solved by Community
                  </div>
               )}

               {/* Reward Pill */}
               {issue.status !== 'fixed' && (
                 <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded-full text-[10px] font-bold text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-800">
                   +{issue.credits} {t('credits')}
                 </div>
               )}
            </div>

            {/* Auto Resolve Notice for verifying items */}
            {issue.status === 'verifying' && (
               <div className="px-4 pb-2 text-[9px] text-center text-slate-400">
                 {t('autoResolve')}
               </div>
            )}
          </GlassCard>
        ))}
      </div>

      {/* 3) Fix Submission Modal */}
      {showFixModal && selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFixModal(false)}></div>
          
          <GlassCard className="w-full max-w-md relative z-10 animate-scale-in">
             <button 
               onClick={() => setShowFixModal(false)}
               className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
             >
               <X size={20} />
             </button>

             <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                  {t('submitFix')}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {language === 'bn' ? selectedIssue.titleBn : selectedIssue.title}
                </p>
             </div>

             {!submitted ? (
               <form onSubmit={handleSubmitFix} className="space-y-4">
                  {/* File Upload */}
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors cursor-pointer group">
                     <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-3 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-600 transition-colors">
                       <Upload size={24} />
                     </div>
                     <span className="text-sm font-medium">{t('uploadProof')}</span>
                     <span className="text-[10px] opacity-70">Photo or Video</span>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t('describeFix')}
                    </label>
                    <textarea 
                      className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none text-sm min-h-[80px]"
                      placeholder="..."
                    />
                  </div>

                  {/* Reward Box */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white flex items-center justify-between shadow-lg shadow-indigo-500/20">
                     <div className="flex flex-col">
                       <span className="text-[10px] font-bold uppercase opacity-80">{t('rewardClaim')}</span>
                       <span className="text-xl font-bold">+{selectedIssue.credits} Credits</span>
                     </div>
                     <div className="text-right">
                       <span className="text-[10px] font-bold uppercase opacity-80">Integrity</span>
                       <span className="block text-lg font-bold text-emerald-300">+2 Score</span>
                     </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity"
                  >
                    {t('submitFix')}
                  </button>
               </form>
             ) : (
               <div className="py-8 text-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    {language === 'bn' ? 'সাবমিশন সফল হয়েছে!' : 'Submission Successful!'}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    {language === 'bn' ? 'যাচাইকরণের পর আপনার ক্রেডিট যোগ হবে।' : 'Credits will be added after verification.'}
                  </p>
               </div>
             )}
          </GlassCard>
        </div>
      )}

    </div>
  );
};