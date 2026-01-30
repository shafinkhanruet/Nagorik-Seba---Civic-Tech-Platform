import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HeartHandshake, X, Scale } from 'lucide-react';

interface EthicsBannerProps {
  className?: string;
}

export const EthicsBanner: React.FC<EthicsBannerProps> = ({ className = '' }) => {
  const { t } = useApp();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={`
      relative overflow-hidden
      bg-indigo-50 dark:bg-indigo-900/20
      border-b border-indigo-100 dark:border-indigo-800/50
      p-4 md:px-6
      transition-all duration-300
      ${className}
    `}>
      <div className="max-w-7xl mx-auto flex items-start gap-4 pr-8">
        <div className="mt-1 p-2 bg-indigo-100 dark:bg-indigo-800/40 rounded-full text-indigo-600 dark:text-indigo-300 shrink-0">
          <HeartHandshake size={20} />
        </div>
        
        <div>
          <h4 className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider mb-1">
            {t('ethicsReminder')}
          </h4>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 font-serif leading-relaxed italic">
            "{t('ethicsQuote')}"
          </p>
        </div>
      </div>

      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
};