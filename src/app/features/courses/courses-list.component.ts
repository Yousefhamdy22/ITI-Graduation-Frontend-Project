import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '@core/services/course.service';
import { CourseListDto, CourseFilters, CourseLevel, PaginatedResult } from '@core/models/entities.model';
import { CardComponent } from '@shared/components/card/card.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    BadgeComponent,
    LoaderComponent,
    ButtonComponent,
    PaginationComponent
  ],
  templateUrl: './courses-list.component.html',
  styles: []
})
export class CoursesComponent implements OnInit {
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Expose Math to template
  Math = Math;

  courses = signal<CourseListDto[]>([]);
  loading = signal(true);
  
  // Pagination
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  pageSize = 12;

  // Filters
  searchQuery = signal('');
  selectedCategory = signal('');
  selectedLevel = signal<CourseLevel | ''>('');
  minPrice = signal<number | undefined>(undefined);
  maxPrice = signal<number | undefined>(undefined);
  minRating = signal<number | undefined>(undefined);
  sortBy = signal<'title' | 'price' | 'rating' | 'students' | 'created'>('created');
  sortOrder = signal<'asc' | 'desc'>('desc');

  categories = [
    'Programming',
    'Design',
    'Business',
    'Marketing',
    'Languages',
    'Science',
    'Mathematics',
    'Music'
  ];

  levels: CourseLevel[] = ['beginner', 'intermediate', 'advanced', 'all-levels'];

  ngOnInit(): void {
    // Read query params
    this.route.queryParams.subscribe(params => {
      if (params['search']) this.searchQuery.set(params['search']);
      if (params['category']) this.selectedCategory.set(params['category']);
      if (params['level']) this.selectedLevel.set(params['level']);
      if (params['page']) this.currentPage.set(+params['page']);
      
      this.loadCourses();
    });
  }

  loadCourses(): void {
    this.loading.set(true);

    const filters: CourseFilters = {
      pageNumber: this.currentPage(),
      pageSize: this.pageSize,
      search: this.searchQuery() || undefined,
      category: this.selectedCategory() || undefined,
      level: this.selectedLevel() || undefined,
      priceMin: this.minPrice(),
      priceMax: this.maxPrice(),
      rating: this.minRating(),
      sortBy: this.sortBy(),
      sortOrder: this.sortOrder()
    };

    this.courseService.getCourses(filters).subscribe({
      next: (result: PaginatedResult<CourseListDto>) => {
        console.log('✅ Courses received:', result);
        console.log('📊 Total items:', result.totalCount);
        console.log('📄 Items array length:', result.items?.length);
        console.log('👤 First course instructor:', result.items[0]?.instructor);
        console.log('📝 First course data:', result.items[0]);
        
        // Ensure all courses have instructor data with fallback
        const coursesWithInstructors = result.items.map(course => ({
          ...course,
          instructor: course.instructor || {
            id: 'unknown',
            firstName: 'Unknown',
            lastName: 'Instructor',
            avatar: undefined
          }
        }));
        
        console.log('✅ Setting courses signal with', coursesWithInstructors.length, 'courses');
        this.courses.set(coursesWithInstructors);
        this.totalPages.set(result.totalPages);
        this.totalItems.set(result.totalCount);
        this.currentPage.set(result.pageNumber);
        this.loading.set(false);
        console.log('✅ Loading set to false, courses() signal value:', this.courses());
      },
      error: (err) => {
        console.error('❌ Error loading courses:', err);
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.updateQueryParams();
    this.loadCourses();
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.updateQueryParams();
    this.loadCourses();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.updateQueryParams();
    this.loadCourses();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('');
    this.selectedLevel.set('');
    this.minPrice.set(undefined);
    this.maxPrice.set(undefined);
    this.minRating.set(undefined);
    this.currentPage.set(1);
    this.updateQueryParams();
    this.loadCourses();
  }

  private updateQueryParams(): void {
    const queryParams: any = {};
    
    if (this.searchQuery()) queryParams.search = this.searchQuery();
    if (this.selectedCategory()) queryParams.category = this.selectedCategory();
    if (this.selectedLevel()) queryParams.level = this.selectedLevel();
    if (this.currentPage() > 1) queryParams.page = this.currentPage();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  getLevelBadgeVariant(level: CourseLevel): 'success' | 'warning' | 'danger' | 'primary' {
    switch (level) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'primary';
    }
  }

  navigateToCourse(slug: string, event?: MouseEvent): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    console.log('🔍 Navigating to course with slug:', slug);
    console.log('🔍 Slug type:', typeof slug);
    console.log('🔍 Slug value:', slug);
    console.log('🔍 Full navigation path:', ['/courses', slug]);
    console.log('🔍 Current URL before navigation:', window.location.href);
    
    if (!slug) {
      console.error('❌ Cannot navigate: slug is', slug);
      return;
    }
    
    this.router.navigate(['/courses', slug]).then(
      success => {
        console.log('✅ Navigation successful:', success);
        console.log('🔍 Current URL after navigation:', window.location.href);
        console.log('🔍 Router URL:', this.router.url);
      },
      error => console.error('❌ Navigation failed:', error)
    );
  }
}
