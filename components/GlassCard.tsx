import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`
      relative overflow-hidden
      bg-white/70 dark:bg-slate-800/60
      backdrop-blur-xl
      border border-white/20 dark:border-slate-700/50
      shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50
      rounded-2xl
      transition-all duration-300
      hover:shadow-emerald-500/10 dark:hover:shadow-emerald-400/10
      ${noPadding ? '' : 'p-6'}
      ${className}
    `}>
      {children}
    </div>
  );
};