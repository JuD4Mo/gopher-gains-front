import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div
      class="card"
      [class.border-t-2]="accentColor()"
      [class.border-t-accent]="accentColor() === 'accent'"
      [style.border-top-color]="accentColor() === 'go' ? 'var(--color-accent)' : null"
    >
      <ng-content />
    </div>
  `,
})
export class CardComponent {
  readonly accentColor = input<string>();
}
