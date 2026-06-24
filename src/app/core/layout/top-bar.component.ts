import { Component, input, inject } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  template: `
    <header
      class="h-16 flex items-center justify-between px-4 lg:px-6 transition-colors"
      style="background-color: var(--color-surface); border-bottom: 1px solid var(--color-border);"
    >
      <!-- Left: hamburger + title -->
      <div class="flex items-center gap-3">
        <button
          (click)="sidebar.toggle()"
          class="lg:hidden p-2 -ml-1 rounded-lg transition-colors btn-ghost"
          aria-label="Toggle sidebar"
        >
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <h1 class="text-base font-bold font-display truncate" style="color: var(--color-text);">{{ title() }}</h1>
      </div>

      <!-- Right: theme toggle + role badge -->
      <div class="flex items-center gap-3 flex-shrink-0">
        <!-- Theme toggle -->
        <button
          (click)="theme.toggle()"
          class="p-2 rounded-lg transition-all btn-ghost"
          [attr.aria-label]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
          [title]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          @if (theme.isDark()) {
            <!-- Sun icon -->
            <svg viewBox="0 0 24 24" class="w-4.5 h-4.5" style="width:18px;height:18px;" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
            </svg>
          } @else {
            <!-- Moon icon -->
            <svg viewBox="0 0 24 24" class="w-4.5 h-4.5" style="width:18px;height:18px;" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          }
        </button>

        <!-- Role pill -->
        <div
          class="flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-full"
          style="background-color: var(--color-accent-dim); border: 1px solid rgba(0,172,215,0.2);"
        >
          <span class="w-2 h-2 rounded-full flex-shrink-0" style="background-color: var(--color-accent);"></span>
          <span class="text-xs font-semibold font-mono hidden sm:inline" style="color: var(--color-accent);">
            {{ auth.currentRole() === 'admin' ? 'admin' : 'user' }}
          </span>
        </div>
      </div>
    </header>
  `,
})
export class TopBarComponent {
  readonly title = input<string>('');
  protected readonly sidebar = inject(SidebarService);
  protected readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);
}
