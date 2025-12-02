import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExamService } from '../exam.service';
import { CourseService } from '../../courses/course.service';

@Component({
  selector: 'app-exam-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center p-6">
      <div class="w-full max-w-2xl bg-white p-6 rounded shadow">
        <h3 class="text-lg font-bold mb-4">إنشاء اختبار جديد</h3>

        <label class="block mb-2">العنوان</label>
        <input [(ngModel)]="title" class="w-full border rounded px-3 py-2 mb-3" />

        <label class="block mb-2">اختار دورة</label>
        <select [(ngModel)]="courseId" class="w-full border rounded px-3 py-2 mb-3">
          <option *ngFor="let c of courses" [value]="c.id">{{ c.title }}</option>
        </select>

        <label class="block mb-2">المدة (دقائق)</label>
        <input type="number" [(ngModel)]="duration" class="w-full border rounded px-3 py-2 mb-3" />

        <label class="block mb-2">نقطة النجاح (%)</label>
        <input type="number" [(ngModel)]="passingScore" class="w-full border rounded px-3 py-2 mb-3" />

        <div class="flex gap-2">
          <button (click)="create()" class="bg-blue-600 text-white px-4 py-2 rounded">أنشئ</button>
          <button (click)="cancel()" class="bg-gray-100 px-4 py-2 rounded">إلغاء</button>
        </div>
      </div>
    </div>
  `
})
export class ExamFormComponent {
  title = '';
  courseId = '';
  duration = 30;
  passingScore = 70;
  courses: any[] = [];

  constructor(private examService: ExamService, private courseService: CourseService, private router: Router) {
    this.courseService.getCourses().subscribe(list => {
      this.courses = list || [];
      if (this.courses.length && !this.courseId) this.courseId = this.courses[0].id;
    });
  }

  create() {
    const exam = {
      id: Date.now().toString(),
      courseId: this.courseId,
      title: this.title || 'اختبار جديد',
      description: '',
      duration: this.duration,
      passingScore: this.passingScore,
      questions: []
    };
    // use loadExams to append
    this.examService.getExams().subscribe(list => {
      const newList = [...(list || []), exam];
      this.examService.loadExams(newList);
      this.router.navigate(['/exams']);
    });
  }

  cancel() {
    this.router.navigate(['/exams']);
  }
}
