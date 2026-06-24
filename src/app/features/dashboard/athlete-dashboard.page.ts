import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ExerciseService } from '../../services/exercise.service';
import { RoutineService } from '../../services/routine.service';
import { SessionService } from '../../services/session.service';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { catchError, of, forkJoin } from 'rxjs';
import type { WorkoutSession } from '../../models/session.model';
import type { Routine } from '../../models/routine.model';

const MASCOT_CELEBRATING = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gopher-celebrating-BZF4N0dTYgz8RsFhJeLbyonFVV35Lx.png';
const MASCOT_THINKING    = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gopher-thinking-Photoroom-0gguwoJ79ANQ0MBK9mrnlwsQY4QLkK.png';
const MASCOT_CLIPBOARD   = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gopher-clipboard-Photoroom-IsR5uV4PXCOFc4rG4gWb2fp9Og5EGF.png';

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

@Component({
  selector: 'app-athlete-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, SafeHtmlPipe],
  template: `
    <div class="p-6 lg:p-10 max-w-[1200px] mx-auto">

      <!-- ── Hero zone ── -->
      <div
        class="relative rounded-2xl overflow-hidden mb-8"
        style="background-color: var(--color-card); border: 1px solid var(--color-border);"
      >
        <div class="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style="background: linear-gradient(90deg, var(--color-accent) 0%, transparent 60%);"></div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 lg:p-8">
          <div class="flex-shrink-0">
            <img
              [src]="mascotCelebrating"
              alt="Gopher ready to train"
              class="w-32 h-32 sm:w-36 sm:h-36 object-contain"
              width="144"
              height="144"
            />
          </div>

          <div class="flex-1 min-w-0">
            <p class="text-[11px] font-mono font-semibold uppercase tracking-[0.12em] mb-1" style="color: var(--color-accent);">My Dashboard</p>
            <h1 class="text-2xl lg:text-3xl font-bold font-display tracking-tight leading-tight mb-1" style="color: var(--color-text);">
              Ready to train?
            </h1>
            <p class="text-sm" style="color: var(--color-muted);">
              @if (routines().length > 0) {
                {{ routines().length }} {{ routines().length === 1 ? 'routine' : 'routines' }} ready. Pick one and get moving.
              } @else {
                No routines yet. Create your first one to get started.
              }
            </p>
          </div>

          <div class="flex-shrink-0 flex flex-col gap-2 w-full sm:w-auto">
            <a
              routerLink="/sessions/new"
              class="btn-primary flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl"
            >
              <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.plus | safeHtml"></span>
              Start Session
            </a>
            <a
              routerLink="/sessions"
              class="btn-secondary flex items-center justify-center px-6 py-2.5 text-sm rounded-xl"
            >
              View History
            </a>
          </div>
        </div>

        <!-- Weekly bar -->
        <div
          class="flex items-center gap-3 px-6 lg:px-8 py-4"
          style="border-top: 1px solid var(--color-border); background-color: rgba(0,0,0,0.12);"
        >
          <span class="text-[11px] font-mono uppercase tracking-wider flex-shrink-0" style="color: var(--color-muted);">This Week</span>
          <div class="flex items-center gap-1.5 flex-1">
            @for (day of weekDays; track $index) {
              <div
                class="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono transition-all"
                [style.background-color]="$index <= todayIndex ? 'rgba(28,200,255,0.15)' : 'rgba(255,255,255,0.03)'"
                [style.border]="$index === todayIndex ? '1px solid rgba(28,200,255,0.6)' : '1px solid var(--color-border)'"
                [style.color]="$index <= todayIndex ? 'var(--color-accent)' : 'var(--color-muted)'"
              >
                {{ day }}
              </div>
            }
          </div>
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <span class="text-lg font-bold font-mono" style="color: var(--color-accent);">{{ totalSessionCount() }}</span>
            <span class="text-[11px] font-mono" style="color: var(--color-muted);">sessions</span>
          </div>
        </div>
      </div>

      <!-- ── Main content ── -->
      <div class="flex flex-col lg:flex-row gap-8">

        <!-- Left: routines + sessions -->
        <div class="flex-1 min-w-0 flex flex-col gap-8">

          <!-- My Routines -->
          <div class="rounded-xl" style="background-color: var(--color-card); border: 1px solid var(--color-border);">
            <div class="flex items-center justify-between px-6 py-4" style="border-bottom: 1px solid var(--color-border);">
              <p class="text-sm font-semibold font-display" style="color: var(--color-text);">My Routines</p>
              <a routerLink="/routines/new" class="text-[11px] font-mono transition-colors" style="color: var(--color-accent);">+ New routine</a>
            </div>

            @if (routines().length === 0) {
              <div class="flex flex-col items-center justify-center py-10 gap-3 px-6">
                <img [src]="mascotThinking" alt="No routines yet" class="w-28 h-28 object-contain" width="112" height="112" />
                <div class="text-center">
                  <p class="text-sm font-semibold font-display" style="color: var(--color-text);">No routines yet</p>
                  <p class="text-xs mt-1 max-w-xs leading-relaxed" style="color: var(--color-muted);">Create your first routine to start organizing your training.</p>
                </div>
                <a routerLink="/routines/new" class="btn-primary text-xs px-4 py-2">Create Routine</a>
              </div>
            } @else {
              <div class="divide-y" style="border-color: var(--color-border);">
                @for (r of routines(); track r.id) {
                  <a
                    [routerLink]="'/routines/' + r.id"
                    class="group flex items-center gap-4 px-6 py-4 transition-all duration-150 hover:bg-[var(--color-card-hover)]"
                  >
                    <div
                      class="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-105"
                      style="background-color: rgba(183,148,244,0.12); color: #B794F4;"
                    >
                      <div class="w-5 h-5 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.routines | safeHtml"></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold font-display leading-snug" style="color: var(--color-text);">{{ r.name }}</p>
                      @if (r.description) {
                        <p class="text-xs font-mono mt-0.5 truncate" style="color: var(--color-muted);">{{ r.description }}</p>
                      }
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0">
                      <a
                        routerLink="/sessions/new"
                        class="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all"
                        style="background-color: rgba(28,200,255,0.12); color: var(--color-accent); border: 1px solid rgba(28,200,255,0.2);"
                        (click)="$event.stopPropagation()"
                      >Start</a>
                      <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full opacity-30 group-hover:opacity-70 transition-opacity" style="color: var(--color-muted);" [innerHTML]="icons.chevronRight | safeHtml"></span>
                    </div>
                  </a>
                }
              </div>
            }
          </div>

          <!-- Recent Sessions -->
          <div class="rounded-xl" style="background-color: var(--color-card); border: 1px solid var(--color-border);">
            <div class="flex items-center justify-between px-6 py-4" style="border-bottom: 1px solid var(--color-border);">
              <p class="text-sm font-semibold font-display" style="color: var(--color-text);">Recent Sessions</p>
              <a routerLink="/sessions" class="text-[11px] font-mono transition-colors" style="color: var(--color-accent);">View all</a>
            </div>

            @if (recentSessions().length === 0) {
              <div class="flex flex-col items-center justify-center py-10 gap-3 px-6">
                <img [src]="mascotClipboard" alt="No sessions logged yet" class="w-28 h-28 object-contain" width="112" height="112" />
                <div class="text-center">
                  <p class="text-sm font-semibold font-display" style="color: var(--color-text);">No sessions logged yet</p>
                  <p class="text-xs mt-1 max-w-xs leading-relaxed" style="color: var(--color-muted);">Your training history appears here once you complete your first session.</p>
                </div>
                <a routerLink="/sessions/new" class="btn-primary text-xs px-4 py-2">Log First Session</a>
              </div>
            } @else {
              <div class="divide-y" style="border-color: var(--color-border);">
                @for (s of recentSessions(); track s.id) {
                  <a
                    [routerLink]="'/sessions/' + s.id"
                    class="group flex items-center gap-4 px-6 py-4 transition-all hover:bg-[var(--color-card-hover)]"
                  >
                    <div
                      class="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
                      style="background-color: rgba(246,201,14,0.1); color: #F6C90E;"
                    >
                      <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.sessions | safeHtml"></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium leading-snug truncate" style="color: var(--color-text);">
                        {{ s.observations || 'Workout session' }}
                      </p>
                      <p class="text-xs font-mono mt-0.5" style="color: var(--color-muted);">{{ s.startTime | date:'EEE, MMM d' }}</p>
                    </div>
                    <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full opacity-30 group-hover:opacity-70 transition-opacity" style="color: var(--color-muted);" [innerHTML]="icons.chevronRight | safeHtml"></span>
                  </a>
                }
              </div>
            }
          </div>

        </div>

        <!-- Right: stats -->
        <div class="lg:w-60 flex flex-col gap-8">

          <!-- Stats -->
          <div class="rounded-xl" style="background-color: var(--color-card); border: 1px solid var(--color-border);">
            <div class="px-5 py-4" style="border-bottom: 1px solid var(--color-border);">
              <p class="text-sm font-semibold font-display" style="color: var(--color-text);">Your Stats</p>
            </div>
            <div class="px-5 py-4 space-y-4">
              <div>
                <p class="text-[11px] font-mono uppercase tracking-wider mb-0.5" style="color: var(--color-muted);">Total Sessions</p>
                <p class="text-3xl font-bold font-mono" style="color: var(--color-text);">{{ totalSessionCount() }}</p>
              </div>
              <div class="h-px" style="background-color: var(--color-border);"></div>
              <div>
                <p class="text-[11px] font-mono uppercase tracking-wider mb-0.5" style="color: var(--color-muted);">My Routines</p>
                <p class="text-3xl font-bold font-mono" style="color: var(--color-text);">{{ routines().length }}</p>
              </div>
              <div class="h-px" style="background-color: var(--color-border);"></div>
              <div>
                <p class="text-[11px] font-mono uppercase tracking-wider mb-0.5" style="color: var(--color-muted);">Exercises</p>
                <p class="text-3xl font-bold font-mono" style="color: var(--color-text);">{{ exerciseCount() }}</p>
              </div>
            </div>
          </div>



        </div>
      </div>
    </div>
  `,
})
export class AthleteDashboardPage implements OnInit {
  private readonly exerciseService = inject(ExerciseService);
  private readonly routineService  = inject(RoutineService);
  private readonly sessionService  = inject(SessionService);

  protected readonly icons             = ICONS;
  protected readonly mascotCelebrating = MASCOT_CELEBRATING;
  protected readonly mascotThinking    = MASCOT_THINKING;
  protected readonly mascotClipboard   = MASCOT_CLIPBOARD;
  protected readonly weekDays          = WEEK_DAYS;
  protected readonly todayIndex        = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  protected readonly totalSessionCount = signal(0);
  protected readonly exerciseCount     = signal(0);
  protected readonly recentSessions    = signal<WorkoutSession[]>([]);
  protected readonly routines          = signal<Routine[]>([]);

  ngOnInit() {
    forkJoin({
      sessions:  this.sessionService.getAll({ limit: 5 }).pipe(catchError(() => of(null))),
      exercises: this.exerciseService.getAll({ limit: 1 }).pipe(catchError(() => of(null))),
      routines:  this.routineService.getAll({ limit: 20 }).pipe(catchError(() => of(null))),
    }).subscribe({
      next: (result) => {
        this.recentSessions.set(result.sessions?.data ?? []);
        this.totalSessionCount.set(result.sessions?.meta?.totalCount ?? 0);
        this.exerciseCount.set(result.exercises?.meta?.totalCount ?? 0);
        this.routines.set(result.routines?.data ?? []);
      },
    });
  }
}
