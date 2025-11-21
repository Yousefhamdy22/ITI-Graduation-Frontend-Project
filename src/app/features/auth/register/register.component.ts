import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { CardComponent } from '@shared/components/card/card.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    InputComponent,
    CardComponent
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4 py-12">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <span class="text-white font-bold text-3xl">E</span>
          </div>
          <h1 class="text-3xl font-bold text-neutral-900 mb-2">Create Account</h1>
          <p class="text-neutral-600">Create your account</p>
        </div>

        <app-card>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <app-input
                  label="First Name"
                  type="text"
                  formControlName="firstName"
                  [hasError]="isFieldInvalid('firstName')"
                  [required]="true"
                />

                <app-input
                  label="Last Name"
                  type="text"
                  formControlName="lastName"
                  [hasError]="isFieldInvalid('lastName')"
                  [required]="true"
                />
              </div>

              <app-input
                label="Email"
                type="email"
                formControlName="email"
                placeholder="name@example.com"
                [hasError]="isFieldInvalid('email')"
                [errorMessage]="getErrorMessage('email')"
                [required]="true"
              />

              <div>
                <label class="form-label">Role <span class="text-danger-600">*</span></label>
                <select
                  formControlName="role"
                  class="form-input"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>

              <app-input
                label="Password"
                type="password"
                formControlName="password"
                placeholder="••••••••"
                [hasError]="isFieldInvalid('password')"
                [errorMessage]="getErrorMessage('password')"
                [required]="true"
              />

              <app-input
                label="Confirm Password"
                type="password"
                formControlName="confirmPassword"
                placeholder="••••••••"
                [hasError]="isFieldInvalid('confirmPassword')"
                [errorMessage]="getErrorMessage('confirmPassword')"
                [required]="true"
              />

              <app-button
                type="submit"
                variant="primary"
                [fullWidth]="true"
                [loading]="loading()"
                [disabled]="!registerForm.valid"
              >
                Sign Up
              </app-button>
            </div>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-neutral-600">
              Already have an account?
              <a routerLink="/auth/login" class="text-primary-600 hover:text-primary-700 font-medium">
                Sign In
              </a>
            </p>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  loading = signal(false);

  registerForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['student', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.loading()) {
      this.loading.set(true);
      
      const { firstName, lastName, email, role, password } = this.registerForm.value;
      
      this.authService.register({ firstName, lastName, email, role, password }).subscribe({
        next: () => {
          this.notificationService.success('Registration successful!');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.notificationService.error(error.message || 'Registration failed');
          this.loading.set(false);
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (field?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    if (field?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    
    return '';
  }
}
