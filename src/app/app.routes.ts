import {Routes} from '@angular/router';

export const routes: Routes = [
  // Default -> login
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./auth/student/student-login/student-login').then(m => m.StudentLogin),
  },

  // Home (after login for non-admin)
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/student/student-register/student-register').then(m => m.StudentRegister),
  },

  // Dashboard
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./auth/Admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
    data: {role: 'admin'},
    canActivate: [() => import('./auth/role.guard').then(m => m.RoleGuard as any)],
  },

  // Student landing
  {
    path: 'student',
    loadComponent: () => import('./auth/student/student-dashboard/student-dashboard').then(m => m.StudentDashboard),
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
    data: {role: 'admin'},
    canActivate: [() => import('./auth/role.guard').then(m => m.RoleGuard as any)],
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

  // Instructor landing


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
        path: 'new',
        loadComponent: () => import('./entities/exams/exam-course-picker/exam-course-picker.component').then(m => m.ExamCoursePickerComponent),
      },
      {
        path: 'assemble',
        loadComponent: () => import('./entities/exams/exam-assemble/exam-assemble.component').then(m => m.ExamAssembleComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./entities/exams/exam-player/exam-player.component')
            .then(m => m.ExamPlayerComponent),
      },
    ],
  },

  // Questions management
  {
    path: 'questions',
    children: [
      {
        path: '',
        loadComponent: () => import('./entities/questions/question-list/question-list.component').then(m => m.QuestionListComponent),
      },
      {
        path: 'new',
        loadComponent: () => import('./entities/questions/question-form/question-form.component').then(m => m.QuestionFormComponent),
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./entities/questions/question-form/question-form.component').then(m => m.QuestionFormComponent),
      },
    ],
  },

  // Certificates
  {
    path: 'certificates',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./entities/certificates/certificates.component')
            .then(m => m.CertificatesComponent),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./entities/certificates/certificate-form/certificate-form.component')
            .then(m => m.CertificateFormComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./entities/certificates/certificate-view/certificate-view.component')
            .then(m => m.CertificateViewComponent),
      },
    ],
  },

  // Fallback
  {
    path: 'search',
    loadComponent: () => import('./search/search.component').then(m => m.SearchComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/student/student-login/student-login').then(m => m.StudentLogin),
  },
  {
    path: 'admin',
    loadComponent: () => import('./auth/Admin/admin-login/admin-login').then(m => m.AdminLogin),
  },
  {
    path: 'instructor-login',
    loadComponent: () => import('./auth/instructor/instructor-login/instructor-login').then(m => m.InstructorLogin),
  },
  {
    path: 'instructor',
    loadComponent: () => import('./auth/instructor/instructor-dashboard/instructor-dashboard').then(m => m.InstructorDashboard),
    data: { role: 'instructor' },
    canActivate: [() => import('./auth/role.guard').then(m => m.RoleGuard as any)],
  },

  // Page not found / errors
  {
    path: '**',
    loadComponent: () => import('./notfound/notfound').then(m => m.Notfound),
  },
];
