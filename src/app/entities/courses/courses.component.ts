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
    { key: '', label: 'كل الكورسات' },
    { key: 'web', label: 'تطوير الويب' },
    { key: 'ai', label: 'الذكاء الاصطناعي' },
    { key: 'devops', label: 'DevOps' },
    { key: 'security', label: 'الأمن السيبراني' }
  ];

  constructor(private courseService: CourseService, public auth: AuthService, private studentService: StudentService, private toast: ToastService) {
    console.log('✅ CoursesComponent loaded successfully');
  }

  ngOnInit() {
    console.log('✅ CoursesComponent ngOnInit called');
    this.loadCourses();
    // enrolledIds is not checked here - each course page handles its own enrollment
    // This list is just for browsing, actual enrollment happens in course-details
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
    // Simply ignore - enrollment is handled in course-details page
    // This is just for UI display purposes
    this.toast.show('اضغط على الكورس لعرض التفاصيل والتسجيل', 'info');
  }
}