import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert } from 'lucide-react';

export const ComplianceBanner: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="bg-red-50 dark:bg-red-900/10 border-b border-red-200 dark:border-red-900/30 p-3 flex items-center justify-center gap-3">
      <ShieldAlert size={18} className="text-red-600 dark:text-red-500 animate-pulse" />
      <span className="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-wide">
        {t('compliance_banner')}
      </span>
    </div>
  );
};