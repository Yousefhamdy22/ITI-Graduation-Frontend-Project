import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const RoleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const required = route.data?.['role'] as string | undefined;
  const user = auth.currentUser;
  if (!user) {
    router.navigate(['/login']);
    return false;
  }
  if (required && user.role !== required) {
    // redirect to home if not authorized
    router.navigate(['/home']);
    return false;
  }
  return true;
};
