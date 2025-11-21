import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@core/auth/services/auth.service';
import { InstructorService } from '@core/services/instructor.service';
import { CourseListDto, CourseLevel } from '@core/models/entities.model';
import { CardComponent } from '@shared/components/card/card.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-instructor-courses',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    CardComponent,
    BadgeComponent,
    ButtonComponent,
    LoaderComponent
  ],
  template: `
      <div class="space-y-6 p-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">My Courses</h1>
            <p class="text-neutral-600 dark:text-neutral-400 mt-1">Manage and organize your courses</p>
          </div>
          <app-button [routerLink]="['/instructor/courses/new']" variant="primary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Course
          </app-button>
        </div>

        <!-- Filters -->
        <app-card>
          <div class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearchChange()"
                placeholder="Search courses..."
                class="form-input"
              />
            </div>
            <select [(ngModel)]="selectedStatus" (ngModelChange)="filterCourses()" class="form-input w-auto">
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <select [(ngModel)]="selectedLevel" (ngModelChange)="filterCourses()" class="form-input w-auto">
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </app-card>

        <!-- Courses Grid -->
        @if (loading()) {
          <div class="flex justify-center py-12">
            <app-loader></app-loader>
          </div>
        } @else if (filteredCourses().length === 0) {
          <app-card>
            <div class="text-center py-12">
              <svg class="w-16 h-16 mx-auto text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">No Courses Yet</h3>
              <p class="text-neutral-600 dark:text-neutral-400 mb-4">Create your first course to get started</p>
              <app-button [routerLink]="['/instructor/courses/new']" variant="primary">
                Create Your First Course
              </app-button>
            </div>
          </app-card>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (course of filteredCourses(); track course.id) {
              <app-card [hover]="true" [padding]="false">
                <div class="relative">
                  <img 
                    [src]="course.coverImage || 'https://via.placeholder.com/400x200'" 
                    [alt]="course.title" 
                    class="w-full h-48 object-cover"
                  />
                  <div class="absolute top-2 right-2">
                    <app-badge [variant]="course.isPublished ? 'success' : 'warning'">
                      {{ course.isPublished ? 'Published' : 'Draft' }}
                    </app-badge>
                  </div>
                </div>

                <div class="p-6">
                  <div class="flex items-center justify-between mb-3">
                    <app-badge [variant]="getLevelBadgeVariant(course.level)">
                      {{ course.level | uppercase }}
                    </app-badge>
                    <span class="text-lg font-bold text-primary-600 dark:text-primary-400">
                      @if (course.price === 0) {
                        Free
                      } @else {
                        ${'$'}{{ course.price }}
                      }
                    </span>
                  </div>

                  <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2 line-clamp-2">
                    {{ course.title }}
                  </h3>

                  <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                    {{ course.shortDescription }}
                  </p>

                  <!-- Stats -->
                  <div class="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                    <div class="text-center">
                      <div class="text-lg font-bold text-neutral-900 dark:text-neutral-100">{{ course.totalStudents }}</div>
                      <div class="text-xs text-neutral-600 dark:text-neutral-400">Students</div>
                    </div>
                    <div class="text-center">
                      <div class="text-lg font-bold text-neutral-900 dark:text-neutral-100">{{ course.rating.toFixed(1) }}</div>
                      <div class="text-xs text-neutral-600 dark:text-neutral-400">Rating</div>
                    </div>
                    <div class="text-center">
                      <div class="text-lg font-bold text-neutral-900 dark:text-neutral-100">{{ course.totalLectures }}</div>
                      <div class="text-xs text-neutral-600 dark:text-neutral-400">Lectures</div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-2">
                    <app-button 
                      [routerLink]="['/courses', course.slug]" 
                      variant="ghost" 
                      size="sm"
                      class="flex-1"
                      title="View as student"
                    >
                      👁️ View
                    </app-button>
                    <app-button 
                      [routerLink]="['/instructor/courses', course.id, 'edit']" 
                      variant="outline" 
                      size="sm"
                      class="flex-1"
                    >
                      Edit
                    </app-button>
                    <app-button 
                      [routerLink]="['/instructor/courses', course.id, 'curriculum']" 
                      variant="primary" 
                      size="sm"
                      class="flex-1"
                    >
                      Curriculum
                    </app-button>
                    <button
                      (click)="deleteCourse(course.id)"
                      class="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                      [attr.aria-label]="'Delete course'"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </app-card>
            }
          </div>
        }
      </div>
  `,
  styles: []
})
export class InstructorCoursesComponent implements OnInit {
  private instructorService = inject(InstructorService);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);

  courses = signal<CourseListDto[]>([]);
  loading = signal(true);
  searchQuery = '';
  selectedStatus = '';
  selectedLevel = '';

  filteredCourses = computed(() => {
    let result = this.courses();

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.shortDescription?.toLowerCase().includes(query)
      );
    }

    if (this.selectedStatus) {
      result = result.filter(course =>
        this.selectedStatus === 'published' ? course.isPublished : !course.isPublished
      );
    }

    if (this.selectedLevel) {
      result = result.filter(course => course.level === this.selectedLevel);
    }

    return result;
  });

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading.set(true);
    const currentUser = this.authService.currentUser();
    const instructorId = currentUser?.id || '2';
    
    console.log('🔍 Loading courses for instructor:', instructorId);
    console.log('👤 Current user:', currentUser);
    
    // Fetch instructor's courses directly from API
    // Note: The interceptor will wrap this in a paginated response
    this.http.get<any>(`http://localhost:3000/courses?instructorId=${instructorId}`).subscribe({
      next: (response) => {
        console.log('✅ Received response from API:', response);
        
        // Handle paginated response from interceptor
        const coursesArray = response.items || response.data || (Array.isArray(response) ? response : []);
        console.log('📚 Courses array:', coursesArray);
        console.log('📊 Total courses:', coursesArray.length);
        
        if (!Array.isArray(coursesArray)) {
          console.error('❌ Expected array but got:', typeof coursesArray, coursesArray);
          this.courses.set([]);
          this.loading.set(false);
          return;
        }
        
        // Transform to CourseListDto format
        const transformedCourses = coursesArray.map((course: any) => ({
          id: course.id,
          slug: course.slug,
          title: course.title,
          shortDescription: course.description?.substring(0, 150) || course.shortDescription || '',
          coverImage: course.thumbnail || course.coverImage,
          price: course.price || 0,
          level: course.level as CourseLevel,
          category: course.category,
          rating: course.rating || 0,
          totalStudents: course.studentsEnrolled || course.totalStudents || 0,
          totalLectures: course.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0) || course.totalLectures || 0,
          duration: course.duration || '0 hours',
          isPublished: course.isPublished || false,
          isFeatured: course.isFeatured || false,
          instructor: course.instructor || {
            id: currentUser?.id || '2',
            firstName: currentUser?.firstName || 'محمد',
            lastName: currentUser?.lastName || 'أحمد'
          },
          createdAt: course.createdAt,
          updatedAt: course.updatedAt
        }));
        console.log('✅ Transformed courses:', transformedCourses.length);
        this.courses.set(transformedCourses as CourseListDto[]);
        this.loading.set(false);
        console.log('✅ Courses loaded successfully. Total:', this.courses().length);
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.loading.set(false);
      }
    });
  }

  onSearchChange(): void {
    // Trigger filtering through computed signal
  }

  filterCourses(): void {
    // Trigger filtering through computed signal
  }

  getLevelBadgeVariant(level: CourseLevel): 'success' | 'warning' | 'danger' {
    switch (level) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'danger';
      default:
        return 'success';
    }
  }

  deleteCourse(courseId: string): void {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      this.instructorService.deleteCourse(courseId).subscribe({
        next: () => {
          this.courses.update(courses => courses.filter(c => c.id !== courseId));
        },
        error: (error) => {
          console.error('Error deleting course:', error);
        }
      });
    }
  }
}
