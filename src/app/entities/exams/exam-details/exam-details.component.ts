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
    const hours = Math.floor(this.exam.duration / 60);
    const minutes = this.exam.duration % 60;
    if (hours > 0) {
      return `${hours} ساعة و ${minutes} دقيقة`;
    }
    return `${minutes} دقيقة`;
  }
}
