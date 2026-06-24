import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CardComponent } from '../../shared/components/card.component';
import { ExerciseService } from '../../services/exercise.service';
import { RoutineService } from '../../services/routine.service';
import { UserService } from '../../services/user.service';
import { SessionService } from '../../services/session.service';
import { UserRoutineService } from '../../services/user-routine.service';
import { AuthService } from '../../core/services/auth.service';
import { catchError, of, forkJoin } from 'rxjs';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { ICONS } from '../../shared/icons';
import type { WorkoutSession } from '../../models/session.model';
import type { UserRoutine } from '../../models/user-routine.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, CardComponent, SafeHtmlPipe, EmptyStateComponent],
  template: `
    @if (auth.currentRole() === 'admin') {
      <!-- ── ADMIN DASHBOARD ─────────────────────────────── -->
      <div class="space-y-7">

        <!-- Greeting -->
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold font-display" style="color: var(--color-text);">
              Good day, Admin
            </h2>
            <p class="text-sm mt-0.5" style="color: var(--color-muted);">
              Here is a summary of your Gopher Gains platform.
            </p>
          </div>
          <div
            class="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-xs"
            style="background-color: var(--color-accent-dim); color: var(--color-accent); border: 1px solid rgba(0,172,215,0.2);"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
            admin mode
          </div>
        </div>

        <!-- Stat cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          @for (stat of stats(); track stat.label) {
            <a
              [routerLink]="stat.link"
              class="card p-5 group block transition-all duration-200 hover:shadow-card-hover"
              [style.border-left]="'3px solid ' + stat.accentColor"
            >
              <div class="flex items-start justify-between mb-4">
                <div
                  class="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110 [&>div]:w-4.5 [&>div]:h-4.5"
                  [style.background-color]="stat.accentColor + '20'"
                  [style.color]="stat.accentColor"
                >
                  <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="stat.icon | safeHtml"></div>
                </div>
              </div>
              <p class="text-3xl font-bold font-mono tracking-tight" style="color: var(--color-text);">{{ stat.count }}</p>
              <p class="section-label mt-1">{{ stat.label }}</p>
            </a>
          }
        </div>

        <!-- Quick actions + overview -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="card p-5">
            <h3 class="text-sm font-semibold font-display mb-4" style="color: var(--color-text);">Quick Actions</h3>
            <div class="grid grid-cols-2 gap-3">
              @for (action of adminActions; track action.label) {
                <a
                  [routerLink]="action.route"
                  class="flex flex-col gap-2 p-4 rounded-lg transition-all duration-150 group"
                  style="border: 1px solid var(--color-border);"
                  [style.--hover-color]="action.color"
                >
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                    [style.background-color]="action.color + '18'"
                    [style.color]="action.color"
                  >
                    <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.plus | safeHtml"></div>
                  </div>
                  <span class="text-sm font-medium font-display" style="color: var(--color-text);">{{ action.label }}</span>
                  <span class="text-xs" style="color: var(--color-muted);">{{ action.desc }}</span>
                </a>
              }
            </div>
          </div>

          <div class="card p-5">
            <h3 class="text-sm font-semibold font-display mb-4" style="color: var(--color-text);">Platform Overview</h3>
            <div class="space-y-1">
              @for (stat of stats(); track stat.label) {
                <div
                  class="flex items-center justify-between py-3 transition-colors"
                  style="border-bottom: 1px solid var(--color-border);"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-2 h-2 rounded-full flex-shrink-0" [style.background-color]="stat.accentColor"></div>
                    <span class="text-sm" style="color: var(--color-muted);">{{ stat.label }}</span>
                  </div>
                  <span class="text-sm font-bold font-mono" style="color: var(--color-text);">{{ stat.count }}</span>
                </div>
              }
            </div>
            <a
              routerLink="/assignments"
              class="flex items-center justify-between pt-4 text-sm font-medium transition-colors group"
              style="color: var(--color-accent);"
            >
              <span>View all assignments</span>
              <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full group-hover:translate-x-0.5 transition-transform" [innerHTML]="icons.chevronRight | safeHtml"></span>
            </a>
          </div>
        </div>

      </div>
    } @else {
      <!-- ── USER DASHBOARD ──────────────────────────────── -->
      <div class="space-y-7">

        <!-- Greeting + primary CTA -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold font-display" style="color: var(--color-text);">Your Progress</h2>
            <p class="text-sm mt-0.5" style="color: var(--color-muted);">Keep pushing. Here is your current status.</p>
          </div>
          <!-- Primary CTA: dominant, top-right, always visible -->
          <a
            routerLink="/sessions/new"
            class="btn-primary self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 text-sm"
          >
            <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.plus | safeHtml"></span>
            Start Session
          </a>
        </div>

        <!-- User stat cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="card p-5" style="border-left: 3px solid var(--color-accent);">
            <div class="flex items-start justify-between mb-4">
              <div class="w-9 h-9 rounded-lg flex items-center justify-center" style="background-color: var(--color-accent-dim); color: var(--color-accent);">
                <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.sessions | safeHtml"></div>
              </div>
            </div>
            <p class="text-3xl font-bold font-mono" style="color: var(--color-text);">{{ userSessionCount() }}</p>
            <p class="section-label mt-1">My Sessions</p>
          </div>
          <div class="card p-5" style="border-left: 3px solid #B794F4;">
            <div class="flex items-start justify-between mb-4">
              <div class="w-9 h-9 rounded-lg flex items-center justify-center" style="background-color: rgba(183,148,244,0.12); color: #B794F4;">
                <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.routines | safeHtml"></div>
              </div>
            </div>
            <p class="text-3xl font-bold font-mono" style="color: var(--color-text);">{{ assignedRoutines().length }}</p>
            <p class="section-label mt-1">Assigned Routines</p>
          </div>
          <div class="card p-5" style="border-left: 3px solid #56D364;">
            <div class="flex items-start justify-between mb-4">
              <div class="w-9 h-9 rounded-lg flex items-center justify-center" style="background-color: rgba(86,211,100,0.12); color: #56D364;">
                <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.exercises | safeHtml"></div>
              </div>
            </div>
            <p class="text-3xl font-bold font-mono" style="color: var(--color-text);">{{ userExerciseCount() }}</p>
            <p class="section-label mt-1">Exercises Available</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent sessions -->
          <div class="card p-5">
            <h3 class="text-sm font-semibold font-display mb-4" style="color: var(--color-text);">Recent Sessions</h3>
            @if (recentSessions().length === 0) {
              <app-empty-state [icon]="icons.sessions" title="No sessions yet" message="Start your first workout session to track your progress." />
            } @else {
              <div class="space-y-1">
                @for (s of recentSessions(); track s.id) {
                  <a
                    [routerLink]="'/sessions/' + s.id"
                    class="flex items-center justify-between p-3 rounded-lg transition-colors group"
                    style="color: var(--color-text);"
                  >
                    <div>
                      <p class="text-sm font-medium">{{ s.observations || 'Workout session' }}</p>
                      <p class="text-xs mt-0.5 font-mono" style="color: var(--color-muted);">{{ s.startTime | date:'MMM d, yyyy' }}</p>
                    </div>
                    <span
                      class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full transition-colors"
                      style="color: var(--color-muted);"
                      [innerHTML]="icons.chevronRight | safeHtml"
                    ></span>
                  </a>
                }
              </div>
              <a routerLink="/sessions" class="block mt-4 text-sm font-medium transition-colors" style="color: var(--color-accent);">
                View all sessions &rarr;
              </a>
            }
          </div>

          <!-- Assigned routines -->
          <div class="card p-5">
            <h3 class="text-sm font-semibold font-display mb-4" style="color: var(--color-text);">My Routines</h3>
            @if (assignedRoutines().length === 0) {
              <app-empty-state [icon]="icons.routines" title="No routines assigned" message="Ask your admin to assign routines to get started." />
            } @else {
              <div class="space-y-2">
                @for (a of assignedRoutines(); track a.routineId) {
                  <a
                    [routerLink]="'/routines/' + a.routineId"
                    class="flex items-center justify-between p-3 rounded-lg transition-all group"
                    style="border: 1px solid var(--color-border);"
                  >
                    <div>
                      <p class="text-sm font-medium" style="color: var(--color-text);">{{ routineNames()[a.routineId] ?? 'Routine #' + a.routineId }}</p>
                      <p class="text-xs mt-0.5 font-mono" style="color: var(--color-muted);">Assigned {{ a.assignedAt | date:'MMM d, yyyy' }}</p>
                    </div>
                    <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" style="color: var(--color-muted);" [innerHTML]="icons.chevronRight | safeHtml"></span>
                  </a>
                }
              </div>
            }
          </div>
        </div>

      </div>
    }
  `,
})
export class DashboardPage implements OnInit {
  private readonly exerciseService = inject(ExerciseService);
  private readonly routineService = inject(RoutineService);
  private readonly userService = inject(UserService);
  private readonly sessionService = inject(SessionService);
  private readonly userRoutineService = inject(UserRoutineService);
  protected readonly auth = inject(AuthService);

  protected readonly icons = ICONS;
  protected readonly stats = signal<{ label: string; count: number; icon: string; link: string; accentColor: string }[]>([]);
  protected readonly userSessionCount = signal(0);
  protected readonly userExerciseCount = signal(0);
  protected readonly recentSessions = signal<WorkoutSession[]>([]);
  protected readonly assignedRoutines = signal<UserRoutine[]>([]);
  protected readonly routineNames = signal<Record<number, string>>({});

  protected readonly adminActions = [
    { label: 'New Exercise', desc: 'Add to catalog', route: '/exercises/new', color: '#00ACD7' },
    { label: 'New Routine', desc: 'Build a routine', route: '/routines/new', color: '#B794F4' },
    { label: 'New User', desc: 'Register account', route: '/users/new', color: '#56D364' },
    { label: 'New Session', desc: 'Start tracking', route: '/sessions/new', color: '#F6C90E' },
  ];

  ngOnInit() {
    this.loadAdminStats();
    this.loadUserData();
  }

  private loadAdminStats() {
    forkJoin({
      exercises: this.exerciseService.getAll({ limit: 1 }).pipe(catchError(() => of(null))),
      routines:  this.routineService.getAll({ limit: 1 }).pipe(catchError(() => of(null))),
      users:     this.userService.getAll({ limit: 1 }).pipe(catchError(() => of(null))),
      sessions:  this.sessionService.getAll({ limit: 1 }).pipe(catchError(() => of(null))),
    }).subscribe({
      next: (result) => {
        this.stats.set([
          { label: 'Exercises', count: result.exercises?.meta?.totalCount ?? 0, icon: ICONS.exercises, link: '/exercises', accentColor: '#00ACD7' },
          { label: 'Routines',  count: result.routines?.meta?.totalCount ?? 0,  icon: ICONS.routines,  link: '/routines',  accentColor: '#B794F4' },
          { label: 'Users',     count: result.users?.meta?.totalCount ?? 0,     icon: ICONS.users,     link: '/users',     accentColor: '#56D364' },
          { label: 'Sessions',  count: result.sessions?.meta?.totalCount ?? 0,  icon: ICONS.sessions,  link: '/sessions',  accentColor: '#F6C90E' },
        ]);
      },
    });
  }

  private loadUserData() {
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
