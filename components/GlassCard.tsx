
import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  noPadding = false,
  hoverEffect = false
}) => {
  return (
    <div className={`
      relative overflow-hidden
      bg-white/80 dark:bg-slate-900/60
      backdrop-blur-xl
      border border-slate-200/60 dark:border-slate-700/60
      shadow-xl shadow-slate-200/40 dark:shadow-slate-950/40
      rounded-2xl
      transition-all duration-300
      ${hoverEffect ? 'hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1' : ''}
      ${noPadding ? '' : 'p-6'}
      ${className}
    `}>
      {/* Subtle top gradient highlight for 3D feel */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 dark:via-slate-400/20 to-transparent opacity-50" />
      
      {children}
    </div>
  );
};
