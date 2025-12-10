import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from '../../auth.service';
import { ToastService } from '../../../shared/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
})
export class AdminLogin {
  isRegister = false;
  email = '';
  password = '';
  confirmPassword = '';
  firstName = '';
  lastName = '';
  phoneNumber = '';
  gender = ''; // 'male' or 'female'

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
    this.auth.loginAdmin({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.toast.show('تم تسجيل الدخول بنجاح', 'success');
          this.router.navigate(['/dashboard']);
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

    this.auth.registerAdmin(payload).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.toast.show('تم التسجيل بنجاح', 'success');
          this.router.navigate(['/dashboard']); // Or login first? Usually returns token.
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
