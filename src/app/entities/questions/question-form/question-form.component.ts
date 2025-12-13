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
            this.toast.show('Question not found.', 'error');
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
          this.toast.show('Failed to fetch question details.', 'error');
          console.error('Error fetching question:', err);
        }
      });
    }
  }

  // 👇 Update add option function
  addOption() { this.options.push({ text: '', isCorrect: false }); }
  removeOption(i: number) { this.options.splice(i, 1); }

  // 👇 Function to select single correct option
  selectCorrectOption(i: number) {
    this.options.forEach((opt, index) => {
      opt.isCorrect = (index === i);
    });
  }

  save() {
    if (!this.text.trim()) { this.toast.show('Enter question text', 'warning'); return; }
    if (!this.courseId) { this.toast.show('Select a course for the question', 'warning'); return; }
    const instructor = this.auth.currentUser;
    if (!instructor) { this.toast.show('Not allowed', 'error'); return; }

    // 💡 Create AnswerOptions
    const answerOptions: AnswerOption[] = this.options
      // 1. Filter empty options
      .filter(opt => opt.text.trim())
      // 2. Map to API model
      .map(opt => ({
        text: opt.text,
        isCorrect: opt.isCorrect
      }));

    if (answerOptions.length === 0) {
      this.toast.show('Must add at least one correct option.', 'warning');
      return;
    }

    if (!answerOptions.some(opt => opt.isCorrect)) {
      this.toast.show('Must select a correct answer.', 'warning');
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

      // 💡 Update logic
      this.qs.updateQuestion(updatePayload).subscribe({
        next: (response: ServerResponse<Question>) => {
          if (response.isSuccess) {
            this.toast.show('Question updated successfully', 'success');
          } else {
            const errorMsg = response.errors && response.errors.length > 0
              ? response.errors[0]
              : response.message || response.successMessage || 'Unknown error';
            this.toast.show('Update failed: ' + errorMsg, 'error');
          }
        },
        error: () => this.toast.show('Server connection error during update.', 'error')
      });
    } else {
      // 💡 Create logic
      console.log('🔵 Creating new question:', payload);
      this.qs.createQuestion(payload).subscribe({
        next: (createdQuestion: Question) => {
          console.log('✅ Question creation response:', createdQuestion);
          console.log('✅ Question CourseId:', createdQuestion.courseId);
          if (createdQuestion && createdQuestion.id) {
            console.log('✅ Question created successfully with ID:', createdQuestion.id);
            this.toast.show('Question created successfully within course - ID: ' + createdQuestion.id, 'success');
            // Navigate after successful creation
            const qp = this.route.snapshot.queryParams;
            this.router.navigate(['/questions'], { queryParams: qp });
          } else {
            console.warn('⚠️ Question created but no ID returned:', createdQuestion);
            this.toast.show('Created but question ID not received', 'warning');
            const qp = this.route.snapshot.queryParams;
            this.router.navigate(['/questions'], { queryParams: qp });
          }
        },
        error: (err) => {
          console.error('❌ Question creation error:', err);
          this.toast.show('Server connection error during creation.', 'error');
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