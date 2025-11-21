import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { CardComponent } from '@shared/components/card/card.component';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    AvatarComponent,
    ButtonComponent,
    BadgeComponent
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 p-6">
        <!-- Profile Header -->
        <app-card>
          <div class="flex items-center space-x-6">
            <app-avatar
              [src]="currentUser()?.avatar"
              [size]="'xl'"
              [alt]="currentUser()?.firstName || ''"
            />
            
            <div class="flex-1">
              <h1 class="text-2xl font-bold text-neutral-900">
                {{ currentUser()?.firstName }} {{ currentUser()?.lastName }}
              </h1>
              <p class="text-neutral-600">{{ currentUser()?.email }}</p>
              <div class="mt-2">
                <app-badge [variant]="'primary'">
                  {{ currentUser()?.role | uppercase }}
                </app-badge>
              </div>
            </div>
            
            <app-button variant="outline" routerLink="/profile/edit">
              Edit Profile
            </app-button>
          </div>
        </app-card>

        <!-- Profile Information -->
        <app-card header="My Profile">
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-neutral-700">Email</label>
              <p class="mt-1 text-neutral-900">{{ currentUser()?.email }}</p>
            </div>
            
            <div>
              <label class="text-sm font-medium text-neutral-700">Bio</label>
              <p class="mt-1 text-neutral-900">{{ currentUser()?.bio || 'No bio available' }}</p>
            </div>
            
            <div>
              <label class="text-sm font-medium text-neutral-700">Member Since</label>
              <p class="mt-1 text-neutral-900">{{ currentUser()?.createdAt | date }}</p>
            </div>
          </div>
        </app-card>
      </div>
  `,
  styles: []
})
export class ProfileComponent {
  private authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;
}
