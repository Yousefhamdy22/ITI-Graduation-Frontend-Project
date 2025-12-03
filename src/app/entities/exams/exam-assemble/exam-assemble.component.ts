import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../questions/question.service';
import { CourseService } from '../../courses/course.service';
import { ExamService } from '../exam.service';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../shared/toast.service';

@Component({
  selector: 'app-exam-assemble',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam-assemble.component.html',
  styleUrls: ['./exam-assemble.component.css']
})
export class ExamAssembleComponent implements OnInit {
  selectedIds: string[] = [];
  questions: any[] = [];
  courses: any[] = [];
  courseId = '';
  title = '';
  duration = 30;
  passingScore = 70;
  points: Record<string, number> = {};

  constructor(
    private questionService: QuestionService,
    private courseService: CourseService,
    private examService: ExamService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const raw = sessionStorage.getItem('selectedQuestionIds');
    if (raw) {
      try { this.selectedIds = JSON.parse(raw); } catch {}
    }
    this.questionService.getQuestions().subscribe(list => {
      this.questions = (list || []).filter(q => this.selectedIds.includes(q.id));
      for (const q of this.questions) {
        if (!(q.id in this.points)) this.points[q.id] = 5;
      }
    });
    this.courseService.getCourses().subscribe(list => this.courses = list || []);

    // read courseId from query params if provided
    this.route.queryParams.subscribe(p => {
      if (p['courseId']) this.courseId = p['courseId'];
    });
  }

  async createExam() {
    if (!this.courseId) { this.toast.show('اختر كورس', 'warning'); return; }
    if (!this.selectedIds || this.selectedIds.length === 0) { this.toast.show('لم تقم بتحديد أي سؤال. الرجاء اختيار أسئلة أولاً.', 'warning'); return; }
    // Build exam questions from selected list
    const all = await firstValueFrom(this.questionService.getQuestions());
    const mapped = this.selectedIds.map(id => {
      const q = all.find((x: any) => x.id === id);
      return {
        id: q?.id || id,
        text: q?.text || '',
        options: q?.options || [],
        correctOption: (q as any)?.correctOptionIndex ?? ((q as any)?.correctBoolean ? 1 : 0),
        points: this.points[id] || 0
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

    this.examService.getExams().subscribe(list => {
      const newList = [...(list || []), exam];
      this.examService.loadExams(newList);
      sessionStorage.removeItem('selectedQuestionIds');
      this.router.navigate(['/exams']);
    });
  }

  back() {
    this.router.navigate(['/questions']);
  }
}
