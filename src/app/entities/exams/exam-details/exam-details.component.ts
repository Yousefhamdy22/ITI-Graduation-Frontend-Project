import { Component, Input } from '@angular/core';
import { Exam } from '../exam.model';

@Component({
  selector: 'app-exam-details',
  standalone: true,
  templateUrl: './exam-details.component.html',
  styleUrls: ['./exam-details.component.css']
})
export class ExamDetailsComponent {
  @Input() exam!: Exam;
}
