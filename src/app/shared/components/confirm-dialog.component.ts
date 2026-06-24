import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (visible()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background-color: rgba(0,0,0,0.65);"
        (click)="cancel()"
        role="dialog"
        [attr.aria-label]="title()"
        aria-modal="true"
      >
        <div
          class="card w-full max-w-md p-6 animate-slide-up"
          (click)="$event.stopPropagation()"
        >
          <!-- Icon -->
          <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style="background-color: rgba(207,34,46,0.12);">
            <svg viewBox="0 0 24 24" class="w-5 h-5" style="color: #FF7B7B;" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h3 class="text-base font-semibold font-display mb-1.5" style="color: var(--color-text);">{{ title() }}</h3>
          <p class="text-sm mb-6" style="color: var(--color-muted);">{{ message() }}</p>
          <div class="flex items-center justify-end gap-3">
            <button (click)="cancel()" class="btn-secondary">Cancel</button>
            <button (click)="confirm()" class="btn-danger">{{ confirmText() }}</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  private readonly state = signal<{
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
  } | null>(null);

  protected readonly visible = () => this.state() !== null;
  protected readonly title = () => this.state()?.title ?? '';
  protected readonly message = () => this.state()?.message ?? '';
  protected readonly confirmText = () => this.state()?.confirmText ?? 'Confirm';

  open(options: { title: string; message: string; confirmText?: string; onConfirm: () => void }) {
    this.state.set({ title: options.title, message: options.message, confirmText: options.confirmText ?? 'Confirm', onConfirm: options.onConfirm });
  }

  protected confirm() {
    this.state()?.onConfirm();
    this.state.set(null);
  }

  protected cancel() {
    this.state.set(null);
  }
}
