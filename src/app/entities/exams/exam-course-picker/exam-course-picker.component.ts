import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CourseService } from '../../courses/course.service';
import { ToastService } from '../../../shared/toast.service';

@Component({
  selector: 'app-exam-course-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './exam-course-picker.component.html',
  styleUrls: ['./exam-course-picker.component.css']
})
export class ExamCoursePickerComponent implements OnInit {
  courses: any[] = [];
  selectedCourseId = '';
  loading = false;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.courseService.getCourses().subscribe({
      next: (list) => {
        this.courses = list || [];
        this.loading = false;
      },
      error: () => {
        this.toast.show('Error loading courses', 'error');
        this.loading = false;
      }
    });
  }

  getCourseTitle(courseId: string): string {
    const course = this.courses.find(c => c.id === courseId);
    return course ? course.title : '';
  }

  choose(): void {
    if (!this.selectedCourseId) {
      this.toast.show('Select a course first', 'warning');
      return;
    }
    // Navigate to exam form with filtered questions
    this.router.navigate(['/exams/form'], {
      queryParams: { courseId: this.selectedCourseId }
    });
  }

  cancel(): void {
    this.router.navigate(['/exams']);
  }
}
