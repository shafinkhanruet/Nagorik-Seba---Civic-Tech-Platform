import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
  hoverEffect?: boolean;
  accent?: 'emerald' | 'indigo' | 'rose' | 'amber' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  noPadding = false,
  hoverEffect = true,
  accent = 'none'
}) => {
  const accentStyles = {
    emerald: 'before:bg-emerald-500 hover:border-emerald-500/50',
    indigo: 'before:bg-indigo-500 hover:border-indigo-500/50',
    rose: 'before:bg-rose-500 hover:border-rose-500/50',
    amber: 'before:bg-amber-500 hover:border-amber-500/50',
    none: ''
  };

  return (
    <div className={`
      relative overflow-hidden
      bg-white/60 dark:bg-slate-900/40
      backdrop-blur-2xl
      border border-white/40 dark:border-white/5
      shadow-xl shadow-slate-200/50 dark:shadow-black/40
      rounded-[2rem]
      transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
      ${accent !== 'none' ? `before:absolute before:top-0 before:left-0 before:w-1.5 before:h-full ${accentStyles[accent]}` : ''}
      ${hoverEffect ? 'hover:shadow-2xl hover:-translate-y-1.5 hover:bg-white/80 dark:hover:bg-slate-900/60' : ''}
      ${noPadding ? '' : 'p-8'}
      ${className}
    `}>
      {/* Dynamic light refraction effect */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};