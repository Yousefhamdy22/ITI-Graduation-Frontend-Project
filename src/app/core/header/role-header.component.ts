import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToastContainerComponent } from '../../shared/toast-container/toast-container.component';
import { AdminHeaderComponent } from './admin/admin-header.component';
import { InstructorHeaderComponent } from './instructor/instructor-header.component';
import { StudentHeaderComponent } from './student/student-header.component';
import { PublicHeaderComponent } from './public-header.component';
import { StudentService } from '../../entities/students/student.service';
import { EnrollmentService } from '../../entities/enrollments/enrollment.service';
import { EnrollmentDetails } from '../../entities/enrollments/enrollment.model';

@Component({
  selector: 'app-role-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastContainerComponent],
  templateUrl: './role-header.component.html',
  styleUrls: ['./role-header.component.css']
})
export class RoleHeaderComponent implements OnInit {
  user$!: Observable<any>;
  snapshotUser: any = null;
  loadingEnrollments = false;
  myEnrollments: EnrollmentDetails[] = [];
  showStudentDropdown = false;

  constructor(
    private auth: AuthService, 
    private router: Router, 
    private studentService: StudentService,
    private enrollmentService: EnrollmentService
  ) {
    // Initialize snapshot immediately in constructor
    this.snapshotUser = this.auth.currentUser;
  }

  ngOnInit() {
    this.user$ = this.auth.user$;

    // Subscribe to user changes and keep a snapshot
    this.auth.user$.subscribe(u => {
      this.snapshotUser = u || null;
      if (this.snapshotUser?.role === 'student') {
        this.loadStudentEnrollments();
      } else {
        this.myEnrollments = [];
      }
    });

    // On navigation end, update snapshot
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.snapshotUser = this.auth.currentUser;
      if (this.snapshotUser?.role === 'student') {
        this.loadStudentEnrollments();
      }
    });
  }

  getHomeRoute(): string {
    if (!this.snapshotUser) return '/';
    if (this.snapshotUser.role === 'admin') return '/admin/dashboard';
    return `/${this.snapshotUser.role}`;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  private loadStudentEnrollments() {
    // Double-check role to prevent accidental calls for non-students
    if (!this.snapshotUser?.id || this.snapshotUser.role !== 'student') return;
    this.loadingEnrollments = true;
    
    const studentId = this.snapshotUser.id; // Assuming userId = studentId
    
    // Backend doesn't have /api/Enrollments/student/{studentId} endpoint yet
    // Workaround: Get all enrollments and filter on frontend
    // Avoid calling API if there's no token (prevents unauthenticated 401s)
    let token: string | null = null;
    try {
      token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    } catch {}

    if (!token) {
      console.warn('Skipping enrollments fetch: no auth token available');
      this.loadingEnrollments = false;
      this.myEnrollments = [];
      return;
    }

    this.enrollmentService.getEnrollments().subscribe({
      next: (allEnrollments) => {
        // Filter enrollments for current student
        this.myEnrollments = (allEnrollments || []).filter(e => 
          e.studentId === studentId || (e.student as any)?.id === studentId
        );
        console.log('✅ Loaded enrollments:', this.myEnrollments.length, 'courses');
        this.loadingEnrollments = false;
      },
      error: (err) => {
        // Improve error diagnostics for network/auth issues
        if (err && err.status === 0) {
          console.error('Failed to load enrollments: Network/CORS or server aborted connection', err);
        } else {
          console.warn('Failed to load enrollments:', err);
        }
        this.loadingEnrollments = false;
        this.myEnrollments = [];
      }
    });
  }

  // Helpers for template rendering
  progress(enrollment: any): number {
    const p = enrollment && (enrollment.progress ?? enrollment?.course?.progress ?? null);
    return typeof p === 'number' && p >= 0 ? Math.min(100, Math.max(0, p)) : 0;
  }
  progressLabel(enrollment: any): string {
    const val = this.progress(enrollment);
    return val > 0 ? `${val}%` : '—';
  }
}
