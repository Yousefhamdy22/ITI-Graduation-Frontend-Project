import { Component, OnInit, afterNextRender, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../core/sidebar/sidebar.component';
import { RoleHeaderComponent } from '../../../core/header/role-header.component';
import { FooterComponent } from '../../../core/footer/footer.component';
import { AuthService } from '../../auth.service';
import { StudentService } from '../../../entities/students/student.service';
import { CourseService } from '../../../entities/courses/course.service';
import { Course } from '../../../entities/courses/course.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, RoleHeaderComponent],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.scss'],
})
export class StudentDashboard implements OnInit {
  user: any = null;
  enrolledCourses: Course[] = [];
  activeCoursesCount = 0;
  completedCoursesCount = 0;
  certificatesCount = 0;
  loading = true;

  constructor(
    private auth: AuthService,
    private studentService: StudentService,
    private courseService: CourseService,
    private injector: Injector
  ) {
    afterNextRender(() => {
      this.loadData();
    }, { injector: this.injector });
  }

  ngOnInit(): void {
    // Initialization handled in constructor via afterNextRender
  }

  private loadData() {
    this.user = this.auth.currentUser;
    if (!this.user) return;

    this.loading = true;

    // 1. Get Student Details to find enrolled IDs
    this.studentService.getStudentById(this.user.id).subscribe({
      next: (student) => {
        const enrolledIds = student?.enrolledCourseIds || [];

        // 2. Get All Courses and filter
        this.courseService.getCourses().subscribe({
          next: (allCourses) => {
            this.enrolledCourses = (allCourses || []).filter(c => enrolledIds.includes(c.id));

            // Mock stats for now
            this.activeCoursesCount = this.enrolledCourses.length;
            this.completedCoursesCount = 0; // Logic for completion can be added later
            this.certificatesCount = 0; // Logic for certificates can be added later

            this.loading = false;
          },
          error: (err) => {
            console.error('Error loading courses', err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading student data', err);
        this.loading = false;
      }
    });
  }
}
