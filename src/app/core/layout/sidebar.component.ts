import { Component, inject, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
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

const LOGO_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gopher-Gains-Logo-v1-0YQbpRo1RgZh5Y4xCIgIkgMV9hxr97.png';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, SafeHtmlPipe],
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
      <!-- Header: horizontal brand lockup -->
      <div class="relative flex items-center gap-3 px-4 py-4 border-b" style="border-color: var(--color-border);">
        <!-- Logo mark -->
        <img
          [src]="logoUrl"
          alt="Gopher Gains logo"
          class="w-10 h-10 flex-shrink-0 object-contain"
          width="40"
          height="40"
        />
        <!-- Wordmark: always white on the dark sidebar in both themes -->
        <div class="flex flex-col leading-none">
          <span class="text-base font-bold tracking-tight font-display" style="color: #E6EDF3;">
            Gopher <span style="color: var(--color-accent);">Gains</span>
          </span>
          <span class="text-[10px] font-mono mt-0.5" style="color: #5A6A80;">Fitness Tracker</span>
        </div>
        <!-- Close button mobile -->
        <button
          (click)="sidebar.close()"
          class="lg:hidden absolute top-1/2 -translate-y-1/2 right-3 p-1.5 rounded-lg transition-colors"
          style="color: var(--color-sidebar-muted);"
          aria-label="Close sidebar"
        >
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Nav items -->
      <nav class="flex-1 overflow-y-auto py-3 px-3" role="navigation" aria-label="Main navigation">
        <!-- Main section -->
        <div class="mb-1">
          <p class="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest" style="color: #3A4A5A;">Workspace</p>
          @for (item of mainItems(); track item.route) {
            <a
              [routerLink]="item.route"
              (click)="sidebar.close()"
              class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative"
              [class.nav-active]="isActive(item.route)"
              [class.nav-inactive]="!isActive(item.route)"
              [attr.aria-current]="isActive(item.route) ? 'page' : null"
            >
              @if (isActive(item.route)) {
                <span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r" style="background-color: var(--color-accent);"></span>
              }
              <span class="w-5 h-5 flex-shrink-0 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="item.icon | safeHtml"></span>
              <span>{{ item.label }}</span>
            </a>
          }
        </div>

        <!-- Admin-only section -->
        @if (adminItems().length > 0) {
          <div class="mt-4">
            <p class="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest" style="color: #3A4A5A;">Admin</p>
            @for (item of adminItems(); track item.route) {
              <a
                [routerLink]="item.route"
                (click)="sidebar.close()"
                class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative"
                [class.nav-active]="isActive(item.route)"
                [class.nav-inactive]="!isActive(item.route)"
                [attr.aria-current]="isActive(item.route) ? 'page' : null"
              >
                @if (isActive(item.route)) {
                  <span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r" style="background-color: var(--color-accent);"></span>
                }
                <span class="w-5 h-5 flex-shrink-0 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="item.icon | safeHtml"></span>
                <span>{{ item.label }}</span>
              </a>
            }
          </div>
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

  protected readonly logoUrl = LOGO_URL;

  private readonly allNavItems: NavItem[] = [
    { label: 'Dashboard', route: '/', icon: ICONS.dashboard },
    { label: 'Exercises', route: '/exercises', icon: ICONS.exercises },
    { label: 'Routines', route: '/routines', icon: ICONS.routines },
    { label: 'Sessions', route: '/sessions', icon: ICONS.sessions },
    { label: 'Users', route: '/users', icon: ICONS.users, adminOnly: true },
    { label: 'Assignments', route: '/assignments', icon: ICONS.assignments, adminOnly: true },
  ];

  private readonly allMapped = computed(() => {
    const role = this.auth.currentRole();
    const dashboardRoute = role === 'admin' ? '/admin' : '/my';
    return this.allNavItems.map(item =>
      item.label === 'Dashboard' ? { ...item, route: dashboardRoute } : item
    );
  });

  protected readonly mainItems = computed(() =>
    this.allMapped().filter(item => !item.adminOnly)
  );

  protected readonly adminItems = computed(() =>
    this.allMapped().filter(item => item.adminOnly && this.auth.currentRole() === 'admin')
  );

  protected readonly exactRoutes = new Set(['/admin', '/my']);

  protected isExactRoute(route: string): boolean {
    return this.exactRoutes.has(route);
  }

  protected isActive(route: string): boolean {
    if (this.isExactRoute(route)) return this.router.url === route;
    return this.router.url.startsWith(route);
  }
}
