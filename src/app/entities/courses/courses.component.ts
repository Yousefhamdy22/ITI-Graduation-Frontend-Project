import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CourseService } from './course.service';
import { Course } from './course.model';
import { AuthService } from '../../auth/auth.service';
import { StudentService } from '../students/student.service';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  loading = true;

  query = { search: '', category: '' };

  enrolledIds = new Set<string>();

  categories = [
    { key: '', label: 'All Courses' },
    { key: 'web', label: 'Web Development' },
    { key: 'ai', label: 'Artificial Intelligence' },
    { key: 'devops', label: 'DevOps' },
    { key: 'security', label: 'Cyber Security' }
  ];

  constructor(private courseService: CourseService, public auth: AuthService, private studentService: StudentService, private toast: ToastService) { }

  ngOnInit() {
    this.loadCourses();
    const user = this.auth.currentUser;
    if (user && user.role === 'student') {
      this.studentService.getStudentById(user.id).subscribe({
        next: (s) => {
          if (s && s.enrolledCourseIds) {
            this.enrolledIds = new Set(s.enrolledCourseIds);
          }
        },
        error: (err) => {
          console.warn('Could not fetch student enrollments:', err);
          this.enrolledIds = new Set();
        }
      });
      // Subscribe to updates to keep enrolledIds in sync
      this.studentService.getStudents().subscribe(list => {
        const u = this.auth.currentUser;
        if (u && u.role === 'student') {
          const me = (list || []).find(x => x.id === u.id);
          if (me && me.enrolledCourseIds) this.enrolledIds = new Set(me.enrolledCourseIds);
        }
      });
    }
  }

  loadCourses() {
    this.loading = true;
    const user = this.auth.currentUser;
    if (user && user.role === 'instructor') {
      // show only courses taught by this instructor
      this.courseService.getCourses().subscribe({
        next: (courses) => {
          const mine = (courses || []).filter(c => (c as any).instructorId === user.id || c.instructorName === user.name);
          this.courses = mine;
          this.filteredCourses = mine;
          this.loading = false;
        },
        error: (err) => { console.error(err); this.loading = false; }
      });
      return;
    }

    this.courseService.getCourses().subscribe({
      next: (courses) => {
        console.log('✅ الكورسات وصلت:', courses);
        this.courses = courses;
        this.filteredCourses = courses;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ خطأ:', err);
        this.loading = false;
      }
    });
  }

  filterCourses() {
    let result = [...this.courses];

    // البحث
    if (this.query.search) {
      const term = this.query.search.toLowerCase();
      result = result.filter(c =>
        c.title?.toLowerCase().includes(term) ||
        c.instructorName?.toLowerCase().includes(term)
      );
    }

    // التصنيف (إذا اخترت فئة معينة)
    if (this.query.category && this.query.category !== '') {
      result = result.filter(c => c.categoryKey === this.query.category);
    }

    this.filteredCourses = result;
    console.log('🔍 بعد التصفية:', { category: this.query.category, count: result.length });
  }

  onSearch() {
    this.filterCourses();
  }

  onCategory(cat: string) {
    this.query.category = cat;
    this.filterCourses();
  }

  isCurrentUserEnrolled(courseId: string) {
    return this.enrolledIds.has(courseId);
  }

  toggleEnroll(courseId: string) {
    const user = this.auth.currentUser;
    if (!user || user.role !== 'student') { this.toast.show('Login as student first', 'warning'); return; }
    const enrolled = this.enrolledIds.has(courseId);
    if (enrolled) {
      this.studentService.unenrollStudentFromCourse(user.id, courseId);
      this.enrolledIds.delete(courseId);
      this.toast.show('Unenrolled successfully', 'info');
    } else {
      this.studentService.enrollStudentInCourse(user.id, courseId);
      this.enrolledIds.add(courseId);
      this.toast.show('Enrolled successfully', 'success');
    }
  }
}