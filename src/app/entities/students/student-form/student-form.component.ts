import { Component, Output, EventEmitter } from '@angular/core';
import { Student } from '../student.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent {
  @Output() save = new EventEmitter<Student>();
  student: Partial<Student> = {};

  onSubmit() {
    if (this.student.firstName && this.student.lastName && this.student.email) {
      this.save.emit({
        ...this.student,
        id: this.student.id ?? '',
      } as Student);
    }
  }
}
