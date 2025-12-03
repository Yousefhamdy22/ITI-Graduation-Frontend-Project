import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CertificateService } from '../certificate.service';
import { StudentService } from '../../students/student.service';
import { CourseService } from '../../courses/course.service';
import { AuthService } from '../../../auth/auth.service';
import { ToastService } from '../../../shared/toast.service';

@Component({
  selector: 'app-certificate-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './certificate-form.component.html',
  styleUrls: ['./certificate-form.component.css']
})
export class CertificateFormComponent implements OnInit {
  selectedStudentId = '';
  selectedCourseId = '';
  grade = 0;
  
  students: any[] = [];
  courses: any[] = [];
  
  studentName = '';
  courseName = '';
  instructorName = '';

  constructor(
    private certificateService: CertificateService,
    private studentService: StudentService,
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    // Load students
    this.studentService.getStudents().subscribe(list => {
      this.students = list || [];
    });

    // Load courses
    this.courseService.getCourses().subscribe(list => {
      this.courses = list || [];
    });

    // Get instructor name
    const user = this.authService.currentUser;
    if (user) {
      this.instructorName = user.name;
    }
  }

  onStudentChange() {
    const student = this.students.find(s => s.id === this.selectedStudentId);
    if (student) {
      this.studentName = student.name;
    }
  }

  onCourseChange() {
    const course = this.courses.find(c => c.id === this.selectedCourseId);
    if (course) {
      this.courseName = course.title;
    }
  }

  create() {
    if (!this.selectedStudentId || !this.selectedCourseId || this.grade <= 0) {
      this.toast.show('الرجاء ملء جميع الحقول بشكل صحيح', 'warning');
      return;
    }

    const certificate = this.certificateService.createCertificate({
      studentId: this.selectedStudentId,
      studentName: this.studentName,
      courseId: this.selectedCourseId,
      courseName: this.courseName,
      grade: this.grade,
      instructorName: this.instructorName
    });

    this.toast.show('تم إنشاء الشهادة بنجاح!', 'success');
    this.router.navigate(['/certificates', certificate.id]);
  }

  cancel() {
    this.router.navigate(['/certificates']);
  }
}
