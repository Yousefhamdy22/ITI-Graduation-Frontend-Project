
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
  
  // Check if user is logged in
  isLoggedIn = false;
  
  // Stats from database
  totalCourses = 0;
  totalStudents = 0;
  totalInstructors = 0;
  totalProjects = 0;

  constructor(
    private courseService: CourseService,
    private auth: AuthService,
    private studentService: StudentService,
    private instructorService: InstructorService
  ) {}

  ngOnInit(): void {
    // Check if user is logged in
    const user = this.auth.currentUser;
    this.isLoggedIn = !!user;
    this.currentRole = user?.role || '';
    
    // Load stats from database
    this.loadStats();
    
    // load featured courses always
    this.courseService.getCourses().subscribe({
      next: (data: Course[]) => {
        this.featuredCourses = data ?? [];
        this.totalCourses = data?.length || 0;
        this.loading = false;
      },
      error: () => {
        this.featuredCourses = [];
        this.loading = false;
      }
    });

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
  
  private loadStats(): void {
    // Load total students
    this.studentService.getStudents().subscribe({
      next: (students) => {
        this.totalStudents = students?.length || 0;
      },
      error: () => {
        this.totalStudents = 0;
      }
    });
    
    // Load total instructors
    this.instructorService.getInstructors().subscribe({
      next: (instructors) => {
        this.totalInstructors = instructors?.length || 0;
      },
      error: () => {
        this.totalInstructors = 0;
      }
    });
    
    // Projects count - can be calculated from courses or set manually
    // For now using a multiplier from courses
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.totalProjects = (courses?.length || 0) * 2.5; // Approximate
      },
      error: () => {
        this.totalProjects = 0;
      }
    });
  }
}

