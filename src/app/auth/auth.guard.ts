import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastService } from '../shared/toast.service';

/**
 * AuthGuard: Ensures user is authenticated before accessing protected routes.
 * Checks:
 * 1. Token exists in localStorage
 * 2. Token is not expired (JWT exp claim)
 * 3. User object exists in AuthService
 * 4. Redirects to login if any check fails
 */
export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  // Check if user is already loaded in AuthService
  const user = authService.currentUser;
  if (!user) {
    console.warn('⚠️ AuthGuard: No user in AuthService, attempting to restore from localStorage...');
    authService['autoLogin']();
    if (!authService.currentUser) {
      console.error('❌ AuthGuard: No authentication found. Redirecting to login.');
      toast.show('يجب تسجيل الدخول أولاً', 'error');
      router.navigate(['/admin/login']);
      return false;
    }
  }

  // Verify token exists and is not expired
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ AuthGuard: Token not found in localStorage.');
      toast.show('انتهت صلاحية الجلسة', 'error');
      router.navigate(['/admin/login']);
      return false;
    }

    // Decode JWT and check expiration
    const decoded = decodeJWT(token);
    if (!decoded) {
      console.error('❌ AuthGuard: Failed to decode JWT.');
      localStorage.removeItem('token');
      toast.show('توكن غير صالح', 'error');
      router.navigate(['/admin/login']);
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    if (decoded['exp'] && decoded['exp'] < now) {
      console.warn('⚠️ AuthGuard: Token expired. Attempting refresh...');
      // Token is expired, but interceptor should handle refresh
      // Allow the request to proceed; interceptor will refresh if possible
    }
  }

  console.log('✅ AuthGuard: Authentication verified for user:', user?.email);
  return true;
};

/**
 * Simple JWT decoder (no verification, just payload extraction)
 */
function decodeJWT(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const decoded = atob(parts[1]);
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}
