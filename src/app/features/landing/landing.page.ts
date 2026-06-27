import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MascotComponent } from '../../shared/components/mascot.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, MascotComponent],
  template: `
    <div class="min-h-dvh flex flex-col" style="background-color: var(--color-base); color: var(--color-text);">

      <!-- Nav -->
      <header class="flex items-center justify-between px-6 md:px-12 h-16 flex-shrink-0 sticky top-0 z-10" style="background-color: rgba(16,20,24,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid var(--color-border);">
        <div class="flex items-center gap-3">
          <app-mascot variant="main" size="sm" alt="Gopher Gains" />
          <div class="flex flex-col leading-none">
            <span class="text-[14px] font-bold font-display tracking-tight">
              Gopher<span style="color: var(--color-accent);">Gains</span>
            </span>
            <span class="text-[10px] font-mono tracking-wide uppercase" style="color: var(--color-muted);">Fitness Platform</span>
          </div>
        </div>
        <a routerLink="/login" class="btn-primary text-[13px] px-5 py-2">Sign in</a>
      </header>

      <!-- Hero -->
      <section class="flex flex-col items-center justify-center px-6 py-28 md:py-36 text-center">
        <div class="max-w-2xl mx-auto">
          <p class="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] mb-6" style="color: var(--color-accent);">
            Personal Fitness Platform
          </p>

          <div class="flex justify-center mb-10">
            <app-mascot variant="main" size="3xl" alt="Gopher Gains mascot lifting" />
          </div>

          <h1 class="text-4xl md:text-6xl font-bold font-display tracking-tight leading-[1.08] mb-6" style="color: var(--color-text);">
            Train smarter.<br />
            <span style="color: var(--color-accent);">Track everything.</span>
          </h1>

          <p class="text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-12" style="color: var(--color-muted);">
            Gopher Gains puts your training data in one place. Build routines, log sessions, and watch your progress compound over time.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a routerLink="/login" class="btn-primary w-full sm:w-auto px-8 py-3.5 text-[15px] rounded-xl">Get started</a>
            <a routerLink="/login" class="btn-secondary w-full sm:w-auto px-8 py-3.5 text-[15px] rounded-xl">View demo</a>
          </div>
        </div>
      </section>

      <!-- Features: Built around your training -->
      <section class="px-6 md:px-12 py-24 md:py-28" style="border-top: 1px solid var(--color-border);">
        <div class="max-w-5xl mx-auto">
          <p class="text-[11px] font-mono font-semibold uppercase tracking-[0.15em] text-center mb-4" style="color: var(--color-accent);">Why Gopher Gains</p>
          <h2 class="text-3xl md:text-4xl font-bold font-display tracking-tight text-center mb-16" style="color: var(--color-text);">
            Built around your training
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="flex flex-col items-start p-8 rounded-2xl" style="background-color: var(--color-surface); border: 1px solid var(--color-border);">
              <app-mascot variant="clipboard" size="lg" alt="" />
              <h3 class="text-[17px] font-bold font-display mb-3 mt-6" style="color: var(--color-text);">Build your routines</h3>
              <p class="text-[14px] leading-relaxed" style="color: var(--color-muted);">
                Create routines from your exercise library. Organize sets, reps, and rest times exactly how you want.
              </p>
            </div>

            <div class="flex flex-col items-start p-8 rounded-2xl" style="background-color: var(--color-surface); border: 1px solid var(--color-border);">
              <app-mascot variant="main" size="lg" alt="" />
              <h3 class="text-[17px] font-bold font-display mb-3 mt-6" style="color: var(--color-text);">Log every session</h3>
              <p class="text-[14px] leading-relaxed" style="color: var(--color-muted);">
                Track every workout with precision. Your session history becomes your most valuable training asset.
              </p>
            </div>

            <div class="flex flex-col items-start p-8 rounded-2xl" style="background-color: var(--color-surface); border: 1px solid var(--color-border);">
              <app-mascot variant="celebrating" size="lg" alt="" />
              <h3 class="text-[17px] font-bold font-display mb-3 mt-6" style="color: var(--color-text);">See your progress</h3>
              <p class="text-[14px] leading-relaxed" style="color: var(--color-muted);">
                Personal records, weekly streaks, and consistency metrics. Proof that your hard work is paying off.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats banner -->
      <section class="px-6 md:px-12 py-16" style="background-color: var(--color-surface); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
        <div class="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
          <div>
            <p class="text-4xl font-bold font-mono tracking-tight mb-2" style="color: var(--color-accent);">100%</p>
            <p class="text-[14px] font-medium" style="color: var(--color-muted);">Your data, your ownership</p>
          </div>
          <div>
            <p class="text-4xl font-bold font-mono tracking-tight mb-2" style="color: var(--color-accent);">Free</p>
            <p class="text-[14px] font-medium" style="color: var(--color-muted);">No subscriptions required</p>
          </div>
          <div>
            <p class="text-4xl font-bold font-mono tracking-tight mb-2" style="color: var(--color-accent);">&infin;</p>
            <p class="text-[14px] font-medium" style="color: var(--color-muted);">Exercises in your library</p>
          </div>
        </div>
      </section>

      <!-- How it works -->
      <section class="px-6 md:px-12 py-24 md:py-28" style="border-bottom: 1px solid var(--color-border);">
        <div class="max-w-3xl mx-auto">
          <p class="text-[11px] font-mono font-semibold uppercase tracking-[0.15em] text-center mb-4" style="color: var(--color-accent);">How it works</p>
          <h2 class="text-3xl md:text-4xl font-bold font-display tracking-tight text-center mb-16" style="color: var(--color-text);">Three steps to progress</h2>

          <div class="flex flex-col gap-12">
            <div class="flex items-start gap-8">
              <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold font-mono text-lg" style="background-color: var(--color-accent-dim); color: var(--color-accent); border: 1px solid rgba(61,184,255,0.25);">1</div>
              <div class="pt-1">
                <h3 class="text-[17px] font-bold font-display mb-2" style="color: var(--color-text);">Build your exercise library</h3>
                <p class="text-[14px] leading-relaxed" style="color: var(--color-muted);">Add the exercises you actually do. Name them, categorize them, and build your personal catalog.</p>
              </div>
            </div>

            <div class="flex items-start gap-8">
              <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold font-mono text-lg" style="background-color: var(--color-accent-dim); color: var(--color-accent); border: 1px solid rgba(61,184,255,0.25);">2</div>
              <div class="pt-1">
                <h3 class="text-[17px] font-bold font-display mb-2" style="color: var(--color-text);">Create training routines</h3>
                <p class="text-[14px] leading-relaxed" style="color: var(--color-muted);">Group exercises into routines. Push day, pull day, leg day — structure your week your way.</p>
              </div>
            </div>

            <div class="flex items-start gap-8">
              <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold font-mono text-lg" style="background-color: var(--color-accent-dim); color: var(--color-accent); border: 1px solid rgba(61,184,255,0.25);">3</div>
              <div class="pt-1">
                <h3 class="text-[17px] font-bold font-display mb-2" style="color: var(--color-text);">Log sessions and track progress</h3>
                <p class="text-[14px] leading-relaxed" style="color: var(--color-muted);">Record every workout. Watch your session count grow and your numbers improve over time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="px-6 md:px-12 py-28 text-center">
        <div class="max-w-lg mx-auto">
          <app-mascot variant="celebrating" size="2xl" alt="Gopher celebrating" />
          <h2 class="text-3xl md:text-4xl font-bold font-display tracking-tight mb-4 mt-8" style="color: var(--color-text);">
            Ready to start gaining?
          </h2>
          <p class="text-[15px] mb-10 leading-relaxed" style="color: var(--color-muted);">
            Sign in and start logging your first session today. No coach needed.
          </p>
          <a routerLink="/login" class="btn-primary inline-flex items-center justify-center px-10 py-4 text-[16px] rounded-xl">
            Sign in to Gopher Gains
          </a>
        </div>
      </section>

      <!-- Footer -->
      <footer class="px-6 md:px-12 py-8 text-center" style="border-top: 1px solid var(--color-border);">
        <div class="flex items-center justify-center gap-2.5 mb-2">
          <app-mascot variant="main" size="xs" alt="" />
          <span class="text-[14px] font-bold font-display tracking-tight">
            Gopher<span style="color: var(--color-accent);">Gains</span>
          </span>
        </div>
        <p class="text-[12px]" style="color: var(--color-muted);">Your training. Your progress. Your gains.</p>
      </footer>
    </div>
  `,
})
export class LandingPage {}
