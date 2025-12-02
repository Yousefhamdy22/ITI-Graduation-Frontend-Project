
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Course } from '../course.model';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css']
})
export class CourseCardComponent {
  @Input({ required: true }) course!: Course; // non-nullable
  constructor(private router: Router) {}

  goToCourse(event?: Event) {
    if (event) { event.preventDefault(); }
    this.router.navigate(['/courses', this.course?.id]);
  }
}

