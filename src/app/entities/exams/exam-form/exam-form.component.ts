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
    // Load courses
    this.courseService.getCourses().subscribe({
      next: (list) => {
        this.courses = list || [];
        if (this.courses.length && !this.courseId) {
          this.courseId = this.courses[0].id;
        }
      },
      error: () => this.toast.show('Error loading courses', 'error')
    });

    // Load questions
    this.questionService.getQuestions().subscribe({
      next: (response) => {
        // response is ServerResponse<Question[]>
        this.questions = response.value || [];
        // Update map and default points
        for (const q of this.questions) {
          if (q.id && !(q.id in this.questionPoints)) {
            this.questionPoints[q.id] = q.points || 1; // Use original question points if available
          }
          if (q.id && !(q.id in this.selectedQuestionIdsMap)) {
            this.selectedQuestionIdsMap[q.id] = false;
          }
        }
      },
      error: () => this.toast.show('Error loading questions', 'error')
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
    // Validate data
    if (!this.title.trim()) {
      this.toast.show('Please enter exam title', 'warning');
      return;
    }
    if (!this.courseId) {
      this.toast.show('Please select a course', 'warning');
      return;
    }
    if (this.selectedQuestionIds.length === 0) {
      this.toast.show('Please select questions for the exam', 'warning');
      return;
    }

    // Collect selected questions
    const mappedQuestions = this.selectedQuestionIds.map(id => {
      const q = this.questions.find((x: any) => x.id === id);
      if (!q) return null;

      return {
        id: q.id,
        text: q.text,
        points: this.questionPoints[id] || q.points || 1,
        answerOptions: q.answerOptions || []
      };
    }).filter(q => q !== null);

    // Create exam object
    const newExam: Partial<Exam> = {
      courseId: this.courseId,
      title: this.title.trim(),
      description: this.description.trim(),
      durationMinutes: this.duration,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      questions: mappedQuestions
    };

    // Save exam
    this.examService.createExam(newExam).subscribe({
      next: (createdExam) => {
        this.toast.show('Exam created successfully', 'success');
        this.router.navigate(['/exams']);
      },
      error: (err) => {
        console.error('Error creating exam:', err);
        this.toast.show('Failed to create exam', 'error');
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
