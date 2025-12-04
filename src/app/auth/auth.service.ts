import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Role = 'admin' | 'student' | 'instructor' | null;

export interface User {
  id: string;
  name: string;
  role: Role;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // In-memory only authentication state (no localStorage)
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {}

  private saveUser(u: User | null) {
    // Do not persist to localStorage by request — keep in-memory only
    this.userSubject.next(u);
  }

  loginAs(role: Role, name = 'مستخدم', id?: string): User {
    const user: User = { id: id || Date.now().toString(), name, role };
    this.saveUser(user);
    return user;
  }

  logout() {
    this.saveUser(null);
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  isInRole(role: Role) {
    return this.currentUser?.role === role;
  }
}
