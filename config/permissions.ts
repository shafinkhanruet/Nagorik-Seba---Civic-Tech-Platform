
import { Role } from '../types';

export type Permission =
  | 'view:dashboard'
  | 'view:admin_panel'
  | 'action:submit_report'
  | 'action:vote'
  | 'action:file_rti'
  | 'action:moderate' // updated from moderate_content to match usage
  | 'action:manage_projects'
  | 'action:approve_project' // Added
  | 'action:freeze_project' // Added
  | 'action:manage_crisis'
  | 'action:unlock_identity';

const PERMISSIONS: Record<Role, Permission[]> = {
  citizen: [
    'view:dashboard',
    'action:submit_report',
    'action:vote',
    'action:file_rti'
  ],
  moderator: [
    'view:dashboard',
    'view:admin_panel',
    'action:moderate'
  ],
  admin: [
    'view:dashboard',
    'view:admin_panel',
    'action:moderate',
    'action:manage_projects',
    'action:approve_project',
    'action:freeze_project'
  ],
  superadmin: [
    'view:dashboard',
    'view:admin_panel',
    'action:moderate',
    'action:manage_projects',
    'action:approve_project',
    'action:freeze_project',
    'action:manage_crisis',
    'action:unlock_identity'
  ]
};

export const hasPermission = (userRole: Role, permission: Permission): boolean => {
  return PERMISSIONS[userRole]?.includes(permission) || false;
};

// Export as checkPermission alias to match usage in hooks
export const checkPermission = hasPermission;
