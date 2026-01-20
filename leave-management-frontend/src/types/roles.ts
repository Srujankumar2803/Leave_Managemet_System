/**
 * Role type definition - matches backend role enum
 */
export type Role = 'EMPLOYEE' | 'MANAGER' | 'ADMIN';

/**
 * Check if user has required role
 * @param userRole - The user's current role
 * @param allowedRoles - Array of roles that are allowed access
 * @returns true if user role is in allowedRoles
 */
export const hasRole = (userRole: Role | undefined | null, allowedRoles: Role[]): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};
