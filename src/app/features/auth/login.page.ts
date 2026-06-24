import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import type { UserRole } from '../../models/user.model';

const MASCOT_MAIN       = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gopher-Gains-Logo-v1-Photoroom-WfSlqGUxq90Xa0oAPjDPNoaGcCYtXQ.png';
const MASCOT_CELEBRATING = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gopher-celebrating-BZF4N0dTYgz8RsFhJeLbyonFVV35Lx.png';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div
      class="min-h-dvh flex flex-col items-center justify-center px-6 py-16"
      style="background-color: var(--color-base);"
    >
      <!-- Back to home -->
      <a
        routerLink="/"
        class="absolute top-6 left-6 flex items-center gap-1.5 text-[13px] font-medium transition-colors"
        style="color: var(--color-muted);"
      >
        <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back
      </a>

      <div class="w-full max-w-sm">

        <!-- Brand -->
        <div class="flex flex-col items-center text-center mb-10">
          <img
            [src]="mascotMain"
            alt="Gopher Gains"
            class="w-20 h-20 object-contain mb-5"
            width="80"
            height="80"
          />
          <h1 class="text-2xl font-bold font-display tracking-tight mb-1" style="color: var(--color-text);">
            Welcome back
          </h1>
          <p class="text-[14px]" style="color: var(--color-muted);">Choose how you want to continue</p>
        </div>

        <!-- Role cards -->
        <div class="flex flex-col gap-3">

          <!-- Admin -->
          <button
            (click)="continue('admin')"
            class="group flex items-center gap-4 p-5 rounded-xl text-left transition-all duration-150"
            style="background-color: var(--color-card); border: 1px solid var(--color-border);"
          >
            <div
              class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
              style="background-color: rgba(28,200,255,0.12);"
            >
              <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: var(--color-accent);">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[15px] font-semibold font-display" style="color: var(--color-text);">Continue as Admin</p>
              <p class="text-[12px] mt-0.5" style="color: var(--color-muted);">Manage exercises, routines, users and sessions</p>
            </div>
            <svg viewBox="0 0 24 24" class="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: var(--color-muted);">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>

          <!-- User -->
          <button
            (click)="continue('user')"
            class="group flex items-center gap-4 p-5 rounded-xl text-left transition-all duration-150"
            style="background-color: var(--color-card); border: 1px solid var(--color-border);"
          >
            <div
              class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
              style="background-color: rgba(45,164,78,0.12);"
            >
              <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: #2DA44E;">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[15px] font-semibold font-display" style="color: var(--color-text);">Continue as Athlete</p>
              <p class="text-[12px] mt-0.5" style="color: var(--color-muted);">Track workouts, log sessions and view your progress</p>
            </div>
            <svg viewBox="0 0 24 24" class="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: var(--color-muted);">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>

        </div>

        <!-- Celebrating mascot hint -->
        <div class="flex flex-col items-center mt-10 gap-2">
          <img [src]="mascotCelebrating" alt="" class="w-14 h-14 object-contain" width="56" height="56" aria-hidden="true" />
          <p class="text-[12px] text-center" style="color: var(--color-muted);">No account needed. Just pick your role and go.</p>
        </div>

      </div>
    </div>
  `,
})
export class LoginPage {
  private readonly auth   = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly mascotMain        = MASCOT_MAIN;
  protected readonly mascotCelebrating = MASCOT_CELEBRATING;

  continue(role: UserRole): void {
    this.auth.login(role);
    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/my']);
    }
  }
}
