
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CourseListComponent } from '../entities/courses/course-list/course-list.component';
import { Course } from '../entities/courses/course.model';
import { CourseService } from '../entities/courses/course.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CourseListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  featuredCourses: Course[] = [];
  loading = true;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getFeaturedCourses().subscribe({
      next: (data: Course[]) => {
        console.log('✅ Featured courses loaded:', data);
        this.featuredCourses = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error loading featured courses:', err);
        this.featuredCourses = [];
        this.loading = false;
      }
    });
  }
}

