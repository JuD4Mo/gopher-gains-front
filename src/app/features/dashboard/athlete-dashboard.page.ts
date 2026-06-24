import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ExerciseService } from '../../services/exercise.service';
import { RoutineService } from '../../services/routine.service';
import { SessionService } from '../../services/session.service';
import { UserRoutineService } from '../../services/user-routine.service';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { catchError, of, forkJoin } from 'rxjs';
import type { WorkoutSession } from '../../models/session.model';
import type { UserRoutine } from '../../models/user-routine.model';

const MASCOT_CELEBRATING = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gopher-celebrating-BZF4N0dTYgz8RsFhJeLbyonFVV35Lx.png';
const MASCOT_THINKING    = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gopher-thinking-Photoroom-0gguwoJ79ANQ0MBK9mrnlwsQY4QLkK.png';
const MASCOT_CLIPBOARD   = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gopher-clipboard-Photoroom-IsR5uV4PXCOFc4rG4gWb2fp9Og5EGF.png';

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

@Component({
  selector: 'app-athlete-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, SafeHtmlPipe],
  template: `
    <div class="p-6 lg:p-8 max-w-[1200px] mx-auto">

      <!-- ── Hero zone ── -->
      <div
        class="relative rounded-2xl overflow-hidden mb-7"
        style="background-color: var(--color-card); border: 1px solid var(--color-border);"
      >
        <!-- Subtle horizontal rule accent -->
        <div class="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style="background: linear-gradient(90deg, var(--color-accent) 0%, transparent 60%);"></div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 lg:p-8">
          <!-- Mascot -->
          <div class="flex-shrink-0 relative">
            <img
              [src]="mascotCelebrating"
              alt="Gopher celebrating"
              class="w-24 h-24 object-contain drop-shadow-xl"
              width="96"
              height="96"
            />
          </div>

          <!-- Copy -->
          <div class="flex-1 min-w-0">
            <p class="text-[11px] font-mono font-semibold uppercase tracking-[0.12em] mb-1" style="color: var(--color-accent);">Athlete Portal</p>
            <h1 class="text-2xl lg:text-3xl font-bold font-display tracking-tight leading-tight mb-1" style="color: var(--color-text);">
              Ready to train?
            </h1>
            <p class="text-sm" style="color: var(--color-muted);">
              {{ assignedRoutines().length > 0
                ? assignedRoutines().length + ' routine' + (assignedRoutines().length > 1 ? 's' : '') + ' assigned. Let\'s get moving.'
                : 'No routines assigned yet. Check with your coach.' }}
            </p>
          </div>

          <!-- Primary CTA -->
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
              class="btn-secondary flex items-center justify-center gap-2 px-6 py-2.5 text-sm rounded-xl"
            >
              View History
            </a>
          </div>
        </div>

        <!-- Weekly streak bar -->
        <div
          class="flex items-center gap-3 px-6 lg:px-8 py-4"
          style="border-top: 1px solid var(--color-border); background-color: rgba(0,0,0,0.15);"
        >
          <span class="text-[11px] font-mono uppercase tracking-wider flex-shrink-0" style="color: var(--color-muted);">This Week</span>
          <div class="flex items-center gap-1.5 flex-1">
            @for (day of weekDays; track $index) {
              <div class="flex flex-col items-center gap-1">
                <div
                  class="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono transition-all"
                  [style.background-color]="$index <= todayIndex ? 'rgba(0,172,215,0.15)' : 'rgba(255,255,255,0.03)'"
                  [style.border]="$index === todayIndex ? '1px solid rgba(0,172,215,0.6)' : '1px solid var(--color-border)'"
                  [style.color]="$index <= todayIndex ? 'var(--color-accent)' : 'var(--color-muted)'"
                >
                  {{ day }}
                </div>
              </div>
            }
          </div>
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <span class="text-lg font-bold font-mono" style="color: var(--color-accent);">{{ userSessionCount() }}</span>
            <span class="text-[11px] font-mono" style="color: var(--color-muted);">sessions</span>
          </div>
        </div>
      </div>

      <!-- ── Main content: 2-col asymmetric ── -->
      <div class="flex flex-col lg:flex-row gap-6">

        <!-- Left: routines (wider) -->
        <div class="flex-1 min-w-0 flex flex-col gap-5">

          <!-- My Routines -->
          <div
            class="rounded-xl"
            style="background-color: var(--color-card); border: 1px solid var(--color-border);"
          >
            <div class="flex items-center justify-between px-6 py-4" style="border-bottom: 1px solid var(--color-border);">
              <p class="text-sm font-semibold font-display" style="color: var(--color-text);">My Routines</p>
              <a routerLink="/routines" class="text-[11px] font-mono transition-colors" style="color: var(--color-accent);">Browse all</a>
            </div>

            @if (assignedRoutines().length === 0) {
              <div class="flex flex-col items-center justify-center py-10 gap-3">
                <img [src]="mascotThinking" alt="Gopher thinking" class="w-28 h-28 object-contain" width="112" height="112" />
                <div class="text-center">
                  <p class="text-sm font-semibold font-display" style="color: var(--color-text);">No routines yet</p>
                  <p class="text-xs mt-1 max-w-xs leading-relaxed" style="color: var(--color-muted);">Create your first routine and start building your training program.</p>
                </div>
                <a routerLink="/routines/new" class="btn-primary text-xs px-4 py-2">Create a Routine</a>
              </div>
            } @else {
              <div class="divide-y" style="border-color: var(--color-border);">
                @for (r of assignedRoutines(); track r.routineId) {
                  <a
                    [routerLink]="'/routines/' + r.routineId"
                    class="group flex items-center gap-4 px-6 py-4 transition-all duration-150 hover:bg-[var(--color-card-hover)]"
                  >
                    <!-- Routine icon -->
                    <div
                      class="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-105"
                      style="background-color: rgba(183,148,244,0.12); color: #B794F4;"
                    >
                      <div class="w-5 h-5 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.routines | safeHtml"></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold font-display leading-snug" style="color: var(--color-text);">
                        {{ routineNames()[r.routineId] ?? 'Routine #' + r.routineId }}
                      </p>
                      <p class="text-xs font-mono mt-0.5" style="color: var(--color-muted);">
                        Assigned {{ r.assignedAt | date:'MMM d, yyyy' }}
                      </p>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0">
                      <a
                        [routerLink]="'/sessions/new'"
                        class="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all"
                        style="background-color: rgba(0,172,215,0.12); color: var(--color-accent); border: 1px solid rgba(0,172,215,0.2);"
                        (click)="$event.stopPropagation()"
                      >
                        Start
                      </a>
                      <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full opacity-40 group-hover:opacity-80 transition-opacity" style="color: var(--color-muted);" [innerHTML]="icons.chevronRight | safeHtml"></span>
                    </div>
                  </a>
                }
              </div>
            }
          </div>

          <!-- Recent Sessions -->
          <div
            class="rounded-xl"
            style="background-color: var(--color-card); border: 1px solid var(--color-border);"
          >
            <div class="flex items-center justify-between px-6 py-4" style="border-bottom: 1px solid var(--color-border);">
              <p class="text-sm font-semibold font-display" style="color: var(--color-text);">Recent Sessions</p>
              <a routerLink="/sessions" class="text-[11px] font-mono transition-colors" style="color: var(--color-accent);">View all</a>
            </div>

            @if (recentSessions().length === 0) {
              <div class="flex flex-col items-center justify-center py-10 gap-3">
                <img [src]="mascotClipboard" alt="Gopher with clipboard" class="w-28 h-28 object-contain" width="112" height="112" />
                <div class="text-center">
                  <p class="text-sm font-semibold font-display" style="color: var(--color-text);">No sessions logged yet</p>
                  <p class="text-xs mt-1 max-w-xs leading-relaxed" style="color: var(--color-muted);">Your training history will appear here once you complete your first session.</p>
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
                      <p class="text-xs font-mono mt-0.5" style="color: var(--color-muted);">
                        {{ s.startTime | date:'EEE, MMM d' }}
                      </p>
                    </div>
                    <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full opacity-30 group-hover:opacity-70 transition-opacity" style="color: var(--color-muted);" [innerHTML]="icons.chevronRight | safeHtml"></span>
                  </a>
                }
              </div>
            }
          </div>

        </div>

        <!-- Right column: stats + quick nav -->
        <div class="lg:w-64 flex flex-col gap-5">

          <!-- Personal stats -->
          <div
            class="rounded-xl"
            style="background-color: var(--color-card); border: 1px solid var(--color-border);"
          >
            <div class="px-5 py-4" style="border-bottom: 1px solid var(--color-border);">
              <p class="text-sm font-semibold font-display" style="color: var(--color-text);">Your Stats</p>
            </div>
            <div class="px-5 py-4 space-y-4">
              <div>
                <p class="text-[11px] font-mono uppercase tracking-wider mb-0.5" style="color: var(--color-muted);">Total Sessions</p>
                <p class="text-3xl font-bold font-mono" style="color: var(--color-text);">{{ userSessionCount() }}</p>
              </div>
              <div class="h-px" style="background-color: var(--color-border);"></div>
              <div>
                <p class="text-[11px] font-mono uppercase tracking-wider mb-0.5" style="color: var(--color-muted);">Routines</p>
                <p class="text-3xl font-bold font-mono" style="color: var(--color-text);">{{ assignedRoutines().length }}</p>
              </div>
              <div class="h-px" style="background-color: var(--color-border);"></div>
              <div>
                <p class="text-[11px] font-mono uppercase tracking-wider mb-0.5" style="color: var(--color-muted);">Exercises Available</p>
                <p class="text-3xl font-bold font-mono" style="color: var(--color-text);">{{ userExerciseCount() }}</p>
              </div>
            </div>
          </div>

          <!-- Quick navigation -->
          <div
            class="rounded-xl"
            style="background-color: var(--color-card); border: 1px solid var(--color-border);"
          >
            <div class="px-5 py-4" style="border-bottom: 1px solid var(--color-border);">
              <p class="text-sm font-semibold font-display" style="color: var(--color-text);">Quick Nav</p>
            </div>
            <div class="p-3 space-y-1">
              @for (nav of athleteQuickNav; track nav.label) {
                <a
                  [routerLink]="nav.route"
                  class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group"
                >
                  <div
                    class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    [style.background-color]="nav.accent + '15'"
                    [style.color]="nav.accent"
                  >
                    <div class="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="nav.icon | safeHtml"></div>
                  </div>
                  <span class="text-[13px] font-medium flex-1" style="color: var(--color-text);">{{ nav.label }}</span>
                  <span class="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full opacity-0 group-hover:opacity-60 transition-opacity" style="color: var(--color-muted);" [innerHTML]="icons.chevronRight | safeHtml"></span>
                </a>
              }
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
})
export class AthleteDashboardPage implements OnInit {
  private readonly exerciseService = inject(ExerciseService);
  private readonly routineService = inject(RoutineService);
  private readonly sessionService = inject(SessionService);
  private readonly userRoutineService = inject(UserRoutineService);

  protected readonly icons = ICONS;
  protected readonly mascotCelebrating = MASCOT_CELEBRATING;
  protected readonly mascotThinking    = MASCOT_THINKING;
  protected readonly mascotClipboard   = MASCOT_CLIPBOARD;
  protected readonly weekDays = WEEK_DAYS;
  protected readonly todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  protected readonly userSessionCount = signal(0);
  protected readonly userExerciseCount = signal(0);
  protected readonly recentSessions = signal<WorkoutSession[]>([]);
  protected readonly assignedRoutines = signal<UserRoutine[]>([]);
  protected readonly routineNames = signal<Record<number, string>>({});

  protected readonly athleteQuickNav = [
    { label: 'Browse Exercises', route: '/exercises', icon: ICONS.exercises, accent: '#00ACD7' },
    { label: 'View Routines', route: '/routines', icon: ICONS.routines, accent: '#B794F4' },
    { label: 'All Sessions', route: '/sessions', icon: ICONS.sessions, accent: '#F6C90E' },
    { label: 'Start Session', route: '/sessions/new', icon: ICONS.plus, accent: '#2DA44E' },
  ];

  ngOnInit() {
    const userId = 1;
    forkJoin({
      sessions:    this.sessionService.getAll({ userId, limit: 5 }).pipe(catchError(() => of(null))),
      exercises:   this.exerciseService.getAll({ limit: 1 }).pipe(catchError(() => of(null))),
      routines:    this.userRoutineService.getByUser(userId).pipe(catchError(() => of(null))),
      allRoutines: this.routineService.getAll({ limit: 100 }).pipe(catchError(() => of(null))),
    }).subscribe({
      next: (result) => {
        this.recentSessions.set(result.sessions?.data ?? []);
        this.userSessionCount.set(result.sessions?.meta?.totalCount ?? 0);
        this.userExerciseCount.set(result.exercises?.meta?.totalCount ?? 0);

        const assignments = result.routines?.data ?? [];
        this.assignedRoutines.set(assignments);

        if (result.allRoutines?.data) {
          const names: Record<number, string> = {};
          for (const r of result.allRoutines.data) names[r.id] = r.name;
          this.routineNames.set(names);
        }
      },
    });
  }
}
