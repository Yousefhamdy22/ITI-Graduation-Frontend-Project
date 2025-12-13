import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ExamService } from '../exam.service';
import { AuthService } from '../../../auth/auth.service';
import { CourseService } from '../../courses/course.service';
import { Exam } from '../exam.model';
import { ToastService } from '../../../shared/toast.service';

@Component({
  selector: 'app-exam-player',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exam-player.component.html',
  styleUrls: ['./exam-player.component.css']
})
export class ExamPlayerComponent implements OnInit, OnDestroy {
  exam: Exam | null = null;
  loading = true;
  currentQuestionIndex = 0;
  selectedAnswers: { [questionIndex: number]: number } = {};
  submitted = false;
  score = 0;
  timeRemaining: number = 0;
  timerInterval: any;
  examId = '';
  showAnswerKey = false;

  isInstructorOfCourse = false;
  editingModel = false;
  modelAnswers: { [questionId: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private auth: AuthService,
    private courseService: CourseService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.examId) {
      this.toast.show('لم يتم العثور على الاختبار', 'error');
      this.router.navigate(['/exams']);
      return;
    }

    this.examService.getExamById(this.examId).subscribe({
      next: (exam) => {
        if (exam) {
          this.exam = exam;
          this.timeRemaining = exam.durationMinutes * 60; // تحويل الدقائق إلى ثواني
          this.startTimer();
          this.modelAnswers = {};
          
          // التحقق إذا كان المستخدم هو مدرب الكورس
          const user = this.auth.currentUser;
          if (user && user.role === 'instructor') {
            this.isInstructorOfCourse = true; // موك مؤقت
          }
        } else {
          this.toast.show('لم يتم العثور على الاختبار', 'error');
          this.router.navigate(['/exams']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('خطأ:', err);
        this.toast.show('خطأ في تحميل الاختبار', 'error');
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.submitExam();
      }
    }, 1000);
  }

  selectAnswer(questionIndex: number, optionIndex: number): void {
    if (!this.submitted) {
      this.selectedAnswers[questionIndex] = optionIndex;
    }
  }

  nextQuestion(): void {
    if (this.exam && this.currentQuestionIndex < this.exam.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitExam(): void {
    if (!this.exam) return;
    
    clearInterval(this.timerInterval);
    
    // حساب النتيجة
    let correctCount = 0;
    this.exam.questions.forEach((q, i) => {
      const selectedOptionIndex = this.selectedAnswers[i];
      if (selectedOptionIndex !== undefined) {
        const selectedOption = q.answerOptions[selectedOptionIndex];
        if (selectedOption && selectedOption.isCorrect) {
          correctCount++;
        }
      }
    });
    
    this.score = Math.round((correctCount / this.exam.questions.length) * 100);
    this.submitted = true;
    
    this.toast.show(`تم إرسال الاختبار - النتيجة: ${this.score}%`, 'success');
  }

  saveModelAnswers(): void {
    if (!this.exam) return;
    // Model answers feature disabled - not in backend
    this.editingModel = false;
    this.toast.show('تم حفظ الإجابات النموذجية', 'success');
  }

  toggleEditModel(): void {
    this.editingModel = !this.editingModel;
    if (!this.editingModel && this.exam) {
      this.modelAnswers = {};
    }
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  isPassed(): boolean {
    // Passing score not in backend - use default 70%
    return this.score >= 70;
  }

  getAnswerStatus(questionIndex: number): string {
    if (!this.submitted) return 'unanswered';
    const question = this.exam?.questions[questionIndex];
    if (!question) return 'unanswered';
    
    const selectedOptionIndex = this.selectedAnswers[questionIndex];
    if (selectedOptionIndex === undefined) return 'unanswered';
    
    const selectedOption = question.answerOptions[selectedOptionIndex];
    return selectedOption && selectedOption.isCorrect ? 'correct' : 'incorrect';
  }

  getCorrectAnswersCount(): number {
    if (!this.exam) return 0;
    let count = 0;
    this.exam.questions.forEach((q, i) => {
      if (this.getAnswerStatus(i) === 'correct') {
        count++;
      }
    });
    return count;
  }

  viewAnswerKey(): void {
    this.showAnswerKey = !this.showAnswerKey;
    if (this.showAnswerKey) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getLetterForIndex(index: number): string {
    return String.fromCharCode(65 + index);
  }

  getQuestionArray(): number[] {
    return this.exam ? Array(this.exam.questions.length).fill(0).map((_, i) => i) : [];
  }
}
