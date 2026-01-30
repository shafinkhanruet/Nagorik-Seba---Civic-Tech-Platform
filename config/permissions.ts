import { Role } from '../types';

// Define all available permissions in the system
export type Permission = 
  | 'view:admin_panel'
  | 'view:sensitive_data'
  | 'action:vote'
  | 'action:report'
  | 'action:comment'
  | 'action:moderate'
  | 'action:freeze_project'
  | 'action:approve_project'
  | 'action:manage_crisis'
  | 'action:unlock_identity'
  | 'action:upload_court_order'
  | 'action:manage_districts'
  | 'action:manage_rti';

// The centralized Matrix
export const ROLE_PERMISSIONS: Record<Role, Permission[] | '*'> = {
  citizen: [
    'action:vote',
    'action:report',
    'action:comment'
  ],
  moderator: [
    'view:admin_panel',
    'action:vote',
    'action:comment',
    'action:moderate',
    'view:sensitive_data' // Can view reports but not unlock identities
  ],
  admin: [
    'view:admin_panel',
    'view:sensitive_data',
    'action:vote',
    'action:comment',
    'action:moderate',
    'action:freeze_project',
    'action:approve_project',
    'action:manage_districts',
    'action:upload_court_order',
    'action:manage_rti'
  ],
  superadmin: '*' // Wildcard: Can do everything
};

// Helper to check permission
export const checkPermission = (role: Role, permission: Permission): boolean => {
  const permissions = ROLE_PERMISSIONS[role];
  if (permissions === '*') return true;
  return permissions.includes(permission);
};