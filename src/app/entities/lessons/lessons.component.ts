import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LessonService } from './lesson.service';
import { Lesson } from './lesson.model';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {
  lessons: Lesson[] = [];
  filteredLessons: Lesson[] = [];
  loading = true;

  query = { search: '', courseId: '' };

  constructor(private lessonService: LessonService) {}

  ngOnInit(): void {
    this.loadLessons();
  }

  loadLessons() {
    this.loading = true;
    this.lessonService.getLessons().subscribe({
      next: (lessons) => {
        console.log('✅ الدروس وصلت:', lessons);
        this.lessons = lessons;
        this.filteredLessons = lessons;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ خطأ:', err);
        this.loading = false;
      }
    });
  }

  filterLessons() {
    let result = [...this.lessons];

    if (this.query.search) {
      const term = this.query.search.toLowerCase();
      result = result.filter(l =>
        l.title?.toLowerCase().includes(term) ||
        l.description?.toLowerCase().includes(term)
      );
    }

    if (this.query.courseId) {
      result = result.filter(l => l.courseId === this.query.courseId);
    }

    this.filteredLessons = result;
  }

  onSearch() {
    this.filterLessons();
  }

  onCourseFilter(courseId: string) {
    this.query.courseId = courseId;
    this.filterLessons();
  }
}
