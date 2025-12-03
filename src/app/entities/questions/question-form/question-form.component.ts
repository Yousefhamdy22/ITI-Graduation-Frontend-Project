import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionService } from '../question.service';
import { Question } from '../question.model';
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
  type: Question['type'] = 'mcq';
  options: string[] = ['', ''];
  correctOptionIndex = 0;
  correctBoolean: boolean | null = null;
  courseId = '';
  courses: any[] = [];

  constructor(
    private qs: QuestionService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
    , private courseService: CourseService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    // load courses for course selection
    this.courseService.getCourses().subscribe(list => this.courses = list || []);
    // if opened from exam flow, prefill courseId from query params
    const qp = this.route.snapshot.queryParams;
    if (!this.id && qp['courseId']) this.courseId = qp['courseId'];
    if (this.id) {
      this.qs.getQuestionById(this.id).subscribe(q => {
        if (!q) return;
        this.text = q.text;
        this.type = q.type;
        this.options = q.options ? [...q.options] : ['',''];
        this.correctOptionIndex = q.correctOptionIndex || 0;
        this.correctBoolean = q.correctBoolean ?? null;
        this.courseId = (q as any).courseId || '';
      });
    }
  }

  addOption() { this.options.push(''); }
  removeOption(i: number) { this.options.splice(i,1); }

  save() {
    if (!this.text.trim()) { this.toast.show('أدخل نص السؤال', 'warning'); return; }
    if (!this.courseId) { this.toast.show('اختر الكورس التابع له السؤال', 'warning'); return; }
    const instructor = this.auth.currentUser;
    if (!instructor) { this.toast.show('غير مسموح', 'error'); return; }

    const payload: Partial<Question> = {
      text: this.text,
      type: this.type,
      courseId: this.courseId,
      options: this.type === 'mcq' ? this.options : undefined,
      correctOptionIndex: this.type === 'mcq' ? this.correctOptionIndex : undefined,
      correctBoolean: this.type === 'tf' ? this.correctBoolean || false : undefined,
      createdBy: instructor.id
    };

    if (this.id) {
      this.qs.updateQuestion(this.id, payload);
      this.toast.show('تم التحديث', 'success');
    } else {
      this.qs.createQuestion(payload);
      this.toast.show('تم الإنشاء', 'success');
    }
    // preserve any query params (courseId / forExam) when returning to list
    const qp = this.route.snapshot.queryParams;
    this.router.navigate(['/questions'], { queryParams: qp });
  }

  cancel() { this.router.navigate(['/questions'], { queryParams: this.route.snapshot.queryParams }); }
}
