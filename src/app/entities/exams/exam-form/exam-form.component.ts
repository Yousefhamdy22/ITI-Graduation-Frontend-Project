import { Component, Output, EventEmitter } from '@angular/core';
import { Exam } from '../exam.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-exam-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './exam-form.component.html',
  styleUrls: ['./exam-form.component.css']
})
export class ExamFormComponent {
  @Output() save = new EventEmitter<Exam>();
  exam: Partial<Exam> = {};

  onSubmit() {
    if (this.exam.title && this.exam.description) {
      this.save.emit({
        ...this.exam,
        id: this.exam.id ?? '',
      } as Exam);
    }
  }
}
