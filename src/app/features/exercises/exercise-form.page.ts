import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { ExerciseService } from '../../services/exercise.service';
import { ToastService } from '../../shared/services/toast.service';
import type { CreateExerciseDto, UpdateExerciseDto } from '../../models/exercise.model';
import type { MuscleGroup } from '../../models/api-response.model';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [RouterLink, FormsModule, ErrorMessageComponent, SafeHtmlPipe],
  template: `
    <div class="p-5 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div class="flex items-center gap-3">
        <a routerLink="/exercises" class="btn-ghost gap-1.5 text-sm px-2">
          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.arrowLeft | safeHtml"></span>
          Back
        </a>
        <span style="color: var(--color-border);">/</span>
        <h2 class="text-lg font-bold font-display" style="color: var(--color-text);">{{ isEdit() ? 'Edit Exercise' : 'New Exercise' }}</h2>
      </div>

      <div class="card">
        <div class="px-6 pt-5 pb-4" style="border-bottom: 1px solid var(--color-border);">
          <p class="text-sm font-semibold font-display" style="color: var(--color-text);">Exercise Details</p>
          <p class="text-xs font-mono" style="color: var(--color-muted);">Fill in the exercise information</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="p-6 space-y-5">
          <app-error-message [message]="error()" />

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--color-muted);">Name</label>
            <input [(ngModel)]="form.name" name="name" required placeholder="e.g. Bench Press" class="input" />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--color-muted);">Muscle Group</label>
            <select [(ngModel)]="form.muscleGroup" name="muscleGroup" required class="input">
              <option value="" disabled>Select a muscle group</option>
              <option value="chest">Chest</option><option value="back">Back</option><option value="legs">Legs</option><option value="arms">Arms</option><option value="delts">Delts</option><option value="abs">Abs</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--color-muted);">Description</label>
            <textarea [(ngModel)]="form.description" name="description" required rows="3" placeholder="Describe the exercise..." class="input resize-none"></textarea>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--color-muted);">Execution Tip</label>
            <textarea [(ngModel)]="form.executionTip" name="executionTip" required rows="2" placeholder="How to perform this exercise correctly..." class="input resize-none"></textarea>
          </div>

          <div class="flex items-center gap-3 pt-2" style="border-top: 1px solid var(--color-border);">
            <button type="submit" [disabled]="submitting()" class="btn-primary">
              @if (submitting()) { <span class="w-4 h-4 rounded-full animate-spin border-2 border-white/30 border-t-white"></span> }
              {{ submitting() ? 'Saving...' : isEdit() ? 'Update Exercise' : 'Create Exercise' }}
            </button>
            <a routerLink="/exercises" class="btn-secondary">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ExerciseFormPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly exerciseService = inject(ExerciseService);
  private readonly toast = inject(ToastService);

  protected readonly icons = ICONS;
  protected readonly isEdit = signal(false);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected form: CreateExerciseDto = { name: '', description: '', executionTip: '', muscleGroup: '' as MuscleGroup };
  private editId?: number;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = Number(id); this.isEdit.set(true);
      this.exerciseService.getById(this.editId).subscribe({
        next: (res) => { this.form = { name: res.data.name, description: res.data.description, executionTip: res.data.executionTip, muscleGroup: res.data.muscleGroup }; },
        error: (err) => this.error.set(err.error?.message ?? err.message ?? 'Failed to load exercise'),
      });
    }
  }

  protected onSubmit() {
    if (!this.form.name || !this.form.description || !this.form.executionTip || !this.form.muscleGroup) { this.error.set('All fields are required'); return; }
    this.submitting.set(true); this.error.set(null);
    const request = this.isEdit() ? this.exerciseService.update(this.editId!, this.form as UpdateExerciseDto) : this.exerciseService.create(this.form);
    request.subscribe({
      next: () => { this.toast.show(this.isEdit() ? 'Exercise updated' : 'Exercise created'); this.router.navigate(['/exercises']); },
      error: (err) => { this.error.set(err.error?.message ?? err.message ?? 'Failed to save exercise'); this.submitting.set(false); },
    });
  }
}
