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
      this.courseService.getCourses(),
      this.studentService.getTotalStudents$(),
      this.instructorService.getInstructors(),
    ]).pipe(
      map(([courses, totalStudents, instructors]) => {
        const totalCourses = courses.length;
        const totalInstructors = Array.isArray(instructors) ? instructors.length : 0;
        const revenue = courses.reduce((sum: number, c: any) => sum + (c.price || 0), 0);
        const activeEnrollments = courses.reduce((sum: number, c: any) => sum + (c.studentsCount || 0), 0);

        // حساب الطلاب الجدد هذا الشهر (مثال بسيط)
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        // إذا كان لديك تاريخ تسجيل الطالب في الكورس، يمكن حسابهم هنا
        const newStudentsThisMonth = 0; // تحتاج تعديل حسب بياناتك

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

