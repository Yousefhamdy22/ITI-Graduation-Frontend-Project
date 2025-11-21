import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '@shared/components/card/card.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'instructor' | 'student';
  avatar?: string;
  createdAt: string;
  bio?: string;
}

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    ButtonComponent,
    BadgeComponent,
    LoaderComponent
  ],
  template: `
    <div class="space-y-6 p-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-neutral-900 dark:text-white">User Management</h1>
          <p class="text-neutral-600 dark:text-gray-400 mt-1">Manage platform users and their roles</p>
        </div>
        <app-button (click)="showCreateModal = true" variant="primary">
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New User
          </span>
        </app-button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <app-card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral-600 dark:text-gray-400">Total Users</p>
              <p class="text-3xl font-bold text-neutral-900 dark:text-white mt-2">{{ users().length }}</p>
            </div>
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </app-card>

        <app-card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral-600 dark:text-gray-400">Admins</p>
              <p class="text-3xl font-bold text-neutral-900 dark:text-white mt-2">{{ getUsersByRole('admin').length }}</p>
            </div>
            <div class="w-12 h-12 bg-danger-100 dark:bg-danger-900 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-danger-600 dark:text-danger-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </app-card>

        <app-card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral-600 dark:text-gray-400">Instructors</p>
              <p class="text-3xl font-bold text-neutral-900 dark:text-white mt-2">{{ getUsersByRole('instructor').length }}</p>
            </div>
            <div class="w-12 h-12 bg-warning-100 dark:bg-warning-900 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-warning-600 dark:text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </app-card>

        <app-card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral-600 dark:text-gray-400">Students</p>
              <p class="text-3xl font-bold text-neutral-900 dark:text-white mt-2">{{ getUsersByRole('student').length }}</p>
            </div>
            <div class="w-12 h-12 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </app-card>
      </div>

      <!-- Filters -->
      <app-card>
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[200px]">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="filterUsers()"
              placeholder="Search users by name or email..."
              class="form-input"
            />
          </div>
          <div>
            <select [(ngModel)]="selectedRole" (ngModelChange)="filterUsers()" class="form-input">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="instructor">Instructor</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>
      </app-card>

      <!-- Users Table -->
      <app-card>
        @if (loading()) {
          <div class="flex justify-center py-12">
            <app-loader></app-loader>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                @for (user of filteredUsers(); track user.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          @if (user.avatar) {
                            <img class="h-10 w-10 rounded-full" [src]="user.avatar" [alt]="user.firstName">
                          } @else {
                            <div class="h-10 w-10 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                              {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                            </div>
                          }
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ user.firstName }} {{ user.lastName }}
                          </div>
                          @if (user.bio) {
                            <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{{ user.bio }}</div>
                          }
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {{ user.email }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <app-badge [variant]="getRoleBadgeVariant(user.role)">
                        {{ user.role | uppercase }}
                      </app-badge>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ user.createdAt | date:'mediumDate' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end gap-2">
                        <button
                          (click)="editUser(user)"
                          class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                          title="Edit user"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          (click)="deleteUser(user)"
                          class="text-danger-600 dark:text-danger-400 hover:text-danger-900 dark:hover:text-danger-300"
                          title="Delete user"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="5" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No users found
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </app-card>

      <!-- Create/Edit User Modal -->
      @if (showCreateModal || showEditModal) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ showEditModal ? 'Edit User' : 'Create New User' }}
                </h2>
                <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form (ngSubmit)="saveUser()" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">First Name *</label>
                    <input
                      type="text"
                      [(ngModel)]="editingUser.firstName"
                      name="firstName"
                      class="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label class="form-label">Last Name *</label>
                    <input
                      type="text"
                      [(ngModel)]="editingUser.lastName"
                      name="lastName"
                      class="form-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label class="form-label">Email *</label>
                  <input
                    type="email"
                    [(ngModel)]="editingUser.email"
                    name="email"
                    class="form-input"
                    required
                  />
                </div>

                @if (!showEditModal) {
                  <div>
                    <label class="form-label">Password *</label>
                    <input
                      type="password"
                      [(ngModel)]="editingUser.password"
                      name="password"
                      class="form-input"
                      required
                    />
                  </div>
                }

                <div>
                  <label class="form-label">Role *</label>
                  <select [(ngModel)]="editingUser.role" name="role" class="form-input" required>
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label class="form-label">Bio</label>
                  <textarea
                    [(ngModel)]="editingUser.bio"
                    name="bio"
                    rows="3"
                    class="form-input"
                    placeholder="Optional bio..."
                  ></textarea>
                </div>

                <div>
                  <label class="form-label">Avatar URL</label>
                  <input
                    type="text"
                    [(ngModel)]="editingUser.avatar"
                    name="avatar"
                    class="form-input"
                    placeholder="https://..."
                  />
                </div>

                <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <app-button type="button" (click)="closeModal()" variant="ghost">
                    Cancel
                  </app-button>
                  <app-button type="submit" variant="primary">
                    {{ showEditModal ? 'Update User' : 'Create User' }}
                  </app-button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class UsersManagementComponent implements OnInit {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/users';

  users = signal<User[]>([]);
  filteredUsers = signal<User[]>([]);
  loading = signal(true);
  
  searchQuery = '';
  selectedRole = '';
  
  showCreateModal = false;
  showEditModal = false;
  editingUser: any = {};

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.http.get<User[]>(this.API_URL).subscribe({
      next: (users) => {
        this.users.set(users);
        this.filteredUsers.set(users);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading.set(false);
      }
    });
  }

  filterUsers(): void {
    let filtered = this.users();

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }

    if (this.selectedRole) {
      filtered = filtered.filter(user => user.role === this.selectedRole);
    }

    this.filteredUsers.set(filtered);
  }

  getUsersByRole(role: string): User[] {
    return this.users().filter(user => user.role === role);
  }

  getRoleBadgeVariant(role: string): 'danger' | 'warning' | 'success' | 'primary' {
    switch (role) {
      case 'admin': return 'danger';
      case 'instructor': return 'warning';
      case 'student': return 'success';
      default: return 'primary';
    }
  }

  editUser(user: User): void {
    this.editingUser = { ...user };
    this.showEditModal = true;
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      this.http.delete(`${this.API_URL}/${user.id}`).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user');
        }
      });
    }
  }

  saveUser(): void {
    if (this.showEditModal) {
      // Update existing user
      this.http.put(`${this.API_URL}/${this.editingUser.id}`, this.editingUser).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating user:', error);
          alert('Failed to update user');
        }
      });
    } else {
      // Create new user
      const newUser = {
        ...this.editingUser,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      this.http.post(this.API_URL, newUser).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating user:', error);
          alert('Failed to create user');
        }
      });
    }
  }

  closeModal(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.editingUser = {};
  }
}
