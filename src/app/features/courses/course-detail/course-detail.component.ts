import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CourseService } from '@core/services/course.service';
import { CourseDetailDto, ModuleWithLectures, CourseLevel } from '@core/models/entities.model';
import { CardComponent } from '@shared/components/card/card.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    BadgeComponent,
    ButtonComponent,
    LoaderComponent
  ],
  templateUrl: './course-detail.component.html',
  styles: []
})
export class CourseDetailComponent implements OnInit {
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  course = signal<CourseDetailDto | null>(null);
  loading = signal(true);
  enrolling = signal(false);
  selectedTab = signal<'overview' | 'curriculum' | 'instructor' | 'reviews'>('overview');
  expandedModules = signal<Set<string>>(new Set());

  // Computed values
  totalDuration = computed(() => {
    const modules = this.course()?.modules || [];
    return modules.reduce((total, module) => total + (module.duration || 0), 0);
  });

  totalLectures = computed(() => {
    const modules = this.course()?.modules || [];
    return modules.reduce((total, module) => total + module.lectures.length, 0);
  });

  ngOnInit(): void {
    console.log('📖 Course Detail Component initialized');
    this.route.params.subscribe(params => {
      console.log('📖 Route params received:', params);
      const slug = params['slug'];
      console.log('📖 Extracted slug:', slug);
      if (slug) {
        this.loadCourse(slug);
      } else {
        console.error('❌ No slug found in route params');
      }
    });
  }

  loadCourse(slug: string): void {
    console.log('📖 Loading course with slug:', slug);
    this.loading.set(true);
    this.courseService.getCourseBySlug(slug).subscribe({
      next: (course) => {
        console.log('✅ Course loaded successfully:', course);
        this.course.set(course);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error loading course:', err);
        this.loading.set(false);
        this.router.navigate(['/courses']);
      }
    });
  }

  enrollCourse(): void {
    const course = this.course();
    if (!course) return;

    this.enrolling.set(true);
    const userId = 'current-user-id'; // TODO: Get from AuthService
    this.courseService.enrollCourse(userId, course.id).subscribe({
      next: () => {
        this.enrolling.set(false);
        // Reload course to get updated enrollment status
        this.loadCourse(course.slug);
      },
      error: () => {
        this.enrolling.set(false);
      }
    });
  }

  goToLecture(courseSlug: string, moduleId: string, lectureId: string): void {
    this.router.navigate(['/courses', courseSlug, 'lecture', lectureId], {
      queryParams: { moduleId }
    });
  }

  toggleModule(moduleId: string): void {
    const expanded = this.expandedModules();
    const newExpanded = new Set(expanded);
    
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    
    this.expandedModules.set(newExpanded);
  }

  isModuleExpanded(moduleId: string): boolean {
    return this.expandedModules().has(moduleId);
  }

  setTab(tab: 'overview' | 'curriculum' | 'instructor' | 'reviews'): void {
    this.selectedTab.set(tab);
  }

  getLevelBadgeVariant(level: CourseLevel): 'success' | 'warning' | 'danger' | 'primary' {
    switch (level) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'primary';
    }
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  getLectureIcon(type: string): string {
    switch (type) {
      case 'video': return '🎥';
      case 'pdf': return '📄';
      case 'text': return '📝';
      case 'quiz': return '❓';
      default: return '📚';
    }
  }
}
