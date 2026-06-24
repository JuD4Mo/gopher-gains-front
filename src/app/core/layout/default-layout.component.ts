import { Component, inject, signal, DestroyRef } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SidebarComponent } from './sidebar.component';
import { TopBarComponent } from './top-bar.component';
import { ToastComponent } from '../../shared/components/toast.component';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopBarComponent, ToastComponent],
  template: `
    <div class="min-h-dvh flex" style="background-color: var(--color-base);">
      <app-sidebar />
      <div class="lg:ml-sidebar flex-1 min-h-dvh flex flex-col min-w-0">
        <app-top-bar [title]="pageTitle()" />
        <main class="flex-1 overflow-auto">
          <router-outlet />
        </main>
      </div>
      <app-toast />
    </div>
  `,
})
export class DefaultLayoutComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly _theme = inject(ThemeService);
  readonly pageTitle = signal('');

  constructor() {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      let child = this.route;
      while (child.firstChild) child = child.firstChild;
      this.pageTitle.set((child.snapshot.title as string) ?? '');
    });
  }
}
