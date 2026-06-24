import { Component, input, output } from '@angular/core';
import { MuscleGroupBadgeComponent } from './muscle-group-badge.component';
import type { ExerciseSet } from '../../models/exercise-set.model';
import type { Exercise } from '../../models/exercise.model';
import { SafeHtmlPipe } from '../safe-html.pipe';
import { ICONS } from '../icons';

@Component({
  selector: 'app-exercise-section',
  standalone: true,
  imports: [MuscleGroupBadgeComponent, SafeHtmlPipe],
  template: `
    <div class="border-l-4 border-accent bg-surface-light rounded-r-lg p-5 space-y-3">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="text-lg font-bold font-display text-accent">{{ exercise().name }}</h3>
          @if (exercise().muscleGroup) {
            <app-muscle-group-badge [group]="exercise().muscleGroup" />
          }
        </div>
        @if (showBadge()) {
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
            {{ setsCount() }} sets
          </span>
        }
      </div>

      @if (sets().length === 0) {
        <p class="text-sm text-text-muted italic">No sets logged yet</p>
      } @else {
        <div class="overflow-x-auto -mx-5">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border">
                <th class="text-left py-2 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">Set</th>
                <th class="text-right py-2 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">Weight</th>
                <th class="text-right py-2 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">Reps</th>
                <th class="text-right py-2 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">RIR</th>
                @if (showDelete()) {
                  <th class="text-center py-2 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">Action</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (s of sets(); track s.id; let i = $index) {
                <tr class="border-b border-border/50 hover:bg-card transition-colors group">
                  <td class="py-2 px-5 text-text font-medium">{{ i + 1 }}</td>
                  <td class="py-2 px-5 text-right font-mono text-text">{{ s.weight }} kg</td>
                  <td class="py-2 px-5 text-right font-mono text-text">{{ s.repetitions }}</td>
                  <td class="py-2 px-5 text-right font-mono text-text-muted">{{ s.rir }}</td>
                  @if (showDelete()) {
                    <td class="py-2 px-5 text-center">
                      <button 
                        (click)="deleteSet.emit(s.id)"
                        class="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-accent p-1"
                        title="Delete set"
                      >
                        <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.trash | safeHtml"></span>
                      </button>
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class ExerciseSectionComponent {
  readonly exercise = input.required<Exercise>();
  readonly sets = input.required<ExerciseSet[]>();
  readonly showBadge = input<boolean>(true);
  readonly showDelete = input<boolean>(false);

  readonly deleteSet = output<number>();

  protected readonly icons = ICONS;
  protected readonly setsCount = () => this.sets().length;
}
