import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '@core/services/course.service';
import { CourseListDto, CourseFilters } from '@core/models/entities.model';
import { CardComponent } from '@shared/components/card/card.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-home',
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
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  private courseService = inject(CourseService);
  private router = inject(Router);

  loading = signal(false);
  featuredCourses = signal<CourseListDto[]>([]);
  popularCourses = signal<CourseListDto[]>([]);
  searchQuery = signal('');

  categories = [
    { id: 'programming', name: 'Programming', icon: '💻' },
    { id: 'design', name: 'Design', icon: '🎨' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'marketing', name: 'Marketing', icon: '📈' },
    { id: 'languages', name: 'Languages', icon: '🌍' },
    { id: 'science', name: 'Science', icon: '🔬' }
  ];

  stats = [
    { value: '10,000+', label: 'Students' },
    { value: '500+', label: 'Courses' },
    { value: '100+', label: 'Instructors' },
    { value: '50+', label: 'Categories' }
  ];

  ngOnInit(): void {
    this.loadFeaturedCourses();
    this.loadPopularCourses();
  }

  loadFeaturedCourses(): void {
    this.loading.set(true);
    const filters: CourseFilters = {
      isFeatured: true,
      pageNumber: 1,
      pageSize: 6,
      sortBy: 'rating',
      sortOrder: 'desc'
    };

    this.courseService.getCourses(filters).subscribe({
      next: (result) => {
        this.featuredCourses.set(result.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadPopularCourses(): void {
    const filters: CourseFilters = {
      pageNumber: 1,
      pageSize: 8,
      sortBy: 'students',
      sortOrder: 'desc'
    };

    this.courseService.getCourses(filters).subscribe({
      next: (result) => {
        this.popularCourses.set(result.items);
      }
    });
  }

  onSearch(): void {
    if (this.searchQuery().trim()) {
      this.router.navigate(['/courses'], {
        queryParams: { search: this.searchQuery() }
      });
    }
  }

  onCategoryClick(categoryId: string): void {
    this.router.navigate(['/courses'], {
      queryParams: { category: categoryId }
    });
  }

  viewAllCourses(): void {
    this.router.navigate(['/courses']);
  }
}
