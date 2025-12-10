import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ExamService } from './exam.service';
import { ExamListComponent } from './exam-list/exam-list.component';
import { Exam } from './exam.model';
import { ToastService } from '../../shared/toast.service';
import { CourseService } from '../courses/course.service';

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
  courses: any[] = [];

  query = { search: '', courseId: '' };

  constructor(
    private examService: ExamService,
    private courseService: CourseService,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.loadExams();
    this.loadCourses();
  }

  loadExams(): void {
    this.loading = true;
    this.examService.getExams().subscribe({
      next: (exams) => {
        this.exams = exams || [];
        this.filteredExams = exams || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('خطأ في تحميل الاختبارات:', err);
        this.toast.show('خطأ في تحميل الاختبارات', 'error');
        this.loading = false;
      }
    });
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses || [];
      },
      error: (err) => {
        console.error('خطأ في تحميل الكورسات:', err);
      }
    });
  }

  filterExams(): void {
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

  onSearch(): void {
    this.filterExams();
  }

  onCourseFilter(courseId: string): void {
    this.query.courseId = courseId;
    this.filterExams();
  }

  onEditExam(exam: Exam): void {
    this.router.navigate(['/exams', exam.id, 'edit']);
  }

  onDeleteExam(examId: string): void {
    if (confirm('هل أنت متأكد من حذف هذا الاختبار؟')) {
      this.examService.deleteExam(examId).subscribe({
        next: () => {
          this.toast.show('تم حذف الاختبار بنجاح', 'success');
          // No need to manually filter if we subscribe to exams$ in the template or re-load,
          // but since we are using local arrays 'exams' and 'filteredExams', let's just reload or filter.
          // The service emits new values to exams$, but we need to verify if we are subscribed to it.
          // logic in ngOnInit calls loadExams which acts as a one-time fetch.
          // Since we updated the behavior subject in service, let's just reload.
          this.loadExams();
        },
        error: (err) => {
          console.error('خطأ في الحذف:', err);
          this.toast.show('فشل حذف الاختبار', 'error');
        }
      });
    }
  }

  createNewExam(): void {
    this.router.navigate(['/exams/form']);
  }
}

