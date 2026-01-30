
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Award, 
  Activity, 
  FileText, 
  MessageSquare, 
  ThumbsUp, 
  Edit3,
  Settings,
  Share2,
  CheckCircle2
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, t } = useApp();
  const [activeTab, setActiveTab] = useState<'activity' | 'badges' | 'settings'>('activity');

  // Mock User Data for Demo
  const profileData = {
    name: user?.name || 'Citizen_98241', // Fallback for anonymity
    id: user?.id || 'CIT-882190',
    joinDate: 'October 2023',
    location: 'Uttara, Dhaka',
    trustScore: 88,
    rank: 'Active Guardian',
    stats: {
      reports: 12,
      verified: 10,
      votes: 145,
      impact: 850
    }
  };

  const activities = [
    { id: 1, type: 'report', title: 'Reported: Illegal Sand Mining', time: '2 days ago', status: 'verified', score: '+15' },
    { id: 2, type: 'vote', title: 'Voted on "Meghna Bridge Project"', time: '3 days ago', status: 'counted', score: '+2' },
    { id: 3, type: 'comment', title: 'Commented on "Road Repair in Mirpur"', time: '1 week ago', status: 'published', score: '+5' },
    { id: 4, type: 'report', title: 'Reported: Broken Street Light', time: '2 weeks ago', status: 'fixed', score: '+20' },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-6 animate-fade-in">
      
      {/* Profile Header Card */}
      <GlassCard className="relative overflow-visible mt-10">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-t-2xl"></div>
        
        <div className="relative px-6 pb-6 pt-16 flex flex-col md:flex-row items-end md:items-center gap-6">
          
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-800 p-1 shadow-xl">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.id}`} 
                alt="Profile" 
                className="w-full h-full rounded-full bg-slate-100"
              />
            </div>
            <div className="absolute bottom-2 right-2 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" title="Verified Citizen">
              <ShieldCheck size={16} />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 mb-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{profileData.name}</h1>
              <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase rounded-full border border-indigo-200 dark:border-indigo-800 w-fit">
                {profileData.rank}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-4 mb-4">
              <span className="flex items-center gap-1"><MapPin size={14} /> {profileData.location}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> Joined {profileData.joinDate}</span>
            </p>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity">
                <Edit3 size={14} /> Edit Profile
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <Share2 size={14} /> Share Public ID
              </button>
            </div>
          </div>

          {/* Trust Score Big */}
          <div className="flex flex-col items-center p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl min-w-[120px]">
             <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Trust Score</span>
             <span className="text-4xl font-black text-emerald-700 dark:text-emerald-300">{profileData.trustScore}</span>
             <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">Top 5% of Citizens</span>
          </div>
        </div>
      </GlassCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{profileData.stats.reports}</p>
            <p className="text-xs text-slate-500 uppercase font-bold">Reports</p>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-3">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{profileData.stats.verified}</p>
            <p className="text-xs text-slate-500 uppercase font-bold">Verified</p>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full">
            <ThumbsUp size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{profileData.stats.votes}</p>
            <p className="text-xs text-slate-500 uppercase font-bold">Votes Cast</p>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-3">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{profileData.stats.impact}</p>
            <p className="text-xs text-slate-500 uppercase font-bold">Impact Pts</p>
          </div>
        </GlassCard>
      </div>

      {/* Main Content Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar Menu */}
        <div className="lg:col-span-1">
          <GlassCard className="p-2" noPadding>
            {[
              { id: 'activity', label: 'Activity History', icon: Activity },
              { id: 'badges', label: 'Badges & Achievements', icon: Award },
              { id: 'settings', label: 'Account Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400' 
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </GlassCard>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2">
          <GlassCard className="min-h-[400px]">
            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Recent Activity</h3>
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-8">
                  {activities.map((item, idx) => (
                    <div key={item.id} className="relative pl-6">
                      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 bg-white dark:bg-slate-900 flex items-center justify-center`}>
                        <div className={`w-2 h-2 rounded-full ${
                          item.type === 'report' ? 'bg-red-500' : item.type === 'vote' ? 'bg-blue-500' : 'bg-amber-500'
                        }`}></div>
                      </div>
                      
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">{item.type}</span>
                          <span className="text-xs font-mono text-emerald-500 font-bold">{item.score} pts</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">{item.title}</h4>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">{item.time}</span>
                          <span className="px-2 py-0.5 bg-white dark:bg-slate-900 rounded text-[10px] font-bold uppercase border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'badges' && (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award size={40} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Badges Coming Soon</h3>
                <p className="text-slate-500 text-sm">Earn badges by contributing to the community.</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings size={40} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Settings Unavailable</h3>
                <p className="text-slate-500 text-sm">You cannot change settings in this demo mode.</p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>

    </div>
  );
};
