
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CourseService } from '../course.service';
import { LectureService } from '../../lectures/lecture.service';
import { StudentService } from '../../students/student.service';
import { EnrollmentService } from '../../enrollments/enrollment.service';
import { AuthService } from '../../../auth/auth.service';
import { Course } from '../course.model';
import { Lecture } from '../../lectures/lecture.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastService } from '../../../shared/toast.service';
import { RoleHeaderComponent } from '../../../core/header/role-header.component';
import { FooterComponent } from '../../../core/footer/footer.component';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, RouterModule, RoleHeaderComponent, FooterComponent],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  course: Course | null = null;
  lectures: Lecture[] = [];
  loading = true;
  safePromoUrl: SafeResourceUrl | null = null;
  isInstructor = false;
  studentsInCourse: any[] = [];
  enrolled = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private lectureService: LectureService,
    private studentService: StudentService,
    private enrollmentService: EnrollmentService,
    public auth: AuthService,
    private sanitizer: DomSanitizer,
    private toast: ToastService
  ) {}

  // Navigate to payment page for client-side payment flow
  goToPayment() {
    if (!this.course) return;
    // Navigate to /payment with courseId and price
    (window as any).location.href = `/payment?courseId=${this.course.id}&price=${this.course.price || 0}`;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.loading = false; return; }

    this.courseService.getCourseById(id).subscribe({
      next: (c) => {
        this.course = c;
        this.safePromoUrl = c?.promoVideoUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(c.promoVideoUrl) : null;
        // check instructor
        const user = this.auth.currentUser;
        if (user && user.role === 'instructor' && c) {
          this.isInstructor = (c as any).instructorId === user.id || c.instructorName === user.name;
          if (this.isInstructor) {
            this.studentService.getStudents().subscribe(list => {
              this.studentsInCourse = (list || []).filter(s => (s.enrolledCourseIds || []).includes(c!.id));
            });
          }
        }
        // if current user is student, check enrollment
        // Use getStudentByUserId because user.id is the userId, not studentId
        if (user && user.role === 'student' && c) {
          this.studentService.getStudentByUserId(user.id).subscribe({
            next: (s) => {
              this.enrolled = !!(s && (s.enrolledCourseIds || []).includes(c.id));
            },
            error: (err) => {
              // Silently fail - backend might not have this endpoint ready
              console.warn('⚠️ Student enrollment check failed (backend may not be ready):', err.status);
              this.enrolled = false;
            }
          });
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });

    // Load lectures for this course
    // Note: Backend expects moduleId, not courseId. Currently courses don't have modules yet.
    // Silently fail until backend implements course modules properly
    this.lectureService.getLecturesByModule(id).subscribe({
      next: (lectures) => {
        this.lectures = lectures || [];
      },
      error: () => {
        // Silently fail - backend not ready yet
        this.lectures = [];
      }
    });
  }

  toggleEnroll() {
    const user = this.auth.currentUser;
    if (!user || user.role !== 'student' || !this.course) { 
      this.toast.show('سجل دخول كطالب أولاً', 'warning'); 
      return; 
    }
    
    // Try using userId directly as studentId (backend limitation workaround)
    // If backend has /api/Students/user/{userId} endpoint, we should use that instead
    const studentId = user.id; // Assuming userId = studentId for now
    
    if (this.enrolled) {
      // TODO: Get enrollmentId and cancel it
      // For now, just update UI
      this.toast.show('إلغاء الاشتراك غير متاح حالياً', 'info');
    } else {
      // Create enrollment directly with userId
      this.enrollmentService.createEnrollment(studentId, this.course!.id).subscribe({
        next: () => {
          this.enrolled = true;
          this.toast.show('تم التسجيل في الكورس بنجاح! 🎉', 'success');
          // Reload page to show updated enrollment status in header
          window.location.reload();
        },
        error: (err) => {
          console.error('Enrollment failed:', err);
          if (err.status === 404) {
            this.toast.show('لم يتم العثور على بيانات الطالب. يرجى التواصل مع الإدارة.', 'error');
          } else {
            this.toast.show('فشل التسجيل في الكورس', 'error');
          }
        }
      });
    }
  }
}