import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { QuestionService } from '../../questions/question.service';
import { ExamService } from '../exam.service';
import { CourseService } from '../../courses/course.service';
import { ToastService } from '../../../shared/toast.service';
import { Exam } from '../exam.model';

@Component({
  selector: 'app-exam-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './exam-form.component.html',
  styleUrls: ['./exam-form.component.css']
})
export class ExamFormComponent implements OnInit {
  title = '';
  description = '';
  courseId = '';
  duration = 60;
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
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    // تحميل الكورسات
    this.courseService.getCourses().subscribe({
      next: (list) => {
        this.courses = list || [];
        if (this.courses.length && !this.courseId) {
          this.courseId = this.courses[0].id;
        }
      },
      error: () => this.toast.show('خطأ في تحميل الكورسات', 'error')
    });

    // تحميل الأسئلة
    this.questionService.getQuestions().subscribe({
      next: (res) => {
        // res is ServerResponse<Question[]>
        this.questions = res.value || [];
        // تحديث الخريطة والنقاط الافتراضية
        for (const q of this.questions) {
          if (q.id && !(q.id in this.questionPoints)) {
            this.questionPoints[q.id] = q.points || 1; // استخدام نقاط السؤال الأصلية إذا وجدت
          }
          if (q.id && !(q.id in this.selectedQuestionIdsMap)) {
            this.selectedQuestionIdsMap[q.id] = false;
          }
        }
      },
      error: () => this.toast.show('خطأ في تحميل الأسئلة', 'error')
    });
  }

  onToggleQuestion(id: string): void {
    const checked = !!this.selectedQuestionIdsMap[id];
    if (checked && !this.selectedQuestionIds.includes(id)) {
      this.selectedQuestionIds.push(id);
    } else if (!checked) {
      this.selectedQuestionIds = this.selectedQuestionIds.filter(x => x !== id);
    }
  }

  create(): void {
    // التحقق من البيانات
    if (!this.title.trim()) {
      this.toast.show('من فضلك أدخل عنوان الاختبار', 'warning');
      return;
    }
    if (!this.courseId) {
      this.toast.show('من فضلك اختر كورس', 'warning');
      return;
    }
    if (this.selectedQuestionIds.length === 0) {
      this.toast.show('من فضلك اختر أسئلة للاختبار', 'warning');
      return;
    }

    // تجميع الأسئلة المختارة
    const mappedQuestions = this.selectedQuestionIds.map(id => {
      const q = this.questions.find((x: any) => x.id === id);
      if (!q) return null;

      // Map AnswerOptions to string array and find correct index
      const options = q.answerOptions ? q.answerOptions.map((o: any) => o.text) : [];
      let correctOption = 0;
      if (q.answerOptions) {
        const idx = q.answerOptions.findIndex((o: any) => o.isCorrect);
        if (idx !== -1) correctOption = idx;
      }

      return {
        id: q.id,
        text: q.text,
        options: options,
        correctOption: correctOption,
        points: this.questionPoints[id] || q.points || 1
      };
    }).filter(q => q !== null);

    // إنشاء كائن الاختبار
    // لا نضع id هنا، السيرفس ستقوم بذلك
    const newExam: Partial<Exam> = {
      courseId: this.courseId,
      title: this.title.trim(),
      description: this.description.trim(),
      duration: this.duration,
      passingScore: this.passingScore,
      questions: mappedQuestions
    };

    // حفظ الاختبار
    this.examService.createExam(newExam).subscribe({
      next: (createdExam) => {
        this.toast.show('تم إنشاء الاختبار بنجاح', 'success');
        this.router.navigate(['/exams']);
      },
      error: (err) => {
        console.error('Error creating exam:', err);
        this.toast.show('فشل إنشاء الاختبار', 'error');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/exams']);
  }

  getTotalPoints(): number {
    return this.selectedQuestionIds.reduce((sum, id) => sum + (this.questionPoints[id] || 1), 0);
  }
}
