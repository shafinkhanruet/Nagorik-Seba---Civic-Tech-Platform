import React, { useState } from 'react';
import { Loader2, Check } from 'lucide-react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  isSuccess?: boolean; // If managed externally
  disabledTooltip?: string;
  variant?: 'primary' | 'danger' | 'outline' | 'ghost' | 'success';
  children: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  isLoading = false,
  isSuccess = false,
  disabledTooltip,
  variant = 'primary',
  className = '',
  disabled,
  children,
  ...props
}) => {
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary': return 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90';
      case 'danger': return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 border border-transparent';
      case 'success': return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/40 border border-transparent';
      case 'outline': return 'bg-transparent border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800';
      case 'ghost': return 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800';
      default: return 'bg-slate-900 text-white';
    }
  };

  return (
    <div className="relative group inline-block w-full sm:w-auto">
      <button
        disabled={disabled || isLoading || isSuccess}
        className={`
          relative w-full sm:w-auto
          flex items-center justify-center gap-2 
          px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide
          transition-all duration-200 active:scale-[0.98]
          disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
          ${getVariantClasses()}
          ${className}
        `}
        {...props}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <Loader2 size={16} className="animate-spin absolute" />
        )}

        {/* Success Check */}
        {!isLoading && isSuccess && (
          <Check size={16} className="animate-scale-in absolute" />
        )}

        {/* Content (Hidden when loading/success to maintain width) */}
        <span className={`${(isLoading || isSuccess) ? 'opacity-0' : 'opacity-100'} flex items-center justify-center gap-2`}>
          {children}
        </span>
      </button>

      {/* Disabled Tooltip */}
      {disabled && disabledTooltip && !isLoading && !isSuccess && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] px-3 py-1.5 bg-slate-800 text-white text-[10px] font-medium rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
          {disabledTooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
      )}
    </div>
  );
};