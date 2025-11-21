import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '@core/services/course.service';
import { CourseListDto, CourseFilters, CourseLevel } from '@core/models/entities.model';
import { CardComponent } from '@shared/components/card/card.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    CardComponent,
    BadgeComponent,
    LoaderComponent,
    ButtonComponent
  ],
  template: `
      <div class="space-y-6 p-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-neutral-900">All Courses</h1>
            <p class="text-neutral-600 mt-1">Explore our comprehensive course catalog</p>
          </div>
          <app-button routerLink="/courses/new" variant="primary">
            Create Course
          </app-button>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap gap-4">
          <select class="form-input w-auto">
            <option>All Categories</option>
            <option>Programming</option>
            <option>Design</option>
            <option>Business</option>
          </select>
          
          <select class="form-input w-auto">
            <option>All Levels</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <input
            type="search"
            placeholder="Search courses..."
            class="form-input flex-1 max-w-md"
          />
        </div>

        <!-- Courses Grid -->
        @if (loading()) {
          <app-loader />
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (course of courses(); track course.id) {
              <app-card [hoverable]="true" [padding]="false">
                <a [routerLink]="['/courses', course.id]" class="block">
                  <img [src]="course.coverImage" [alt]="course.title" class="w-full h-48 object-cover">
                  <div class="p-6">
                    <div class="flex items-center justify-between mb-3">
                      <app-badge [variant]="getLevelBadgeVariant(course.level)">
                        {{ course.level }}
                      </app-badge>
                      <span class="text-lg font-bold text-primary-600">
                        @if (course.price === 0) {
                          Free
                        } @else {
                          {{ course.price | currency: 'USD' }}
                        }
                      </span>
                    </div>
                    
                    <h3 class="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
                      {{ course.title }}
                    </h3>
                    
                    <p class="text-sm text-neutral-600 mb-4 line-clamp-2">
                      {{ course.shortDescription }}
                    </p>
                    
                    <div class="flex items-center justify-between text-sm text-neutral-600">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-1 text-warning-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span class="font-medium">{{ course.rating }}</span>
                      </div>
                      <span>{{ course.totalStudents }} Students</span>
                    </div>
                  </div>
                </a>
              </app-card>
            }
          </div>
        }
      </div>
  `,
  styles: []
})
export class CoursesComponent implements OnInit {
  courses = signal<CourseListDto[]>([]);
  loading = signal(true);

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (result) => {
        this.courses.set(result.items);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getLevelBadgeVariant(level: string): 'success' | 'warning' | 'danger' {
    switch (level) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'danger';
      default: return 'primary' as any;
    }
  }

  getStartIndex(): number {
    return this.courses().length > 0 ? 1 : 0;
  }

  getEndIndex(): number {
    return this.courses().length;
  }

  get totalCourses(): number {
    return this.courses().length;
  }
}
