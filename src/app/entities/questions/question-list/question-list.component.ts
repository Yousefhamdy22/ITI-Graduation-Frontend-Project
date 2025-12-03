import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  constructor(private questionService: QuestionService, private router: Router, private courseService: CourseService, private route: ActivatedRoute, private toast: ToastService) {}

  ngOnInit() {
    this.questionService.getQuestions().subscribe(list => this.questions = list || []);
    this.courseService.getCourses().subscribe(list => this.courses = list || []);

    this.route.queryParams.subscribe(params => {
      if (params['courseId']) this.selectedCourseId = params['courseId'];
      this.forExam = params['forExam'] === '1' || params['forExam'] === 'true' || false;
    });

    // load any persisted selected ids
    const raw = sessionStorage.getItem('selectedQuestionIds');
    if (raw) {
      try {
        const ids: string[] = JSON.parse(raw);
        for (const id of ids) this.selectedForExam.add(id);
      } catch {}
    }
  }

  get filteredQuestions() {
    if (!this.selectedCourseId) return this.questions;
    return this.questions.filter(q => (q as any).courseId === this.selectedCourseId);
  }

  edit(q: Question) {
    this.router.navigate(['/questions', q.id, 'edit'], { queryParams: { courseId: this.selectedCourseId, forExam: this.forExam ? 1 : null } });
  }

  remove(q: Question) {
    if (!confirm('هل أنت متأكد من حذف السؤال؟')) return;
    this.questionService.deleteQuestion(q.id);
    // remove from selection if present
    if (this.selectedForExam.has(q.id)) {
      this.selectedForExam.delete(q.id);
      sessionStorage.setItem('selectedQuestionIds', JSON.stringify(Array.from(this.selectedForExam)));
    }
  }

  toggleSelect(q: Question) {
    if (this.selectedForExam.has(q.id)) this.selectedForExam.delete(q.id);
    else this.selectedForExam.add(q.id);
    sessionStorage.setItem('selectedQuestionIds', JSON.stringify(Array.from(this.selectedForExam)));
  }

  createExamWithSelected() {
    // store selected ids in sessionStorage then navigate to exam creation
    const ids = Array.from(this.selectedForExam);
    sessionStorage.setItem('selectedQuestionIds', JSON.stringify(ids));
    if (!this.selectedCourseId) { this.toast.show('اختر كورس قبل المتابعة', 'warning'); return; }
    // include courseId so assemble page can prefill
    this.router.navigate(['/exams/assemble'], { queryParams: { courseId: this.selectedCourseId } });
  }
}
