import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

const MASCOT_MAIN       = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gopher-Gains-Logo-v1-Photoroom-WfSlqGUxq90Xa0oAPjDPNoaGcCYtXQ.png';
const MASCOT_CLIPBOARD  = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gopher-clipboard-Photoroom-IsR5uV4PXCOFc4rG4gWb2fp9Og5EGF.png';
const MASCOT_CELEBRATING = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gopher-celebrating-BZF4N0dTYgz8RsFhJeLbyonFVV35Lx.png';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-dvh flex flex-col" style="background-color: var(--color-base); color: var(--color-text);">

      <!-- ── Nav ── -->
      <header class="flex items-center justify-between px-6 md:px-12 h-16 flex-shrink-0" style="border-bottom: 1px solid var(--color-border);">
        <div class="flex items-center gap-2.5">
          <img [src]="mascotMain" alt="Gopher Gains" class="w-8 h-8 object-contain" width="32" height="32" />
          <span class="text-[15px] font-bold font-display tracking-tight">
            Gopher<span style="color: var(--color-accent);">Gains</span>
          </span>
        </div>
        <a
          routerLink="/login"
          class="text-[13px] font-semibold px-4 py-2 rounded-lg transition-all"
          style="background-color: var(--color-accent); color: #fff;"
        >Sign in</a>
      </header>

      <!-- ── Hero ── -->
      <section class="flex-1 flex flex-col items-center justify-center px-6 py-20 md:py-28 text-center">
        <div class="max-w-2xl mx-auto">

          <!-- Mascot -->
          <div class="flex justify-center mb-8">
            <img
              [src]="mascotMain"
              alt="Gopher Gains mascot lifting dumbbells"
              class="w-36 h-36 md:w-44 md:h-44 object-contain"
              width="176"
              height="176"
            />
          </div>

          <p class="text-[12px] font-mono font-semibold uppercase tracking-[0.15em] mb-4" style="color: var(--color-accent);">
            Personal Fitness Platform
          </p>

          <h1 class="text-4xl md:text-6xl font-bold font-display tracking-tight leading-tight mb-6" style="color: var(--color-text);">
            Train smarter.<br />
            <span style="color: var(--color-accent);">Track everything.</span>
          </h1>

          <p class="text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-10" style="color: var(--color-muted);">
            Gopher Gains puts your training data in one place. Build routines, log sessions, and watch your progress compound over time.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              routerLink="/login"
              class="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-[15px] transition-all"
              style="background-color: var(--color-accent); color: #fff;"
            >
              Get started
            </a>
            <a
              routerLink="/login"
              class="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-[15px] transition-all"
              style="border: 1px solid var(--color-border); color: var(--color-text);"
            >
              View demo
            </a>
          </div>
        </div>
      </section>

      <!-- ── Features ── -->
      <section class="px-6 md:px-12 py-20 md:py-24" style="border-top: 1px solid var(--color-border);">
        <div class="max-w-5xl mx-auto">
          <p class="text-[11px] font-mono font-semibold uppercase tracking-[0.15em] text-center mb-3" style="color: var(--color-accent);">Why Gopher Gains</p>
          <h2 class="text-3xl md:text-4xl font-bold font-display tracking-tight text-center mb-16" style="color: var(--color-text);">
            Built around your training
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

            <!-- Feature 1 -->
            <div class="flex flex-col items-start p-7 rounded-2xl" style="background-color: var(--color-card); border: 1px solid var(--color-border);">
              <img [src]="mascotClipboard" alt="Plan your training" class="w-16 h-16 object-contain mb-5" width="64" height="64" />
              <h3 class="text-[16px] font-bold font-display mb-2" style="color: var(--color-text);">Build your routines</h3>
              <p class="text-[14px] leading-relaxed" style="color: var(--color-muted);">
                Create routines from your exercise library. Organize sets, reps, and rest times exactly how you want.
              </p>
            </div>

            <!-- Feature 2 -->
            <div class="flex flex-col items-start p-7 rounded-2xl" style="background-color: var(--color-card); border: 1px solid var(--color-border);">
              <img [src]="mascotMain" alt="Log every session" class="w-16 h-16 object-contain mb-5" width="64" height="64" />
              <h3 class="text-[16px] font-bold font-display mb-2" style="color: var(--color-text);">Log every session</h3>
              <p class="text-[14px] leading-relaxed" style="color: var(--color-muted);">
                Track every workout with precision. Your session history becomes your most valuable training asset.
              </p>
            </div>

            <!-- Feature 3 -->
            <div class="flex flex-col items-start p-7 rounded-2xl" style="background-color: var(--color-card); border: 1px solid var(--color-border);">
              <img [src]="mascotCelebrating" alt="Celebrate progress" class="w-16 h-16 object-contain mb-5" width="64" height="64" />
              <h3 class="text-[16px] font-bold font-display mb-2" style="color: var(--color-text);">See your progress</h3>
              <p class="text-[14px] leading-relaxed" style="color: var(--color-muted);">
                Personal records, weekly streaks, and consistency metrics. Proof that your hard work is paying off.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Stats banner ── -->
      <section class="px-6 md:px-12 py-16" style="background-color: var(--color-surface); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
        <div class="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <p class="text-4xl font-bold font-mono tracking-tight mb-1" style="color: var(--color-accent);">100%</p>
            <p class="text-[13px] font-medium" style="color: var(--color-muted);">Your data, your ownership</p>
          </div>
          <div>
            <p class="text-4xl font-bold font-mono tracking-tight mb-1" style="color: var(--color-accent);">0</p>
            <p class="text-[13px] font-medium" style="color: var(--color-muted);">Coach dependency</p>
          </div>
          <div>
            <p class="text-4xl font-bold font-mono tracking-tight mb-1" style="color: var(--color-accent);">&#x221E;</p>
            <p class="text-[13px] font-medium" style="color: var(--color-muted);">Exercises in your library</p>
          </div>
        </div>
      </section>

      <!-- ── CTA ── -->
      <section class="px-6 md:px-12 py-24 text-center">
        <div class="max-w-xl mx-auto">
          <img [src]="mascotCelebrating" alt="Get started" class="w-24 h-24 object-contain mx-auto mb-6" width="96" height="96" />
          <h2 class="text-3xl md:text-4xl font-bold font-display tracking-tight mb-4" style="color: var(--color-text);">
            Ready to start gaining?
          </h2>
          <p class="text-[15px] mb-8" style="color: var(--color-muted);">
            Sign in and start logging your first session today.
          </p>
          <a
            routerLink="/login"
            class="inline-flex items-center justify-center px-10 py-4 rounded-xl font-bold text-[16px] transition-all"
            style="background-color: var(--color-accent); color: #fff;"
          >
            Sign in to Gopher Gains
          </a>
        </div>
      </section>

      <!-- ── Footer ── -->
      <footer class="px-6 md:px-12 py-8 text-center" style="border-top: 1px solid var(--color-border);">
        <div class="flex items-center justify-center gap-2 mb-2">
          <img [src]="mascotMain" alt="" class="w-5 h-5 object-contain" width="20" height="20" aria-hidden="true" />
          <span class="text-[13px] font-bold font-display">
            Gopher<span style="color: var(--color-accent);">Gains</span>
          </span>
        </div>
        <p class="text-[12px]" style="color: var(--color-muted);">Your training. Your progress. Your gains.</p>
      </footer>

    </div>
  `,
})
export class LandingPage {
  protected readonly mascotMain        = MASCOT_MAIN;
  protected readonly mascotClipboard   = MASCOT_CLIPBOARD;
  protected readonly mascotCelebrating = MASCOT_CELEBRATING;
}
