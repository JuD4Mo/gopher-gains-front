import { Component, input } from '@angular/core';
import { SafeHtmlPipe } from '../safe-html.pipe';

const MASCOT_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gopher-Gains-Logo-v1-Photoroom-WfSlqGUxq90Xa0oAPjDPNoaGcCYtXQ.png';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [SafeHtmlPipe],
  template: `
    <div class="flex flex-col items-center justify-center py-16 text-center gap-4">
      @if (useMascot()) {
        <img
          [src]="mascotUrl"
          alt="No content yet"
          class="w-20 h-20 object-contain opacity-70"
          width="80"
          height="80"
        />
      } @else if (icon()) {
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6"
          style="background-color: var(--color-accent-dim); color: var(--color-accent);"
          [innerHTML]="icon() | safeHtml"
          aria-hidden="true"
        ></div>
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
  protected readonly mascotUrl = MASCOT_URL;
}
