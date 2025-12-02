import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Course } from '../course.model';
import { CourseService } from '../course.service';
import { Router } from '@angular/router';

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

  constructor(private courseService: CourseService, private router: Router) {}

  onSubmit() {
    // Only save if required fields are present
    if (this.course.title && this.course.description) {
      this.courseService.createCourse(this.course).subscribe(created => {
        this.save.emit(created);
        // navigate to courses list after creation
        this.router.navigate(['/courses']);
      });
    }
  }
}
