import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastService } from '../shared/toast.service';

/**
 * RoleGuard: Verifies user has required role after AuthGuard checks authentication.
 * Should be used in combination with AuthGuard.
 * Checks: User role matches route's required role.
 */
export const RoleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);
  
  // Support both single role and multiple roles
  const requiredRole = route.data?.['role'] as string | undefined;
  const requiredRoles = route.data?.['roles'] as string[] | undefined;
  const user = auth.currentUser;

  if (!user) {
    console.error('❌ RoleGuard: No user found. Redirecting to login.');
    const loginPath = requiredRole === 'admin' ? '/admin/login' : requiredRole === 'instructor' ? '/instructor/login' : '/login';
    router.navigate([loginPath]);
    return false;
  }

  // Check single role
  if (requiredRole && user.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    console.error(`❌ RoleGuard: User role '${user.role}' does not match required role '${requiredRole}'.`);
    toast.show(`ليس لديك صلاحيات الوصول`, 'error');
    router.navigate(['/']);
    return false;
  }

  // Check multiple roles (user must have at least one)
  if (requiredRoles && requiredRoles.length > 0) {
    const userRoleLower = user.role?.toLowerCase();
    const hasRequiredRole = requiredRoles.some(r => r.toLowerCase() === userRoleLower);
    
    if (!hasRequiredRole) {
      console.error(`❌ RoleGuard: User role '${user.role}' not in required roles [${requiredRoles.join(', ')}]`);
      toast.show(`ليس لديك صلاحيات الوصول`, 'error');
      router.navigate(['/']);
      return false;
    }
  }

  console.log(`✅ RoleGuard: User '${user.email}' authorized (role: ${user.role})`);
  return true;
};
