import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/auth/services/auth.service';
import { CardComponent } from '@shared/components/card/card.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    ButtonComponent,
    LoaderComponent
  ],
  template: `
    <div class="max-w-2xl mx-auto space-y-6 p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Edit Profile</h1>
        <app-button variant="ghost" (click)="cancel()">Cancel</app-button>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <app-loader></app-loader>
        </div>
      } @else {
        <form (ngSubmit)="saveProfile()">
          <!-- Personal Information -->
          <app-card header="Personal Information">
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="formData.firstName"
                    name="firstName"
                    required
                    class="form-input"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="formData.lastName"
                    name="lastName"
                    required
                    class="form-input"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  [(ngModel)]="formData.email"
                  name="email"
                  required
                  class="form-input"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Avatar URL
                </label>
                <input
                  type="url"
                  [(ngModel)]="formData.avatar"
                  name="avatar"
                  class="form-input"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Bio
                </label>
                <textarea
                  [(ngModel)]="formData.bio"
                  name="bio"
                  rows="4"
                  class="form-input"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
            </div>
          </app-card>

          <!-- Change Password -->
          <app-card header="Change Password" class="mt-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  [(ngModel)]="formData.currentPassword"
                  name="currentPassword"
                  class="form-input"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  [(ngModel)]="formData.newPassword"
                  name="newPassword"
                  class="form-input"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  [(ngModel)]="formData.confirmPassword"
                  name="confirmPassword"
                  class="form-input"
                  placeholder="Confirm new password"
                />
              </div>

              @if (passwordError()) {
                <div class="text-sm text-danger-600">
                  {{ passwordError() }}
                </div>
              }
            </div>
          </app-card>

          <!-- Actions -->
          <div class="flex justify-end gap-3 mt-6">
            <app-button variant="ghost" type="button" (click)="cancel()">
              Cancel
            </app-button>
            <app-button variant="primary" type="submit" [disabled]="saving()">
              {{ saving() ? 'Saving...' : 'Save Changes' }}
            </app-button>
          </div>
        </form>
      }
    </div>
  `,
  styles: []
})
export class ProfileEditComponent implements OnInit {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private router = inject(Router);

  loading = signal(false);
  saving = signal(false);
  passwordError = signal('');

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    avatar: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.formData.firstName = user.firstName || '';
      this.formData.lastName = user.lastName || '';
      this.formData.email = user.email || '';
      this.formData.avatar = user.avatar || '';
      this.formData.bio = user.bio || '';
    }
  }

  validatePassword(): boolean {
    this.passwordError.set('');

    if (this.formData.newPassword || this.formData.confirmPassword) {
      if (!this.formData.currentPassword) {
        this.passwordError.set('Current password is required to change password');
        return false;
      }

      if (this.formData.newPassword !== this.formData.confirmPassword) {
        this.passwordError.set('New passwords do not match');
        return false;
      }

      if (this.formData.newPassword.length < 6) {
        this.passwordError.set('New password must be at least 6 characters');
        return false;
      }
    }

    return true;
  }

  saveProfile(): void {
    if (!this.validatePassword()) {
      return;
    }

    this.saving.set(true);
    const user = this.authService.currentUser();
    
    if (!user) {
      this.saving.set(false);
      return;
    }

    const updatedUser = {
      ...user,
      firstName: this.formData.firstName,
      lastName: this.formData.lastName,
      email: this.formData.email,
      avatar: this.formData.avatar,
      bio: this.formData.bio
    };

    // Update user in database
    this.http.patch(`${environment.apiUrl}/users/${user.id}`, updatedUser).subscribe({
      next: () => {
        // Update local storage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Update auth service
        this.authService['currentUserSignal'].set(updatedUser);
        
        this.saving.set(false);
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.saving.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }
}
