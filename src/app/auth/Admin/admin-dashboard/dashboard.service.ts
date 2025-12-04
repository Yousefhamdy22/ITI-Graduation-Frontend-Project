import {Injectable} from '@angular/core';
import {combineLatest, map} from 'rxjs';
import {CourseService} from '../../../entities/courses/course.service';
import {StudentService} from '../../../entities/students/student.service';
import {InstructorService} from '../../../entities/instructors/instructor.service';

@Injectable({providedIn: 'root'})
export class DashboardService {
  stats$;

  constructor(
    private courseService: CourseService,
    private studentService: StudentService,
    private instructorService: InstructorService
  ) {
    this.stats$ = combineLatest([
      this.courseService.getTotalCourses$(),
      this.courseService.getRevenueEstimate$(),
      this.courseService.courses$,
      this.studentService.getTotalStudents$(),
      this.instructorService.getTotalInstructors$(),
    ]).pipe(
      map(([totalCourses, revenue, courses, totalStudents, totalInstructors]) => {
        const activeEnrollments = courses.reduce((sum, c) => sum + (c.studentsCount || 0), 0);

        // simple calculation for "new this month" (students joined in last 30 days)
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const newStudentsThisMonth = (courses || []).reduce((sum, c) => sum, 0); // placeholder

        return {
          totalStudents,
          totalCourses,
          totalInstructors,
          activeEnrollments,
          revenue,
          newStudentsThisMonth,
        };
      })
    );
  }
}

