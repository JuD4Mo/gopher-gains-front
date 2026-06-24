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
      <div class="flex items-center gap-3 px-5 h-16 flex-shrink-0" style="border-bottom: 1px solid var(--color-border);">
        <div class="relative w-8 h-8 flex-shrink-0">
          <img
            [src]="logoUrl"
            alt="Gopher Gains mascot"
            class="w-full h-full object-contain drop-shadow-sm"
            width="32"
            height="32"
          />
        </div>
        <div class="flex flex-col leading-none">
          <span class="text-[13px] font-bold tracking-tight font-display" style="color: #E6EDF3;">
            Gopher<span style="color: var(--color-accent);">Gains</span>
          </span>
          <span class="text-[10px] font-mono mt-0.5 tracking-wide uppercase" style="color: #3A4A5A;">Fitness Platform</span>
        </div>
        <button
          (click)="sidebar.close()"
          class="lg:hidden ml-auto p-1.5 rounded-md transition-colors"
          style="color: #3A4A5A;"
          aria-label="Close sidebar"
        >
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Portal switcher -->
      <div class="px-4 py-3 flex-shrink-0" style="border-bottom: 1px solid var(--color-border);">
        <div class="flex rounded-lg overflow-hidden p-0.5" style="background-color: rgba(255,255,255,0.04); border: 1px solid var(--color-border);">
          <a
            routerLink="/admin"
            (click)="sidebar.close()"
            class="flex-1 text-center text-[11px] font-semibold font-mono py-1.5 rounded-md transition-all duration-150"
            [style.background-color]="currentRole() === 'admin' ? 'var(--color-accent)' : 'transparent'"
            [style.color]="currentRole() === 'admin' ? '#fff' : 'var(--color-sidebar-muted)'"
          >admin</a>
          <a
            routerLink="/my"
            (click)="sidebar.close()"
            class="flex-1 text-center text-[11px] font-semibold font-mono py-1.5 rounded-md transition-all duration-150"
            [style.background-color]="currentRole() === 'user' ? 'var(--color-accent)' : 'transparent'"
            [style.color]="currentRole() === 'user' ? '#fff' : 'var(--color-sidebar-muted)'"
          >athlete</a>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto py-4 px-3" role="navigation" aria-label="Main navigation">
        <div class="space-y-0.5">
          @for (item of visibleItems(); track item.route) {
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

        @if (adminManageItems().length > 0) {
          <div class="mt-6">
            <p class="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.1em]" style="color: #2A3A4A;">Manage</p>
            <div class="space-y-0.5">
              @for (item of adminManageItems(); track item.route) {
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

      <!-- Footer status -->
      <div class="px-5 py-4 flex-shrink-0" style="border-top: 1px solid var(--color-border);">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
            <span class="text-[11px] font-mono" style="color: #3A4A5A;">Live</span>
          </div>
          <span class="text-[11px] font-mono" style="color: #2A3A4A;">v1.0</span>
        </div>
      </div>
    </aside>

    <style>
      .nav-active {
        background-color: rgba(0, 172, 215, 0.1);
        color: var(--color-accent);
      }
      .nav-inactive {
        color: #4A5A6A;
      }
      .nav-inactive:hover {
        color: #E6EDF3;
        background-color: rgba(255,255,255,0.04);
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
    { label: 'Dashboard', route: '/admin', icon: ICONS.dashboard },
    { label: 'My Dashboard', route: '/my', icon: ICONS.dashboard },
    { label: 'Exercises', route: '/exercises', icon: ICONS.exercises },
    { label: 'Routines', route: '/routines', icon: ICONS.routines },
    { label: 'Sessions', route: '/sessions', icon: ICONS.sessions },
    { label: 'Users', route: '/users', icon: ICONS.users, adminOnly: true },
    { label: 'Assignments', route: '/assignments', icon: ICONS.assignments, adminOnly: true },
  ];

  protected readonly visibleItems = computed(() => {
    const role = this.auth.currentRole();
    if (role === 'admin') {
      return this.allNavItems.filter(i => ['/admin', '/exercises', '/routines', '/sessions'].includes(i.route));
    }
    return this.allNavItems.filter(i => ['/my', '/exercises', '/routines', '/sessions'].includes(i.route));
  });

  protected readonly adminManageItems = computed(() => {
    if (this.auth.currentRole() !== 'admin') return [];
    return this.allNavItems.filter(i => i.adminOnly);
  });

  protected readonly exactRoutes = new Set(['/admin', '/my']);

  protected isActive(route: string): boolean {
    if (this.exactRoutes.has(route)) return this.router.url === route;
    return this.router.url.startsWith(route);
  }
}
