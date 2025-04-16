import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private storageKey = 'app-theme';
  private themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());

  currentTheme$ = this.themeSubject.asObservable();

  constructor() {
    // Apply the initial theme
    this.applyTheme(this.themeSubject.value);
  }

  toggleTheme(): void {
    const newTheme = this.themeSubject.value === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    localStorage.setItem(this.storageKey, theme);
    this.applyTheme(theme);
  }

  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  private getInitialTheme(): Theme {
    // Check localStorage first
    const savedTheme = localStorage.getItem(this.storageKey) as Theme | null;
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      return savedTheme;
    }

    // Check for user's system preference
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }

    // Default to dark mode
    return 'dark';
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
