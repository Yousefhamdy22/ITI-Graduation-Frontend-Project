import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'elearning_theme';
  
  private themeSignal = signal<Theme>(this.getInitialTheme());
  currentTheme = this.themeSignal.asReadonly();

  constructor() {
    // Apply theme on initialization and when it changes
    effect(() => {
      this.applyTheme(this.themeSignal());
    });
  }

  private getInitialTheme(): Theme {
    // Check localStorage first
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem(this.THEME_KEY, theme);
  }

  toggleTheme(): void {
    const newTheme = this.themeSignal() === 'light' ? 'dark' : 'light';
    this.themeSignal.set(newTheme);
  }

  setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
  }

  isDark(): boolean {
    return this.themeSignal() === 'dark';
  }
}
