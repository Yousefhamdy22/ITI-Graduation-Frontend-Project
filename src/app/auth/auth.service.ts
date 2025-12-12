import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

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
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: string;
  accessToken?: string;
  refreshToken?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private BASE_URL = 'http://localhost:5180/api';

  constructor() {
    // Attempt to restore session on init
    this.autoLogin();
  }

  // --- Admin ---

  loginAdmin(data: any): Observable<AuthResponse> {
    console.log('🔵 AuthService.loginAdmin() called with:', data.email);
    return this.http.post<AuthResponse>(`${this.BASE_URL}/admin/login`, data)
      .pipe(
        tap(res => {
          console.log('✅ AuthService: Login response:', res);
          this.handleAuthResponse(res);
        }),
        catchError(err => {
          console.error('❌ AuthService: Login error:', err);
          return throwError(() => err);
        })
      );
  }

  registerAdmin(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE_URL}/admin/register`, data)
      .pipe(
        tap(res => this.handleAuthResponse(res)),
        catchError(err => {
          console.error('❌ AuthService: Register error:', err);
          return throwError(() => err);
        })
      );
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
    const url = `${this.BASE_URL}/Auth/register-student`;
    console.log('🔵 AuthService: Sending POST to', url);
    console.log('🔵 AuthService: Request data:', data);
    return this.http.post<AuthResponse>(url, data)
      .pipe(
        tap(res => {
          console.log('✅ AuthService: Response received:', res);
          this.handleAuthResponse(res);
        })
      );
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
      localStorage.removeItem('refreshToken');
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

  // --- Refresh Token ---
  refreshToken(): Observable<{ accessToken: string; refreshToken?: string }> {
    const refreshToken = this.isBrowser() ? localStorage.getItem('refreshToken') : null;
    if (!refreshToken) {
      // Return an observable that errors if no refresh token
      return new Observable(observer => {
        observer.error(new Error('No refresh token'));
      });
    }

    return this.http.post<{ accessToken: string; refreshToken?: string }>(
      `${this.BASE_URL}/Auth/RefreshToken`,
      { refreshToken }
    ).pipe(
      tap(res => {
        if (res?.accessToken && this.isBrowser()) {
          localStorage.setItem('token', res.accessToken);
          if (res.refreshToken) {
            localStorage.setItem('refreshToken', res.refreshToken);
          }
        }
      })
    );
  }
}