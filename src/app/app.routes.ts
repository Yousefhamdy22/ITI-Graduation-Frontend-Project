import { Routes } from '@angular/router';
import { AuthGuard } from '@core/auth/guards/auth.guard';
import { RoleGuard } from '@core/auth/guards/role.guard';
import { MainLayoutComponent } from '@app/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  },
  {
    path: 'courses',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    loadChildren: () => import('./features/courses/courses.routes').then(m => m.COURSES_ROUTES)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    loadChildren: () => import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES)
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    loadChildren: () => import('./features/settings/settings.routes').then(m => m.SETTINGS_ROUTES)
  },
  {
    path: 'users',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
    component: MainLayoutComponent,
    loadChildren: () => import('./features/users/users.routes').then(m => m.USERS_ROUTES)
  },
  {
    path: 'instructor',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['instructor', 'admin'] },
    component: MainLayoutComponent,
    loadChildren: () => import('./features/instructor/instructor.routes').then(m => m.INSTRUCTOR_ROUTES)
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
