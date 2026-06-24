import { Component, inject, signal, input, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { RoutineService } from '../../services/routine.service';
import { UserRoutineService } from '../../services/user-routine.service';
import { RoutineExerciseService } from '../../services/routine-exercise.service';
import { ToastService } from '../../shared/services/toast.service';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import type { Routine } from '../../models/routine.model';
import { catchError, of, forkJoin } from 'rxjs';

interface RoutineWithExerciseCount extends Routine {
  exerciseCount: number;
}

@Component({
  selector: 'app-routine-selection-modal',
  standalone: true,
  imports: [FormsModule, CardComponent, LoadingSpinnerComponent, ErrorMessageComponent, EmptyStateComponent, SafeHtmlPipe],
  template: `
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <app-card class="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold font-display text-text">Select Your Routine</h2>
            <button (click)="onClose()" class="btn-ghost px-2">
              <span class="w-5 h-5 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.close | safeHtml"></span>
            </button>
          </div>

          <app-error-message [message]="error()" />

          <div class="flex gap-2 mb-6">
            <button 
              (click)="activeTab.set('suggested')"
              [class.bg-accent]="activeTab() === 'suggested'"
              [class.text-white]="activeTab() === 'suggested'"
              [class.bg-surface-light]="activeTab() !== 'suggested'"
              class="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              Suggested
            </button>
            <button 
              (click)="activeTab.set('all')"
              [class.bg-accent]="activeTab() === 'all'"
              [class.text-white]="activeTab() === 'all'"
              [class.bg-surface-light]="activeTab() !== 'all'"
              class="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              All Routines
            </button>
          </div>

          @if (loading()) {
            <app-loading-spinner size="lg" />
          } @else if (activeTab() === 'suggested') {
            @if (suggestedRoutines().length === 0) {
              <app-empty-state [icon]="icons.emptyBox" title="No suggested routines" message="All routines will appear in All Routines tab." />
            } @else {
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                @for (routine of suggestedRoutines(); track routine.id) {
                  <button 
                    (click)="selectRoutine(routine)"
                    [disabled]="assigning()"
                    class="text-left p-4 rounded-lg border-2 border-border hover:border-accent hover:bg-surface-light transition-all disabled:opacity-50 group"
                  >
                    <div class="flex items-start justify-between mb-2">
                      <h3 class="font-semibold text-text group-hover:text-accent transition-colors">{{ routine.name }}</h3>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [class.bg-teal/10]="routine.type === 'default'"
                        [class.text-teal]="routine.type === 'default'"
                        [class.bg-accent/10]="routine.type !== 'default'"
                        [class.text-accent]="routine.type !== 'default'"
                      >
                        {{ routine.type === 'default' ? 'Default' : 'Customized' }}
                      </span>
                    </div>
                    @if (routine.description) {
                      <p class="text-xs text-text-muted mb-3 line-clamp-2">{{ routine.description }}</p>
                    }
                    <div class="flex items-center gap-1 text-xs text-text-muted">
                      <span class="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.exercises | safeHtml"></span>
                      {{ routine.exerciseCount }} exercises
                    </div>
                  </button>
                }
              </div>
            }
          } @else {
            <div class="mb-4">
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                placeholder="Search routines..."
                class="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none"
              />
            </div>

            @if (filteredRoutines().length === 0) {
              <app-empty-state [icon]="icons.emptyBox" title="No routines found" message="Try adjusting your search or create a new routine." />
            } @else {
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                @for (routine of filteredRoutines(); track routine.id) {
                  <button 
                    (click)="selectRoutine(routine)"
                    [disabled]="assigning()"
                    class="text-left p-4 rounded-lg border-2 border-border hover:border-accent hover:bg-surface-light transition-all disabled:opacity-50 group"
                  >
                    <div class="flex items-start justify-between mb-2">
                      <h3 class="font-semibold text-text group-hover:text-accent transition-colors">{{ routine.name }}</h3>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [class.bg-teal/10]="routine.type === 'default'"
                        [class.text-teal]="routine.type === 'default'"
                        [class.bg-accent/10]="routine.type !== 'default'"
                        [class.text-accent]="routine.type !== 'default'"
                      >
                        {{ routine.type === 'default' ? 'Default' : 'Customized' }}
                      </span>
                    </div>
                    @if (routine.description) {
                      <p class="text-xs text-text-muted mb-3 line-clamp-2">{{ routine.description }}</p>
                    }
                    <div class="flex items-center gap-1 text-xs text-text-muted">
                      <span class="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.exercises | safeHtml"></span>
                      {{ routine.exerciseCount }} exercises
                    </div>
                  </button>
                }
              </div>
            }
          }
        </div>
      </app-card>
    </div>
  `,
})
export class RoutineSelectionModalComponent implements OnInit {
  private readonly routineService = inject(RoutineService);
  private readonly userRoutineService = inject(UserRoutineService);
  private readonly routineExerciseService = inject(RoutineExerciseService);
  private readonly toast = inject(ToastService);

  protected readonly icons = ICONS;

  readonly userId = input.required<number>();

  protected readonly routineSelected = output<Routine | null>();
  protected readonly loading = signal(true);
  protected readonly assigning = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly activeTab = signal<'suggested' | 'all'>('suggested');
  protected readonly searchQuery = signal('');

  protected readonly allRoutines = signal<RoutineWithExerciseCount[]>([]);
  protected readonly suggestedRoutines = signal<RoutineWithExerciseCount[]>([]);
  protected readonly filteredRoutines = signal<RoutineWithExerciseCount[]>([]);

  private readonly assignedRoutineIds = signal<Set<number>>(new Set());

  ngOnInit() {
    this.loadUserRoutines();
  }

  private loadUserRoutines() {
    const uid = this.userId();
    if (!uid) {
      this.loadRoutines();
      return;
    }
    this.userRoutineService.getByUser(uid).pipe(catchError(() => of(null))).subscribe({
      next: (res) => {
        if (res?.data) {
          this.assignedRoutineIds.set(new Set(res.data.map((r) => r.routineId)));
        }
        this.loadRoutines();
      },
      error: () => this.loadRoutines(),
    });
  }

  private loadRoutines() {
    this.loading.set(true);
    this.routineService.getAll({ limit: 100 }).pipe(catchError(() => of(null))).subscribe({
      next: (res) => {
        if (!res?.data) {
          this.loading.set(false);
          return;
        }

        const routines = res.data;
        const requests = routines.map((r) =>
          this.routineExerciseService.getByRoutine(r.id).pipe(catchError(() => of(null)))
        );

        forkJoin(requests).subscribe({
          next: (exerciseResults) => {
            const routinesWithCounts: RoutineWithExerciseCount[] = routines.map((r, i) => ({
              ...r,
              exerciseCount: exerciseResults[i]?.data?.length ?? 0,
            }));

            const assigned = this.assignedRoutineIds();
            this.allRoutines.set(routinesWithCounts);
            this.suggestedRoutines.set(routinesWithCounts.filter((r) => assigned.has(r.id)).slice(0, 4));
            this.filteredRoutines.set(routinesWithCounts);
            this.loading.set(false);
          },
        });
      },
    });
  }

  protected selectRoutine(routine: Routine) {
    if (this.assignedRoutineIds().has(routine.id)) {
      this.routineSelected.emit(routine);
      return;
    }

    const uid = this.userId();
    if (!uid) {
      this.routineSelected.emit(routine);
      return;
    }

    this.assigning.set(true);
    this.error.set(null);

    this.userRoutineService.assign({ userId: uid, routineId: routine.id }).subscribe({
      next: () => {
        this.toast.show('Routine assigned!');
        this.routineSelected.emit(routine);
        this.assigning.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? err.message);
        this.assigning.set(false);
      },
    });
  }

  protected onClose() {
    this.routineSelected.emit(null);
  }
}
