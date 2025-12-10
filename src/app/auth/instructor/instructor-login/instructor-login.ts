import { Component } from '@angular/core';
import { AuthService, Role } from '../../auth.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../../shared/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instructor-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './instructor-login.html',
  styleUrl: './instructor-login.scss',
})
export class InstructorLogin {
  isRegister = false;
  email = '';
  password = '';
  confirmPassword = '';
  firstName = '';
  lastName = '';
  phoneNumber = '';
  gender = ''; // 'male' or 'female'
  role: Role = 'instructor';

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) { }

  toggleMode() {
    this.isRegister = !this.isRegister;
  }

  submit() {
    if (this.isRegister) {
      this.register();
    } else {
      this.login();
    }
  }

  login() {
    this.auth.loginInstructor({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.toast.show('تم تسجيل الدخول بنجاح', 'success');
          this.router.navigate(['/instructor']);
        } else {
          this.toast.show(res.errors?.join(', ') || 'فشل تسجيل الدخول', 'error');
        }
      },
      error: (err) => {
        this.toast.show('خطأ في الاتصال', 'error');
        console.error(err);
      }
    });
  }

  register() {
    if (this.password !== this.confirmPassword) {
      this.toast.show('كلمة المرور غير متطابقة', 'warning');
      return;
    }

    const payload = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      gender: this.gender || 'male',
      phoneNumber: this.phoneNumber || null,
      createdAt: new Date()
    };

    this.auth.registerInstructor(payload).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.toast.show('تم التسجيل بنجاح', 'success');
          this.router.navigate(['/instructor']);
        } else {
          this.toast.show(res.errors?.join(', ') || 'فشل التسجيل', 'error');
        }
      },
      error: (err) => {
        this.toast.show('خطأ في الاتصال', 'error');
        console.error(err);
      }
    });
  }
}