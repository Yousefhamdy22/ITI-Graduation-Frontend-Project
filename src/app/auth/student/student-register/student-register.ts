import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService, Role} from '../../auth.service';
import {StudentService} from '../../../entities/students/student.service';
import {InstructorService} from '../../../entities/instructors/instructor.service';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-student-register',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './student-register.html',
  styleUrl: './student-register.scss',
})
export class StudentRegister {
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
  ) {
  }

  register() {
    if (this.role === 'student') {
      const s = this.studentService.addStudent({name: this.name || 'طالب جديد', email: this.email, phone: this.phone});
      this.auth.loginAs('student', s.name, s.id);
      this.router.navigate(['/student']);
      return;
    }
    const i = this.instructorService.addInstructor({name: this.name || 'مدرب جديد', email: this.email});
    this.auth.loginAs('instructor', i.name, i.id);
    this.router.navigate(['/instructor']);
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
