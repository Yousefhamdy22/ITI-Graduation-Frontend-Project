
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CourseService } from '../course.service';
import { StudentService } from '../../students/student.service';
import { AuthService } from '../../../auth/auth.service';
import { Course } from '../course.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastService } from '../../../shared/toast.service';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  course: Course | null = null;
  loading = true;
  safePromoUrl: SafeResourceUrl | null = null;
  isInstructor = false;
  studentsInCourse: any[] = [];
  enrolled = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private studentService: StudentService,
    public auth: AuthService,
    private sanitizer: DomSanitizer,
    private toast: ToastService
  ) {}

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
        if (user && user.role === 'student' && c) {
          this.studentService.getStudentById(user.id).subscribe(s => {
            this.enrolled = !!(s && (s.enrolledCourseIds || []).includes(c.id));
          });
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  toggleEnroll() {
    const user = this.auth.currentUser;
    if (!user || user.role !== 'student' || !this.course) { this.toast.show('سجل دخول كطالب أولاً', 'warning'); return; }
    if (this.enrolled) {
      this.studentService.unenrollStudentFromCourse(user.id, this.course.id);
      this.enrolled = false;
      this.toast.show('تم إلغاء التسجيل', 'info');
    } else {
      this.studentService.enrollStudentInCourse(user.id, this.course.id);
      this.enrolled = true;
      this.toast.show('تم التسجيل في الكورس', 'success');
    }
  }
}