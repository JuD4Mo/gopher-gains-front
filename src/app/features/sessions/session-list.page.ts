import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { PaginationComponent } from '../../shared/components/pagination.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import type { WorkoutSession } from '../../models/session.model';
import type { PaginationMeta } from '../../models/api-response.model';
import { catchError, of } from 'rxjs';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, LoadingSpinnerComponent, EmptyStateComponent, PaginationComponent, ErrorMessageComponent, StatusBadgeComponent, SafeHtmlPipe],
  template: `
    <div class="p-5 lg:p-8 space-y-6 max-w-[1400px] mx-auto">

      <!-- Page header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg flex items-center justify-center" style="background-color: rgba(246,201,14,0.12); color: #F6C90E;">
            <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.sessions | safeHtml"></div>
          </div>
          <div>
            <h2 class="text-lg font-bold font-display leading-none" style="color: var(--color-text);">Sessions</h2>
            <p class="text-xs font-mono mt-0.5" style="color: var(--color-muted);">Workout history</p>
          </div>
        </div>
        <a routerLink="/sessions/new" class="btn-primary">
          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.plus | safeHtml"></span>
          New Session
        </a>
      </div>

      <!-- Table card -->
      <div class="card">
        <!-- Filter -->
        <div class="p-5" style="border-bottom: 1px solid var(--color-border);">
          <select [(ngModel)]="statusFilter" (change)="onFilterChange()" class="input max-w-[180px]">
            <option value="">All statuses</option>
            <option value="in_progress">In Progress</option>
            <option value="finished">Finished</option>
          </select>
        </div>

        @if (loading()) { <app-loading-spinner /> }
        @else if (error()) { <app-error-message [message]="error()" /> }
        @else if (sessions().length === 0) {
          <app-empty-state [icon]="icons.emptyBox" title="No sessions yet" message="Start a workout session." />
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr>
                  <th class="table-header-cell">ID</th>
                  <th class="table-header-cell hidden sm:table-cell">User</th>
                  <th class="table-header-cell">Status</th>
                  <th class="table-header-cell hidden md:table-cell">Start Time</th>
                  <th class="table-header-cell text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (s of sessions(); track s.id) {
                  <tr class="table-row">
                    <td class="table-cell">
                      <span class="font-mono font-medium" style="color: var(--color-muted);">#{{ s.id }}</span>
                    </td>
                    <td class="table-cell hidden sm:table-cell" style="color: var(--color-muted);">{{ userNames()[s.userId] ?? 'User #' + s.userId }}</td>
                    <td class="table-cell">
                      <app-status-badge [status]="s.status" />
                    </td>
                    <td class="table-cell hidden md:table-cell font-mono" style="color: var(--color-muted);">{{ s.startTime | date:'MMM d, HH:mm' }}</td>
                    <td class="table-cell text-right">
                      <a
                        [routerLink]="['/sessions', s.id]"
                        class="btn-ghost text-xs px-2.5 py-1.5"
                        [attr.aria-label]="'View session #' + s.id"
                      >
                        <span class="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.chevronRight | safeHtml"></span>
                        View
                      </a>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div class="px-5 pb-5">
            <app-pagination [meta]="pagination()" (pageChange)="onPageChange($event)" />
          </div>
        }
      </div>
    </div>
  `,
})
export class SessionListPage implements OnInit {
  private readonly sessionService = inject(SessionService);
  private readonly userService = inject(UserService);
  protected readonly icons = ICONS;
  protected readonly sessions = signal<WorkoutSession[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly pagination = signal<PaginationMeta>({ page: 1, perPage: 10, pageCount: 0, totalCount: 0 });
  protected readonly userNames = signal<Record<number, string>>({});
  protected statusFilter = '';
  private currentPage = 1;

  ngOnInit() {
    this.userService.getAll({ limit: 100 }).pipe(catchError(() => of(null))).subscribe({
      next: (res) => {
        if (res) {
          const names: Record<number, string> = {};
          for (const u of res.data) names[u.id] = `${u.name} ${u.lastName}`;
          this.userNames.set(names);
        }
      },
    });
    this.load();
  }

  private load() {
    this.loading.set(true); this.error.set(null);
    this.sessionService.getAll({ status: this.statusFilter || undefined, page: this.currentPage }).subscribe({
      next: (res) => { this.sessions.set(res.data); if (res.meta) this.pagination.set(res.meta); this.loading.set(false); },
      error: (err) => { this.error.set(err.error?.message ?? err.message); this.loading.set(false); },
    });
  }
  protected onFilterChange() { this.currentPage = 1; this.load(); }
  protected onPageChange(p: number) { this.currentPage = p; this.load(); }
}
