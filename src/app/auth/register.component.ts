import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, Role } from './auth.service';
import { StudentService } from '../entities/students/student.service';
import { InstructorService } from '../entities/instructors/instructor.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  role: Role = 'student';
  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';

  constructor(
    private auth: AuthService,
    private studentService: StudentService,
    private instructorService: InstructorService,
    private router: Router
  ) {}

  register() {
    if (this.role === 'student') {
      const s = this.studentService.addStudent({ name: this.name || 'طالب جديد', email: this.email, phone: this.phone });
      this.auth.loginAs('student', s.name, s.id);
      this.router.navigate(['/home']);
      return;
    }
    const i = this.instructorService.addInstructor({ name: this.name || 'مدرب جديد', email: this.email });
    this.auth.loginAs('instructor', i.name, i.id);
    this.router.navigate(['/home']);
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
