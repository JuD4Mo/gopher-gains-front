import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { SidebarService } from './sidebar.service';
import { AuthService } from '../services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  adminOnly?: boolean;
}

// Gopher SVG illustration — simplified cute Go Gopher
const GOPHER_SVG = `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <!-- Body -->
  <ellipse cx="32" cy="40" rx="16" ry="18" fill="#00ACD7"/>
  <!-- Head -->
  <ellipse cx="32" cy="22" rx="14" ry="13" fill="#00ACD7"/>
  <!-- Ears -->
  <ellipse cx="18" cy="14" rx="5" ry="7" fill="#00ACD7"/>
  <ellipse cx="46" cy="14" rx="5" ry="7" fill="#00ACD7"/>
  <ellipse cx="18" cy="14" rx="3" ry="5" fill="#E6EDF3" opacity="0.3"/>
  <ellipse cx="46" cy="14" rx="3" ry="5" fill="#E6EDF3" opacity="0.3"/>
  <!-- Face -->
  <!-- Eyes whites -->
  <ellipse cx="26" cy="21" rx="5" ry="5.5" fill="white"/>
  <ellipse cx="38" cy="21" rx="5" ry="5.5" fill="white"/>
  <!-- Pupils -->
  <circle cx="27" cy="22" r="2.8" fill="#1C2230"/>
  <circle cx="39" cy="22" r="2.8" fill="#1C2230"/>
  <!-- Shine -->
  <circle cx="28" cy="21" r="1" fill="white"/>
  <circle cx="40" cy="21" r="1" fill="white"/>
  <!-- Snout -->
  <ellipse cx="32" cy="29" rx="6" ry="4" fill="#80D8EE" opacity="0.7"/>
  <!-- Nose -->
  <ellipse cx="32" cy="27.5" rx="2" ry="1.2" fill="#1C2230"/>
  <!-- Smile -->
  <path d="M28 31 Q32 33.5 36 31" stroke="#1C2230" stroke-width="1.2" stroke-linecap="round" fill="none"/>
  <!-- Arms -->
  <ellipse cx="14" cy="42" rx="5" ry="8" rx="5" ry="8" fill="#00ACD7" transform="rotate(-15 14 42)"/>
  <ellipse cx="50" cy="42" rx="5" ry="8" fill="#00ACD7" transform="rotate(15 50 42)"/>
  <!-- Feet -->
  <ellipse cx="24" cy="57" rx="7" ry="4" fill="#0090B8"/>
  <ellipse cx="40" cy="57" rx="7" ry="4" fill="#0090B8"/>
  <!-- Tail -->
  <path d="M46 50 Q58 48 55 38" stroke="#0090B8" stroke-width="4" stroke-linecap="round" fill="none"/>
  <!-- Belly -->
  <ellipse cx="32" cy="42" rx="9" ry="11" fill="#80D8EE" opacity="0.35"/>
</svg>`;

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SafeHtmlPipe],
  template: `
    @if (sidebar.open()) {
      <div
        class="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        (click)="sidebar.close()"
        role="presentation"
      ></div>
    }

    <aside
      class="fixed top-0 left-0 z-40 h-dvh w-sidebar flex flex-col select-none transition-transform duration-250 -translate-x-full lg:translate-x-0"
      [class.translate-x-0]="sidebar.open()"
      style="background-color: var(--color-sidebar); border-right: 1px solid var(--color-border);"
    >
      <!-- Header with Gopher -->
      <div class="flex flex-col items-center pt-6 pb-5 px-5 border-b" style="border-color: var(--color-border);">
        <!-- Gopher illustration -->
        <div class="w-16 h-16 mb-3 drop-shadow-lg" [innerHTML]="gopherSvg" aria-label="Gopher mascot"></div>
        <!-- Brand -->
        <div class="flex items-center gap-1.5">
          <span class="text-xl font-bold tracking-tight font-display" style="color: var(--color-text);">Gopher</span>
          <span class="text-xl font-bold tracking-tight font-display" style="color: var(--color-accent);">Gains</span>
        </div>
        <span class="text-xs mt-0.5 font-mono" style="color: var(--color-sidebar-muted);">v1.0.0</span>
        <!-- Close button mobile -->
        <button
          (click)="sidebar.close()"
          class="lg:hidden absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
          style="color: var(--color-sidebar-muted);"
          aria-label="Close sidebar"
        >
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Nav section label -->
      <div class="px-5 pt-5 pb-2">
        <span class="section-label">Navigation</span>
      </div>

      <!-- Nav items -->
      <nav class="flex-1 overflow-y-auto pb-4 px-3 space-y-0.5" role="navigation" aria-label="Main navigation">
        @for (item of navItems(); track item.route) {
          <a
            [routerLink]="item.route"
            [routerLinkActiveOptions]="{ exact: isExactRoute(item.route) }"
            (click)="sidebar.close()"
            class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative"
            [class.nav-active]="isActive(item.route)"
            [class.nav-inactive]="!isActive(item.route)"
            [attr.aria-current]="isActive(item.route) ? 'page' : null"
          >
            @if (isActive(item.route)) {
              <span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r" style="background-color: var(--color-accent);"></span>
            }
            <span
              class="w-5 h-5 flex-shrink-0 [&>svg]:w-full [&>svg]:h-full transition-colors"
              [innerHTML]="item.icon | safeHtml"
            ></span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Footer -->
      <div class="px-5 py-4 border-t" style="border-color: var(--color-border);">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span class="text-xs font-mono" style="color: var(--color-sidebar-muted);">Connected</span>
        </div>
      </div>
    </aside>

    <style>
      .nav-active {
        background-color: var(--color-accent-dim);
        color: var(--color-accent);
      }
      .nav-inactive {
        color: var(--color-sidebar-muted);
      }
      .nav-inactive:hover {
        color: var(--color-text);
        background-color: var(--color-sidebar-hover);
      }
    </style>
  `,
})
export class SidebarComponent {
  private readonly router = inject(Router);
  protected readonly sidebar = inject(SidebarService);
  private readonly auth = inject(AuthService);

  protected readonly gopherSvg = GOPHER_SVG;

  private readonly allNavItems: NavItem[] = [
    { label: 'Dashboard', route: '/', icon: ICONS.dashboard },
    { label: 'Exercises', route: '/exercises', icon: ICONS.exercises },
    { label: 'Routines', route: '/routines', icon: ICONS.routines },
    { label: 'Users', route: '/users', icon: ICONS.users, adminOnly: true },
    { label: 'Sessions', route: '/sessions', icon: ICONS.sessions },
    { label: 'Assignments', route: '/assignments', icon: ICONS.assignments, adminOnly: true },
  ];

  protected readonly navItems = computed(() => {
    const role = this.auth.currentRole();
    const dashboardRoute = role === 'admin' ? '/admin' : '/my';
    return this.allNavItems
      .filter(item => !item.adminOnly || role === 'admin')
      .map(item => item.label === 'Dashboard' ? { ...item, route: dashboardRoute } : item);
  });

  protected readonly exactRoutes = new Set(['/admin', '/my']);

  protected isExactRoute(route: string): boolean {
    return this.exactRoutes.has(route);
  }

  protected isActive(route: string): boolean {
    if (this.isExactRoute(route)) return this.router.url === route;
    return this.router.url.startsWith(route);
  }
}
