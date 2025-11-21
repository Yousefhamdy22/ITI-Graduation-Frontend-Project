import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/auth/services/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { CardComponent } from '@shared/components/card/card.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    ButtonComponent,
    BadgeComponent
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 p-6">
      <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Settings</h1>

      <!-- Account Settings -->
      <app-card header="Account Settings">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-neutral-900 dark:text-neutral-100">Email</h3>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ currentUser()?.email }}</p>
            </div>
            <app-badge variant="success">Verified</app-badge>
          </div>

          <hr class="border-neutral-200 dark:border-neutral-700">

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-neutral-900 dark:text-neutral-100">Account Type</h3>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ currentUser()?.role | titlecase }}</p>
            </div>
          </div>

          <hr class="border-neutral-200 dark:border-neutral-700">

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-neutral-900 dark:text-neutral-100">Member Since</h3>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ currentUser()?.createdAt | date }}</p>
            </div>
          </div>
        </div>
      </app-card>

      <!-- Appearance -->
      <app-card header="Appearance">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-neutral-900 dark:text-neutral-100">Theme</h3>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">Choose your preferred theme</p>
            </div>
            <div class="flex gap-2">
              <button
                (click)="setTheme('light')"
                [class.ring-2]="currentTheme() === 'light'"
                class="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                ☀️ Light
              </button>
              <button
                (click)="setTheme('dark')"
                [class.ring-2]="currentTheme() === 'dark'"
                class="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                🌙 Dark
              </button>
            </div>
          </div>
        </div>
      </app-card>

      <!-- Notifications -->
      <app-card header="Notifications">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-neutral-900 dark:text-neutral-100">Email Notifications</h3>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">Receive email about your activity</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                [(ngModel)]="settings.emailNotifications"
                (change)="saveSettings()"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <hr class="border-neutral-200 dark:border-neutral-700">

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-neutral-900 dark:text-neutral-100">Course Updates</h3>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">Get notified when courses are updated</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                [(ngModel)]="settings.courseUpdates"
                (change)="saveSettings()"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <hr class="border-neutral-200 dark:border-neutral-700">

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-neutral-900 dark:text-neutral-100">Assignment Reminders</h3>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">Remind me about upcoming deadlines</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                [(ngModel)]="settings.assignmentReminders"
                (change)="saveSettings()"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </app-card>

      <!-- Privacy -->
      <app-card header="Privacy">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-neutral-900 dark:text-neutral-100">Profile Visibility</h3>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">Make your profile visible to others</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                [(ngModel)]="settings.profileVisible"
                (change)="saveSettings()"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <hr class="border-neutral-200 dark:border-neutral-700">

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-neutral-900 dark:text-neutral-100">Show Online Status</h3>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">Let others see when you're online</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                [(ngModel)]="settings.showOnlineStatus"
                (change)="saveSettings()"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </app-card>

      <!-- Danger Zone -->
      <app-card header="Danger Zone">
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 border border-danger-200 dark:border-danger-800 rounded-lg bg-danger-50 dark:bg-danger-900/20">
            <div>
              <h3 class="font-medium text-danger-700 dark:text-danger-400">Delete Account</h3>
              <p class="text-sm text-danger-600 dark:text-danger-500">Permanently delete your account and all data</p>
            </div>
            <app-button variant="danger" size="sm">
              Delete Account
            </app-button>
          </div>
        </div>
      </app-card>
    </div>
  `,
  styles: []
})
export class SettingsComponent {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);

  readonly currentUser = this.authService.currentUser;
  readonly currentTheme = this.themeService.currentTheme;

  settings = {
    emailNotifications: true,
    courseUpdates: true,
    assignmentReminders: true,
    profileVisible: true,
    showOnlineStatus: true
  };

  constructor() {
    this.loadSettings();
  }

  loadSettings(): void {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      this.settings = { ...this.settings, ...JSON.parse(saved) };
    }
  }

  saveSettings(): void {
    localStorage.setItem('userSettings', JSON.stringify(this.settings));
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.themeService.setTheme(theme);
  }
}
