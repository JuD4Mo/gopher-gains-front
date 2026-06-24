import { Component, input, inject } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  template: `
    <header
      class="h-16 flex items-center justify-between px-5 lg:px-7 flex-shrink-0"
      style="background-color: var(--color-surface); border-bottom: 1px solid var(--color-border);"
    >
      <!-- Left: hamburger + breadcrumb -->
      <div class="flex items-center gap-3">
        <button
          (click)="sidebar.toggle()"
          class="lg:hidden p-2 -ml-1 rounded-lg transition-colors"
          style="color: var(--color-muted);"
          aria-label="Toggle sidebar"
        >
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        @if (title()) {
          <div class="flex items-center gap-2">
            <span class="text-[13px] font-medium" style="color: var(--color-muted);">Gopher Gains</span>
            <span style="color: var(--color-border);">/</span>
            <span class="text-[13px] font-semibold" style="color: var(--color-text);">{{ title() }}</span>
          </div>
        }
      </div>

      <!-- Right -->
      <div class="flex items-center gap-2">
        <!-- Theme toggle -->
        <button
          (click)="theme.toggle()"
          class="p-2 rounded-lg transition-all"
          style="color: var(--color-muted);"
          [attr.aria-label]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          @if (theme.isDark()) {
            <svg viewBox="0 0 24 24" style="width:16px;height:16px;" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
            </svg>
          } @else {
            <svg viewBox="0 0 24 24" style="width:16px;height:16px;" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          }
        </button>

        <!-- Role indicator -->
        <div
          class="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
          style="background-color: var(--color-accent-dim); border: 1px solid rgba(0,172,215,0.15);"
        >
          <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background-color: var(--color-accent);"></span>
          <span class="text-[11px] font-bold font-mono hidden sm:inline" style="color: var(--color-accent);">
            {{ auth.currentRole() }}
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
