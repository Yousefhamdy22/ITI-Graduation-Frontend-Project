import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService, Role } from '../../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../shared/toast.service';
import { RoleHeaderComponent } from '../../../core/header/role-header.component';

@Component({
  selector: 'app-student-register',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RoleHeaderComponent
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
    private router: Router,
    private toast: ToastService
  ) {
  }

  register() {
    // Validate password match
    if (this.password !== this.confirmPassword) {
      this.toast.show('كلمة المرور غير متطابقة', 'warning');
      return;
    }

    // Validate required fields
    if (!this.name || !this.email || !this.password) {
      this.toast.show('يرجى ملء جميع الحقول المطلوبة', 'warning');
      return;
    }

    // Use the real API registration
    const registrationData = {
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      firstName: this.name.split(' ')[0] || 'Student',
      lastName: this.name.split(' ')[1] || '',
      gender: 'male',
      phoneNumber: this.phone || null,
      createdAt: new Date().toISOString()
    };
    
    console.log('🔵 Sending registration request to backend:', {
      email: registrationData.email,
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      gender: registrationData.gender,
      phoneNumber: registrationData.phoneNumber
    });
    
    this.auth.registerStudent(registrationData).subscribe({
      next: (res) => {
        console.log('✅ Registration response from backend:', res);
        if (res.isSuccess) {
          this.toast.show('تم التسجيل بنجاح - Student ID: ' + res.user.id, 'success');
          console.log('✅ Student registered successfully with ID:', res.user.id);
          this.router.navigate(['/student']);
        } else {
          this.toast.show(res.message || 'فشل التسجيل', 'error');
          console.warn('⚠️ Registration response indicates failure:', res);
        }
      },
      error: (err) => {
        console.error('❌ Registration failed with error:', err);
        
        let errorMsg = 'خطأ في الاتصال';
        
        // Handle different error formats from backend
        if (err.error) {
          if (Array.isArray(err.error)) {
            // Array of errors: ['An account with this email already exists.']
            errorMsg = err.error[0] || 'حدث خطأ في التسجيل';
          } else if (err.error.message) {
            // Object with message property
            errorMsg = err.error.message;
          } else if (err.error.errors && Array.isArray(err.error.errors)) {
            // Object with errors array
            errorMsg = err.error.errors[0] || 'حدث خطأ في التسجيل';
          } else if (typeof err.error === 'string') {
            // Direct string error
            errorMsg = err.error;
          }
        }
        
        // Translate common errors to Arabic
        if (errorMsg.toLowerCase().includes('email already exists')) {
          errorMsg = 'هذا البريد الإلكتروني مسجل مسبقاً. يرجى استخدام بريد آخر أو تسجيل الدخول.';
        } else if (errorMsg.toLowerCase().includes('invalid email')) {
          errorMsg = 'البريد الإلكتروني غير صحيح';
        } else if (errorMsg.toLowerCase().includes('password')) {
          errorMsg = 'كلمة المرور ضعيفة أو غير مطابقة';
        }
        
        this.toast.show(errorMsg, 'error');
        
        console.error('❌ Error details:', {
          status: err.status,
          statusText: err.statusText,
          errorBody: err.error
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
