import { Injectable } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { CourseService } from '../entities/courses/course.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  stats$;

  constructor(private courseService: CourseService) {
    this.stats$ = combineLatest([
      this.courseService.getTotalCourses$(),
      this.courseService.getRevenueEstimate$(),
      this.courseService.courses$
    ]).pipe(
      map(([totalCourses, revenue, courses]) => {
        const totalStudents = courses.reduce((sum, c) => sum + (c.studentsCount || 0), 0);
        const activeEnrollments = totalStudents; // مؤقتًا
        return { totalStudents, totalCourses, activeEnrollments, revenue };
      })
    );
  }
}

