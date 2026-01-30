import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../context/NotificationContext';
import { GlassCard } from '../components/GlassCard';
import { useToast } from '../context/ToastContext';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Save, 
  ArrowLeft,
  Building2,
  Map,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Settings: React.FC = () => {
  const { t } = useApp();
  const { settings, updateSettings } = useNotifications();
  const { addToast } = useToast();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleToggle = (key: keyof typeof localSettings) => {
    setLocalSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    addToast('Preferences updated successfully', 'success');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-10">
      
      <div className="flex items-center gap-4 mb-4">
        <Link to="/app/notifications" className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {t('notificationSettings')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage how and what you receive alerts about.</p>
        </div>
      </div>

      <GlassCard>
        <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
          <Bell size={16} /> {t('alertTypes')}
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{t('emailAlerts')}</p>
                <p className="text-xs text-slate-500">Receive daily digest summaries.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={localSettings.emailAlerts} onChange={() => handleToggle('emailAlerts')} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
                <Smartphone size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{t('pushAlerts')}</p>
                <p className="text-xs text-slate-500">Real-time notifications on device.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={localSettings.pushAlerts} onChange={() => handleToggle('pushAlerts')} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Topic Subscriptions</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Building2 size={16} />
              <span className="text-sm font-medium">Project Updates</span>
            </div>
            <input type="checkbox" checked={localSettings.projectUpdates} onChange={() => handleToggle('projectUpdates')} className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Map size={16} />
              <span className="text-sm font-medium">District Integrity Scores</span>
            </div>
            <input type="checkbox" checked={localSettings.districtScores} onChange={() => handleToggle('districtScores')} className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <FileText size={16} />
              <span className="text-sm font-medium">Report Status Changes</span>
            </div>
            <input type="checkbox" checked={localSettings.reportStatus} onChange={() => handleToggle('reportStatus')} className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" />
          </div>
        </div>
      </GlassCard>

      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg flex items-center gap-2 hover:opacity-90 transition-all"
        >
          <Save size={18} /> {t('updatePreferences')}
        </button>
      </div>

    </div>
  );
};