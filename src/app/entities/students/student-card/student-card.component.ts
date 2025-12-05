import { Component, Input } from '@angular/core';
import { Student } from '../student.model';

@Component({
  selector: 'app-student-card',
  standalone: true,
  templateUrl: './student-card.component.html',
  styleUrls: ['./student-card.component.css']
})
export class StudentCardComponent {
  @Input() student!: Student;
}
