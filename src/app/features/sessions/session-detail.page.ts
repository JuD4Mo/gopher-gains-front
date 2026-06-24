import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CardComponent } from '../../shared/components/card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { ExerciseSectionComponent } from '../../shared/components/exercise-section.component';
import { SessionService } from '../../services/session.service';
import { ExerciseSetService } from '../../services/exercise-set.service';
import { ExerciseService } from '../../services/exercise.service';
import { ToastService } from '../../shared/services/toast.service';
import type { WorkoutSession } from '../../models/session.model';
import type { ExerciseSet } from '../../models/exercise-set.model';
import type { Exercise } from '../../models/exercise.model';
import { catchError, of } from 'rxjs';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-session-detail',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, CardComponent, LoadingSpinnerComponent, ErrorMessageComponent, EmptyStateComponent, StatusBadgeComponent, ExerciseSectionComponent, SafeHtmlPipe],
  template: `
    <div class="p-5 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div class="flex items-center gap-3">
        <a routerLink="/sessions" class="btn-ghost px-0 text-sm gap-1.5">
          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.arrowLeft | safeHtml"></span>
          Back
        </a>
        <h2 class="text-xl font-bold font-display text-text">Session #{{ session()?.id }}</h2>
      </div>

      @if (loading()) { <app-loading-spinner size="lg" /> }
      @else if (!session()) { <app-error-message message="Session not found" /> }
      @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <app-card>
            <div class="p-5 space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-base font-semibold text-text font-display">Details</h3>
                <app-status-badge [status]="session()!.status" />
              </div>
              <div>
                <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Start Time</span>
                <p class="text-sm text-text mt-1">{{ session()!.startTime | date:'medium' }}</p>
              </div>
              @if (session()!.endTime) {
                <div>
                  <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">End Time</span>
                  <p class="text-sm text-text mt-1">{{ session()!.endTime | date:'medium' }}</p>
                </div>
              }
              @if (session()!.observations) {
                <div>
                  <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Observations</span>
                  <p class="text-sm text-text mt-1">{{ session()!.observations }}</p>
                </div>
              }
              @if (session()!.status === 'in_progress') {
                <button (click)="finishSession()" class="btn-primary w-full">Finish Session</button>
              }
            </div>
          </app-card>

          <div class="lg:col-span-2">
            <app-card>
              <div class="p-5">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-base font-semibold text-text font-display">Exercise Sets ({{ sets().length }})</h3>
                  @if (session()!.status === 'in_progress' && !showAddForm()) {
                    <button (click)="showAddForm.set(true)" class="btn-primary text-xs px-3 py-1.5">
                      <span class="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.plus | safeHtml"></span>
                      Add Set
                    </button>
                  }
                </div>

                @if (showAddForm()) {
                  <div class="p-4 mb-6 bg-surface-light rounded-lg border border-border space-y-3">
                    <div class="grid grid-cols-1 gap-3">
                      <div>
                        <label class="block text-xs font-medium text-text-muted mb-1">Exercise</label>
                        <div class="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                          @for (ex of exercises(); track ex.id) {
                            <button 
                              (click)="newSet.exerciseId = ex.id"
                              [class.ring-2]="newSet.exerciseId === ex.id"
                              [class.ring-accent]="newSet.exerciseId === ex.id"
                              [class.bg-accent/10]="newSet.exerciseId === ex.id"
                              class="text-left p-2.5 rounded-lg border border-border hover:border-accent/30 hover:bg-surface-light transition-all text-xs font-medium text-text"
                            >
                              <div class="font-semibold">{{ ex.name }}</div>
                              @if (ex.muscleGroup) {
                                <div class="text-xs text-text-muted mt-0.5">{{ ex.muscleGroup }}</div>
                              }
                            </button>
                          }
                        </div>
                      </div>
                    </div>

                    <div class="grid grid-cols-3 gap-2">
                      <div>
                        <label class="block text-xs font-medium text-text-muted mb-1">Weight (kg)</label>
                        <input type="number" [(ngModel)]="newSet.weight" step="0.5" placeholder="0" class="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none" />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-text-muted mb-1">Reps</label>
                        <input type="number" [(ngModel)]="newSet.repetitions" placeholder="0" class="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none" />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-text-muted mb-1">RIR</label>
                        <input type="number" [(ngModel)]="newSet.rir" min="0" max="10" placeholder="3" class="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none" />
                      </div>
                    </div>

                    <div class="flex items-center gap-2">
                      <button (click)="addSet()" class="btn-primary text-xs px-3 py-2">Add</button>
                      <button (click)="showAddForm.set(false)" class="btn-ghost text-xs px-3 py-2">Cancel</button>
                    </div>
                    <app-error-message [message]="setError()" />
                  </div>
                }

                @if (sets().length === 0) {
                  <app-empty-state [icon]="icons.emptyBox" title="No sets logged" message="Add exercise sets to this session." />
                } @else {
                  <div class="space-y-4">
                    @for (exercise of exercisesWithSets(); track exercise.id) {
                      <app-exercise-section 
                        [exercise]="exercise" 
                        [sets]="exercise.sets"
                        [showBadge]="true"
                        [showDelete]="false"
                      />
                    }
                  </div>
                }
              </div>
            </app-card>
          </div>
        </div>
      }
    </div>
  `,
})
export class SessionDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly sessionService = inject(SessionService);
  private readonly exerciseSetService = inject(ExerciseSetService);
  private readonly exerciseService = inject(ExerciseService);
  private readonly toast = inject(ToastService);

  protected readonly icons = ICONS;
  protected readonly session = signal<WorkoutSession | null>(null);
  protected readonly sets = signal<ExerciseSet[]>([]);
  protected readonly exercises = signal<Exercise[]>([]);
  protected readonly exerciseNames = signal<Record<number, string>>({});
  protected readonly loading = signal(true);
  protected readonly setError = signal<string | null>(null);
  protected readonly showAddForm = signal(false);
  protected newSet = { exerciseId: 0, weight: 0, repetitions: 0, rir: 3 };
  private sessionId = 0;

  protected readonly exercisesWithSets = computed(() => {
    const exercises = this.exercises();
    const sets = this.sets();
    return exercises
      .map((ex) => ({
        ...ex,
        sets: sets.filter((s) => s.exerciseId === ex.id),
      }))
      .filter((ex) => ex.sets.length > 0);
  });

  ngOnInit() {
    this.sessionId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.sessionId) return;
    this.exerciseService.getAll({}).pipe(catchError(() => of(null))).subscribe({
      next: (res) => {
        if (res) {
          this.exercises.set(res.data);
          const names: Record<number, string> = {};
          for (const ex of res.data) names[ex.id] = ex.name;
          this.exerciseNames.set(names);
        }
      },
    });
    this.load();
  }

  private load() {
    this.loading.set(true);
    this.sessionService.getById(this.sessionId).subscribe({
      next: (res) => { this.session.set(res.data); this.loadSets(); },
      error: () => this.loading.set(false),
    });
  }

  private loadSets() {
    this.exerciseSetService.getAll({ wsessionId: this.sessionId }).subscribe({
      next: (res) => { this.sets.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  protected addSet() {
    if (!this.newSet.exerciseId) { this.setError.set('Please select an exercise'); return; }
    this.setError.set(null);
    const stepNumber = this.sets().filter((s) => s.exerciseId === this.newSet.exerciseId).length + 1;
    this.exerciseSetService.create({ wsessionId: this.sessionId, ...this.newSet, stepNumber }).subscribe({
      next: () => { this.showAddForm.set(false); this.newSet = { exerciseId: 0, weight: 0, repetitions: 0, rir: 3 }; this.loadSets(); },
      error: (err) => this.setError.set(err.error?.message ?? err.message),
    });
  }

  protected finishSession() {
    this.sessionService.update(this.sessionId, { status: 'finished', endTime: new Date().toISOString() }).subscribe({
      next: () => { this.toast.show('Session finished'); this.load(); },
      error: (err) => this.setError.set(err.error?.message ?? err.message),
    });
  }
}
