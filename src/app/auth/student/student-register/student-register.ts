import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService, Role } from '../../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../shared/toast.service';

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
        const errorMsg = err.error?.message || err.error?.errors?.[0] || 'خطأ في الاتصال';
        this.toast.show(errorMsg, 'error');
        console.error('❌ Registration failed with error:', err);
        console.error('❌ Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.error?.message,
          errors: err.error?.errors
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
