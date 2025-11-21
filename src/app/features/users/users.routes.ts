import { Routes } from '@angular/router';
import { RoleGuard } from '@core/auth/guards/role.guard';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () => import('./users-management.component').then(m => m.UsersManagementComponent)
  }
];
