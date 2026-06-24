import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
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
  delta: string;
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
  imports: [RouterLink, DatePipe, SafeHtmlPipe],
  template: `
    <div class="p-6 lg:p-8 max-w-[1400px] mx-auto">

      <!-- Header row -->
      <div class="flex items-start justify-between mb-8">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[11px] font-mono font-semibold uppercase tracking-[0.12em]" style="color: var(--color-accent);">Admin Portal</span>
            <span class="w-1 h-1 rounded-full" style="background-color: var(--color-border);"></span>
            <span class="text-[11px] font-mono" style="color: var(--color-muted);">{{ today }}</span>
          </div>
          <h1 class="text-3xl font-bold font-display tracking-tight" style="color: var(--color-text);">Platform Overview</h1>
          <p class="text-sm mt-1" style="color: var(--color-muted);">Monitor activity, manage content, and keep the platform healthy.</p>
        </div>
        <div class="hidden lg:flex items-center gap-3">
          <a routerLink="/exercises/new" class="btn-secondary text-sm px-4 py-2">New Exercise</a>
          <a routerLink="/users/new" class="btn-primary text-sm px-4 py-2">Add User</a>
        </div>
      </div>

      <!-- Asymmetric main grid: stats + feed column | action panel -->
      <div class="flex flex-col xl:flex-row gap-6">

        <!-- Left column: stats strip + activity feed -->
        <div class="flex-1 min-w-0 flex flex-col gap-6">

          <!-- Stats strip: horizontal scrollable on mobile, 4-col on desktop -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            @for (stat of stats(); track stat.label) {
              <a
                [routerLink]="stat.link"
                class="group block rounded-xl p-5 transition-all duration-200 hover:translate-y-[-1px]"
                style="background-color: var(--color-card); border: 1px solid var(--color-border);"
              >
                <div class="flex items-center justify-between mb-4">
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                    [style.background-color]="stat.accent + '18'"
                    [style.color]="stat.accent"
                  >
                    <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="stat.icon | safeHtml"></div>
                  </div>
                  <span class="text-[11px] font-mono" style="color: var(--color-muted);">{{ stat.delta }}</span>
                </div>
                <p class="text-2xl font-bold font-mono tracking-tight leading-none mb-1" style="color: var(--color-text);">
                  {{ stat.count }}
                </p>
                <p class="text-[11px] font-semibold uppercase tracking-wider" style="color: var(--color-muted);">{{ stat.label }}</p>
              </a>
            }
          </div>

          <!-- Activity Feed -->
          <div
            class="rounded-xl flex flex-col"
            style="background-color: var(--color-card); border: 1px solid var(--color-border);"
          >
            <div class="flex items-center justify-between px-6 py-4" style="border-bottom: 1px solid var(--color-border);">
              <div class="flex items-center gap-2.5">
                <div class="w-2 h-2 rounded-full animate-pulse" style="background-color: var(--color-accent);"></div>
                <span class="text-sm font-semibold font-display" style="color: var(--color-text);">Activity Feed</span>
              </div>
              <span class="text-[11px] font-mono" style="color: var(--color-muted);">Live</span>
            </div>

            @if (recentSessions().length === 0 && !loading()) {
              <!-- Mascot empty state for admin -->
              <div class="flex flex-col items-center justify-center py-16 gap-4">
                <div class="w-16 h-16 rounded-xl flex items-center justify-center" style="background-color: var(--color-accent-dim);">
                  <div class="w-8 h-8 [&>svg]:w-full [&>svg]:h-full" style="color: var(--color-accent);" [innerHTML]="icons.sessions | safeHtml"></div>
                </div>
                <div class="text-center">
                  <p class="text-sm font-semibold font-display" style="color: var(--color-text);">No activity yet</p>
                  <p class="text-xs mt-1" style="color: var(--color-muted);">Platform activity will appear here once sessions begin.</p>
                </div>
              </div>
            } @else {
              <div class="divide-y" style="border-color: var(--color-border);">
                @for (item of activityFeed(); track item.label + item.time) {
                  <div class="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-[var(--color-card-hover)]">
                    <div
                      class="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                      [style.background-color]="item.accent + '15'"
                      [style.color]="item.accent"
                    >
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
                <a routerLink="/sessions" class="text-[12px] font-medium transition-colors" style="color: var(--color-accent);">
                  View all sessions &rarr;
                </a>
              </div>
            }
          </div>

        </div>

        <!-- Right column: platform health + quick actions -->
        <div class="xl:w-72 flex flex-col gap-5">

          <!-- Platform Health -->
          <div
            class="rounded-xl"
            style="background-color: var(--color-card); border: 1px solid var(--color-border);"
          >
            <div class="px-5 py-4" style="border-bottom: 1px solid var(--color-border);">
              <p class="text-sm font-semibold font-display" style="color: var(--color-text);">Platform Health</p>
            </div>
            <div class="px-5 py-4 space-y-4">
              @for (metric of platformMetrics; track metric.label) {
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-xs font-medium" style="color: var(--color-muted);">{{ metric.label }}</span>
                    <span class="text-xs font-mono font-semibold" [style.color]="metric.accent">{{ metric.value }}</span>
                  </div>
                  <div class="h-1.5 rounded-full overflow-hidden" style="background-color: var(--color-border);">
                    <div
                      class="h-full rounded-full transition-all duration-700"
                      [style.width.%]="metric.pct"
                      [style.background-color]="metric.accent"
                    ></div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Quick actions -->
          <div
            class="rounded-xl"
            style="background-color: var(--color-card); border: 1px solid var(--color-border);"
          >
            <div class="px-5 py-4" style="border-bottom: 1px solid var(--color-border);">
              <p class="text-sm font-semibold font-display" style="color: var(--color-text);">Quick Actions</p>
            </div>
            <div class="p-3 space-y-1">
              @for (action of quickActions; track action.label) {
                <a
                  [routerLink]="action.route"
                  class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group"
                  style="color: var(--color-muted);"
                >
                  <div
                    class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                    [style.background-color]="action.accent + '15'"
                    [style.color]="action.accent"
                  >
                    <div class="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.plus | safeHtml"></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-[13px] font-medium group-hover:text-[var(--color-text)] transition-colors" style="color: var(--color-text);">{{ action.label }}</p>
                    <p class="text-[11px]" style="color: var(--color-muted);">{{ action.desc }}</p>
                  </div>
                  <span class="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full opacity-0 group-hover:opacity-100 transition-opacity" [innerHTML]="icons.chevronRight | safeHtml"></span>
                </a>
              }
            </div>
          </div>

          <!-- Content summary -->
          <div
            class="rounded-xl"
            style="background-color: var(--color-card); border: 1px solid var(--color-border);"
          >
            <div class="px-5 py-4" style="border-bottom: 1px solid var(--color-border);">
              <p class="text-sm font-semibold font-display" style="color: var(--color-text);">Content Index</p>
            </div>
            <div class="px-5 py-2">
              @for (stat of stats(); track stat.label) {
                <div
                  class="flex items-center justify-between py-3 transition-colors"
                  style="border-bottom: 1px solid var(--color-border);"
                >
                  <div class="flex items-center gap-2.5">
                    <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" [style.background-color]="stat.accent"></span>
                    <span class="text-[13px]" style="color: var(--color-muted);">{{ stat.label }}</span>
                  </div>
                  <span class="text-[13px] font-bold font-mono" style="color: var(--color-text);">{{ stat.count }}</span>
                </div>
              }
            </div>
            <div class="px-5 py-3">
              <a routerLink="/assignments" class="text-[12px] font-medium transition-colors" style="color: var(--color-accent);">
                Manage assignments &rarr;
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardPage implements OnInit {
  private readonly exerciseService = inject(ExerciseService);
  private readonly routineService = inject(RoutineService);
  private readonly userService = inject(UserService);
  private readonly sessionService = inject(SessionService);

  protected readonly icons = ICONS;
  protected readonly stats = signal<PlatformStat[]>([]);
  protected readonly recentSessions = signal<WorkoutSession[]>([]);
  protected readonly loading = signal(true);
  protected readonly activityFeed = signal<ActivityItem[]>([]);

  protected readonly today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  protected readonly platformMetrics = [
    { label: 'API Uptime', value: '99.9%', pct: 99, accent: '#2DA44E' },
    { label: 'Sessions this week', value: '84%', pct: 84, accent: '#00ACD7' },
    { label: 'Routine completion', value: '71%', pct: 71, accent: '#B794F4' },
    { label: 'Active users', value: '62%', pct: 62, accent: '#F6C90E' },
  ];

  protected readonly quickActions = [
    { label: 'New Exercise', desc: 'Add to catalog', route: '/exercises/new', accent: '#00ACD7' },
    { label: 'New Routine', desc: 'Build a program', route: '/routines/new', accent: '#B794F4' },
    { label: 'New User', desc: 'Register athlete', route: '/users/new', accent: '#2DA44E' },
    { label: 'Assign Routine', desc: 'Assign to athlete', route: '/assignments', accent: '#F6C90E' },
  ];

  protected getActivityIcon(type: ActivityItem['type']): string {
    const map: Record<string, string> = {
      session: ICONS.sessions,
      user: ICONS.users,
      exercise: ICONS.exercises,
      routine: ICONS.routines,
      assignment: ICONS.assignments,
    };
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
          { label: 'Exercises', count: result.exercises?.meta?.totalCount ?? 0, icon: ICONS.exercises, link: '/exercises', accent: '#00ACD7', delta: 'total' },
          { label: 'Routines',  count: result.routines?.meta?.totalCount ?? 0,  icon: ICONS.routines,  link: '/routines',  accent: '#B794F4', delta: 'total' },
          { label: 'Athletes',  count: result.users?.meta?.totalCount ?? 0,     icon: ICONS.users,     link: '/users',     accent: '#2DA44E', delta: 'total' },
          { label: 'Sessions',  count: result.sessions?.meta?.totalCount ?? 0,  icon: ICONS.sessions,  link: '/sessions',  accent: '#F6C90E', delta: 'total' },
        ]);

        const sessions = result.sessions?.data ?? [];
        this.recentSessions.set(sessions);

        this.activityFeed.set(sessions.map((s: WorkoutSession) => ({
          type: 'session' as const,
          label: s.observations || 'Workout session logged',
          sub: `Session #${s.id}`,
          time: s.startTime ? new Date(s.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
          accent: '#F6C90E',
        })));

        this.loading.set(false);
      },
    });
  }
}
