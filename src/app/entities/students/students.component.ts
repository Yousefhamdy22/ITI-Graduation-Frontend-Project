import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { StudentService } from './student.service';
import { Student } from './student.model';
import { AuthService } from '../../auth/auth.service';
import { CourseService } from '../courses/course.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  loading = true;

  query = { search: '' };

  constructor(private studentService: StudentService, private auth: AuthService, private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {
    this.loading = true;
    const user = this.auth.currentUser;
    if (user && user.role === 'instructor') {
      // only show students enrolled in this instructor's courses
      this.courseService.getCourses().subscribe(courses => {
        const myCourseIds = (courses || []).filter(c => (c as any).instructorId === user.id || c.instructorName === user.name).map(c => c.id);
        this.studentService.getStudents().subscribe({
          next: (students) => {
            const filtered = (students || []).filter(s => (s.enrolledCourseIds || []).some(id => myCourseIds.includes(id)));
            this.students = filtered;
            this.filteredStudents = filtered;
            this.loading = false;
          },
          error: (err) => { console.error(err); this.loading = false; }
        });
      });
      return;
    }

    this.studentService.getStudents().subscribe({
      next: (students) => {
        console.log('✅ الطلاب وصلوا:', students);
        this.students = students;
        this.filteredStudents = students;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ خطأ:', err);
        this.loading = false;
      }
    });
  }

  filterStudents() {
    let result = [...this.students];

    if (this.query.search) {
      const term = this.query.search.toLowerCase();
      result = result.filter(s =>
        s.name?.toLowerCase().includes(term) ||
        s.email?.toLowerCase().includes(term)
      );
    }

    this.filteredStudents = result;
  }

  onSearch() {
    this.filterStudents();
  }
}
