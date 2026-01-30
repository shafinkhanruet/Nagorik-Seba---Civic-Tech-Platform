
import React from 'react';
import { useApp } from '../context/AppContext';
import { FeedPost, PostData } from '../components/FeedPost';
import { GlassCard } from '../components/GlassCard';
import { EthicsBanner } from '../components/EthicsBanner';
import { 
  Image, 
  Video, 
  Filter, 
  TrendingUp, 
  Award, 
  Phone, 
  MapPin,
  Flame,
  Megaphone,
  ShieldCheck,
  User
} from 'lucide-react';

// Strictly Anonymized Mock Data
const MOCK_POSTS: PostData[] = [
  {
    id: 'p1',
    author: 'Citizen_8492',
    authorTrustScore: 92,
    isAnonymous: false,
    location: 'Mirpur 10, Dhaka',
    timePosted: '2 hours ago',
    content: 'আজ সকালে মিরপুর ১০ নম্বর গোলচত্বরে ট্রাফিক সিগন্যাল অমান্য করে তিনটি বাস প্রতিযোগিতা করছিল। এর ফলে একটি রিকশা উল্টে যায়। ট্রাফিক পুলিশের সামনেই ঘটনাটি ঘটলেও কোনো ব্যবস্থা নেওয়া হয়নি। আমি এর বিচার চাই।',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1549637642-90187f64f420?auto=format&fit=crop&q=80&w=600',
    truthProbability: 88,
    supportCount: 342,
    doubtCount: 12,
    commentCount: 45,
    status: 'verified',
    weightedSupport: 410.5
  },
  {
    id: 'p2',
    author: 'User_2910',
    authorTrustScore: 75,
    isAnonymous: true, // Specifically marked anonymous
    location: 'Agrabad, Chittagong',
    timePosted: '4 hours ago',
    content: 'সরকারি হাসপাতালের জরুরি বিভাগে গত ৩ ঘণ্টা ধরে কোনো ডাক্তার নেই। রোগীরা ব্যথায় কাতরাচ্ছে, কিন্তু নার্সরা বলছে ডাক্তার লাঞ্চে গেছেন। এটা কি দেখার কেউ নেই? ভিডিওটি দেখুন।',
    mediaType: 'video',
    mediaUrl: 'https://images.unsplash.com/photo-1516574187841-69301880578c?auto=format&fit=crop&q=80&w=600',
    truthProbability: 65,
    supportCount: 890,
    doubtCount: 56,
    commentCount: 120,
    status: 'review',
    weightedSupport: 1020.2
  },
  {
    id: 'p3',
    author: 'Citizen_7731',
    authorTrustScore: 85,
    isAnonymous: false,
    location: 'Sylhet Sadar',
    timePosted: '6 hours ago',
    content: 'আমাদের এলাকায় নতুন রাস্তা নির্মাণের কাজ শেষ হয়েছে। ঠিকাদার খুব ভালো মানের কাজ করেছেন, নির্ধারিত সময়ের আগেই কাজ শেষ। ধন্যবাদ সিটি কর্পোরেশনকে। ভালো কাজের প্রশংসাও করা উচিত।',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1584463635296-6e1b6c7a3366?auto=format&fit=crop&q=80&w=600',
    truthProbability: 95,
    supportCount: 1200,
    doubtCount: 5,
    commentCount: 88,
    status: 'verified',
    weightedSupport: 1500.0
  },
  {
    id: 'p4',
    author: 'User_5501',
    authorTrustScore: 60,
    isAnonymous: true,
    location: 'Gulshan 2, Dhaka',
    timePosted: '12 hours ago',
    content: 'ফুটপাত দখল করে দোকান বসানোর কারণে পথচারীরা রাস্তায় হাঁটতে বাধ্য হচ্ছে। এতে প্রতিদিন দুর্ঘটনা ঘটছে। মেয়র মহোদয়ের দৃষ্টি আকর্ষণ করছি।',
    mediaType: 'none',
    truthProbability: 72,
    supportCount: 150,
    doubtCount: 8,
    commentCount: 20,
    status: 'review',
    weightedSupport: 180.5
  },
  {
    id: 'p5',
    author: 'Group_Eng_99',
    authorTrustScore: 98,
    isAnonymous: false,
    location: 'BUET Area',
    timePosted: '1 day ago',
    content: 'আমরা লক্ষ্য করছি যে পদ্মা সেতুর পিলারের কাছে অবৈধভাবে বালু উত্তোলন করা হচ্ছে। এটি সেতুর কাঠামোর জন্য হুমকিস্বরূপ। ড্রোন ফুটেজ সংযুক্ত করা হলো।',
    mediaType: 'video',
    mediaUrl: 'https://images.unsplash.com/photo-1470093851219-69951fcbb533?auto=format&fit=crop&q=80&w=600',
    truthProbability: 99,
    supportCount: 5600,
    doubtCount: 20,
    commentCount: 450,
    status: 'verified',
    weightedSupport: 8900.5
  }
];

export const CitizenFeed: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="pb-20 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Feed Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Ethics Banner */}
          <div className="">
            <EthicsBanner />
          </div>

          {/* Enhanced Create Post Widget */}
          <GlassCard className="p-5 border-t-4 border-t-emerald-500">
            <div className="flex gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-emerald-100 dark:border-emerald-900/50">
                 <User size={20} className="text-slate-400" />
              </div>
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="What's happening in your area? Report anonymously..." 
                  className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-all shadow-inner"
                />
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 px-1">
               <div className="flex gap-2 sm:gap-3">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors text-xs font-bold uppercase">
                    <Image size={16} /> <span className="hidden sm:inline">Photo</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-xs font-bold uppercase">
                    <Video size={16} /> <span className="hidden sm:inline">Video</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-xs font-bold uppercase">
                    <MapPin size={16} /> <span className="hidden sm:inline">Location</span>
                  </button>
               </div>
               <button className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-xs hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                 Post Report
               </button>
            </div>
          </GlassCard>

          {/* Filters */}
          <div className="flex justify-between items-center px-1">
             <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
               <Flame className="text-orange-500" /> Citizen Feed
             </h3>
             <button className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:text-emerald-600 transition-colors">
               <Filter size={14} /> Filter & Sort
             </button>
          </div>

          {/* Feed Posts */}
          <div className="space-y-6">
            {MOCK_POSTS.map(post => (
              <FeedPost key={post.id} post={post} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center pt-6 pb-4">
             <button className="px-8 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm rounded-xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 transition-all">
               Load More Reports
             </button>
          </div>
        </div>

        {/* Right Sidebar Column (Desktop Only) */}
        <div className="hidden lg:block space-y-6">
          
          {/* Trending Issues */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <TrendingUp className="text-emerald-500" size={20} />
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Trending Topics</h3>
            </div>
            <div className="space-y-4">
              {[
                { tag: '#TrafficJam_Mirpur', count: '2.5k reports' },
                { tag: '#DengueAlert', count: '1.2k reports' },
                { tag: '#RoadRepair', count: '850 reports' },
                { tag: '#WASA_Water', count: '620 reports' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-emerald-600 transition-colors">
                    {item.tag}
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Top Citizens (Anonymized) */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Award className="text-amber-500" size={20} />
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Top Contributors</h3>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Citizen_9921', score: 98, area: 'Uttara' },
                { name: 'User_4420', score: 96, area: 'Dhanmondi' },
                { name: 'Citizen_1102', score: 95, area: 'Mirpur' }
              ].map((user, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{user.name}</p>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">
                        <ShieldCheck size={10} /> {user.score}%
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400">{user.area}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Emergency Widget */}
          <div className="bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl p-5 text-white shadow-lg shadow-red-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-full animate-pulse">
                <Phone size={20} />
              </div>
              <h3 className="font-bold text-lg">Emergency?</h3>
            </div>
            <p className="text-xs text-white/90 mb-4 leading-relaxed font-medium">
              For immediate police, fire, or ambulance assistance, do not report here. Call directly.
            </p>
            <button className="w-full py-3 bg-white text-red-600 font-bold rounded-xl text-sm hover:bg-red-50 transition-colors shadow-sm flex items-center justify-center gap-2">
              <Phone size={16} /> Call 999
            </button>
          </div>

          {/* PSA Widget */}
          <GlassCard className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800">
             <div className="flex items-start gap-3">
               <Megaphone className="text-blue-500 shrink-0" size={20} />
               <div>
                 <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">Public Notice</h4>
                 <p className="text-xs text-blue-700 dark:text-blue-200 leading-relaxed">
                   Gas supply will be suspended in Mirpur area tomorrow from 10 AM to 4 PM for maintenance.
                 </p>
               </div>
             </div>
          </GlassCard>

        </div>
      </div>
    </div>
  );
};
