import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { RoutineSelectionModalComponent } from './routine-selection-modal.component';
import { SessionService } from '../../services/session.service';
import { ToastService } from '../../shared/services/toast.service';
import { UserService } from '../../services/user.service';
import type { User } from '../../models/user.model';
import type { Routine } from '../../models/routine.model';
import { catchError, of } from 'rxjs';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-session-form',
  standalone: true,
  imports: [RouterLink, FormsModule, ErrorMessageComponent, RoutineSelectionModalComponent, SafeHtmlPipe],
  template: `
    @if (showRoutineModal()) {
      <app-routine-selection-modal [userId]="userId" (routineSelected)="onRoutineSelected($event)" />
    }

    <div class="p-5 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div class="flex items-center gap-3">
        <a routerLink="/sessions" class="btn-ghost gap-1.5 text-sm px-2">
          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.arrowLeft | safeHtml"></span>
          Back
        </a>
        <span style="color: var(--color-border);">/</span>
        <h2 class="text-lg font-bold font-display" style="color: var(--color-text);">New Session</h2>
      </div>

      <div class="card">
        <div class="px-6 pt-5 pb-4" style="border-bottom: 1px solid var(--color-border);">
          <p class="text-sm font-semibold font-display" style="color: var(--color-text);">Start Workout Session</p>
          <p class="text-xs font-mono" style="color: var(--color-muted);">Configure and begin your training</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="p-6 space-y-5">
          <app-error-message [message]="error()" />

          @if (selectedRoutine()) {
            <div class="flex items-center gap-3 p-4 rounded-lg" style="background-color: var(--color-accent-dim); border: 1px solid rgba(61,184,255,0.2);">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background-color: var(--color-accent); color: white;">
                <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.routines | safeHtml"></div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-mono" style="color: var(--color-muted);">Selected Routine</p>
                <p class="text-sm font-semibold font-display truncate" style="color: var(--color-accent);">{{ selectedRoutine()!.name }}</p>
              </div>
              <button type="button" (click)="showRoutineModal.set(true)" class="btn-ghost text-xs px-2.5 py-1.5">Change</button>
            </div>
          } @else {
            <div class="flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all" style="border: 1px dashed var(--color-border);" (click)="showRoutineModal.set(true)">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background-color: var(--color-card-hover); color: var(--color-muted);">
                <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.routines | safeHtml"></div>
              </div>
              <div>
                <p class="text-sm font-medium" style="color: var(--color-muted);">No routine selected</p>
                <p class="text-xs font-mono" style="color: var(--color-muted); opacity: 0.6;">Click to select a routine</p>
              </div>
            </div>
          }

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--color-muted);">User</label>
            <select [(ngModel)]="userId" name="userId" required class="input">
              <option value="0" disabled>Select a user</option>
              @for (u of users(); track u.id) { <option [ngValue]="u.id">{{ u.name }} {{ u.lastName }} ({{ u.email }})</option> }
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--color-muted);">Observations <span class="normal-case font-normal" style="color: var(--color-muted);">(optional)</span></label>
            <textarea [(ngModel)]="observations" name="observations" rows="3" placeholder="Any notes about this session..." class="input resize-none"></textarea>
          </div>

          <div class="flex items-center gap-3 pt-2" style="border-top: 1px solid var(--color-border);">
            <button type="submit" [disabled]="submitting()" class="btn-primary">
              @if (submitting()) { <span class="w-4 h-4 rounded-full animate-spin border-2 border-white/30 border-t-white"></span> }
              {{ submitting() ? 'Starting...' : 'Start Session' }}
            </button>
            <a routerLink="/sessions" class="btn-secondary">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class SessionFormPage implements OnInit {
  private readonly router = inject(Router);
  private readonly sessionService = inject(SessionService);
  private readonly userService = inject(UserService);
  private readonly toast = inject(ToastService);
  protected readonly icons = ICONS;
  protected readonly users = signal<User[]>([]);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly showRoutineModal = signal(true);
  protected readonly selectedRoutine = signal<Routine | null>(null);
  protected userId = 0;
  protected observations = '';

  ngOnInit() {
    this.userService.getAll({ limit: 100 }).pipe(catchError(() => of(null))).subscribe({
      next: (res) => { if (res) this.users.set(res.data); },
    });
  }

  protected onRoutineSelected(routine: Routine | null) {
    if (!routine) { this.showRoutineModal.set(false); return; }
    this.selectedRoutine.set(routine);
    this.showRoutineModal.set(false);
  }

  protected onSubmit() {
    if (!this.userId) { this.error.set('Please select a user'); return; }
    this.submitting.set(true); this.error.set(null);
    this.sessionService.create({ userId: this.userId, observations: this.observations || undefined }).subscribe({
      next: (res) => { this.toast.show('Session started'); this.router.navigate(['/sessions', res.data.id]); },
      error: (err) => { this.error.set(err.error?.message ?? err.message); this.submitting.set(false); },
    });
  }
}
