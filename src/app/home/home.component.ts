
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseListComponent } from '../entities/courses/course-list/course-list.component';
import { Course } from '../entities/courses/course.model';
import { CourseService } from '../entities/courses/course.service';
import { AuthService } from '../auth/auth.service';
import { StudentService } from '../entities/students/student.service';
import { InstructorService } from '../entities/instructors/instructor.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  featuredCourses: Course[] = [];
  loading = true;

  // role-aware
  currentRole = '';
  enrolledCount = 0;
  myCourses: Course[] = [];

  constructor(
    private courseService: CourseService,
    private auth: AuthService,
    private studentService: StudentService,
    private instructorService: InstructorService
  ) {}

  ngOnInit(): void {
    // load featured courses always
    this.courseService.getCourses().subscribe({
      next: (data: Course[]) => {
        this.featuredCourses = data ?? [];
        this.loading = false;
      },
      error: () => {
        this.featuredCourses = [];
        this.loading = false;
      }
    });

    const user = this.auth.currentUser;
    this.currentRole = user?.role || '';

    if (user?.role === 'student') {
      // try to fetch the student record and show enrolledCourseIds count
      this.studentService.getStudentById(user.id).subscribe({
        next: (s) => {
          if (s) this.enrolledCount = s.enrolledCourseIds?.length || 0;
        },
        error: (err) => {
          console.warn('Student record not found, using default values:', err);
          this.enrolledCount = 0;
        }
      });
      // show all courses but mark enrolledCount in UI (course list component can be enhanced later)
      this.courseService.getCourses().subscribe(list => (this.myCourses = list || []));
    }

    if (user?.role === 'instructor') {
      // show courses created by this instructor
      this.courseService.getCourses().subscribe(list => {
        this.myCourses = (list || []).filter(c => c.instructorName === user.name || c.instructorId === user.id);
      });
    }
  }
}

