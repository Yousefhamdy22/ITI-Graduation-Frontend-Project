import { Component, OnInit, afterNextRender, Injector, inject } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { Router, RouterLink, RouterModule } from "@angular/router";

import { SidebarComponent } from "../../../core/sidebar/sidebar.component";

import { TrendChartComponent } from "./trend-chart.component";

import { Observable } from 'rxjs';

import { DashboardService } from './dashboard.service';

import { StudentService } from '../../../entities/students/student.service';

import { InstructorService } from '../../../entities/instructors/instructor.service';

import { CourseService } from '../../../entities/courses/course.service';

import { ExamService } from '../../../entities/exams/exam.service';

import { ToastService } from '../../../shared/toast.service';

import { AuthService } from '../../auth.service';

import { CommonModule } from '@angular/common';

import { Exam } from '../../../entities/exams/exam.model';
import { Instructor } from '../../../entities/instructors/instructor.model';

import { RoleHeaderComponent } from '../../../core/header/role-header.component';

import { FooterComponent } from '../../../core/footer/footer.component';

import { ExamFormModalComponent } from '../../../shared/exam-form-modal/exam-form-modal.component';

@Component({

  selector: 'app-admin-dashboard',

  imports: [CommonModule, RouterModule, FormsModule, TrendChartComponent, SidebarComponent, RoleHeaderComponent, ExamFormModalComponent],



  templateUrl: './admin-dashboard.html',

})

export class AdminDashboard implements OnInit {

  stats$: any;



  // students for table

  students$: Observable<any[]>;

  filteredStudents: any[] = [];



  // instructors for table

  instructors$: Observable<any[]>;

  filteredInstructors: any[] = [];



  // exams for table

  exams: Exam[] = [];

  filteredExams: Exam[] = [];



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
  totalExams = 0;

  // Modal
  showExamModal = false;

  // Enhanced stats from DarElKetab
  stats = {
    totalStudents: 0,
    activeStudents: 0,
    totalTeachers: 0,
    activeTeachers: 0,
    totalGroups: 0,
    pendingRegistrations: 0,
    monthlyRevenue: 0,
    attendanceRate: 0
  };

  // Pending actions that need admin attention
  pendingActions = [
    { type: 'registration', title: 'طلبات التسجيل الجديدة', count: 5, priority: 'high', icon: 'pi-user-plus', color: 'blue' },
    { type: 'payment', title: 'المدفوعات المعلقة', count: 8, priority: 'medium', icon: 'pi-credit-card', color: 'amber' },
    { type: 'teacher', title: 'طلبات إجازة المعلمين', count: 2, priority: 'medium', icon: 'pi-calendar-times', color: 'purple' },
    { type: 'complaint', title: 'شكاوى ومقترحات', count: 3, priority: 'low', icon: 'pi-exclamation-triangle', color: 'red' }
  ];

  // Recent activities
  recentActivities = [
    { type: 'student', message: 'تم قبول طالب جديد: أحمد محمد', time: '5 دقائق', icon: 'pi-user-plus', color: 'green' },
    { type: 'payment', message: 'تم استلام رسوم شهرية: 2,500 جنيه', time: '15 دقيقة', icon: 'pi-money-bill', color: 'blue' },
    { type: 'teacher', message: 'المعلم خالد العبدالله سجل حضوره', time: '30 دقيقة', icon: 'pi-check-circle', color: 'teal' },
    { type: 'system', message: 'تم إنشاء تقرير شهري جديد', time: 'ساعة', icon: 'pi-file', color: 'purple' }
  ];

  // Critical alerts
  criticalAlerts = [
    { type: 'attendance', message: 'معدل الحضور انخفض إلى 87%', severity: 'warning' },
    { type: 'payment', message: '8 طلاب لم يدفعوا الرسوم الشهرية', severity: 'error' },
    { type: 'capacity', message: 'مجموعة الحفظ المتقدم وصلت للحد الأقصى', severity: 'info' }
  ];



  // trend data for charts

  enrollmentTrend: number[] = [];

  trendLabels: string[] = [];



  // UI state

  query = '';

  instructorQuery = '';

  examQuery = '';

  page = 1;

  pageSize = 5;

  activeTab = 'students'; // students | instructors | exams



  constructor(
    private dashboardservice: DashboardService,
    private studentService: StudentService,
    private instructorService: InstructorService,
    private courseService: CourseService,
    private examService: ExamService,
    private toast: ToastService,
    private router: Router,
    private auth: AuthService,
    private injector: Injector
  ) {

    this.students$ = this.studentService.getStudents();

    this.instructors$ = this.instructorService.getInstructors();

    this.stats$ = this.dashboardservice.stats$;



    // Move HTTP calls to afterNextRender to avoid SSR issues

    afterNextRender(() => {

      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ No authentication token found! Redirecting to login...');
        this.toast.show('You must login first', 'error');
        this.router.navigate(['/admin/login']);
        return;
      }

      // courses

      this.courseService.getCourses().subscribe({
        next: (list: any) => {
          this.totalCourses = (list || []).length;
        },
        error: (err: any) => {
          console.error('❌ Failed to load courses:', err);
          if (err.status === 401) {
            this.toast.show('Session expired - Please login again', 'error');
            localStorage.removeItem('token');
            this.router.navigate(['/admin/login']);
          }
        }
      });



      // keep a live list for simple client-side search/pagination

      this.students$.subscribe({
        next: (list: any) => {
          this.filteredStudents = list || [];
          // compute totals and enrollments
          this.totalStudents = (list || []).length;
          this.totalEnrollments = (list || []).reduce((acc: number, s: any) => acc + ((s.enrolledCourseIds || []).length || 0), 0);
          // Update enhanced stats
          this.stats.totalStudents = this.totalStudents;
          this.stats.activeStudents = (list || []).filter((s: any) => s.active !== false).length;
          // compute trend (last 6 months)
          this.computeEnrollmentTrend(list || []);
        },
        error: (err: any) => {
          console.error('❌ Failed to load students:', err);
          if (err.status === 401) {
            this.toast.show('Session expired - Please login again', 'error');
            localStorage.removeItem('token');
            this.router.navigate(['/admin/login']);
          }
        }
      });



      this.instructors$.subscribe({
        next: (list: any) => {
          this.filteredInstructors = list || [];
          this.totalInstructors = (list || []).length;
          // Update enhanced stats
          this.stats.totalTeachers = this.totalInstructors;
          this.stats.activeTeachers = (list || []).filter((i: any) => i.active !== false).length;
        },
        error: (err: any) => {
          console.error('❌ Failed to load instructors:', err);
          if (err.status === 401) {
            this.toast.show('Session expired - Please login again', 'error');
            localStorage.removeItem('token');
            this.router.navigate(['/admin/login']);
          }
        }
      });



      // تحميل الاختبارات

      this.examService.getExams().subscribe({
        next: (list: any) => {
          this.exams = list || [];
          this.totalExams = this.exams.length;
          this.filterExams();
        },
        error: (err: any) => {
          console.error('❌ Failed to load exams:', err);
          if (err.status === 401) {
            this.toast.show('Session expired - Please login again', 'error');
            localStorage.removeItem('token');
            this.router.navigate(['/admin/login']);
          }
        }
      });

    }, { injector: this.injector });

  }



  ngOnInit(): void {

    // initialization is done in constructor

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



  // ============ STUDENTS ============

  onSearch() {

    const q = (this.query || '').trim();

    this.studentService.getStudents().subscribe((list: any) => {

      this.filteredStudents = (list || []).filter((s: any) => {

        const term = q || '';

        return (

          !term ||

          s.firstName?.toLowerCase().includes(term.toLowerCase()) ||

          s.lastName?.toLowerCase().includes(term.toLowerCase()) ||

          s.phoneNumber?.includes(term)

        );

      });

      this.page = 1;

    });

  }



  clearSearch() {

    this.query = '';

    this.onSearch();

  }



  goToStudent(id: string) {

    this.router.navigate(['/students', id]);

  }



  addStudent() {

    if (!this.newStudentName || !this.newStudentEmail) {

      this.toast.show('أدخل اسم وبريد الطالب', 'warning');

      return;

    }

    const nameParts = this.newStudentName.trim().split(' ');

    const s = this.studentService.addStudent({ firstName: nameParts[0] || '', lastName: nameParts.slice(1).join(' ') || '', email: this.newStudentEmail });

    this.newStudentName = this.newStudentEmail = '';

    this.toast.show('تم إضافة الطالب', 'success');

  }



  deleteStudent(id: string) {

    if (!confirm('هل أنت متأكد من حذف هذا الطالب؟')) return;

    const ok = this.studentService.deleteStudent(id);

    if (ok) this.toast.show('تم حذف الطالب', 'info');

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



  // ============ INSTRUCTORS ============

  onInstructorSearch() {

    const q = (this.instructorQuery || '').trim().toLowerCase();

    this.instructorService.getInstructors().subscribe((list: any) => {

      this.filteredInstructors = (list || []).filter((i: Instructor) => {

        return !q || (i.firstName || '').toLowerCase().includes(q) || (i.lastName || '').toLowerCase().includes(q) || (i.email || '').toLowerCase().includes(q);

      });

    });

  }



  goToInstructor(id: string) {

    this.router.navigate(['/instructors', id]);

  }



  addInstructor() {

    if (!this.newInstructorName || !this.newInstructorEmail) {

      this.toast.show('أدخل اسم وبريد المدرب', 'warning');

      return;

    }

    const nameParts = this.newInstructorName.trim().split(' ');

    const firstName = nameParts[0] || '';

    const lastName = nameParts.slice(1).join(' ') || '';

    this.instructorService.createInstructor({ firstName, lastName, email: this.newInstructorEmail }).subscribe(() => {

      this.newInstructorName = this.newInstructorEmail = '';

      this.toast.show('تم إضافة المدرب', 'success');

    });

  }



  deleteInstructor(id: string) {

    if (!confirm('هل أنت متأكد من حذف هذا المدرب؟')) return;

    const ok = this.instructorService.removeInstructor(id);

    if (ok) this.toast.show('تم حذف المدرب', 'info');

  }



  // ============ EXAMS ============

  filterExams(): void {

    let result = [...this.exams];



    if (this.examQuery) {

      const term = this.examQuery.toLowerCase();

      result = result.filter(e =>

        e.title?.toLowerCase().includes(term) ||

        e.description?.toLowerCase().includes(term)

      );

    }



    this.filteredExams = result;

  }



  onExamSearch(): void {

    this.filterExams();

  }



  createNewExam(): void {

    this.showExamModal = true;

  }



  onExamFormSuccess(): void {

    this.showExamModal = false;

    // إعادة تحميل الاختبارات

    this.examService.getExams().subscribe((list: any) => {

      this.exams = list || [];

      this.filterExams();

    });

  }



  closeExamModal(): void {

    this.showExamModal = false;

  }



  viewExamDetails(examId: string): void {

    this.router.navigate(['/exams', examId]);

  }



  editExam(examId: string): void {

    this.router.navigate(['/exams', examId, 'edit']);

  }



  deleteExam(examId: string): void {

    if (!confirm('هل أنت متأكد من حذف هذا الاختبار؟')) return;



    const exam = this.exams.find(e => e.id === examId);

    if (!exam) return;



    this.examService.updateExam(examId, { ...exam, id: '' });

    this.exams = this.exams.filter(e => e.id !== examId);

    this.totalExams = this.exams.length;

    this.filterExams();

    this.toast.show('تم حذف الاختبار بنجاح', 'success');

  }



  // ============ GENERAL ============

  logout() {

    this.auth.logout();

    this.router.navigate(['/']);

  }



  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  // Helper methods from DarElKetab
  handlePendingAction(action: any) {
    console.log('Handling action:', action);
    // Navigate to specific management page based on action type
    switch (action.type) {
      case 'registration':
        this.router.navigate(['/students']);
        break;
      case 'payment':
        this.router.navigate(['/financial']);
        break;
      case 'teacher':
        this.router.navigate(['/instructors']);
        break;
      default:
        break;
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  }

}