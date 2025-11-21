import { HttpInterceptorFn, HttpResponse, HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { environment } from '@environments/environment';

/**
 * Interceptor to transform JSON Server responses into the format expected by the app
 * JSON Server returns arrays for lists, but our app expects paginated results
 */
export const jsonServerInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  
  return next(req).pipe(
    switchMap(event => {
      // Only process successful HTTP responses
      if (event instanceof HttpResponse) {
        // Transform courses list endpoint
        if (req.url.includes('/courses') && !req.url.includes('/slug/') && !req.url.includes('/users') && Array.isArray(event.body)) {
          const items = event.body;
          
          console.log('JSON Server Interceptor: Processing courses response', items.length, 'courses');
          
          // Fetch all users to populate instructor data
          return http.get<any[]>(`${environment.apiUrl}/users`).pipe(
            map(users => {
              console.log('JSON Server Interceptor: Fetched users', users.length);
              
              // Create a map of users by ID for quick lookup
              const userMap = new Map(users.map(u => [u.id, u]));
              
              // Populate instructor data for each course
              const coursesWithInstructors = items.map((course: any) => {
                const instructor = userMap.get(course.instructorId);
                return {
                  ...course,
                  instructor: instructor ? {
                    id: instructor.id,
                    firstName: instructor.firstName,
                    lastName: instructor.lastName,
                    avatar: instructor.avatar
                  } : {
                    id: course.instructorId || 'unknown',
                    firstName: 'Unknown',
                    lastName: 'Instructor',
                    avatar: undefined
                  },
                  // Map fields to match expected DTO
                  slug: course.slug || course.title?.toLowerCase().replace(/\s+/g, '-') || course.id,
                  shortDescription: course.description,
                  coverImage: course.thumbnail,
                  totalStudents: course.studentsEnrolled || 0,
                  totalLectures: course.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0) || 0,
                  isFeatured: course.isFeatured || false
                };
              });
              
              console.log('JSON Server Interceptor: Populated instructor data, first course:', coursesWithInstructors[0]);
              
              return processCoursesWithFilters(req, coursesWithInstructors, event);
            })
          );
        }
      }
      
      return of(event);
    })
  );
};

function processCoursesWithFilters(req: any, items: any[], event: HttpResponse<any>) {
  const pageSize = parseInt(req.params.get('pageSize') || '12');
  const pageNumber = parseInt(req.params.get('pageNumber') || '1');
  
  // Apply filters manually since JSON Server doesn't support our filter format
  let filteredItems = items;
  
  // Search filter
  const search = req.params.get('search');
  if (search) {
    const searchLower = search.toLowerCase();
    filteredItems = filteredItems.filter((item: any) => 
      item.title?.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower) ||
      item.shortDescription?.toLowerCase().includes(searchLower)
    );
  }
  
  // Category filter
  const category = req.params.get('category');
  if (category) {
    filteredItems = filteredItems.filter((item: any) => 
      item.category === category
    );
  }
  
  // Level filter
  const level = req.params.get('level');
  if (level) {
    filteredItems = filteredItems.filter((item: any) => 
      item.level?.toLowerCase() === level.toLowerCase()
    );
  }
  
  // Price filters
  const priceMin = req.params.get('priceMin');
  if (priceMin) {
    filteredItems = filteredItems.filter((item: any) => 
      item.price >= parseFloat(priceMin)
    );
  }
  
  const priceMax = req.params.get('priceMax');
  if (priceMax) {
    filteredItems = filteredItems.filter((item: any) => 
      item.price <= parseFloat(priceMax)
    );
  }
  
  // Rating filter
  const rating = req.params.get('rating');
  if (rating) {
    filteredItems = filteredItems.filter((item: any) => 
      item.rating >= parseFloat(rating)
    );
  }
  
  // Sorting
  const sortBy = req.params.get('sortBy') || 'createdAt';
  const sortOrder = req.params.get('sortOrder') || 'desc';
  
  filteredItems = [...filteredItems].sort((a: any, b: any) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    // Handle different data types
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
  
  const totalCount = filteredItems.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  
  // Paginate
  const startIndex = (pageNumber - 1) * pageSize;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize);
  
  // Return in the expected PaginatedResult format
  return event.clone({
    body: {
      items: paginatedItems,
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      totalPages: totalPages,
      hasPreviousPage: pageNumber > 1,
      hasNextPage: pageNumber < totalPages
    }
  });
}
