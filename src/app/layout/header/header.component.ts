import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AvatarComponent],
  template: `
    <header class="bg-white dark:bg-neutral-800 shadow-sm border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-40">
      <div class="container-custom">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/dashboard" class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-xl">E</span>
              </div>
              <span class="text-xl font-bold text-neutral-900 dark:text-neutral-100">E-Learning Platform</span>
            </a>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-8">
            <a
              routerLink="/dashboard"
              routerLinkActive="text-primary-600"
              class="text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              Dashboard
            </a>
            <a
              routerLink="/courses"
              routerLinkActive="text-primary-600"
              class="text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              Courses
            </a>
            @if (userRole() === 'student') {
              <a
                routerLink="/dashboard"
                routerLinkActive="text-primary-600"
                class="text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                My Courses
              </a>
            }
          </nav>

          <!-- Right Side Actions -->
          <div class="flex items-center space-x-4">
            <!-- Theme Toggle -->
            <button
              (click)="toggleTheme()"
              class="p-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              @if (isDark()) {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              } @else {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              }
            </button>

            <!-- Notifications -->
            <button
              class="relative p-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
            </button>

            <!-- User Menu -->
            @if (currentUser(); as user) {
              <div class="relative">
                <button
                  (click)="toggleUserMenu()"
                  class="flex items-center space-x-2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                  aria-label="User menu"
                >
                  <app-avatar [src]="user.avatar" [size]="'sm'" [alt]="user.firstName" />
                  <span class="hidden md:block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {{ user.firstName }}
                  </span>
                </button>

                @if (showUserMenu) {
                  <div class="dropdown-menu right-0">
                    <a routerLink="/profile" class="dropdown-item">
                      Profile
                    </a>
                    <a routerLink="/settings" class="dropdown-item">
                      Settings
                    </a>
                    <hr class="my-1 border-neutral-200">
                    <button (click)="logout()" class="dropdown-item text-danger-600">
                      Logout
                    </button>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </header>
  `,
  styles: []
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);

  showUserMenu = false;

  readonly currentUser = this.authService.currentUser;
  readonly userRole = this.authService.userRole;
  readonly currentTheme = this.themeService.currentTheme;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isDark(): boolean {
    return this.themeService.isDark();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logout();
  }
}
