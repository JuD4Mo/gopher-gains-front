import { Component, input } from '@angular/core';
import type { SessionStatus } from '../../models/api-response.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span
      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-mono"
      [style.background-color]="status() === 'finished' ? 'rgba(45,164,78,0.14)' : 'rgba(0,172,215,0.14)'"
      [style.color]="status() === 'finished' ? '#56D364' : '#00ACD7'"
    >
      <span
        class="w-1.5 h-1.5 rounded-full flex-shrink-0"
        [style.background-color]="status() === 'finished' ? '#56D364' : '#00ACD7'"
        [class.animate-pulse]="status() === 'in_progress'"
      ></span>
      {{ status() === 'in_progress' ? 'In Progress' : 'Finished' }}
    </span>
  `,
})
export class StatusBadgeComponent {
  readonly status = input.required<SessionStatus>();
}
