import { Component, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    @if (toastService.message(); as m) {
      <div
        class="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium shadow-modal animate-slide-up max-w-sm"
        [style.background-color]="m.type === 'success' ? '#1a3a26' : '#3a1a1c'"
        [style.border]="m.type === 'success' ? '1px solid rgba(86,211,100,0.35)' : '1px solid rgba(207,34,46,0.35)'"
        [style.color]="m.type === 'success' ? '#56D364' : '#FF7B7B'"
        role="alert"
        aria-live="polite"
      >
        <span
          class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          [style.background-color]="m.type === 'success' ? 'rgba(86,211,100,0.15)' : 'rgba(207,34,46,0.15)'"
        >
          @if (m.type === 'success') {
            <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          } @else {
            <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          }
        </span>
        <span style="color: var(--color-text);">{{ m.text }}</span>
      </div>
    }
  `,
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);
}
