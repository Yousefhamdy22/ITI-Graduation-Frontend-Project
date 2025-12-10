import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionService } from '../question.service';
import { Question, CreateQuestionPayload, AnswerOption, ServerResponse } from '../question.model';
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
      // 💡 تعديل طريقة جلب السؤال للتعامل مع ServerResponse
      this.qs.getQuestionById(this.id).subscribe({
        next: (response: ServerResponse<Question>) => {
          const q = response.value;
          if (!q) return;

          this.text = q.text;
          this.points = q.points;
          // 💡 إعادة بناء مصفوفة الخيارات لتناسب نموذج الـ UI الجديد
          // نستخدم الـ answerOptions القادمة من السيرفر كبديل لـ options القديمة
          if (q.answerOptions && q.answerOptions.length > 0) {
            // يتم تعبئة options الجديدة من answerOptions القادمة من الـ API
            this.options = q.answerOptions.map(opt => ({
              text: opt.text,
              isCorrect: opt.isCorrect
            }));
          } else {
            // إذا لم يكن هناك خيارات، نرجع للخيارات الافتراضية
            this.options = [{ text: '', isCorrect: false }, { text: '', isCorrect: true }];
          }

          // ⚠️ ملاحظة: courseId لم يعد جزءاً من نموذج السؤال القادم من API
          // لذا، نحتاج إلى افتراض قيمته أو الحصول عليها من مكان آخر (سنتركه كما كان مؤقتاً).
          this.courseId = (qp['courseId'] as string) || '';
        },
        error: (err) => {
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

    const payload: CreateQuestionPayload = {
      text: this.text,
      points: this.points,
      imageUrl: null, // نفترض أنه لا يوجد حقل إدخال حالي للصور
      answerOptions: answerOptions,
      // ⚠️ ملاحظة: courseId و createdBy لم يعدا في الـ Payload، بل يجب إرسالهما للـ API كـ Query/Header إذا لزم الأمر
      // لكن لتبسيط الكود، نلتزم بالنموذج الذي يتطلبه الـ Service
    };

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
      this.qs.createQuestion(payload).subscribe({
        next: (response: ServerResponse<Question>) => {
          if (response.isSuccess) {
            this.toast.show('تم إنشاء السؤال بنجاح', 'success');
          } else {
            this.toast.show('فشل الإنشاء: ' + (response.errors[0] || 'خطأ غير معروف'), 'error');
          }
        },
        error: () => this.toast.show('خطأ في الاتصال بالخادم أثناء الإنشاء.', 'error')
      });
    }

    // preserve any query params (courseId / forExam) when returning to list
    const qp = this.route.snapshot.queryParams;
    this.router.navigate(['/questions'], { queryParams: qp });
  }

  cancel() { this.router.navigate(['/questions'], { queryParams: this.route.snapshot.queryParams }); }
}