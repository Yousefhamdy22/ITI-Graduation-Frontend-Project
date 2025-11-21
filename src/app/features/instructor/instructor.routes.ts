import { Routes } from '@angular/router';
import { RoleGuard } from '@core/auth/guards/role.guard';

export const INSTRUCTOR_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    canActivate: [RoleGuard],
    data: { roles: ['instructor', 'admin'] },
    loadComponent: () => import('./instructor-dashboard/instructor-dashboard.component').then(m => m.InstructorDashboardComponent)
  },
  {
    path: 'courses',
    canActivate: [RoleGuard],
    data: { roles: ['instructor', 'admin'] },
    loadComponent: () => import('./courses/instructor-courses.component').then(m => m.InstructorCoursesComponent)
  },
  {
    path: 'courses/:id',
    canActivate: [RoleGuard],
    data: { roles: ['instructor', 'admin'] },
    loadComponent: () => import('./courses/course-form/instructor-course-form.component').then(m => m.InstructorCourseFormComponent)
  },
  {
    path: 'courses/:id/curriculum',
    canActivate: [RoleGuard],
    data: { roles: ['instructor', 'admin'] },
    loadComponent: () => import('./courses/curriculum/course-curriculum.component').then(m => m.CourseCurriculumComponent)
  },
  {
    path: 'courses/:id/students',
    canActivate: [RoleGuard],
    data: { roles: ['instructor', 'admin'] },
    loadComponent: () => import('./students/course-students.component').then(m => m.CourseStudentsComponent)
  }
];
