import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CourseService } from './course.service';
import { Course } from './course.model';

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

  categories = [
    { key: '', label: 'كل الكورسات' },
    { key: 'web', label: 'تطوير الويب' },
    { key: 'ai', label: 'الذكاء الاصطناعي' },
    { key: 'devops', label: 'DevOps' },
    { key: 'security', label: 'الأمن السيبراني' }
  ];

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;
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
}