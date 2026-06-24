import { Injectable, signal, effect } from '@angular/core';

type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<Theme>(this.initialTheme());

  readonly theme = this._theme.asReadonly();
  readonly isDark = () => this._theme() === 'dark';

  constructor() {
    effect(() => {
      const theme = this._theme();
      const html = document.documentElement;
      if (theme === 'light') {
        html.classList.add('light');
        html.classList.remove('dark');
      } else {
        html.classList.remove('light');
        html.classList.add('dark');
      }
      localStorage.setItem('gg-theme', theme);
    });
  }

  toggle() {
    this._theme.update(t => (t === 'dark' ? 'light' : 'dark'));
  }

  private initialTheme(): Theme {
    const stored = localStorage.getItem('gg-theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
}
