import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { ToastService } from '../shared/toast.service';
import { AuthService } from '../auth/auth.service';
import { StudentService } from '../entities/students/student.service';
import { CourseService } from '../entities/courses/course.service';
import { CertificateService } from '../entities/certificates/certificate.service';

@Component({
  selector: 'app-student-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, HomeComponent],
  templateUrl: './student-landing.component.html',
  styleUrls: ['./student-landing.component.css']
})
export class StudentLandingComponent implements OnInit {
  user: any = null;
  studentRecord: any = null;
  myCourses: any[] = [];
  certificates: any[] = [];
  editing = false;
  editPhone = '';
  editAvatar = '';

  constructor(
    private auth: AuthService,
    private studentService: StudentService,
    private courseService: CourseService,
    private certificateService: CertificateService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.currentUser;
    if (!this.user) return;

    if (this.user.role === 'student') {
      this.studentService.getStudentById(this.user.id).subscribe(s => this.studentRecord = s);
      // show all courses for now as enrolled courses are just a count in mock
      this.courseService.getCourses().subscribe(list => this.myCourses = list || []);
      this.certificateService.getCertificatesByStudent(this.user.id).subscribe(list => this.certificates = list || []);
    }
  }

  startEdit() {
    if (!this.studentRecord) return;
    this.editing = true;
    this.editPhone = this.studentRecord.phone || '';
    this.editAvatar = this.studentRecord.avatar || '';
  }

  saveProfile() {
    if (!this.studentRecord) return;
    const updated = this.studentService.updateStudent(this.studentRecord.id, { phone: this.editPhone, avatar: this.editAvatar });
    if (updated) {
      this.studentRecord = updated;
      this.editing = false;
      this.toast.show('تم حفظ بيانات الملف الشخصي', 'success');
    }
  }

  cancelEdit() { this.editing = false; }
}
