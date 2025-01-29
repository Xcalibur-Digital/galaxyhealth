import { useUser } from '../contexts/UserContext';

const ROLE_PERMISSIONS = {
  nurse: ['view_patients', 'edit_patients', 'view_appointments'],
  physician: ['view_patients', 'edit_patients', 'view_appointments', 'prescribe_medications'],
  practice_staff: ['view_patients', 'view_appointments', 'manage_scheduling'],
  analyst: ['view_reports', 'export_data', 'view_analytics']
};

export function RoleBasedComponent({ 
  requiredRoles, 
  requiredPermissions, 
  children, 
  fallback = null 
}) {
  const { user } = useUser();
  
  if (!user || !user.role) {
    return fallback;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return fallback;
  }

  if (requiredPermissions) {
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));
    if (!hasPermission) {
      return fallback;
    }
  }

  return children;
} 