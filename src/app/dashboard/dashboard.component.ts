
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardService } from './dashboard.service';
import { StudentService } from '../entities/students/student.service';
import { InstructorService } from '../entities/instructors/instructor.service';
import { CourseService } from '../entities/courses/course.service';
import { ToastService } from '../shared/toast.service';
import { AuthService } from '../auth/auth.service';
import { Observable, combineLatest, map } from 'rxjs';
import { TrendChartComponent } from './trend-chart.component';
import { SidebarComponent } from '../core/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TrendChartComponent, SidebarComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  stats$: any;

  // students for table
  students$: Observable<any[]>;
  filteredStudents: any[] = [];

  // instructors for table
  instructors$: Observable<any[]>;
  filteredInstructors: any[] = [];

  // add forms
  newStudentName = '';
  newStudentEmail = '';
  newInstructorName = '';
  newInstructorEmail = '';
  // totals
  totalStudents = 0;
  totalInstructors = 0;
  totalCourses = 0;
  totalEnrollments = 0;

  // trend data for charts
  enrollmentTrend: number[] = [];
  trendLabels: string[] = [];

  // UI state
  query = '';
  instructorQuery = '';
  page = 1;
  pageSize = 5;

  constructor(
    private dashboardservice: DashboardService,
    private studentService: StudentService,
    private instructorService: InstructorService,
    private courseService: CourseService,
    private toast: ToastService,
    private router: Router,
    private auth: AuthService
  ) {
    this.students$ = this.studentService.getStudents();
    this.instructors$ = this.instructorService.getInstructors();
    // courses
    this.courseService.getCourses().subscribe(list => {
      this.totalCourses = (list || []).length;
    });
    this.stats$ = this.dashboardservice.stats$;
    // keep a live list for simple client-side search/pagination
    this.students$.subscribe(list => {
      this.filteredStudents = list || [];
      // compute totals and enrollments
      this.totalStudents = (list || []).length;
      this.totalEnrollments = (list || []).reduce((acc: number, s: any) => acc + ((s.enrolledCourseIds || []).length || 0), 0);
      // compute trend (last 6 months)
      this.computeEnrollmentTrend(list || []);
    });

    this.instructors$.subscribe(list => {
      this.filteredInstructors = list || [];
      this.totalInstructors = (list || []).length;
    });
  }

  private computeEnrollmentTrend(students: any[]) {
    const months = 6;
    const now = new Date();
    const labels: string[] = [];
    const counts: number[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(dt.toLocaleString(undefined, { month: 'short' }));
      const keyYear = dt.getFullYear();
      const keyMonth = dt.getMonth();

      let count = 0;
      for (const s of students) {
        if (!s || !s.joinDate) continue;
        const jd = new Date(s.joinDate);
        if (jd.getFullYear() === keyYear && jd.getMonth() === keyMonth) {
          count += (s.enrolledCourseIds || []).length || 0;
        }
      }
      counts.push(count);
    }

    this.enrollmentTrend = counts;
    this.trendLabels = labels;
  }

  onSearch() {
    const q = (this.query || '').trim();
    this.studentService.getStudents().subscribe(list => {
      this.filteredStudents = (list || []).filter(s => {
        const term = q || '';
        return (
          !term ||
          s.name?.toLowerCase().includes(term.toLowerCase()) ||
          s.phone?.includes(term)
        );
      });
      this.page = 1;
    });
  }

  onInstructorSearch() {
    const q = (this.instructorQuery || '').trim().toLowerCase();
    this.instructorService.getInstructors().subscribe(list => {
      this.filteredInstructors = (list || []).filter(i => {
        return !q || (i.name || '').toLowerCase().includes(q) || (i.email || '').toLowerCase().includes(q);
      });
    });
  }

  clearSearch() {
    this.query = '';
    this.onSearch();
  }

  goToStudent(id: string) {
    this.router.navigate(['/students', id]);
  }

  goToInstructor(id: string) {
    this.router.navigate(['/instructors', id]);
  }

  addStudent() {
    if (!this.newStudentName || !this.newStudentEmail) {
      this.toast.show('أدخل اسم وبريد الطالب', 'warning');
      return;
    }
    const s = this.studentService.addStudent({ name: this.newStudentName, email: this.newStudentEmail });
    this.newStudentName = this.newStudentEmail = '';
    this.toast.show('تم إضافة الطالب', 'success');
  }

  deleteStudent(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا الطالب؟')) return;
    const ok = this.studentService.deleteStudent(id);
    if (ok) this.toast.show('تم حذف الطالب', 'info');
  }

  addInstructor() {
    if (!this.newInstructorName || !this.newInstructorEmail) { this.toast.show('أدخل اسم وبريد المدرب', 'warning'); return; }
    this.instructorService.addInstructor({ name: this.newInstructorName, email: this.newInstructorEmail });
    this.newInstructorName = this.newInstructorEmail = '';
    this.toast.show('تم إضافة المدرب', 'success');
  }

  deleteInstructor(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا المدرب؟')) return;
    const ok = this.instructorService.deleteInstructor(id);
    if (ok) this.toast.show('تم حذف المدرب', 'info');
  }

  get pagedStudents() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredStudents.slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.max(1, Math.ceil(this.filteredStudents.length / this.pageSize));
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }

  nextPage() {
    if (this.page < this.totalPages()) this.page++;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
