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

const LOGO_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gopher-Gains-Logo-v1-Photoroom-WfSlqGUxq90Xa0oAPjDPNoaGcCYtXQ.png';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, SafeHtmlPipe],
  template: `
    @if (sidebar.open()) {
      <div
        class="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
        (click)="sidebar.close()"
        role="presentation"
      ></div>
    }

    <aside
      class="fixed top-0 left-0 z-40 h-dvh w-sidebar flex flex-col select-none transition-transform duration-300 -translate-x-full lg:translate-x-0"
      [class.translate-x-0]="sidebar.open()"
      style="background-color: var(--color-sidebar); border-right: 1px solid var(--color-border);"
    >
      <!-- Brand -->
      <div class="flex flex-col px-5 pt-6 pb-5 flex-shrink-0" style="border-bottom: 1px solid var(--color-border);">
        <div class="flex items-start justify-between mb-3">
          <a routerLink="/">
            <img
              [src]="logoUrl"
              alt="Gopher Gains"
              class="w-12 h-12 object-contain"
              width="48"
              height="48"
            />
          </a>
          <button
            (click)="sidebar.close()"
            class="lg:hidden p-1.5 rounded-md transition-colors mt-0.5"
            style="color: var(--color-sidebar-muted);"
            aria-label="Close sidebar"
          >
            <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <p class="text-[15px] font-bold font-display tracking-tight leading-none" style="color: var(--color-text);">
          Gopher<span style="color: var(--color-accent);">Gains</span>
        </p>
        <p class="text-[11px] font-mono mt-1" style="color: var(--color-sidebar-muted);">Fitness Platform</p>
        <div class="mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-md w-fit" style="background-color: rgba(61,184,255,0.1);">
          <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background-color: var(--color-accent);"></span>
          <span class="text-[11px] font-mono font-semibold uppercase tracking-wide" style="color: var(--color-accent);">
            {{ currentRole() === 'admin' ? 'Admin' : 'Athlete' }}
          </span>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto py-4 px-3" role="navigation" aria-label="Main navigation">
        <div class="space-y-0.5">
          @for (item of primaryItems(); track item.route) {
            <a
              [routerLink]="item.route"
              (click)="sidebar.close()"
              class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 relative"
              [class.nav-active]="isActive(item.route)"
              [class.nav-inactive]="!isActive(item.route)"
              [attr.aria-current]="isActive(item.route) ? 'page' : null"
            >
              @if (isActive(item.route)) {
                <span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r" style="background-color: var(--color-accent);"></span>
              }
              <span class="w-[18px] h-[18px] flex-shrink-0 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="item.icon | safeHtml"></span>
              <span>{{ item.label }}</span>
            </a>
          }
        </div>

        @if (manageItems().length > 0) {
          <div class="mt-6">
            <p class="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.1em]" style="color: var(--color-sidebar-muted);">Manage</p>
            <div class="space-y-0.5">
              @for (item of manageItems(); track item.route) {
                <a
                  [routerLink]="item.route"
                  (click)="sidebar.close()"
                  class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 relative"
                  [class.nav-active]="isActive(item.route)"
                  [class.nav-inactive]="!isActive(item.route)"
                  [attr.aria-current]="isActive(item.route) ? 'page' : null"
                >
                  @if (isActive(item.route)) {
                    <span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r" style="background-color: var(--color-accent);"></span>
                  }
                  <span class="w-[18px] h-[18px] flex-shrink-0 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="item.icon | safeHtml"></span>
                  <span>{{ item.label }}</span>
                </a>
              }
            </div>
          </div>
        }
      </nav>

      <!-- Footer: logout -->
      <div class="px-4 py-4 flex-shrink-0" style="border-top: 1px solid var(--color-border);">
        <button
          (click)="logout()"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150"
          style="color: var(--color-sidebar-muted);"
        >
          <svg viewBox="0 0 24 24" class="w-[18px] h-[18px] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Sign out</span>
        </button>
      </div>
    </aside>

    <style>
      .nav-active {
        background-color: rgba(28,200,255,0.1);
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
  protected readonly currentRole = this.auth.currentRole;

  private readonly allNavItems: NavItem[] = [
    { label: 'Dashboard',   route: '/admin',       icon: ICONS.dashboard },
    { label: 'My Dashboard',route: '/my',           icon: ICONS.dashboard },
    { label: 'Exercises',   route: '/exercises',    icon: ICONS.exercises },
    { label: 'Routines',    route: '/routines',     icon: ICONS.routines },
    { label: 'Sessions',    route: '/sessions',     icon: ICONS.sessions },
    { label: 'Users',       route: '/users',        icon: ICONS.users,       adminOnly: true },
    { label: 'Assignments', route: '/assignments',  icon: ICONS.assignments, adminOnly: true },
  ];

  protected readonly primaryItems = computed(() => {
    const role = this.auth.currentRole();
    if (role === 'admin') {
      return this.allNavItems.filter(i => ['/admin', '/exercises', '/routines', '/sessions'].includes(i.route));
    }
    return this.allNavItems.filter(i => ['/my', '/exercises', '/routines', '/sessions'].includes(i.route));
  });

  protected readonly manageItems = computed(() => {
    if (this.auth.currentRole() !== 'admin') return [];
    return this.allNavItems.filter(i => i.adminOnly);
  });

  private readonly exactRoutes = new Set(['/admin', '/my']);

  protected isActive(route: string): boolean {
    if (this.exactRoutes.has(route)) return this.router.url === route;
    return this.router.url.startsWith(route);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
