import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '@core/models/auth.model';

export const RoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as UserRole[];

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    if (authService.hasAnyRole(requiredRoles)) {
      return true;
    } else {
      router.navigate(['/dashboard']);
      return false;
    }
  }

  return true;
};
