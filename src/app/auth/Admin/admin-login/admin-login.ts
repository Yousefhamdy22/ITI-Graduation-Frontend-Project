import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from '../../auth.service';
import { ToastService } from '../../../shared/toast.service';
import { CommonModule } from '@angular/common';
import { RoleHeaderComponent } from '../../../core/header/role-header.component';
import { FooterComponent } from '../../../core/footer/footer.component';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RoleHeaderComponent,
    FooterComponent
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
          this.toast.show(res.message || 'فشل تسجيل الدخول', 'error');
        }
      },
      error: (err) => {
        console.error('❌ Admin login error:', err);
        
        // Check for specific error messages
        let errorMsg = 'خطأ في الاتصال';
        
        if (err.status === 422) {
          const detail = err.error?.detail || '';
          if (detail.includes('ACCOUNT_LOCKED')) {
            errorMsg = '⚠️ الحساب مقفل. يرجى التواصل مع مسؤول النظام';
          } else if (detail.includes('INVALID_CREDENTIALS')) {
            errorMsg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
          } else {
            errorMsg = err.error?.title || 'فشل تسجيل الدخول';
          }
        } else if (err.status === 401) {
          errorMsg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        } else if (err.error?.message) {
          errorMsg = err.error.message;
        }
        
        this.toast.show(errorMsg, 'error');
      }
    });
  }

  register() {
    // Validation
    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      this.toast.show('يرجى ملء جميع الحقول المطلوبة', 'warning');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toast.show('كلمة المرور غير متطابقة', 'warning');
      return;
    }

    if (this.password.length < 6) {
      this.toast.show('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'warning');
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

    console.log('📝 Registering new admin:', { email: payload.email, firstName: payload.firstName, lastName: payload.lastName });

    this.auth.registerAdmin(payload).subscribe({
      next: (res) => {
        console.log('✅ Admin registration response:', res);
        if (res.isSuccess) {
          this.toast.show('✅ تم تسجيل الأدمن بنجاح! يمكنك الآن تسجيل الدخول', 'success');
          // Navigate to dashboard or stay on login
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.toast.show(res.message || 'فشل التسجيل', 'error');
        }
      },
      error: (err) => {
        console.error('❌ Admin registration error:', err);
        
        let errorMsg = 'خطأ في الاتصال';
        
        if (err.status === 400) {
          // Validation errors
          if (err.error?.errors) {
            const errors = Object.values(err.error.errors).flat();
            errorMsg = errors.join(', ');
          } else if (err.error?.message) {
            errorMsg = err.error.message;
          } else if (err.error?.detail) {
            errorMsg = err.error.detail;
          }
        } else if (err.status === 409) {
          errorMsg = 'البريد الإلكتروني مستخدم بالفعل';
        } else if (err.error?.message) {
          errorMsg = err.error.message;
        } else if (err.error?.errors?.[0]) {
          errorMsg = err.error.errors[0];
        }
        
        this.toast.show(errorMsg, 'error');
      }
    });
  }
}
