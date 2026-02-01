
import { useApp } from '../context/AppContext';
import { Permission, checkPermission } from '../config/permissions';

export const usePermission = () => {
  const { role } = useApp();

  const can = (permission: Permission): boolean => {
    return checkPermission(role, permission);
  };

  return { can, role };
};
