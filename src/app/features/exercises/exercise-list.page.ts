import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { PaginationComponent } from '../../shared/components/pagination.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { MuscleGroupBadgeComponent } from '../../shared/components/muscle-group-badge.component';
import { ExerciseService } from '../../services/exercise.service';
import type { Exercise } from '../../models/exercise.model';
import type { PaginationMeta } from '../../models/api-response.model';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [RouterLink, FormsModule, LoadingSpinnerComponent, EmptyStateComponent, PaginationComponent, ErrorMessageComponent, MuscleGroupBadgeComponent, SafeHtmlPipe],
  template: `
    <div class="p-5 lg:p-8 space-y-6 max-w-[1400px] mx-auto">

      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold font-display" style="color: var(--color-text);">Exercises</h2>
          <p class="text-sm font-mono mt-1" style="color: var(--color-muted);">Exercise catalog</p>
        </div>
        <a routerLink="/exercises/new" class="btn-primary">
          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.plus | safeHtml"></span>
          New Exercise
        </a>
      </div>

      <div class="card">
        <div class="flex items-center gap-3 p-5" style="border-bottom: 1px solid var(--color-border);">
          <div class="relative flex-1 max-w-xs">
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none [&>svg]:w-4 [&>svg]:h-4" style="color: var(--color-muted);" [innerHTML]="icons.search | safeHtml"></div>
            <input [(ngModel)]="nameFilter" (input)="onFilterChange()" placeholder="Search exercises..." class="input pl-9" />
          </div>
          <select [(ngModel)]="muscleFilter" (change)="onFilterChange()" class="input max-w-[160px]">
            <option value="">All muscles</option>
            <option value="chest">Chest</option><option value="back">Back</option><option value="legs">Legs</option><option value="arms">Arms</option><option value="delts">Delts</option><option value="abs">Abs</option>
          </select>
        </div>

        @if (loading()) { <app-loading-spinner /> }
        @else if (error()) { <app-error-message [message]="error()" /> }
        @else if (exercises().length === 0) {
          <app-empty-state [icon]="icons.emptyBox" title="No exercises yet" message="Create your first exercise to get started." />
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr>
                  <th class="table-header-cell">Name</th>
                  <th class="table-header-cell">Muscle</th>
                  <th class="table-header-cell hidden md:table-cell">Description</th>
                  <th class="table-header-cell text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (ex of exercises(); track ex.id) {
                  <tr class="table-row">
                    <td class="table-cell font-medium">{{ ex.name }}</td>
                    <td class="table-cell"><app-muscle-group-badge [group]="ex.muscleGroup" /></td>
                    <td class="table-cell hidden md:table-cell max-w-xs truncate" style="color: var(--color-muted);">{{ ex.description }}</td>
                    <td class="table-cell text-right">
                      <a [routerLink]="['/exercises', ex.id]" class="btn-ghost text-xs px-2.5 py-1.5" [attr.aria-label]="'Edit ' + ex.name">
                        <span class="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.edit | safeHtml"></span>
                        Edit
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
export class ExerciseListPage implements OnInit {
  private readonly exerciseService = inject(ExerciseService);
  protected readonly icons = ICONS;
  protected readonly exercises = signal<Exercise[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly pagination = signal<PaginationMeta>({ page: 1, perPage: 10, pageCount: 0, totalCount: 0 });
  protected nameFilter = '';
  protected muscleFilter = '';
  private currentPage = 1;

  ngOnInit() { this.load(); }
  private load() {
    this.loading.set(true); this.error.set(null);
    this.exerciseService.getAll({ name: this.nameFilter || undefined, muscleGroup: this.muscleFilter || undefined, page: this.currentPage }).subscribe({
      next: (res) => { this.exercises.set(res.data); if (res.meta) this.pagination.set(res.meta); this.loading.set(false); },
      error: (err) => { this.error.set(err.error?.message ?? err.message ?? 'Failed to load exercises'); this.loading.set(false); },
    });
  }
  protected onFilterChange() { this.currentPage = 1; this.load(); }
  protected onPageChange(page: number) { this.currentPage = page; this.load(); }
}
