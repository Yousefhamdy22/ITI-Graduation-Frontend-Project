import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, Role } from '../../auth.service';
import { ToastService } from '../../../shared/toast.service';

@Component({
  selector: 'app-student-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './student-login.html',
  styleUrl: './student-login.scss',
})
export class StudentLogin {
  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
  }

  login() {
    this.auth.loginStudent({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.toast.show('تم تسجيل الدخول بنجاح', 'success');
          this.router.navigate(['/home']);
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

  guest() {
    this.auth.loginAs('student', 'Guest', 'guest-001');
    this.toast.show('Welcome as Guest!', 'success');
    this.router.navigate(['/home']);
  }
}
