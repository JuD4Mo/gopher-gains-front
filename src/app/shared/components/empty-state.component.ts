import { Component, input } from '@angular/core';
import { SafeHtmlPipe } from '../safe-html.pipe';
import { MascotComponent } from './mascot.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [SafeHtmlPipe, MascotComponent],
  template: `
    <div class="flex flex-col items-center justify-center py-16 text-center gap-4">
      @if (useMascot()) {
        <app-mascot variant="thinking" size="lg" alt="No content yet" />
      } @else if (icon()) {
        <div class="w-12 h-12 rounded-xl flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6" style="background-color: var(--color-accent-dim); color: var(--color-accent);" [innerHTML]="icon() | safeHtml" aria-hidden="true"></div>
      }
      <div>
        <h3 class="text-sm font-semibold font-display" style="color: var(--color-text);">{{ title() }}</h3>
        <p class="text-sm mt-1 max-w-xs" style="color: var(--color-muted);">{{ message() }}</p>
      </div>
    </div>
  `,
})
export class EmptyStateComponent {
  readonly icon = input<string>('');
  readonly title = input<string>('Nothing here yet');
  readonly message = input<string>('');
  readonly useMascot = input<boolean>(false);
}
