import React, { useState } from 'react';
import { Eye, AlertTriangle } from 'lucide-react';

interface SensitiveContentWrapperProps {
  children: React.ReactNode;
  isSensitive?: boolean;
  className?: string;
}

export const SensitiveContentWrapper: React.FC<SensitiveContentWrapperProps> = ({ 
  children, 
  isSensitive = false, 
  className = '' 
}) => {
  const [isRevealed, setIsRevealed] = useState(!isSensitive);

  if (!isSensitive) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative overflow-hidden group/sensitive ${className}`}>
      {/* Content Layer */}
      <div 
        className={`
          w-full h-full transition-all duration-500 ease-in-out
          ${isRevealed ? 'filter-none' : 'blur-xl scale-110 opacity-80'}
        `}
        aria-hidden={!isRevealed}
      >
        {children}
      </div>

      {/* Overlay Layer */}
      {!isRevealed && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-100/60 dark:bg-slate-900/60 backdrop-blur-[2px] p-4 text-center animate-fade-in">
          <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg mb-3">
            <AlertTriangle className="text-amber-500" size={24} />
          </div>
          
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 max-w-[80%] leading-relaxed drop-shadow-sm">
            সংবেদনশীল বিষয়বস্তু — দেখতে ক্লিক করুন
          </p>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsRevealed(true);
            }}
            className="px-4 py-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label="Show sensitive content"
          >
            <Eye size={12} /> আমি বুঝেছি, দেখান
          </button>
        </div>
      )}
    </div>
  );
};