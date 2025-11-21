export type UserRole = 'admin' | 'instructor' | 'student';

export interface User {
  id: string;
  email: string;
  password?: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  enrolledCourses?: string[];
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface DecodedToken {
  sub: string;
  email: string;
  role: UserRole;
  exp: number;
  iat: number;
}
