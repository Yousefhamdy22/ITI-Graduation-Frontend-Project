import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { CardComponent } from '@shared/components/card/card.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    BadgeComponent
  ],
  template: `
      <div class="space-y-6">
        <!-- Welcome Section -->
        <div class="bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold mb-2">
                Welcome, {{ currentUser()?.firstName }}!
              </h1>
              <p class="text-primary-100 dark:text-gray-300">
                @if (userRole() === 'admin') {
                  <span>Manage your platform and monitor system performance</span>
                }
                @if (userRole() === 'instructor') {
                  <span>Track your courses and student progress</span>
                }
                @if (userRole() === 'student') {
                  <span>Quick overview of your learning journey</span>
                }
              </p>
            </div>
            @if (userRole() === 'student') {
              <a routerLink="/dashboard/my-learning" class="px-6 py-3 bg-white dark:bg-gray-700 text-primary-600 dark:text-gray-200 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-gray-600 transition-colors">
                View My Courses →
              </a>
            }
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @if (userRole() === 'admin') {
            <app-card>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-neutral-600">Total Courses</p>
                  <p class="text-3xl font-bold text-neutral-900 mt-2">125</p>
                  <p class="text-sm text-success-600 mt-2">↑ 12% from last month</p>
                </div>
                <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </app-card>

            <app-card>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-neutral-600">Total Students</p>
                  <p class="text-3xl font-bold text-neutral-900 mt-2">3,247</p>
                  <p class="text-sm text-success-600 mt-2">↑ 18% from last month</p>
                </div>
                <div class="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </app-card>

            <app-card>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-neutral-600">Active Students</p>
                  <p class="text-3xl font-bold text-neutral-900 mt-2">2,156</p>
                  <p class="text-sm text-success-600 mt-2">↑ 8% from last month</p>
                </div>
                <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </app-card>

            <app-card>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-neutral-600">Total Revenue</p>
                  <p class="text-3xl font-bold text-neutral-900 mt-2">$89,432</p>
                  <p class="text-sm text-success-600 mt-2">↑ 23% from last month</p>
                </div>
                <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </app-card>
          }

          @if (userRole() === 'instructor') {
            <app-card>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-neutral-600">My Courses</p>
                  <p class="text-3xl font-bold text-neutral-900 mt-2">8</p>
                </div>
                <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </app-card>

            <app-card>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-neutral-600">Total Students</p>
                  <p class="text-3xl font-bold text-neutral-900 mt-2">856</p>
                </div>
                <div class="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </app-card>
          }

          @if (userRole() === 'student') {
            <app-card>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-neutral-600 dark:text-gray-400">Enrolled Courses</p>
                  <p class="text-3xl font-bold text-neutral-900 dark:text-white mt-2">5</p>
                  <p class="text-xs text-success-600 dark:text-success-400 mt-1">3 in progress</p>
                </div>
                <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </app-card>

            <app-card>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-neutral-600 dark:text-gray-400">Completed Courses</p>
                  <p class="text-3xl font-bold text-neutral-900 dark:text-white mt-2">2</p>
                  <p class="text-xs text-neutral-500 dark:text-gray-500 mt-1">2 certificates earned</p>
                </div>
                <div class="w-12 h-12 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              </div>
            </app-card>
            
            <app-card>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-neutral-600 dark:text-gray-400">Learning Hours</p>
                  <p class="text-3xl font-bold text-neutral-900 dark:text-white mt-2">24.5</p>
                  <p class="text-xs text-neutral-500 dark:text-gray-500 mt-1">This month</p>
                </div>
                <div class="w-12 h-12 bg-warning-100 dark:bg-warning-900 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-warning-600 dark:text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </app-card>
          }
        </div>

        <!-- Recent Activity / Courses -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2">
            <app-card>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                @if (userRole() === 'student') {
                  <a routerLink="/dashboard/my-learning" class="text-sm text-primary-600 dark:text-primary-400 hover:underline">View All →</a>
                }
              </div>
              <div class="space-y-4">
                @for (course of mockCourses; track course.id) {
                  <div class="flex items-center space-x-4 p-4 hover:bg-neutral-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                    <img [src]="course.thumbnail" alt="" class="w-20 h-20 rounded-lg object-cover">
                    <div class="flex-1 min-w-0">
                      <h3 class="font-semibold text-neutral-900 dark:text-white truncate">{{ course.title }}</h3>
                      <p class="text-sm text-neutral-600 dark:text-gray-400">{{ course.instructor }}</p>
                      @if (userRole() === 'student') {
                        <div class="mt-2">
                          <div class="flex items-center justify-between text-sm mb-1">
                            <span class="text-neutral-600 dark:text-gray-400">Progress</span>
                            <span class="font-medium text-neutral-900 dark:text-white">{{ course.progress }}%</span>
                          </div>
                          <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div class="h-full bg-primary-600 dark:bg-primary-500 rounded-full transition-all" [style.width.%]="course.progress"></div>
                          </div>
                        </div>
                      }
                    </div>
                    <app-badge [variant]="'primary'">{{ course.level }}</app-badge>
                  </div>
                }
              </div>
            </app-card>
          </div>

          <div>
            <app-card>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div class="space-y-3">
                @if (userRole() === 'admin') {
                  <a routerLink="/courses/new" class="block p-3 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors">
                    <div class="font-medium">Create New Course</div>
                    <div class="text-sm opacity-75">Add a new course to the platform</div>
                  </a>
                  <a routerLink="/users" class="block p-3 bg-secondary-50 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
                    <div class="font-medium">Manage Users</div>
                    <div class="text-sm opacity-75">View and manage platform users</div>
                  </a>
                }
                @if (userRole() === 'instructor') {
                  <a routerLink="/instructor/courses/new" class="block p-3 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors">
                    <div class="font-medium">Create Course</div>
                    <div class="text-sm opacity-75">Start creating a new course</div>
                  </a>
                  <a routerLink="/instructor/courses" class="block p-3 bg-secondary-50 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
                    <div class="font-medium">My Courses</div>
                    <div class="text-sm opacity-75">Manage your courses</div>
                  </a>
                }
                @if (userRole() === 'student') {
                  <a routerLink="/courses" class="block p-3 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors">
                    <div class="font-medium">Browse Courses</div>
                    <div class="text-sm opacity-75">Discover new courses to learn</div>
                  </a>
                  <a routerLink="/dashboard/my-learning" class="block p-3 bg-success-50 dark:bg-success-900 text-success-700 dark:text-success-300 rounded-lg hover:bg-success-100 dark:hover:bg-success-800 transition-colors">
                    <div class="font-medium">My Courses</div>
                    <div class="text-sm opacity-75">View enrolled courses with progress</div>
                  </a>
                }
              </div>
            </app-card>
          </div>
        </div>
      </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  mockCourses = [
    {
      id: '1',
      title: 'Introduction to Web Development',
      instructor: 'محمد أحمد',
      thumbnail: 'https://picsum.photos/seed/course1/400/300',
      level: 'Beginner',
      progress: 45
    },
    {
      id: '2',
      title: 'Advanced Angular Development',
      instructor: 'محمد أحمد',
      thumbnail: 'https://picsum.photos/seed/course2/400/300',
      level: 'Advanced',
      progress: 20
    },
    {
      id: '3',
      title: 'UI/UX Design Principles',
      instructor: 'محمد أحمد',
      thumbnail: 'https://picsum.photos/seed/course3/400/300',
      level: 'Intermediate',
      progress: 0
    }
  ];

  private authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;
  readonly userRole = this.authService.userRole;

  ngOnInit(): void {
    // Load dashboard data based on role
  }
}
