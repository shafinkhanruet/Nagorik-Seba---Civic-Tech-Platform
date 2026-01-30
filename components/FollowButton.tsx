import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useApp } from '../context/AppContext';
import { NotificationType } from '../types';
import { Star } from 'lucide-react';

interface FollowButtonProps {
  id: string;
  type: NotificationType;
  name: string;
  className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ id, type, name, className = '' }) => {
  const { isFollowing, toggleFollow } = useNotifications();
  const { t } = useApp();
  const following = isFollowing(id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFollow({ id, type, name });
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300
        ${following 
          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800' 
          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'}
        ${className}
      `}
    >
      <Star size={12} className={following ? 'fill-current' : ''} />
      {following ? t('following') : t('follow')}
    </button>
  );
};