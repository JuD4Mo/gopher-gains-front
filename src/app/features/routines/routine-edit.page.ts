import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { RoutineService } from '../../services/routine.service';
import { ToastService } from '../../shared/services/toast.service';
import type { UpdateRoutineDto } from '../../models/routine.model';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-routine-edit',
  standalone: true,
  imports: [RouterLink, FormsModule, ErrorMessageComponent, SafeHtmlPipe],
  template: `
    <div class="p-5 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div class="flex items-center gap-3">
        <a [routerLink]="['/routines', routineId]" class="btn-ghost px-0 text-sm gap-1.5">
          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.arrowLeft | safeHtml"></span>
          Back
        </a>
        <h2 class="text-xl font-bold font-display" style="color: var(--color-text);">Edit Routine</h2>
      </div>

      <div class="card">
        <div class="px-6 pt-5 pb-4" style="border-bottom: 1px solid var(--color-border);">
          <p class="text-sm font-semibold font-display" style="color: var(--color-text);">Edit Routine</p>
          <p class="text-xs font-mono" style="color: var(--color-muted);">Update the routine details</p>
        </div>
        <form (ngSubmit)="onSubmit()" class="p-6 space-y-5">
          <app-error-message [message]="error()" />
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--color-muted);">Name</label>
            <input [(ngModel)]="form.name" name="name" class="input" />
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--color-muted);">Description</label>
            <textarea [(ngModel)]="form.description" name="description" rows="3" class="input resize-none"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--color-muted);">Frequency (times/week)</label>
              <input type="number" [(ngModel)]="form.frequency" name="frequency" min="1" max="7" class="input font-mono" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--color-muted);">Type</label>
              <select [(ngModel)]="form.type" name="type" class="input">
                <option value="default">Default</option>
                <option value="customized">Customized</option>
              </select>
            </div>
          </div>
          <div class="flex items-center gap-3 pt-2" style="border-top: 1px solid var(--color-border);">
            <button type="submit" [disabled]="submitting()" class="btn-primary">{{ submitting() ? 'Saving...' : 'Update Routine' }}</button>
            <a [routerLink]="['/routines', routineId]" class="btn-secondary">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class RoutineEditPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly routineService = inject(RoutineService);
  private readonly toast = inject(ToastService);
  protected readonly icons = ICONS;
  protected routineId = 0;
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected form: UpdateRoutineDto = {};

  ngOnInit() {
    this.routineId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.routineId) {
      this.routineService.getById(this.routineId).subscribe({
        next: (res) => { this.form = { name: res.data.name, description: res.data.description, frequency: res.data.frequency, type: res.data.type }; },
        error: (err) => this.error.set(err.error?.message ?? err.message),
      });
    }
  }

  protected onSubmit() {
    this.submitting.set(true); this.error.set(null);
    this.routineService.update(this.routineId, this.form).subscribe({
      next: () => { this.toast.show('Routine updated'); this.router.navigate(['/routines']); },
      error: (err) => { this.error.set(err.error?.message ?? err.message); this.submitting.set(false); },
    });
  }
}
