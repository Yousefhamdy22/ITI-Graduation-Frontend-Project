import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LessonService } from './lesson.service';
import { Lecture } from './lesson.model';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {
  lessons: Lecture[] = [];
  filteredLessons: Lecture[] = [];
  loading = true;

  query = { search: '', moduleId: '' };

  constructor(private lessonService: LessonService) { }

  ngOnInit(): void {
    // Note: getLessons() is deprecated, but we use it for backward compatibility
    // In production, you should load lectures by moduleId using getLecturesByModule()
    this.loadLessons();
  }

  loadLessons() {
    this.loading = true;
    this.lessonService.getLessons().subscribe({
      next: (lectures) => {
        console.log('✅ المحاضرات وصلت:', lectures);
        this.lessons = lectures;
        this.filteredLessons = lectures;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ خطأ:', err);
        this.loading = false;
      }
    });
  }

  /**
   * Load lectures for a specific module
   * @param moduleId - The module ID to load lectures for
   */
  loadLecturesByModule(moduleId: string) {
    this.loading = true;
    this.lessonService.getLecturesByModule(moduleId).subscribe({
      next: (lectures) => {
        console.log('✅ محاضرات الوحدة وصلت:', lectures);
        this.lessons = lectures;
        this.filteredLessons = lectures;
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
        l.title?.toLowerCase().includes(term)
      );
    }

    if (this.query.moduleId) {
      result = result.filter(l => l.moduleId === this.query.moduleId);
    }

    this.filteredLessons = result;
  }

  onSearch() {
    this.filterLessons();
  }

  onModuleFilter(moduleId: string) {
    this.query.moduleId = moduleId;
    this.filterLessons();
  }

  /**
   * Format duration from TimeSpan string to readable format
   * @param duration - TimeSpan string (e.g., "01:30:00")
   * @returns Formatted duration string
   */
  formatDuration(duration: string): string {
    if (!duration) return '0';
    const parts = duration.split(':');
    const hours = parseInt(parts[0] || '0');
    const minutes = parseInt(parts[1] || '0');

    if (hours > 0) {
      return `${hours} ساعة و ${minutes} دقيقة`;
    }
    return `${minutes} دقيقة`;
  }

  /**
   * Get duration in minutes for display
   * @param duration - TimeSpan string
   * @returns Total minutes
   */
  getDurationInMinutes(duration: string): number {
    if (!duration) return 0;
    const parts = duration.split(':');
    const hours = parseInt(parts[0] || '0');
    const minutes = parseInt(parts[1] || '0');
    return hours * 60 + minutes;
  }
}
