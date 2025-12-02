import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, Role } from './auth.service';
import { StudentService } from '../entities/students/student.service';
import { InstructorService } from '../entities/instructors/instructor.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  name = 'مستخدم';
  role: Role = 'student';
  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private studentService: StudentService,
    private instructorService: InstructorService
  ) {}

  loginAs(role: Role) {
    if (role === 'admin') {
      this.auth.loginAs('admin', 'Admin');
      this.router.navigate(['/dashboard']);
      return;
    }

    if (role === 'student') {
      this.studentService.getStudents().subscribe(list => {
        const pick = list && list.length ? list[0] : null;
        const id = pick ? pick.id : undefined;
        const name = pick ? pick.name : 'طالب تجريبي';
        this.auth.loginAs('student', name, id);
        this.router.navigate(['/home']);
      });
      return;
    }

    if (role === 'instructor') {
      this.instructorService.getInstructors().subscribe(list => {
        const pick = list && list.length ? list[0] : null;
        const id = pick ? pick.id : undefined;
        const name = pick ? pick.name : 'مدرس تجريبي';
        this.auth.loginAs('instructor', name, id);
        this.router.navigate(['/home']);
      });
      return;
    }
  }

  login() {
    // If student/instructor choose an existing mock to map id/name
    if (this.role === 'student') {
      this.studentService.getStudents().subscribe(list => {
        const pick = list && list.length ? list[0] : null;
        const id = pick ? pick.id : undefined;
        const name = pick ? pick.name : this.name;
        const user = this.auth.loginAs('student', name, id);
        this.router.navigate(['/home']);
      });
      return;
    }

    if (this.role === 'instructor') {
      this.instructorService.getInstructors().subscribe(list => {
        const pick = list && list.length ? list[0] : null;
        const id = pick ? pick.id : undefined;
        const name = pick ? pick.name : this.name;
        this.auth.loginAs('instructor', name, id);
        this.router.navigate(['/home']);
      });
      return;
    }

    const user = this.auth.loginAs(this.role, this.name);
    if (user.role === 'admin') this.router.navigate(['/dashboard']);
    else this.router.navigate(['/home']);
  }

  guest() {
    // map guest to a mock student for demo
    this.studentService.getStudents().subscribe(list => {
      const pick = list && list.length ? list[0] : null;
      const id = pick ? pick.id : undefined;
      const name = pick ? pick.name : 'زائر';
      this.auth.loginAs('student', name, id);
      this.router.navigate(['/home']);
    });
  }
}
