import { Component, OnInit, afterNextRender, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../question.service';
import { CourseService } from '../../courses/course.service';
import { Question } from '../question.model';
import { ToastService } from '../../../shared/toast.service';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit {
  questions: Question[] = [];
  selectedForExam = new Set<string>();
  courses: any[] = [];
  selectedCourseId = '';
  forExam = false;
  private platformId = inject(PLATFORM_ID);

  constructor(
    private questionService: QuestionService, 
    private router: Router, 
    private courseService: CourseService, 
    private route: ActivatedRoute, 
    private toast: ToastService
  ) {
    // Load data after render to avoid SSR issues
    afterNextRender(() => {
      this.loadQuestions();
      this.loadSessionStorage();
    });
  }

  ngOnInit() {
    // Route params setup
    this.route.queryParams.subscribe(params => {
      if (params['courseId']) this.selectedCourseId = params['courseId'];
      this.forExam = params['forExam'] === '1' || params['forExam'] === 'true' || false;
    });
  }

  private loadSessionStorage() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const raw = sessionStorage.getItem('selectedQuestionIds');
    if (raw) {
      try {
        const ids: string[] = JSON.parse(raw);
        for (const id of ids) this.selectedForExam.add(id);
      } catch { }
    }
  }

  loadQuestions() {
    this.questionService.getQuestions().subscribe({
      next: (response) => {
        this.questions = response.value || [];
        console.log('✅ Questions loaded:', this.questions.length);
      },
      error: (err) => {
        console.error('❌ Failed to load questions:', err);
        this.toast.show('فشل تحميل الأسئلة', 'error');
      }
    });

    if (this.courses.length === 0) {
      this.courseService.getCourses().subscribe(list => this.courses = list || []);
    }
  }

  edit(q: Question) {
    this.router.navigate(['/questions', q.id, 'edit'], { queryParams: { courseId: this.selectedCourseId, forExam: this.forExam ? 1 : null } });
  }

  remove(q: Question) {
    if (!q.id) return;
    if (!confirm('هل أنت متأكد من حذف السؤال؟')) return;

    this.questionService.deleteQuestion(q.id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.questions = this.questions.filter(item => item.id !== q.id);
          this.toast.show('تم حذف السؤال بنجاح', 'success');

          // remove from selection if present
          if (this.selectedForExam.has(q.id!) && isPlatformBrowser(this.platformId)) {
            this.selectedForExam.delete(q.id!);
            sessionStorage.setItem('selectedQuestionIds', JSON.stringify(Array.from(this.selectedForExam)));
          }
        } else {
          this.toast.show('فشل الحذف', 'error');
        }
      },
      error: () => this.toast.show('خطأ في الاتصال', 'error')
    });
  }

  toggleSelect(q: Question) {
    if (!q.id || !isPlatformBrowser(this.platformId)) return;
    if (this.selectedForExam.has(q.id)) this.selectedForExam.delete(q.id);
    else this.selectedForExam.add(q.id);
    sessionStorage.setItem('selectedQuestionIds', JSON.stringify(Array.from(this.selectedForExam)));
  }

  createExamWithSelected() {
    if (!isPlatformBrowser(this.platformId)) return;
    // store selected ids in sessionStorage then navigate to exam creation
    const ids = Array.from(this.selectedForExam);
    sessionStorage.setItem('selectedQuestionIds', JSON.stringify(ids));
    if (!this.selectedCourseId) { this.toast.show('اختر كورس قبل المتابعة', 'warning'); return; }
    // include courseId so assemble page can prefill
    this.router.navigate(['/exams/assemble'], { queryParams: { courseId: this.selectedCourseId } });
  }
}
