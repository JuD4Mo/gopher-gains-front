import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { RoutineService } from '../../services/routine.service';
import { ToastService } from '../../shared/services/toast.service';
import type { CreateRoutineDto, UpdateRoutineDto } from '../../models/routine.model';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-routine-form',
  standalone: true,
  imports: [RouterLink, FormsModule, ErrorMessageComponent, SafeHtmlPipe],
  template: `
    <div class="p-5 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div class="flex items-center gap-3">
        <a routerLink="/routines" class="btn-ghost gap-1.5 text-sm px-2">
          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.arrowLeft | safeHtml"></span>
          Back
        </a>
        <span style="color: var(--color-border);">/</span>
        <h2 class="text-lg font-bold font-display" style="color: var(--color-text);">
          {{ isEdit() ? 'Edit Routine' : 'New Routine' }}
        </h2>
      </div>

      <div class="card">
        <div class="px-6 pt-5 pb-4" style="border-bottom: 1px solid var(--color-border);">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background-color: rgba(183,148,244,0.12); color: #B794F4;">
              <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.routines | safeHtml"></div>
            </div>
            <div>
              <p class="text-sm font-semibold font-display" style="color: var(--color-text);">Routine Details</p>
              <p class="text-xs font-mono" style="color: var(--color-muted);">Define the routine structure</p>
            </div>
          </div>
        </div>

        <form (ngSubmit)="onSubmit()" class="p-6 space-y-5">
          <app-error-message [message]="error()" />

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--color-muted);">Name</label>
            <input [(ngModel)]="form.name" name="name" required placeholder="e.g. Push Day A" class="input" />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--color-muted);">Description</label>
            <textarea [(ngModel)]="form.description" name="description" required rows="3" placeholder="Describe the routine..." class="input resize-none"></textarea>
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
            <button type="submit" [disabled]="submitting()" class="btn-primary">
              @if (submitting()) {
                <span class="w-4 h-4 rounded-full animate-spin border-2 border-white/30 border-t-white"></span>
              }
              {{ submitting() ? 'Saving...' : isEdit() ? 'Update Routine' : 'Create Routine' }}
            </button>
            <a routerLink="/routines" class="btn-secondary">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class RoutineFormPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly routineService = inject(RoutineService);
  private readonly toast = inject(ToastService);

  protected readonly icons = ICONS;
  protected readonly isEdit = signal(false);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected form: CreateRoutineDto = { name: '', description: '', frequency: 3, type: 'customized' };
  private editId?: number;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = Number(id); this.isEdit.set(true);
      this.routineService.getById(this.editId).subscribe({
        next: (res) => { this.form = { name: res.data.name, description: res.data.description, frequency: res.data.frequency, type: res.data.type }; },
        error: (err) => this.error.set(err.error?.message ?? err.message),
      });
    }
  }

  protected onSubmit() {
    if (!this.form.name || !this.form.description || !this.form.frequency) { this.error.set('Name, description, and frequency are required'); return; }
    this.submitting.set(true); this.error.set(null);
    const request = this.isEdit() ? this.routineService.update(this.editId!, this.form as UpdateRoutineDto) : this.routineService.create(this.form);
    request.subscribe({
      next: (res) => { this.toast.show(this.isEdit() ? 'Routine updated' : 'Routine created'); this.router.navigate(this.isEdit() ? ['/routines'] : ['/routines', res.data.id]); },
      error: (err) => { this.error.set(err.error?.message ?? err.message); this.submitting.set(false); },
    });
  }
}
