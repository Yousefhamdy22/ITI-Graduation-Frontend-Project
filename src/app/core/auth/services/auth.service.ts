import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

import { environment } from '@environments/environment';
import { 
  User, 
  AuthTokens, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  DecodedToken,
  UserRole 
} from '@core/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = environment.tokenKey;
  private readonly REFRESH_TOKEN_KEY = environment.refreshTokenKey;

  // Signals for reactive state management
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);

  // Public computed signals
  currentUser = computed(() => this.currentUserSignal());
  isAuthenticated = computed(() => this.isAuthenticatedSignal());
  userRole = computed(() => this.currentUserSignal()?.role);

  // Access token stored in memory (not localStorage for security)
  private accessToken: string | null = null;

  constructor() {
    this.loadUserFromStorage();
  }

  /**
   * Login with email and password
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // In real app, this would be a POST to /auth/login
    // For demo, we simulate with JSON Server
    console.log('Attempting login with:', credentials.email);
    return this.http.get<User[]>(`${this.API_URL}/users?email=${credentials.email}`)
      .pipe(
        map(users => {
          console.log('Users found:', users);
          const user = users.find(u => u.email === credentials.email);
          console.log('User matched:', user);
          console.log('Password from form:', credentials.password);
          console.log('Password from DB:', user?.password);
          
          if (!user) {
            throw new Error('User not found');
          }
          
          if (user.password !== credentials.password) {
            throw new Error('Invalid password');
          }
          
          // Simulate token generation (in real app, backend generates these)
          const tokens: AuthTokens = {
            accessToken: this.generateMockToken(user, 15 * 60), // 15 minutes
            refreshToken: this.generateMockToken(user, 7 * 24 * 60 * 60) // 7 days
          };

          return { user, tokens };
        }),
        tap(response => this.handleAuthSuccess(response)),
        catchError(error => {
          console.error('Login error details:', error);
          return throwError(() => new Error('Login failed: ' + error.message));
        })
      );
  }

  /**
   * Register new user
   */
  register(data: RegisterData): Observable<AuthResponse> {
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      createdAt: new Date().toISOString()
    };

    return this.http.post<User>(`${this.API_URL}/users`, newUser)
      .pipe(
        map(user => {
          const tokens: AuthTokens = {
            accessToken: this.generateMockToken(user, 15 * 60),
            refreshToken: this.generateMockToken(user, 7 * 24 * 60 * 60)
          };
          return { user, tokens };
        }),
        tap(response => this.handleAuthSuccess(response))
      );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.accessToken = null;
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Refresh access token using refresh token
   */
  refreshToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    try {
      const decoded = jwtDecode<DecodedToken>(refreshToken);
      
      // Check if refresh token is expired
      if (this.isTokenExpired(decoded)) {
        this.logout();
        return throwError(() => new Error('Refresh token expired'));
      }

      // Simulate refresh token rotation
      // In real app: POST to /auth/refresh with refresh token
      return this.http.get<User>(`${this.API_URL}/users/${decoded.sub}`)
        .pipe(
          map(user => {
            const newAccessToken = this.generateMockToken(user, 15 * 60);
            const newRefreshToken = this.generateMockToken(user, 7 * 24 * 60 * 60);
            
            this.setAccessToken(newAccessToken);
            this.setRefreshToken(newRefreshToken);
            
            return newAccessToken;
          })
        );
    } catch (error) {
      this.logout();
      return throwError(() => new Error('Invalid refresh token'));
    }
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole): boolean {
    return this.currentUserSignal()?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.currentUserSignal()?.role;
    return userRole ? roles.includes(userRole) : false;
  }

  /**
   * Private helper methods
   */

  private handleAuthSuccess(response: AuthResponse): void {
    this.setAccessToken(response.tokens.accessToken);
    this.setRefreshToken(response.tokens.refreshToken);
    this.currentUserSignal.set(response.user);
    this.isAuthenticatedSignal.set(true);
  }

  private setAccessToken(token: string): void {
    this.accessToken = token;
  }

  private setRefreshToken(token: string): void {
    // In production, use httpOnly cookie instead
    // For demo purposes, using localStorage with clear warning
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private loadUserFromStorage(): void {
    const refreshToken = this.getRefreshToken();
    
    if (refreshToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(refreshToken);
        
        if (!this.isTokenExpired(decoded)) {
          // Load user data
          this.http.get<User>(`${this.API_URL}/users/${decoded.sub}`)
            .subscribe({
              next: (user) => {
                this.currentUserSignal.set(user);
                this.isAuthenticatedSignal.set(true);
                // Generate new access token
                this.accessToken = this.generateMockToken(user, 15 * 60);
              },
              error: () => this.logout()
            });
        } else {
          this.logout();
        }
      } catch (error) {
        this.logout();
      }
    }
  }

  private generateMockToken(user: User, expiresInSeconds: number): string {
    // This is a MOCK token generator for demo purposes
    // In real app, backend generates JWT tokens
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload: DecodedToken = {
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds
    };

    const base64Header = btoa(JSON.stringify(header));
    const base64Payload = btoa(JSON.stringify(payload));
    const signature = btoa('mock-signature-' + user.id);

    return `${base64Header}.${base64Payload}.${signature}`;
  }

  private isTokenExpired(decoded: DecodedToken): boolean {
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }
}
