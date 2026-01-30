import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  text: string;
  className?: string;
  position?: 'top' | 'bottom';
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, className = '', position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span className={`relative inline-flex items-center ml-1.5 align-middle ${className} z-40`}>
      <button
        type="button"
        className="text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors focus:outline-none focus:text-emerald-500"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        onClick={(e) => { e.stopPropagation(); setIsVisible(!isVisible); }}
        aria-label="Why am I seeing this?"
      >
        <Info size={14} />
      </button>

      {isVisible && (
        <div 
          className={`
            absolute left-1/2 -translate-x-1/2 w-64 p-3 
            bg-white/95 dark:bg-slate-900/95 backdrop-blur-md 
            border border-slate-200 dark:border-slate-700 
            rounded-xl shadow-xl z-[100] animate-scale-in text-left
            ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
          `}
        >
          <h4 className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            এই তথ্য কেন দেখাচ্ছে?
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal normal-case">
            {text}
          </p>
          
          {/* Arrow */}
          <div className={`
            absolute left-1/2 -translate-x-1/2 border-8 border-transparent
            ${position === 'top' 
              ? 'top-full border-t-white/95 dark:border-t-slate-900/95' 
              : 'bottom-full border-b-white/95 dark:border-b-slate-900/95'}
          `}></div>
        </div>
      )}
    </span>
  );
};