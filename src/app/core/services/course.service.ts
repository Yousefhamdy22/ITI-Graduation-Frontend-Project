import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { 
  CourseListDto, 
  CourseDetailDto, 
  Course,
  CourseFilters, 
  PaginatedResult,
  Enrollment
} from '@core/models/entities.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/courses`;

  /**
   * Get courses with filters and pagination
   */
  getCourses(filters?: CourseFilters): Observable<PaginatedResult<CourseListDto>> {
    if (!filters) {
      filters = { pageNumber: 1, pageSize: 12 };
    }

    let params = new HttpParams()
      .set('pageNumber', filters.pageNumber.toString())
      .set('pageSize', filters.pageSize.toString());

    if (filters.search) params = params.set('search', filters.search);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.level) params = params.set('level', filters.level);
    if (filters.priceMin !== undefined) params = params.set('priceMin', filters.priceMin.toString());
    if (filters.priceMax !== undefined) params = params.set('priceMax', filters.priceMax.toString());
    if (filters.rating) params = params.set('rating', filters.rating.toString());
    if (filters.instructorId) params = params.set('instructorId', filters.instructorId);
    if (filters.isFeatured !== undefined) params = params.set('isFeatured', filters.isFeatured.toString());
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);

    return this.http.get<PaginatedResult<CourseListDto>>(this.API_URL, { params });
  }

  getCourse(id: string): Observable<CourseDetailDto> {
    return this.http.get<CourseDetailDto>(`${this.API_URL}/${id}`);
  }

  getCourseBySlug(slug: string): Observable<CourseDetailDto> {
    console.log('🔧 CourseService: Getting course by slug:', slug);
    console.log('🔧 API URL:', `${this.API_URL}?slug=${slug}`);
    // JSON Server: Query courses by slug field
    // Note: The interceptor wraps the response in {items: [...], pageNumber, ...}
    return this.http.get<any>(`${this.API_URL}?slug=${slug}`).pipe(
      map(response => {
        console.log('🔧 CourseService: Received response:', response);
        
        // Handle paginated response from interceptor
        const courses = response.items || (Array.isArray(response) ? response : []);
        
        if (courses && courses.length > 0) {
          console.log('✅ CourseService: Found course:', courses[0]);
          return courses[0];
        }
        console.error('❌ CourseService: Course not found for slug:', slug);
        throw new Error('Course not found');
      })
    );
  }

  searchCourses(query: string): Observable<CourseListDto[]> {
    const params = new HttpParams().set('query', query).set('pageSize', '10');
    return this.http.get<CourseListDto[]>(`${this.API_URL}/search`, { params });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/categories`);
  }

  createCourse(course: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(this.API_URL, course);
  }

  updateCourse(id: string, course: Partial<Course>): Observable<Course> {
    return this.http.patch<Course>(`${this.API_URL}/${id}`, course);
  }

  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  enrollCourse(userId: string, courseId: string): Observable<Enrollment> {
    const enrollment: Partial<Enrollment> = {
      studentId: userId,
      courseId,
      progress: 0,
      enrolledAt: new Date(),
      lastAccessedAt: new Date(),
      status: 'active',
      certificateIssued: false
    };
    return this.http.post<Enrollment>(`${environment.apiUrl}/enrollments`, enrollment);
  }

  getEnrollments(userId: string): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${environment.apiUrl}/enrollments?userId=${userId}`);
  }
}
