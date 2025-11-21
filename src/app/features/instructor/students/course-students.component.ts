import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InstructorService, StudentEnrollmentDto } from '@core/services/instructor.service';
import { MainLayoutComponent } from '@app/layout/main-layout/main-layout.component';
import { CardComponent } from '@shared/components/card/card.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';

@Component({
  selector: 'app-course-students',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MainLayoutComponent,
    CardComponent,
    BadgeComponent,
    ButtonComponent,
    LoaderComponent,
    AvatarComponent
  ],
  template: `
    <app-main-layout>
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <app-button [routerLink]="['/instructor/courses']" variant="ghost" size="sm">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </app-button>
              <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                Enrolled Students
              </h1>
            </div>
            @if (courseName()) {
              <p class="text-neutral-600 dark:text-neutral-400">{{ courseName() }}</p>
            }
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">{{ students().length }}</div>
            <div class="text-sm text-neutral-600 dark:text-neutral-400">Total Students</div>
          </div>
        </div>

        <!-- Filters and Search -->
        <app-card>
          <div class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearchChange()"
                placeholder="Search students..."
                class="form-input"
              />
            </div>
            <select [(ngModel)]="selectedStatus" (ngModelChange)="filterStudents()" class="form-input w-auto">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
            <select [(ngModel)]="sortBy" (ngModelChange)="filterStudents()" class="form-input w-auto">
              <option value="enrolledAt">Sort by Date</option>
              <option value="progress">Sort by Progress</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </app-card>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <app-card>
            <div class="text-center">
              <div class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{{ activeStudents() }}</div>
              <div class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Active</div>
            </div>
          </app-card>
          <app-card>
            <div class="text-center">
              <div class="text-2xl font-bold text-success-600">{{ completedStudents() }}</div>
              <div class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Completed</div>
            </div>
          </app-card>
          <app-card>
            <div class="text-center">
              <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ averageProgress() }}%</div>
              <div class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Avg Progress</div>
            </div>
          </app-card>
          <app-card>
            <div class="text-center">
              <div class="text-2xl font-bold text-warning-600">{{ droppedStudents() }}</div>
              <div class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Dropped</div>
            </div>
          </app-card>
        </div>

        <!-- Students List -->
        @if (loading()) {
          <div class="flex justify-center py-12">
            <app-loader></app-loader>
          </div>
        } @else if (filteredStudents().length === 0) {
          <app-card>
            <div class="text-center py-12">
              <svg class="w-16 h-16 mx-auto text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">No Students Yet</h3>
              <p class="text-neutral-600 dark:text-neutral-400">Students will appear here once they enroll</p>
            </div>
          </app-card>
        } @else {
          <app-card>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="border-b border-neutral-200 dark:border-neutral-700">
                  <tr class="text-left">
                    <th class="pb-3 text-sm font-medium text-neutral-600 dark:text-neutral-400">Student</th>
                    <th class="pb-3 text-sm font-medium text-neutral-600 dark:text-neutral-400">Enrolled Date</th>
                    <th class="pb-3 text-sm font-medium text-neutral-600 dark:text-neutral-400">Progress</th>
                    <th class="pb-3 text-sm font-medium text-neutral-600 dark:text-neutral-400">Last Accessed</th>
                    <th class="pb-3 text-sm font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                    <th class="pb-3 text-sm font-medium text-neutral-600 dark:text-neutral-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (student of filteredStudents(); track student.enrollmentId) {
                    <tr class="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td class="py-4">
                        <div class="flex items-center gap-3">
                          <app-avatar
                            [src]="student.studentAvatar"
                            [initials]="getInitials(student.studentName)"
                            size="md"
                          />
                          <div>
                            <div class="font-medium text-neutral-900 dark:text-neutral-100">{{ student.studentName }}</div>
                            <div class="text-sm text-neutral-600 dark:text-neutral-400">{{ student.studentEmail }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {{ formatDate(student.enrolledAt) }}
                      </td>
                      <td class="py-4">
                        <div class="flex items-center gap-2">
                          <div class="flex-1 max-w-[100px] bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                            <div
                              class="h-full rounded-full transition-all"
                              [class.bg-success-500]="student.progress === 100"
                              [class.bg-primary-500]="student.progress < 100"
                              [style.width.%]="student.progress"
                            ></div>
                          </div>
                          <span class="text-sm font-medium text-neutral-900 dark:text-neutral-100">{{ student.progress }}%</span>
                        </div>
                      </td>
                      <td class="py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {{ student.lastAccessedAt ? formatDate(student.lastAccessedAt) : 'Never' }}
                      </td>
                      <td class="py-4">
                        <app-badge [variant]="getStatusBadgeVariant(student.status)">
                          {{ student.status | uppercase }}
                        </app-badge>
                      </td>
                      <td class="py-4">
                        <button
                          (click)="viewStudentDetails(student)"
                          class="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                          [attr.aria-label]="'View student details'"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </app-card>
        }
      </div>
  `,
  styles: []
})
export class CourseStudentsComponent implements OnInit {
  private instructorService = inject(InstructorService);
  private route = inject(ActivatedRoute);

  students = signal<StudentEnrollmentDto[]>([]);
  loading = signal(true);
  courseName = signal<string>('');
  courseId = signal<string>('');
  
  searchQuery = '';
  selectedStatus = '';
  sortBy = 'enrolledAt';

  filteredStudents = computed(() => {
    let result = this.students();

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(student =>
        student.studentName.toLowerCase().includes(query) ||
        student.studentEmail.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (this.selectedStatus) {
      result = result.filter(student => student.status === this.selectedStatus);
    }

    // Sorting
    result = [...result].sort((a, b) => {
      switch (this.sortBy) {
        case 'progress':
          return b.progress - a.progress;
        case 'name':
          return a.studentName.localeCompare(b.studentName);
        case 'enrolledAt':
        default:
          return new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime();
      }
    });

    return result;
  });

  activeStudents = computed(() => 
    this.students().filter(s => s.status === 'active').length
  );

  completedStudents = computed(() => 
    this.students().filter(s => s.status === 'completed').length
  );

  droppedStudents = computed(() => 
    this.students().filter(s => s.status === 'dropped').length
  );

  averageProgress = computed(() => {
    const students = this.students();
    if (students.length === 0) return 0;
    const sum = students.reduce((acc, s) => acc + s.progress, 0);
    return Math.round(sum / students.length);
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.courseId.set(id);
      this.loadStudents(id);
    }
  }

  loadStudents(courseId: string): void {
    this.loading.set(true);
    this.instructorService.getStudentEnrollments(courseId, {}).subscribe({
      next: (students) => {
        this.students.set(students);
        this.loading.set(false);
        // You might want to load course name separately
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onSearchChange(): void {
    // Trigger filtering through computed signal
  }

  filterStudents(): void {
    // Trigger filtering through computed signal
  }

  getStatusBadgeVariant(status: string): 'success' | 'warning' | 'danger' | 'primary' {
    switch (status) {
      case 'completed':
        return 'success';
      case 'active':
        return 'primary';
      case 'dropped':
        return 'danger';
      default:
        return 'warning';
    }
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  viewStudentDetails(student: StudentEnrollmentDto): void {
    // Navigate to student detail page or open modal
    console.log('View student details:', student);
  }
}
