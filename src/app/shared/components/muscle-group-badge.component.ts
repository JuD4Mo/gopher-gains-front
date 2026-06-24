import { Component, input } from '@angular/core';
import type { MuscleGroup } from '../../models/api-response.model';

// Dark-mode friendly colors using CSS vars fallback
const MUSCLE_STYLES: Record<MuscleGroup, { bg: string; color: string }> = {
  chest: { bg: 'rgba(255,123,123,0.12)', color: '#FF7B7B' },
  back:  { bg: 'rgba(183,148,244,0.14)', color: '#B794F4' },
  legs:  { bg: 'rgba(0,172,215,0.14)',   color: '#63D4F5' },
  arms:  { bg: 'rgba(246,201,14,0.14)',  color: '#F6C90E' },
  delts: { bg: 'rgba(86,211,100,0.14)',  color: '#56D364' },
  abs:   { bg: 'rgba(0,172,215,0.10)',   color: '#00ACD7' },
};

const FALLBACK = { bg: 'rgba(125,143,168,0.14)', color: '#7D8FA8' };

@Component({
  selector: 'app-muscle-group-badge',
  standalone: true,
  template: `
    <span
      class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize font-mono tracking-wide"
      [style.background-color]="styles().bg"
      [style.color]="styles().color"
    >
      {{ group() }}
    </span>
  `,
})
export class MuscleGroupBadgeComponent {
  readonly group = input.required<MuscleGroup>();
  protected readonly styles = () => MUSCLE_STYLES[this.group()] ?? FALLBACK;
}
