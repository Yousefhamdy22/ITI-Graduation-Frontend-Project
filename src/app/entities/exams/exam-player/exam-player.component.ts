import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ExamService } from '../exam.service';
import { Exam } from '../exam.model';

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

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.examService.getExamById(id).subscribe({
      next: (exam) => {
        this.exam = exam;
        if (exam) {
          this.timeRemaining = exam.duration * 60; // convert to seconds
          this.startTimer();
        }
        this.loading = false;
      },
      error: () => this.loading = false
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
    
    const answers = this.exam.questions.map((q, i) => this.selectedAnswers[i] ?? -1);
    this.examService.submitExam(this.exam.id, answers).subscribe({
      next: (result) => {
        this.score = result.score;
        this.submitted = true;
      }
    });
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getAnswerStatus(questionIndex: number): string {
    if (!this.submitted) return 'unanswered';
    const isCorrect = this.selectedAnswers[questionIndex] === this.exam?.questions[questionIndex].correctOption;
    return isCorrect ? 'correct' : 'incorrect';
  }

  isPassed(): boolean {
    return this.exam ? this.score >= this.exam.passingScore : false;
  }
}
