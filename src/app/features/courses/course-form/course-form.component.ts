import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [],
  template: ``
})
export class CourseFormComponent implements OnInit {
  private router = inject(Router);

  ngOnInit(): void {
    // Redirect to instructor course form with 'new' id
    this.router.navigate(['/instructor/courses', 'new']);
  }
}
