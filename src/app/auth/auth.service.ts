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
  private key = 'elearning_user';
  private userSubject = new BehaviorSubject<User | null>(this.loadUser());
  user$ = this.userSubject.asObservable();

  constructor() {}

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private saveUser(u: User | null) {
    if (u) localStorage.setItem(this.key, JSON.stringify(u));
    else localStorage.removeItem(this.key);
    console.log('[AuthService] saveUser ->', u);
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
