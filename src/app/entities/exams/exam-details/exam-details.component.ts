import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Exam } from '../exam.model';

@Component({
  selector: 'app-exam-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exam-details.component.html',
  styleUrls: ['./exam-details.component.css']
})
export class ExamDetailsComponent {
  @Input() exam!: Exam;

  getEstimatedTime(): string {
    const hours = Math.floor(this.exam.durationMinutes / 60);
    const minutes = this.exam.durationMinutes % 60;
    if (hours > 0) {
      return `${hours} hr and ${minutes} min`;
    }
    return `${minutes} min`;
  }
}
