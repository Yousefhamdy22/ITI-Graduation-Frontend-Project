import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, Role } from '../../auth.service';
import { ToastService } from '../../../shared/toast.service';
import { RoleHeaderComponent } from '../../../core/header/role-header.component';
import { FooterComponent } from '../../../core/footer/footer.component';

@Component({
  selector: 'app-student-login',
  imports: [CommonModule, FormsModule, RouterModule, RoleHeaderComponent, FooterComponent],
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
          this.router.navigate(['/student']);
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
    // Direct mock login without API call - works offline
    this.auth.loginAs('student', 'زائر', 'guest-001');
    this.toast.show('مرحباً بك كزائر!', 'success');
    this.router.navigate(['/student']);
  }
}
