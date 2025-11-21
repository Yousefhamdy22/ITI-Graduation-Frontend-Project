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
  selector: 'app-login',
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
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <span class="text-white font-bold text-3xl">E</span>
          </div>
          <h1 class="text-3xl font-bold text-neutral-900 mb-2">Welcome to E-Learning</h1>
          <p class="text-neutral-600">Sign In</p>
        </div>

        <app-card>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="space-y-4">
              <app-input
                label="Email"
                type="email"
                formControlName="email"
                placeholder="name@example.com"
                [hasError]="isFieldInvalid('email')"
                [errorMessage]="getErrorMessage('email')"
                [required]="true"
              />

              <app-input
                label="Password"
                type="password"
                formControlName="password"
                placeholder="••••••••"
                [hasError]="isFieldInvalid('password')"
                [errorMessage]="getErrorMessage('password')"
                [required]="true"
              />

              <div class="flex items-center justify-between">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    formControlName="rememberMe"
                    class="h-4 w-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <span class="ml-2 text-sm text-neutral-700">Remember me</span>
                </label>

                <a routerLink="/auth/forgot-password" class="text-sm text-primary-600 hover:text-primary-700">
                  Forgot password?
                </a>
              </div>

              <app-button
                type="submit"
                variant="primary"
                [fullWidth]="true"
                [loading]="loading()"
                [disabled]="!loginForm.valid"
              >
                Sign In
              </app-button>
            </div>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-neutral-600">
              Don't have an account?
              <a routerLink="/auth/register" class="text-primary-600 hover:text-primary-700 font-medium">
                Sign Up
              </a>
            </p>
          </div>

          <!-- Demo Credentials -->
          <div class="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <p class="text-xs font-medium text-neutral-700 mb-2">Demo Credentials:</p>
            <div class="space-y-1 text-xs text-neutral-600">
              <p><strong>Admin:</strong> admin@elearning.com / Admin@123</p>
              <p><strong>Instructor:</strong> instructor@elearning.com / Instructor@123</p>
              <p><strong>Student:</strong> student@elearning.com / Student@123</p>
            </div>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  loading = signal(false);
  
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  onSubmit(): void {
    console.log('Form submitted!', this.loginForm.value);
    console.log('Form valid?', this.loginForm.valid);
    
    if (this.loginForm.valid && !this.loading()) {
      this.loading.set(true);
      
      const { email, password } = this.loginForm.value;
      console.log('Attempting login with:', email);
      
      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          console.log('Login success!', response);
          this.notificationService.success('Login successful!');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.notificationService.error(error.message || 'Login failed');
          this.loading.set(false);
        }
      });
    } else {
      console.log('Form invalid or loading');
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (field?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    
    return '';
  }
}
