import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../entities/questions/question.service';
import { ExamService } from '../../entities/exams/exam.service';
import { Exam } from '../../entities/exams/exam.model';
import { CourseService } from '../../entities/courses/course.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-exam-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam-form-modal.component.html',
  styleUrls: ['./exam-form-modal.component.css']
})
export class ExamFormModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<any>();

  title = '';
  description = '';
  courseId = '';
  duration = 60;
  passingScore = 70;

  courses: any[] = [];
  questions: any[] = [];
  selectedQuestionIds: string[] = [];
  questionPoints: Record<string, number> = {};

  constructor(
    private examService: ExamService,
    private courseService: CourseService,
    private questionService: QuestionService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    // تحميل الكورسات
    this.courseService.getCourses().subscribe({
      next: (list: any) => {
        this.courses = list || [];
        if (this.courses.length && !this.courseId) {
          this.courseId = this.courses[0].id;
        }
      },
      error: () => this.toast.show('خطأ في تحميل الكورسات', 'error')
    });

    // تحميل الأسئلة
    this.questionService.getQuestions().subscribe({
      next: (response: any) => {
        this.questions = response.value || [];
      },
      error: () => this.toast.show('خطأ في تحميل الأسئلة', 'error')
    });
  }

  toggleQuestion(id: string): void {
    const idx = this.selectedQuestionIds.indexOf(id);
    if (idx === -1) {
      this.selectedQuestionIds.push(id);
      this.questionPoints[id] = 1;
    } else {
      this.selectedQuestionIds.splice(idx, 1);
      delete this.questionPoints[id];
    }
  }

  isQuestionSelected(id: string): boolean {
    return this.selectedQuestionIds.includes(id);
  }

  getTotalScore(): number {
    return Object.values(this.questionPoints).reduce((sum, p) => sum + (p || 0), 0);
  }

  submit(): void {
    if (!this.title || !this.courseId || this.selectedQuestionIds.length === 0) {
      this.toast.show('الرجاء ملء البيانات المطلوبة واختيار أسئلة', 'warning');
      return;
    }

    const exam = {
      title: this.title,
      description: this.description,
      courseId: this.courseId,
      duration: this.duration,
      passingScore: this.passingScore,
      questions: this.selectedQuestionIds.map(id => {
        const q = this.questions.find(q => q.id === id);
        return {
          ...q,
          points: this.questionPoints[id] || 1
        };
      })
    };

    this.examService.createExam(exam).subscribe({
      next: (result: Exam) => {
        this.toast.show('تم إنشاء الاختبار بنجاح', 'success');
        this.success.emit(result);
        this.closeModal();
      },
      error: () => this.toast.show('خطأ في إنشاء الاختبار', 'error')
    });
  }

  closeModal(): void {
    this.close.emit();
  }
}
