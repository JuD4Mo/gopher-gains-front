import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MascotComponent } from '../../shared/components/mascot.component';
import type { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, MascotComponent],
  template: `
    <div class="min-h-dvh flex" style="background-color: var(--color-base);">
      <!-- Left panel: form -->
      <div class="flex-1 flex flex-col justify-center px-8 py-16 max-w-md mx-auto w-full">
        <a routerLink="/" class="inline-flex items-center gap-1.5 text-[13px] font-medium mb-12 transition-colors w-fit" style="color: var(--color-muted);">
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
          Back to home
        </a>

        <div class="flex items-center gap-3 mb-10">
          <app-mascot variant="main" size="sm" alt="Gopher Gains" />
          <div>
            <p class="text-[15px] font-bold font-display tracking-tight leading-none" style="color: var(--color-text);">
              Gopher<span style="color: var(--color-accent);">Gains</span>
            </p>
            <p class="text-[11px] font-mono mt-0.5" style="color: var(--color-muted);">Fitness Platform</p>
          </div>
        </div>

        <h1 class="text-2xl font-bold font-display tracking-tight mb-1" style="color: var(--color-text);">Sign in</h1>
        <p class="text-sm mb-8" style="color: var(--color-muted);">Welcome back. Enter your details to continue.</p>

        <form (ngSubmit)="submitForm()" class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <label for="email" class="text-[13px] font-medium" style="color: var(--color-text);">Email</label>
            <input id="email" type="email" [(ngModel)]="email" name="email" placeholder="you@example.com" class="input" autocomplete="email" />
          </div>

          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <label for="password" class="text-[13px] font-medium" style="color: var(--color-text);">Password</label>
              <a href="#" class="text-[12px] transition-colors" style="color: var(--color-accent);">Forgot password?</a>
            </div>
            <input id="password" type="password" [(ngModel)]="password" name="password" placeholder="••••••••" class="input" autocomplete="current-password" />
          </div>

          @if (error()) {
            <p class="text-[13px] px-3 py-2.5 rounded-lg" style="background-color: rgba(207,34,46,0.1); color: #CF222E; border: 1px solid rgba(207,34,46,0.2);">{{ error() }}</p>
          }

          <button type="submit" class="btn-primary w-full py-3 text-[15px] mt-1" [disabled]="loading()">
            @if (loading()) {
              <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Signing in...
            } @else { Sign in }
          </button>
        </form>

        <div class="flex items-center gap-3 my-8">
          <div class="flex-1 h-px" style="background-color: var(--color-border);"></div>
          <span class="text-[11px] font-mono uppercase tracking-wider" style="color: var(--color-muted);">Demo access</span>
          <div class="flex-1 h-px" style="background-color: var(--color-border);"></div>
        </div>

        <div class="flex flex-col gap-3">
          <button (click)="demoLogin('admin')" class="group flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-150" style="background-color: var(--color-surface); border: 1px solid var(--color-border);">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style="background-color: rgba(61,184,255,0.12);">
              <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: var(--color-accent);"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[14px] font-semibold font-display" style="color: var(--color-text);">Continue as Admin</p>
              <p class="text-[12px] mt-0.5" style="color: var(--color-muted);">Manage exercises, routines and users</p>
            </div>
            <svg viewBox="0 0 24 24" class="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-50 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: var(--color-muted);"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          <button (click)="demoLogin('user')" class="group flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-150" style="background-color: var(--color-surface); border: 1px solid var(--color-border);">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style="background-color: rgba(125,211,252,0.12);">
              <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: #7DD3FC;"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[14px] font-semibold font-display" style="color: var(--color-text);">Continue as Athlete</p>
              <p class="text-[12px] mt-0.5" style="color: var(--color-muted);">Track workouts and log your sessions</p>
            </div>
            <svg viewBox="0 0 24 24" class="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-50 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: var(--color-muted);"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      <!-- Right panel -->
      <div class="hidden lg:flex flex-1 flex-col items-center justify-center px-12 py-16" style="background-color: var(--color-surface); border-left: 1px solid var(--color-border);">
        <app-mascot variant="celebrating" size="3xl" alt="Gopher celebrating" />
        <p class="text-2xl font-bold font-display tracking-tight text-center mb-3 mt-8" style="color: var(--color-text);">Your gains await.</p>
        <p class="text-[15px] text-center max-w-xs leading-relaxed" style="color: var(--color-muted);">Every session logged is a step forward. Sign in and keep your streak alive.</p>
      </div>
    </div>
  `,
})
export class LoginPage {
  private readonly auth   = inject(AuthService);
  private readonly router = inject(Router);

  protected email    = '';
  protected password = '';
  protected readonly loading = signal(false);
  protected readonly error   = signal('');

  submitForm(): void {
    this.error.set('');
    if (!this.email.trim()) { this.error.set('Please enter your email address.'); return; }
    if (!this.password.trim()) { this.error.set('Please enter your password.'); return; }
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      const role: UserRole = this.email.toLowerCase().startsWith('admin') ? 'admin' : 'user';
      this.auth.login(role);
      this.router.navigate([role === 'admin' ? '/admin' : '/my']);
    }, 600);
  }

  demoLogin(role: UserRole): void {
    this.auth.login(role);
    this.router.navigate([role === 'admin' ? '/admin' : '/my']);
  }
}
