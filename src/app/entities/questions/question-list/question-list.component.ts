import { Component, OnInit, afterNextRender, PLATFORM_ID, inject, ChangeDetectorRef, NgZone, ApplicationRef } from '@angular/core';
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
// @if (false) {
  // This component has hydration issues, render client-side only
// }
export class QuestionListComponent implements OnInit {
  questions: Question[] = [];
  selectedForExam = new Set<string>();
  courses: any[] = [];
  selectedCourseId = '';
  forExam = false;
  isLoading = true;
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private appRef = inject(ApplicationRef);

  constructor(
    private questionService: QuestionService, 
    private router: Router, 
    private courseService: CourseService, 
    private route: ActivatedRoute, 
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Route params setup
    this.route.queryParams.subscribe(params => {
      if (params['courseId']) this.selectedCourseId = params['courseId'];
      this.forExam = params['forExam'] === '1' || params['forExam'] === 'true' || false;
    });

    // Load data in browser only
    if (isPlatformBrowser(this.platformId)) {
      console.log('🚀 Component initialized, loading questions...');
      this.loadQuestions();
      this.loadSessionStorage();
      this.loadCourses();
      
      // Timeout fallback - if loading takes more than 5 seconds
      setTimeout(() => {
        if (this.isLoading) {
          console.warn('⚠️ Loading timeout! Setting isLoading to false');
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      }, 5000);
    } else {
      console.log('🔴 SSR detected - skipping data load');
      this.isLoading = false;
    }
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
    console.log('🔵 Starting loadQuestions()...');
    this.isLoading = true;
    
    const subscription = this.questionService.getQuestions().subscribe({
      next: (response: any) => {
        console.log('✅ HTTP Response received!');
        console.log('📦 Full response:', response);
        
        // Handle both formats: {value: [...]} and direct array
        const data = response?.value || response || [];
        this.questions = Array.isArray(data) ? [...data] : [];
        this.isLoading = false;
        
        console.log('✅ Questions loaded:', this.questions.length);
        console.log('📝 Questions array:', this.questions);
        console.log('🎯 isLoading =', this.isLoading);
        
        // Force multiple change detection strategies
        setTimeout(() => {
          this.cdr.detectChanges();
          this.appRef.tick();
          console.log('🔄 Forced application-wide change detection');
        }, 0);
      },
      error: (err) => {
        console.error('❌ HTTP Error in loadQuestions:', err);
        this.toast.show('فشل تحميل الأسئلة', 'error');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log('✅ Observable completed');
      }
    });
    
    console.log('📡 HTTP request sent, subscription created:', subscription);
  }

  loadCourses() {
    if (this.courses.length === 0) {
      this.courseService.getCourses().subscribe(list => this.courses = list || []);
    }
  }

  trackByQuestionId(index: number, question: Question): string {
    return question.id || index.toString();
  }

  edit(q: Question) {
    this.router.navigate(['/questions', q.id, 'edit'], { queryParams: { courseId: this.selectedCourseId, forExam: this.forExam ? 1 : null } });
  }

  remove(q: Question) {
    if (!q.id) return;
    if (!confirm('هل أنت متأكد من حذف السؤال؟')) return;

    this.questionService.deleteQuestion(q.id).subscribe({
      next: (res) => {
        // Backend returns Ardalis.Result format
        if (res?.isSuccess || res?.value === true) {
          this.questions = this.questions.filter(item => item.id !== q.id);
          this.cdr.detectChanges();
          this.toast.show('تم حذف السؤال بنجاح', 'success');
        } else {
          this.toast.show(res?.message || res?.successMessage || 'فشل حذف السؤال', 'error');
        }
      },
      error: (err) => {
        console.error('❌ Delete error:', err);
        let errorMsg = 'فشل حذف السؤال';
        
        if (err.status === 404) {
          errorMsg = 'السؤال غير موجود';
          // Remove from local list anyway
          this.questions = this.questions.filter(item => item.id !== q.id);
          this.cdr.detectChanges();
        } else if (err.status === 500) {
          errorMsg = 'خطأ في السيرفر - قد يكون السؤال محذوف بالفعل أو غير موجود';
        } else if (err.status === 401) {
          errorMsg = 'انتهت صلاحية الجلسة';
          this.router.navigate(['/admin/login']);
        }
        
        this.toast.show(errorMsg, 'error');
      }
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
