import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../context/NotificationContext';
import { GlassCard } from '../components/GlassCard';
import { NotificationItem, NotificationType } from '../types';
import { 
  Bell, 
  Settings, 
  CheckCheck, 
  Filter, 
  Building2, 
  Map, 
  FileText, 
  Stethoscope, 
  Info,
  Clock,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationCenter: React.FC = () => {
  const { t, language } = useApp();
  const { notifications, markAllAsRead, markAsRead, watchlist, toggleFollow } = useNotifications();
  const [filter, setFilter] = useState<'all' | NotificationType>('all');
  const [activeTab, setActiveTab] = useState<'notifications' | 'watchlist'>('notifications');

  const filteredNotifications = notifications.filter(n => filter === 'all' || n.type === filter);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'project': return <Building2 size={18} />;
      case 'district': return <Map size={18} />;
      case 'report': return <FileText size={18} />;
      case 'hospital': return <Stethoscope size={18} />;
      default: return <Info size={18} />;
    }
  };

  const getIconColor = (type: NotificationType) => {
    switch (type) {
      case 'project': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'district': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'report': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      case 'hospital': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Bell className="text-emerald-500" />
            {t('notificationCenter')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {language === 'bn' 
              ? 'আপনার সমস্ত আপডেট এবং অনুসরণ করা আইটেমগুলি এখানে দেখুন' 
              : 'View all your updates and followed items here'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'notifications' 
              ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900' 
              : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {t('notifications')}
          </button>
          <button 
            onClick={() => setActiveTab('watchlist')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'watchlist' 
              ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900' 
              : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Watchlist
          </button>
          <Link 
            to="/app/settings"
            className="p-2 bg-white dark:bg-slate-800 text-slate-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Settings size={20} />
          </Link>
        </div>
      </div>

      {activeTab === 'notifications' ? (
        <GlassCard noPadding className="min-h-[500px] flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <Filter size={16} className="text-slate-400" />
              {['all', 'project', 'district', 'report', 'hospital'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all whitespace-nowrap ${
                    filter === f 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {t(`filter_${f}s`) || t(`filter_${f}`)}
                </button>
              ))}
            </div>
            
            <button 
              onClick={markAllAsRead}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
            >
              <CheckCheck size={14} /> {t('markAllRead')}
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredNotifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    onClick={() => {
                        if (notif.link) {
                            // In real app, navigate
                            markAsRead(notif.id);
                        } else {
                            markAsRead(notif.id);
                        }
                    }}
                    className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group flex gap-4 ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  >
                    <div className={`p-3 rounded-full h-fit shrink-0 ${getIconColor(notif.type)}`}>
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm ${!notif.read ? 'font-bold text-slate-900 dark:text-slate-100' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <Bell size={48} className="opacity-20 mb-4" />
                <p className="text-sm font-medium">{t('noNotifications')}</p>
              </div>
            )}
          </div>
        </GlassCard>
      ) : (
        <GlassCard noPadding className="min-h-[500px]">
           <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
             <h3 className="font-bold text-slate-700 dark:text-slate-200">Following ({watchlist.length})</h3>
           </div>
           
           <div className="divide-y divide-slate-100 dark:divide-slate-800">
             {watchlist.length > 0 ? (
               watchlist.map(item => (
                 <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className={`p-2 rounded-lg ${getIconColor(item.type)}`}>
                         {getIcon(item.type)}
                       </div>
                       <div>
                         <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.name}</p>
                         <p className="text-xs text-slate-500 capitalize">{item.type}</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => toggleFollow(item)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                      title="Unfollow"
                    >
                      <Trash2 size={16} />
                    </button>
                 </div>
               ))
             ) : (
               <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                 <p className="text-sm">You are not following anything yet.</p>
               </div>
             )}
           </div>
        </GlassCard>
      )}
    </div>
  );
};