import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Student } from '../student.model';

@Component({
  selector: 'app-student-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-card.component.html',
  styleUrls: ['./student-card.component.css']
})
export class StudentCardComponent {
  @Input() student!: Student;
  constructor(private router: Router) {}

  goToStudent(event?: Event) {
    if (event) { event.preventDefault(); }
    this.router.navigate(['/students', this.student?.id]);
  }
}
