import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Public Header Component
 * Displays navigation for guest users (not logged in)
 * Shows login options and browse as guest button
 */
@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-md">
      <div class="app-container py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <a routerLink="/" class="text-2xl font-bold text-[#0E4D67]">
            منصة تعليمية
          </a>

          <!-- Navigation -->
          <nav class="flex items-center gap-4">
            <a routerLink="/courses" class="text-gray-700 hover:text-[#0E4D67] transition">
              الكورسات
            </a>
            
            <!-- Login Dropdown -->
            <div class="relative group">
              <button class="btn-outline flex items-center gap-2">
                تسجيل الدخول
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- Dropdown Menu -->
              <div class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <a routerLink="/login" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-t-lg">
                  دخول كطالب
                </a>
                <a routerLink="/instructor-login" class="block px-4 py-3 text-gray-700 hover:bg-gray-50">
                  دخول كمدرس
                </a>
                <a routerLink="/admin" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-b-lg">
                  دخول كأدمن
                </a>
              </div>
            </div>

            <!-- Browse as Guest Button -->
            <a routerLink="/courses" class="btn-primary">
              الدخول كزائر
            </a>
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: []
})
export class PublicHeaderComponent { }
