
import React from 'react';
import { useApp } from '../../context/AppContext';
import { Permission, hasPermission } from '../../config/permissions';

interface Props {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<Props> = ({ permission, children, fallback = null }) => {
  const { user } = useApp();

  if (!user || !hasPermission(user.role, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
