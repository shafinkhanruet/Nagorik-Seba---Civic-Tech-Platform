import React from 'react';
import { usePermission } from '../hooks/usePermission';
import { Permission } from '../config/permissions';
import { Lock } from 'lucide-react';

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Removes content from the DOM if the user lacks permission.
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  permission, 
  children, 
  fallback = null 
}) => {
  const { can } = usePermission();

  if (!can(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface RestrictedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  permission: Permission;
  children: React.ReactNode;
}

/**
 * Renders a button that is visually disabled and shows a tooltip if unauthorized.
 * It strictly prevents the onClick event if unauthorized.
 */
export const RestrictedButton: React.FC<RestrictedButtonProps> = ({ 
  permission, 
  children, 
  onClick, 
  className = '',
  ...props 
}) => {
  const { can } = usePermission();
  const hasPermission = can(permission);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hasPermission && onClick) {
      onClick(e);
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (hasPermission) {
    return (
      <button onClick={handleClick} className={className} {...props}>
        {children}
      </button>
    );
  }

  return (
    <div className="group relative inline-block w-full">
      <button
        disabled
        className={`cursor-not-allowed opacity-50 grayscale ${className}`}
        {...props}
      >
        <span className="flex items-center justify-center gap-2">
          <Lock size={12} />
          {children}
        </span>
      </button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap border border-slate-700">
        এই কাজ করার অনুমতি আপনার নেই।
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
      </div>
    </div>
  );
};