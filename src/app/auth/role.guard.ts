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
  
  const required = route.data?.['role'] as string | undefined;
  const user = auth.currentUser;

  if (!user) {
    console.error('❌ RoleGuard: No user found. Redirecting to login.');
    const loginPath = required === 'admin' ? '/admin/login' : required === 'instructor' ? '/instructor/login' : '/student-login';
    router.navigate([loginPath]);
    return false;
  }

  if (required && user.role?.toLowerCase() !== required.toLowerCase()) {
    console.error(`❌ RoleGuard: User role '${user.role}' does not match required role '${required}'.`);
    toast.show(`ليس لديك صلاحيات الوصول إلى ${required}`, 'error');
    router.navigate(['/home']);
    return false;
  }

  console.log(`✅ RoleGuard: User '${user.email}' authorized for role '${required}'`);
  return true;
};
