import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionService } from '../question.service';
import { Question, CreateQuestionRequest, AnswerOption, ServerResponse } from '../question.model';
import { AuthService } from '../../../auth/auth.service';
import { CourseService } from '../../courses/course.service';
import { ToastService } from '../../../shared/toast.service';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css']
})
export class QuestionFormComponent implements OnInit {
  id: string | null = null;
  text = '';
  points: number = 1;

  // Options for UI input
  options: { text: string, isCorrect: boolean }[] = [
    { text: '', isCorrect: false },
    { text: '', isCorrect: true }
  ];

  courseId = ''; // Used for routing persistence only
  courses: any[] = [];


  constructor(
    private qs: QuestionService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private courseService: CourseService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    // load courses for course selection
    this.courseService.getCourses().subscribe(list => this.courses = list || []);

    const qp = this.route.snapshot.queryParams;
    // If opened from exam flow, prefill courseId from query params
    if (!this.id && qp['courseId']) this.courseId = qp['courseId'];

    if (this.id) {
      // Backend doesn't support getQuestionById - fetch all questions and filter
      this.qs.getQuestions().subscribe({
        next: (response) => {
          const questionList = response.value || [];
          const q = questionList.find(question => question.id === this.id);
          if (!q) {
            this.toast.show('لم يتم العثور على السؤال.', 'error');
            return;
          }

          this.text = q.text;
          this.points = q.points;
          // Build options array from answerOptions
          if (q.answerOptions && q.answerOptions.length > 0) {
            this.options = q.answerOptions.map(opt => ({
              text: opt.text,
              isCorrect: opt.isCorrect
            }));
          } else {
            // Default options if none exist
            this.options = [{ text: '', isCorrect: false }, { text: '', isCorrect: true }];
          }

          // courseId not part of question model from API
          this.courseId = (qp['courseId'] as string) || '';
        },
        error: (err: any) => {
          this.toast.show('فشل جلب تفاصيل السؤال.', 'error');
          console.error('Error fetching question:', err);
        }
      });
    }
  }

  // 👇 تحديث دالة إضافة الخيار لتناسب النموذج الجديد
  addOption() { this.options.push({ text: '', isCorrect: false }); }
  removeOption(i: number) { this.options.splice(i, 1); }

  // 👇 دالة لتحديد الخيار الصحيح الوحيد (نحتاج إلى تعديل الـ HTML ليتوافق)
  selectCorrectOption(i: number) {
    this.options.forEach((opt, index) => {
      opt.isCorrect = (index === i);
    });
  }

  save() {
    if (!this.text.trim()) { this.toast.show('أدخل نص السؤال', 'warning'); return; }
    if (!this.courseId) { this.toast.show('اختر الكورس التابع له السؤال', 'warning'); return; }
    const instructor = this.auth.currentUser;
    if (!instructor) { this.toast.show('غير مسموح', 'error'); return; }

    // 💡 إنشاء AnswerOptions
    const answerOptions: AnswerOption[] = this.options
      // 1. فلترة الخيارات الفارغة
      .filter(opt => opt.text.trim())
      // 2. تحويلها للنموذج المطلوب من الـ API
      .map(opt => ({
        text: opt.text,
        isCorrect: opt.isCorrect
      }));

    if (answerOptions.length === 0) {
      this.toast.show('يجب إضافة خيار واحد صحيح على الأقل.', 'warning');
      return;
    }

    if (!answerOptions.some(opt => opt.isCorrect)) {
      this.toast.show('يجب تحديد الإجابة الصحيحة.', 'warning');
      return;
    }

    const payload: CreateQuestionRequest = {
      text: this.text,
      points: this.points,
      imageUrl: undefined,
      answerOptions: answerOptions,
      courseId: this.courseId || undefined
    };

    console.log('🔵 Question payload with courseId:', payload);

    if (this.id) {
      const updatePayload: Question = { id: this.id, ...payload } as Question;

      // 💡 تحديث طريقة الاتصال بالتحديث
      this.qs.updateQuestion(updatePayload).subscribe({
        next: (response: ServerResponse<Question>) => {
          if (response.isSuccess) {
            this.toast.show('تم تحديث السؤال بنجاح', 'success');
          } else {
            this.toast.show('فشل التحديث: ' + (response.errors[0] || 'خطأ غير معروف'), 'error');
          }
        },
        error: () => this.toast.show('خطأ في الاتصال بالخادم أثناء التحديث.', 'error')
      });
    } else {
      // 💡 تحديث طريقة الاتصال بالإنشاء
      console.log('🔵 Creating new question:', payload);
      this.qs.createQuestion(payload).subscribe({
        next: (createdQuestion: Question) => {
          console.log('✅ Question creation response:', createdQuestion);
          console.log('✅ Question CourseId:', createdQuestion.courseId);
          if (createdQuestion && createdQuestion.id) {
            console.log('✅ Question created successfully with ID:', createdQuestion.id);
            this.toast.show('تم إنشاء السؤال بنجاح في الكورس - ID: ' + createdQuestion.id, 'success');
            // Navigate after successful creation
            const qp = this.route.snapshot.queryParams;
            this.router.navigate(['/questions'], { queryParams: qp });
          } else {
            console.warn('⚠️ Question created but no ID returned:', createdQuestion);
            this.toast.show('تم الإنشاء لكن لم يتم استلام معرف السؤال', 'warning');
            const qp = this.route.snapshot.queryParams;
            this.router.navigate(['/questions'], { queryParams: qp });
          }
        },
        error: (err) => {
          console.error('❌ Question creation error:', err);
          this.toast.show('خطأ في الاتصال بالخادم أثناء الإنشاء.', 'error');
        }
      });
      return; // Exit early to prevent double navigation
    }

    // preserve any query params (courseId / forExam) when returning to list
    const qp = this.route.snapshot.queryParams;
    this.router.navigate(['/questions'], { queryParams: qp });
  }

  cancel() { this.router.navigate(['/questions'], { queryParams: this.route.snapshot.queryParams }); }
}