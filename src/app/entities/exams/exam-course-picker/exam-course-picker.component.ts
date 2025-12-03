import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from '../../courses/course.service';
import { ToastService } from '../../../shared/toast.service';

@Component({
  selector: 'app-exam-course-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam-course-picker.component.html',
  styleUrls: ['./exam-course-picker.component.css']
})
export class ExamCoursePickerComponent implements OnInit {
  courses: any[] = [];
  selectedCourseId = '';

  constructor(private courseService: CourseService, private router: Router, private toast: ToastService) {}

  ngOnInit() {
    this.courseService.getCourses().subscribe(list => this.courses = list || []);
  }

  choose() {
    if (!this.selectedCourseId) { this.toast.show('اختر كورس أولاً', 'warning'); return; }
    // navigate to questions list filtered for this course in exam selection mode
    this.router.navigate(['/questions'], { queryParams: { courseId: this.selectedCourseId, forExam: 1 } });
  }

  cancel() {
    this.router.navigate(['/exams']);
  }
}
