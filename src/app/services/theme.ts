import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(this.loadTheme());

  constructor() {
    this.applyTheme(this.isDarkMode());
  }

  private loadTheme(): boolean {
    const saved = localStorage.getItem('app_dark_mode');
    return saved ? JSON.parse(saved) : false;
  }

  toggleTheme() {
    const nextMode = !this.isDarkMode();
    this.isDarkMode.set(nextMode);
    localStorage.setItem('app_dark_mode', JSON.stringify(nextMode));
    this.applyTheme(nextMode);
  }

  private applyTheme(isDark: boolean) {
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}