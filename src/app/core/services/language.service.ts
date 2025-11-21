import { Injectable, signal } from '@angular/core';

export type Language = 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSignal = signal<Language>('en');
  private isRtlSignal = signal<boolean>(false);

  currentLanguage = this.currentLanguageSignal.asReadonly();
  isRtl = this.isRtlSignal.asReadonly();

  constructor() {}

  initialize(): void {
    // English only - no language switching needed
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  }

  setLanguage(lang: Language): void {
    // English only - no language switching needed
    this.currentLanguageSignal.set('en');
    this.isRtlSignal.set(false);
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  }

  toggleLanguage(): void {
    // English only - no language switching needed
  }
}
