import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EnrollmentService, EnrollmentStatsDto } from '@core/services/enrollment.service';
import { Enrollment } from '@core/models/entities.model';
import { CardComponent } from '@shared/components/card/card.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    BadgeComponent,
    ButtonComponent,
    LoaderComponent
  ],
  templateUrl: './student-dashboard.component.html',
  styles: []
})
export class StudentDashboardComponent implements OnInit {
  private enrollmentService = inject(EnrollmentService);

  enrollments = signal<Enrollment[]>([]);
  recentActivity = signal<Enrollment[]>([]);
  stats = signal<EnrollmentStatsDto | null>(null);
  loading = signal(true);
  selectedFilter = signal<'all' | 'active' | 'completed'>('all');

  filteredEnrollments = computed(() => {
    const filter = this.selectedFilter();
    const allEnrollments = this.enrollments();

    if (filter === 'all') return allEnrollments;
    if (filter === 'active') return allEnrollments.filter(e => e.status === 'active');
    if (filter === 'completed') return allEnrollments.filter(e => e.status === 'completed');
    
    return allEnrollments;
  });

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);

    // Load enrollments
    this.enrollmentService.getMyEnrollments({ pageSize: 100 }).subscribe({
      next: (result) => {
        this.enrollments.set(result.items);
      }
    });

    // Load statistics
    this.enrollmentService.getMyStats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
      }
    });

    // Load recent activity
    this.enrollmentService.getRecentActivity(5).subscribe({
      next: (activity) => {
        this.recentActivity.set(activity);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  setFilter(filter: 'all' | 'active' | 'completed'): void {
    this.selectedFilter.set(filter);
  }

  getStatusBadgeVariant(status: string): 'success' | 'warning' | 'danger' | 'primary' {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'primary';
      case 'dropped': return 'danger';
      case 'expired': return 'warning';
      default: return 'primary';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  continueLastCourse(): void {
    const recent = this.recentActivity()[0];
    if (recent) {
      // Navigate to the last accessed lecture or course detail
      // Implementation depends on how you track last accessed lecture
    }
  }
}
