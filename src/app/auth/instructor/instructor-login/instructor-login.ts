import { Component } from '@angular/core';
import { AuthService, Role } from '../../auth.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../../shared/toast.service';
import { CommonModule } from '@angular/common';
import { RoleHeaderComponent } from '../../../core/header/role-header.component';
import { FooterComponent } from '../../../core/footer/footer.component';

@Component({
  selector: 'app-instructor-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RoleHeaderComponent,
    FooterComponent
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
          this.toast.show(res.message || 'فشل تسجيل الدخول', 'error');
        }
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'خطأ في الاتصال';
        this.toast.show(errorMsg, 'error');
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
      createdAt: new Date().toISOString()
    };

    this.auth.registerInstructor(payload).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.toast.show('تم التسجيل بنجاح', 'success');
          this.router.navigate(['/instructor']);
        } else {
          this.toast.show(res.message || 'فشل التسجيل', 'error');
        }
      },
      error: (err) => {
        const errorMsg = err.error?.message || err.error?.errors?.[0] || 'خطأ في الاتصال';
        this.toast.show(errorMsg, 'error');
        console.error(err);
      }
    });
  }
}