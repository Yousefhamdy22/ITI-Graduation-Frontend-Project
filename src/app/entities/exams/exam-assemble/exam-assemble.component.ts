import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { QuestionService } from '../../questions/question.service';
import { CourseService } from '../../courses/course.service';
import { ExamService } from '../exam.service';
import { ToastService } from '../../../shared/toast.service';
import { Exam } from '../exam.model';

@Component({
  selector: 'app-exam-assemble',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './exam-assemble.component.html',
  styleUrls: ['./exam-assemble.component.css']
})
export class ExamAssembleComponent implements OnInit {
  selectedIds: string[] = [];
  questions: any[] = [];
  courses: any[] = [];
  courseId = '';
  title = '';
  duration = 60;
  passingScore = 70;
  points: Record<string, number> = {};

  constructor(
    private questionService: QuestionService,
    private courseService: CourseService,
    private examService: ExamService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    // Load selected questions from sessionStorage
    const raw = sessionStorage.getItem('selectedQuestionIds');
    if (raw) {
      try {
        this.selectedIds = JSON.parse(raw);
      } catch { }
    }

    // Load selected questions
    this.questionService.getQuestions().subscribe({
      next: (response) => {
        const allQuestions = response.value || [];
        this.questions = allQuestions.filter((q: any) => q.id && this.selectedIds.includes(q.id));
        for (const q of this.questions) {
          if (q.id && !(q.id in this.points)) {
            this.points[q.id] = q.points || 1;
          }
        }
      },
      error: () => this.toast.show('Error loading questions', 'error')
    });

    // Load courses
    this.courseService.getCourses().subscribe({
      next: (list) => {
        this.courses = list || [];
      },
      error: () => this.toast.show('Error loading courses', 'error')
    });

    // Read courseId from query parameters
    this.route.queryParams.subscribe(params => {
      if (params['courseId']) {
        this.courseId = params['courseId'];
      }
    });
  }

  moveQuestionUp(index: number): void {
    if (index > 0) {
      [this.selectedIds[index], this.selectedIds[index - 1]] =
        [this.selectedIds[index - 1], this.selectedIds[index]];

      [this.questions[index], this.questions[index - 1]] =
        [this.questions[index - 1], this.questions[index]];
    }
  }

  moveQuestionDown(index: number): void {
    if (index < this.selectedIds.length - 1) {
      [this.selectedIds[index], this.selectedIds[index + 1]] =
        [this.selectedIds[index + 1], this.selectedIds[index]];

      [this.questions[index], this.questions[index + 1]] =
        [this.questions[index + 1], this.questions[index]];
    }
  }

  removeQuestion(id: string): void {
    this.selectedIds = this.selectedIds.filter(x => x !== id);
    this.questions = this.questions.filter(q => q.id !== id);
  }

  createExam(): void {
    // Validate data
    if (!this.title.trim()) {
      this.toast.show('Please enter exam title', 'warning');
      return;
    }
    if (!this.courseId) {
      this.toast.show('Please select a course', 'warning');
      return;
    }
    if (this.selectedIds.length === 0) {
      this.toast.show('Please select questions for the exam', 'warning');
      return;
    }

    // Build exam questions
    const mappedQuestions = this.selectedIds.map(id => {
      const q = this.questions.find((x: any) => x.id === id);

      // Use existing answerOptions or create from old format
      const answerOptions = q?.answerOptions || [];

      return {
        id: q?.id || id,
        text: q?.text || '',
        points: this.points[id] || q?.points || 1,
        answerOptions: answerOptions
      };
    });

    // Create exam object
    const newExam: Partial<Exam> = {
      courseId: this.courseId,
      title: this.title.trim(),
      description: '',
      durationMinutes: this.duration,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      questions: mappedQuestions
    };

    // Save exam
    this.examService.createExam(newExam).subscribe({
      next: (createdExam) => {
        sessionStorage.removeItem('selectedQuestionIds');
        this.toast.show('Exam created successfully', 'success');
        this.router.navigate(['/exams']);
      },
      error: (err) => {
        console.error('Error creating exam:', err);
        this.toast.show('Failed to create exam', 'error');
      }
    });
  }

  back(): void {
    this.router.navigate(['/questions']);
  }

  getTotalPoints(): number {
    return this.selectedIds.reduce((sum, id) => sum + (this.points[id] || 1), 0);
  }
}
