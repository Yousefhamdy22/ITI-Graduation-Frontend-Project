import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionService } from '../../questions/question.service';
import { firstValueFrom } from 'rxjs';
import { ExamService } from '../exam.service';
import { CourseService } from '../../courses/course.service';

@Component({
  selector: 'app-exam-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen p-6 bg-gray-50">
      <div class="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">إنشاء اختبار جديد</h3>
          <div class="flex gap-2">
            <a routerLink="/questions/new" class="px-3 py-1 bg-[#0E4D67] text-white rounded text-sm">إنشاء سؤال جديد</a>
            <a routerLink="/questions" class="px-3 py-1 bg-gray-100 rounded text-sm">إدارة الأسئلة</a>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
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
          </div>

          <div>
            <label class="block mb-2 font-semibold">الأسئلة المتاحة</label>
            <div class="max-h-64 overflow-y-auto border rounded p-2 space-y-2">
              <div *ngFor="let q of questions" class="p-2 rounded hover:bg-gray-50 flex items-start justify-between">
                <div>
                  <label class="flex items-center gap-2">
                    <input type="checkbox" [(ngModel)]="selectedQuestionIdsMap[q.id]" (ngModelChange)="onToggleQuestion(q.id)" />
                    <span class="font-medium">{{ q.text }}</span>
                  </label>
                  <div *ngIf="q.type === 'mcq'" class="text-xs text-gray-600">خيارات: {{ q.options?.join(' | ') }}</div>
                </div>
                <div class="flex flex-col items-end gap-2">
                  <a [routerLink]="['/questions', q.id, 'edit']" class="text-sm text-blue-600">تعديل</a>
                  <div class="flex items-center gap-2">
                    <label class="text-xs">الدرجة</label>
                    <input type="number" [(ngModel)]="questionPoints[q.id]" class="w-16 border rounded px-2 py-1 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-2 mt-4 justify-end">
          <button (click)="create()" class="bg-blue-600 text-white px-4 py-2 rounded">إنشئ</button>
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
  questions: any[] = [];
  selectedQuestionIds: string[] = [];
  questionPoints: Record<string, number> = {};
  selectedQuestionIdsMap: Record<string, boolean> = {};

  constructor(
    private examService: ExamService,
    private courseService: CourseService,
    private questionService: QuestionService,
    private router: Router
  ) {
    this.courseService.getCourses().subscribe(list => {
      this.courses = list || [];
      if (this.courses.length && !this.courseId) this.courseId = this.courses[0].id;
    });
    this.questionService.getQuestions().subscribe(list => {
      this.questions = list || [];
      // load selected ids from sessionStorage if any
      const raw = sessionStorage.getItem('selectedQuestionIds');
      if (raw && !this.selectedQuestionIds.length) {
        try {
          const ids = JSON.parse(raw) as string[];
          this.selectedQuestionIds = ids.filter(id => this.questions.some(q => q.id === id));
        } catch {}
      }
      // initialize default points for questions if not set
      for (const q of this.questions) {
        if (!(q.id in this.questionPoints)) this.questionPoints[q.id] = 5; // default 5 points
        if (!(q.id in this.selectedQuestionIdsMap)) this.selectedQuestionIdsMap[q.id] = false;
      }
    });
  }

  onToggleQuestion(id: string) {
    const checked = !!this.selectedQuestionIdsMap[id];
    if (checked && !this.selectedQuestionIds.includes(id)) this.selectedQuestionIds.push(id);
    if (!checked) this.selectedQuestionIds = this.selectedQuestionIds.filter(x => x !== id);
    // persist selection to sessionStorage for cross-navigation
    sessionStorage.setItem('selectedQuestionIds', JSON.stringify(this.selectedQuestionIds));
  }

  async create() {
    // map selectedQuestionIds to exam.question shape
    const allQuestions = await firstValueFrom(this.questionService.getQuestions());
    const mapped = (this.selectedQuestionIds || []).map(id => {
      const q = allQuestions.find((x: any) => x.id === id);
      if (!q) return { id, text: '', options: [], correctOption: 0 };
      const correct = (q as any).correctOptionIndex !== undefined ? (q as any).correctOptionIndex : ((q as any).correctBoolean ? 1 : 0);
      return {
        id: q.id,
        text: q.text,
        options: q.options || [],
        correctOption: correct,
        points: this.questionPoints[id] || 0
      };
    });

    const exam = {
      id: Date.now().toString(),
      courseId: this.courseId,
      title: this.title || 'اختبار جديد',
      description: '',
      duration: this.duration,
      passingScore: this.passingScore,
      questions: mapped
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
