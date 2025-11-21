import { Routes } from '@angular/router';
import { RoleGuard } from '@core/auth/guards/role.guard';

export const COURSES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./courses-list.component').then(m => m.CoursesComponent)
  },
  {
    path: 'new',
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'instructor'] },
    loadComponent: () => import('./course-form/course-form.component').then(m => m.CourseFormComponent)
  },
  {
    path: ':slug',
    loadComponent: () => import('./course-detail/course-detail.component').then(m => m.CourseDetailComponent)
  },
  {
    path: ':slug/lecture/:lectureId',
    loadComponent: () => import('./lecture-player/lecture-player.component').then(m => m.LecturePlayerComponent)
  }
];
