import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Course } from '../course.model';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent {
  @Output() save = new EventEmitter<Course>();
  course: Partial<Course> = {};

  onSubmit() {
    // Only emit if required fields are present
    if (this.course.title && this.course.description) {
      this.save.emit({
        ...this.course,
        id: this.course.id ?? '', 
      } as Course);
    }
  }
}
