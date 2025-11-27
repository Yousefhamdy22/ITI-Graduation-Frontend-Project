
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Home
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent),
  },

  // Dashboard
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  

  // ======================
  {
    path: 'courses',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./entities/courses/courses.component')
            .then(m => m.CoursesComponent),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./entities/courses/course-form/course-form.component')
            .then(m => m.CourseFormComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./entities/courses/course-details/course-details.component')
            .then(m => m.CourseDetailsComponent),
      },
	  
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./entities/courses/course-form/course-form.component')
            .then(m => m.CourseFormComponent),
      },
    ],
  },

  
  // Students 
  {
    path: 'students',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./entities/students/students.component')
            .then(m => m.StudentsComponent),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./entities/students/student-form/student-form.component')
            .then(m => m.StudentFormComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./entities/students/student-details/student-details.component')
            .then(m => m.StudentDetailsComponent),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./entities/students/student-form/student-form.component')
            .then(m => m.StudentFormComponent),
      },
    ],
  },

  // ======================
  // Instructors
  // ======================
  {
    path: 'instructors',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./entities/instructors/instructors.component')
            .then(m => m.InstructorsComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./entities/instructors/instructor-details/instructor-details.component')
            .then(m => m.InstructorDetailsComponent),
      },
    ],
  },

  // ======================
  // Lessons
  // ======================
  {
    path: 'lessons',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./entities/lessons/lessons.component')
            .then(m => m.LessonsComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./entities/lessons/lesson-player/lesson-player.component')
            .then(m => m.LessonPlayerComponent),
      },
    ],
  },

  // ======================
  // Exams
  // ======================
  {
    path: 'exams',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./entities/exams/exams.component')
            .then(m => m.ExamsComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./entities/exams/exam-player/exam-player.component')
            .then(m => m.ExamPlayerComponent),
      },
    ],
  },

  // Fallback
  {
    path: '**',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent),
  },
];

