import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ExamService } from './exam.service';
import { Exam } from './exam.model';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css']
})
export class ExamsComponent implements OnInit {
  exams: Exam[] = [];
  filteredExams: Exam[] = [];
  loading = true;

  query = { search: '', courseId: '' };

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams() {
    this.loading = true;
    this.examService.getExams().subscribe({
      next: (exams) => {
        console.log('✅ الاختبارات وصلت:', exams);
        this.exams = exams;
        this.filteredExams = exams;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ خطأ:', err);
        this.loading = false;
      }
    });
  }

  filterExams() {
    let result = [...this.exams];

    if (this.query.search) {
      const term = this.query.search.toLowerCase();
      result = result.filter(e =>
        e.title?.toLowerCase().includes(term) ||
        e.description?.toLowerCase().includes(term)
      );
    }

    if (this.query.courseId) {
      result = result.filter(e => e.courseId === this.query.courseId);
    }

    this.filteredExams = result;
  }

  onSearch() {
    this.filterExams();
  }

  onCourseFilter(courseId: string) {
    this.query.courseId = courseId;
    this.filterExams();
  }
}
