import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export type Role = 'admin' | 'student' | 'instructor' | null;

export interface User {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface AuthResponse {
  isSuccess: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
  errors?: string[];
  validationErrors?: any[];
}

import { environment } from '../../environment/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private BASE_URL = environment.apiUrl + '/api';

  constructor(private http: HttpClient) {
    // Attempt to restore session on init
    this.autoLogin();
  }

  // --- Admin ---

  loginAdmin(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE_URL}/admin/login`, data)
      .pipe(tap(res => this.handleAuthResponse(res)));
  }

  registerAdmin(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE_URL}/admin/register`, data)
      .pipe(tap(res => this.handleAuthResponse(res)));
  }

  // --- Instructor ---
  loginInstructor(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE_URL}/Auth_Instructor/login-Instructor`, data)
      .pipe(tap(res => this.handleAuthResponse(res)));
  }

  registerInstructor(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE_URL}/Auth_Instructor/register-Instructor`, data)
      .pipe(tap(res => this.handleAuthResponse(res)));
  }

  // --- Student (Existing placeholder preserved/updated) ---
  loginStudent(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE_URL}/Auth/login`, data)
      .pipe(tap(res => this.handleAuthResponse(res)));
  }

  registerStudent(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE_URL}/Auth/register-student`, data)
      .pipe(tap(res => this.handleAuthResponse(res)));
  }

  // Generic login for student (deprecated - use loginStudent instead)
  login(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE_URL}/Auth/login`, data)
      .pipe(tap(res => this.handleAuthResponse(res)));
  }

  // Helper for components not yet fully integrated or for dev/testing
  loginAs(role: Role, name: string, id: string = 'mock-id'): User {
    const user: User = {
      id: id,
      email: `${name.replace(/\s/g, '').toLowerCase()}@example.com`,
      name: name,
      firstName: name.split(' ')[0] || name,
      lastName: name.split(' ')[1] || '',
      role: role
    };
    // For mock login, we don't have a token, but we set user state
    this.userSubject.next(user);
    if (this.isBrowser()) {
      localStorage.setItem('user', JSON.stringify(user));
      // Optional: set a mock token if needed by guards
      localStorage.setItem('token', 'mock-token-for-' + role);
    }
    return user;
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.userSubject.next(null);
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  isInRole(role: Role) {
    return this.currentUser?.role === role;
  }

  private handleAuthResponse(res: AuthResponse) {
    if (res && res.isSuccess && res.accessToken) {
      const token = res.accessToken;
      const refreshToken = res.refreshToken;
      const apiUser = res.user;

      const user: User = {
        id: apiUser.id,
        email: apiUser.email,
        name: `${apiUser.firstName} ${apiUser.lastName}`,
        firstName: apiUser.firstName,
        lastName: apiUser.lastName,
        role: apiUser.role.toLowerCase() as Role
      };

      if (this.isBrowser()) {
        localStorage.setItem('token', token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
      }
      this.userSubject.next(user);
    }
  }

  private autoLogin() {
    if (!this.isBrowser()) return;

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userSubject.next(user);
      } catch {
        this.logout();
      }
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}