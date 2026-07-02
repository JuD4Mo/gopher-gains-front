import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExerciseService } from '../../services/exercise.service';
import { RoutineService } from '../../services/routine.service';
import { UserService } from '../../services/user.service';
import { SessionService } from '../../services/session.service';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { catchError, of, forkJoin } from 'rxjs';
import type { WorkoutSession } from '../../models/session.model';

interface PlatformStat {
  label: string;
  count: number;
  icon: string;
  link: string;
  accent: string;
}

interface ActivityItem {
  type: 'session' | 'user' | 'exercise' | 'routine' | 'assignment';
  label: string;
  sub: string;
  time: string;
  accent: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, SafeHtmlPipe],
  template: `
    <div class="p-5 lg:p-8 max-w-[1400px] mx-auto">

      <!-- Header -->
      <div class="flex items-start justify-between mb-10">
        <div>
          <p class="text-[11px] font-mono font-semibold uppercase tracking-[0.12em] mb-1" style="color: var(--color-accent);">Admin Portal</p>
          <h1 class="text-2xl lg:text-3xl font-bold font-display tracking-tight" style="color: var(--color-text);">Platform Overview</h1>
          <p class="text-sm mt-1" style="color: var(--color-muted);">{{ today }}</p>
        </div>
        <div class="hidden lg:flex items-center gap-2">
          <a routerLink="/exercises/new" class="btn-secondary text-sm px-4 py-2">New Exercise</a>
          <a routerLink="/users/new" class="btn-primary text-sm px-4 py-2">Add User</a>
        </div>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        @for (stat of stats(); track stat.label) {
          <a [routerLink]="stat.link" class="group block rounded-xl p-5 transition-all duration-200 hover:-translate-y-px"
            style="background-color: var(--color-card); border: 1px solid var(--color-border);">
            <div class="flex items-center justify-between mb-4">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                [style.background-color]="stat.accent + '18'" [style.color]="stat.accent">
                <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="stat.icon | safeHtml"></div>
              </div>
            </div>
            <p class="text-2xl font-bold font-mono tracking-tight leading-none mb-1" style="color: var(--color-text);">{{ stat.count }}</p>
            <p class="text-[11px] font-semibold uppercase tracking-wider" style="color: var(--color-muted);">{{ stat.label }}</p>
          </a>
        }
      </div>

      <!-- Activity + Quick Actions -->
      <div class="flex flex-col xl:flex-row gap-5">
        <div class="flex-1 min-w-0 rounded-xl flex flex-col" style="background-color: var(--color-card); border: 1px solid var(--color-border);">
          <div class="flex items-center justify-between px-6 py-4" style="border-bottom: 1px solid var(--color-border);">
            <div class="flex items-center gap-2.5">
              <span class="w-2 h-2 rounded-full" style="background-color: var(--color-accent);"></span>
              <span class="text-sm font-semibold font-display" style="color: var(--color-text);">Recent Activity</span>
            </div>
            <span class="text-[11px] font-mono" style="color: var(--color-muted);">Latest sessions</span>
          </div>

          @if (activityFeed().length === 0 && !loading()) {
            <div class="flex flex-col items-center justify-center py-16 gap-4">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center" style="background-color: var(--color-accent-dim);">
                <div class="w-6 h-6 [&>svg]:w-full [&>svg]:h-full" style="color: var(--color-accent);" [innerHTML]="icons.sessions | safeHtml"></div>
              </div>
              <div class="text-center">
                <p class="text-sm font-semibold font-display" style="color: var(--color-text);">No activity yet</p>
                <p class="text-xs mt-1" style="color: var(--color-muted);">Session activity will appear here once users start logging workouts.</p>
              </div>
            </div>
          } @else {
            <div class="divide-y flex-1" style="border-color: var(--color-border);">
              @for (item of activityFeed(); track item.label + item.time) {
                <div class="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-[var(--color-card-hover)]">
                  <div class="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                    [style.background-color]="item.accent + '15'" [style.color]="item.accent">
                    <div class="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="getActivityIcon(item.type) | safeHtml"></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium leading-snug" style="color: var(--color-text);">{{ item.label }}</p>
                    <p class="text-xs mt-0.5 font-mono" style="color: var(--color-muted);">{{ item.sub }}</p>
                  </div>
                  <span class="text-[11px] font-mono flex-shrink-0 mt-0.5" style="color: var(--color-muted);">{{ item.time }}</span>
                </div>
              }
            </div>
            <div class="px-6 py-3" style="border-top: 1px solid var(--color-border);">
              <a routerLink="/sessions" class="text-[12px] font-medium" style="color: var(--color-accent);">View all sessions &rarr;</a>
            </div>
          }
        </div>

        <div class="xl:w-68 flex flex-col gap-5" style="min-width: 17rem;">
          <div class="rounded-xl" style="background-color: var(--color-card); border: 1px solid var(--color-border);">
            <div class="px-5 py-4" style="border-bottom: 1px solid var(--color-border);">
              <p class="text-sm font-semibold font-display" style="color: var(--color-text);">Quick Actions</p>
            </div>
            <div class="p-3 space-y-1">
              @for (action of quickActions; track action.label) {
                <a [routerLink]="action.route" class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group">
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                    [style.background-color]="action.accent + '18'" [style.color]="action.accent">
                    <div class="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="action.icon | safeHtml"></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-[13px] font-medium" style="color: var(--color-text);">{{ action.label }}</p>
                    <p class="text-[11px]" style="color: var(--color-muted);">{{ action.desc }}</p>
                  </div>
                  <span class="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full opacity-0 group-hover:opacity-50 transition-opacity" style="color: var(--color-muted);" [innerHTML]="icons.chevronRight | safeHtml"></span>
                </a>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardPage implements OnInit {
  private readonly exerciseService = inject(ExerciseService);
  private readonly routineService  = inject(RoutineService);
  private readonly userService     = inject(UserService);
  private readonly sessionService  = inject(SessionService);

  protected readonly icons    = ICONS;
  protected readonly stats    = signal<PlatformStat[]>([]);
  protected readonly loading  = signal(true);
  protected readonly activityFeed = signal<ActivityItem[]>([]);

  protected readonly today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  protected readonly quickActions = [
    { label: 'New Exercise', desc: 'Add to library',  route: '/exercises/new', accent: '#3DB8FF', icon: ICONS.exercises },
    { label: 'New Routine',  desc: 'Build a program', route: '/routines/new',  accent: '#7DD3FC', icon: ICONS.routines  },
    { label: 'Add User',     desc: 'Register a user', route: '/users/new',     accent: '#2DA44E', icon: ICONS.users     },
  ];

  protected getActivityIcon(type: ActivityItem['type']): string {
    const map: Record<string, string> = { session: ICONS.sessions, user: ICONS.users, exercise: ICONS.exercises, routine: ICONS.routines, assignment: ICONS.assignments };
    return map[type] ?? ICONS.dashboard;
  }

  ngOnInit() {
    forkJoin({
      exercises: this.exerciseService.getAll({ limit: 1 }).pipe(catchError(() => of(null))),
      routines:  this.routineService.getAll({ limit: 1 }).pipe(catchError(() => of(null))),
      users:     this.userService.getAll({ limit: 1 }).pipe(catchError(() => of(null))),
      sessions:  this.sessionService.getAll({ limit: 10 }).pipe(catchError(() => of(null))),
    }).subscribe({
      next: (result) => {
        this.stats.set([
          { label: 'Exercises', count: result.exercises?.meta?.totalCount ?? 0, icon: ICONS.exercises, link: '/exercises', accent: '#3DB8FF' },
          { label: 'Routines',  count: result.routines?.meta?.totalCount ?? 0,  icon: ICONS.routines,  link: '/routines',  accent: '#B794F4' },
          { label: 'Users',     count: result.users?.meta?.totalCount ?? 0,     icon: ICONS.users,     link: '/users',     accent: '#2DA44E' },
          { label: 'Sessions',  count: result.sessions?.meta?.totalCount ?? 0,  icon: ICONS.sessions,  link: '/sessions',  accent: '#F6C90E' },
        ]);
        const sessions: WorkoutSession[] = result.sessions?.data ?? [];
        this.activityFeed.set(sessions.map(s => ({
          type: 'session' as const,
          label: s.observations || 'Workout session logged',
          sub:   `Session #${s.id}`,
          time:  s.startTime ? new Date(s.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
          accent: '#F6C90E',
        })));
        this.loading.set(false);
      },
    });
  }
}
