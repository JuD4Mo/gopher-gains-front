import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { PaginationComponent } from '../../shared/components/pagination.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { RoutineService } from '../../services/routine.service';
import type { Routine } from '../../models/routine.model';
import type { PaginationMeta } from '../../models/api-response.model';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-routine-list',
  standalone: true,
  imports: [RouterLink, FormsModule, LoadingSpinnerComponent, EmptyStateComponent, PaginationComponent, ErrorMessageComponent, SafeHtmlPipe],
  template: `
    <div class="p-5 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold font-display" style="color: var(--color-text);">Routines</h2>
          <p class="text-sm font-mono mt-1" style="color: var(--color-muted);">Workout plans</p>
        </div>
        <a routerLink="/routines/new" class="btn-primary">
          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.plus | safeHtml"></span>
          New Routine
        </a>
      </div>

      <div class="card">
        <div class="flex items-center gap-3 p-5" style="border-bottom: 1px solid var(--color-border);">
          <div class="relative flex-1 max-w-xs">
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none [&>svg]:w-4 [&>svg]:h-4" style="color: var(--color-muted);" [innerHTML]="icons.search | safeHtml"></div>
            <input [(ngModel)]="nameFilter" (input)="onFilterChange()" placeholder="Search routines..." class="input pl-9" />
          </div>
          <select [(ngModel)]="typeFilter" (change)="onFilterChange()" class="input max-w-[160px]">
            <option value="">All types</option>
            <option value="default">Default</option>
            <option value="customized">Customized</option>
          </select>
        </div>

        @if (loading()) { <app-loading-spinner /> }
        @else if (error()) { <app-error-message [message]="error()" /> }
        @else if (routines().length === 0) {
          <app-empty-state [icon]="icons.emptyBox" title="No routines yet" message="Create your first routine to get started." />
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr>
                  <th class="table-header-cell">Name</th>
                  <th class="table-header-cell">Type</th>
                  <th class="table-header-cell hidden sm:table-cell">Frequency</th>
                  <th class="table-header-cell text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (r of routines(); track r.id) {
                  <tr class="table-row">
                    <td class="table-cell font-medium">{{ r.name }}</td>
                    <td class="table-cell">
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-mono capitalize"
                        [style.background-color]="r.type === 'default' ? 'rgba(61,184,255,0.12)' : 'rgba(183,148,244,0.12)'"
                        [style.color]="r.type === 'default' ? 'var(--color-accent)' : '#B794F4'">{{ r.type }}</span>
                    </td>
                    <td class="table-cell hidden sm:table-cell font-mono" style="color: var(--color-muted);">{{ r.frequency }}x / week</td>
                    <td class="table-cell text-right">
                      <a [routerLink]="['/routines', r.id]" class="btn-ghost text-xs px-2.5 py-1.5" [attr.aria-label]="'View ' + r.name">
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
export class RoutineListPage implements OnInit {
  private readonly routineService = inject(RoutineService);
  protected readonly icons = ICONS;
  protected readonly routines = signal<Routine[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly pagination = signal<PaginationMeta>({ page: 1, perPage: 10, pageCount: 0, totalCount: 0 });
  protected nameFilter = '';
  protected typeFilter = '';
  private currentPage = 1;

  ngOnInit() { this.load(); }
  private load() {
    this.loading.set(true); this.error.set(null);
    this.routineService.getAll({ name: this.nameFilter || undefined, type: this.typeFilter || undefined, page: this.currentPage }).subscribe({
      next: (res) => { this.routines.set(res.data); if (res.meta) this.pagination.set(res.meta); this.loading.set(false); },
      error: (err) => { this.error.set(err.error?.message ?? err.message); this.loading.set(false); },
    });
  }
  protected onFilterChange() { this.currentPage = 1; this.load(); }
  protected onPageChange(p: number) { this.currentPage = p; this.load(); }
}
