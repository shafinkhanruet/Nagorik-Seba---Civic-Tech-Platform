import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { HeartHandshake, X, BookOpen, HelpCircle } from 'lucide-react';

interface EthicsBannerProps {
  className?: string;
  context?: string; // e.g., 'corruption', 'bribery', 'road', etc.
}

interface EthicsData {
  quote: string;
  source: string;
  theme: string;
}

const ETHICS_DB: Record<string, EthicsData> = {
  corruption: {
    quote: 'নিশ্চয়ই আল্লাহ তোমাদের নির্দেশ দিচ্ছেন যে, তোমরা আমানতসমূহ তার হকদারদের নিকট পৌঁছে দাও। বিশ্বাস ভঙ্গ করো না।',
    source: 'সুরা নিসা: ৫৮ (ভাবার্থ)',
    theme: 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/30 text-amber-900 dark:text-amber-100'
  },
  bribery: {
    quote: 'তোমরা নিজেদের মধ্যে একে অপরের অর্থ-সম্পদ অন্যায়ভাবে গ্রাস করো না এবং মানুষের সম্পদ জেনেশুনে ভক্ষণ করার জন্য বিচারকদের নিকট পেশ করো না।',
    source: 'সুরা বাকারা: ১৮৮ (ভাবার্থ)',
    theme: 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800/30 text-rose-900 dark:text-rose-100'
  },
  injustice: {
    quote: 'কোনো সম্প্রদায়ের প্রতি বিদ্বেষ তোমাদের যেন সুবিচার বর্জনে প্ররোচিত না করে। সুবিচার করো, এটি তাকওয়ার নিকটতর।',
    source: 'সুরা মায়েদা: ৮ (ভাবার্থ)',
    theme: 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800/30 text-indigo-900 dark:text-indigo-100'
  },
  general: {
    quote: 'আল্লাহ তাআলা আমানত ঠিকভাবে আদায় করার নির্দেশ দিয়েছেন।',
    source: 'কুরআন ৪:৫৮ (ভাবার্থ)',
    theme: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30 text-emerald-900 dark:text-emerald-100'
  }
};

export const EthicsBanner: React.FC<EthicsBannerProps> = ({ className = '', context = '' }) => {
  const { t, language } = useApp();
  const [isVisible, setIsVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  // Determine context
  const ethicsData = useMemo(() => {
    const lowerContext = context.toLowerCase();
    
    if (lowerContext.includes('corrup') || lowerContext.includes('theft') || lowerContext.includes('illegal')) {
      return ETHICS_DB.corruption;
    }
    if (lowerContext.includes('bribe') || lowerContext.includes('money') || lowerContext.includes('ghush')) {
      return ETHICS_DB.bribery;
    }
    if (lowerContext.includes('justice') || lowerContext.includes('unfair') || lowerContext.includes('bias')) {
      return ETHICS_DB.injustice;
    }
    
    // Default fallback if no specific context matches but general is requested
    return ETHICS_DB.general;
  }, [context]);

  if (!isVisible) return null;

  return (
    <div className={`
      relative overflow-visible
      border-b md:border md:rounded-xl
      p-4 md:px-6
      transition-all duration-300
      ${ethicsData.theme}
      ${className}
    `}>
      <div className="flex items-start gap-4 pr-8">
        <div className="mt-1 p-2 bg-white/50 dark:bg-black/20 rounded-full shrink-0">
          {context ? <BookOpen size={20} /> : <HeartHandshake size={20} />}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider opacity-80">
              {context ? 'নৈতিক স্মরণ — ইসলামিক দৃষ্টিভঙ্গি' : t('ethicsReminder')}
            </h4>
            
            {/* Context Explanation Button */}
            {context && (
              <div className="relative inline-block">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowTooltip(!showTooltip); }}
                  className="flex items-center gap-1 text-[10px] font-medium bg-white/40 dark:bg-black/20 px-2 py-0.5 rounded-full hover:bg-white/60 transition-colors"
                >
                  <HelpCircle size={10} />
                  {language === 'bn' ? 'কেন এই বার্তা?' : 'Why this msg?'}
                </button>
                
                {/* Tooltip */}
                {showTooltip && (
                  <div className="absolute top-full left-0 mt-2 w-48 p-3 bg-slate-900 text-slate-100 text-xs rounded-lg shadow-xl z-50 animate-scale-in border border-slate-700">
                    <p>
                      {language === 'bn' 
                        ? 'রিপোর্টের ধরণ অনুযায়ী প্রাসঙ্গিক নৈতিক বার্তাটি স্বয়ংক্রিয়ভাবে দেখানো হয়েছে।' 
                        : 'This ethical message is automatically shown based on the report category.'}
                    </p>
                    {/* Arrow */}
                    <div className="absolute bottom-full left-4 border-8 border-transparent border-b-slate-900"></div>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-sm font-medium font-serif leading-relaxed italic opacity-90">
            "{context ? ethicsData.quote : t('ethicsQuote')}"
          </p>
          
          {context && (
            <p className="text-xs mt-1 font-bold opacity-75 text-right">
              — {ethicsData.source}
            </p>
          )}
        </div>
      </div>

      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 p-1 opacity-50 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-all"
        aria-label="Close banner"
      >
        <X size={18} />
      </button>
    </div>
  );
};