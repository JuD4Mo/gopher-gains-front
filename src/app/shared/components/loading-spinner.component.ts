import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center py-16 gap-4">
      <div
        class="rounded-full animate-spin"
        [class.w-8]="size() !== 'lg'"
        [class.h-8]="size() !== 'lg'"
        [class.w-12]="size() === 'lg'"
        [class.h-12]="size() === 'lg'"
        style="border: 2px solid var(--color-border); border-top-color: var(--color-accent);"
        [style.border-width]="size() === 'lg' ? '3px' : '2px'"
      ></div>
      <span class="text-xs font-mono" style="color: var(--color-muted);">Loading...</span>
    </div>
  `,
})
export class LoadingSpinnerComponent {
  readonly size = input<'sm' | 'lg'>('sm');
}
