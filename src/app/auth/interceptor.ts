import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);
  private router = inject(Router);

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;

    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const secret = localStorage.getItem('x-secret-key') || 'osama123';

      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (secret) headers['x-secret-key'] = secret;

      if (Object.keys(headers).length > 0) {
        authReq = req.clone({ setHeaders: headers });
      }
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 404 Not Found errors
        if (error.status === 404 && isPlatformBrowser(this.platformId)) {
          console.warn('⚠️ 404 Not Found - redirecting to not-found page');
          this.router.navigate(['/not-found'], { skipLocationChange: false });
        }
        
        // If unauthorized and we have a refresh token, try to refresh
        // But skip refresh if the request itself is to RefreshToken endpoint
        if (
          error.status === 401 &&
          !authReq.url.includes('RefreshToken') &&
          isPlatformBrowser(this.platformId) &&
          localStorage.getItem('refreshToken')
        ) {
          return this.handle401Error(authReq, next);
        }
        
        // If refresh failed or no refresh token, logout user
        if (error.status === 401 && isPlatformBrowser(this.platformId)) {
          console.warn('⚠️ 401 Unauthorized - logging out user');
          this.authService.logout();
        }
        
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!isPlatformBrowser(this.platformId)) {
      return next.handle(request);
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((res) => {
          this.isRefreshing = false;
          const newToken = isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : null;
          this.refreshTokenSubject.next(newToken);
          const reqWithNewToken = newToken
            ? request.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } })
            : request;
          return next.handle(reqWithNewToken);
        }),
        catchError(err => {
          this.isRefreshing = false;
          // If refresh fails, clear storage and propagate error
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => {
          const reqWithNewToken = token
            ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
            : request;
          return next.handle(reqWithNewToken);
        })
      );
    }
  }
}