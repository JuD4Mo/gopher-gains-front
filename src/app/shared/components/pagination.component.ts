import { Component, computed, input, output } from '@angular/core';
import type { PaginationMeta } from '../../models/api-response.model';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    @if (meta(); as m) {
      <div class="flex items-center justify-between pt-5 mt-2" style="border-top: 1px solid var(--color-border);">
        <span class="text-xs font-mono" style="color: var(--color-muted);">
          {{ m.page }} / {{ m.pageCount }} pages &middot; {{ m.totalCount }} total
        </span>
        <div class="flex items-center gap-1">
          <button
            (click)="pageChange.emit(m.page - 1)"
            [disabled]="m.page <= 1"
            class="btn-ghost px-3 py-1.5 text-xs rounded-lg disabled:opacity-30"
            aria-label="Previous page"
          >
            Prev
          </button>
          @for (p of pages(); track p) {
            @if (p === -1) {
              <span class="px-2 text-xs" style="color: var(--color-muted);">&hellip;</span>
            } @else {
              <button
                (click)="pageChange.emit(p)"
                class="px-3 py-1.5 text-xs rounded-lg transition-all min-w-8 font-mono"
                [style.background-color]="p === m.page ? 'var(--color-accent)' : 'transparent'"
                [style.color]="p === m.page ? 'white' : 'var(--color-muted)'"
                [style.border]="p === m.page ? 'none' : '1px solid var(--color-border)'"
                [attr.aria-current]="p === m.page ? 'page' : null"
              >
                {{ p }}
              </button>
            }
          }
          <button
            (click)="pageChange.emit(m.page + 1)"
            [disabled]="m.page >= m.pageCount"
            class="btn-ghost px-3 py-1.5 text-xs rounded-lg disabled:opacity-30"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    }
  `,
})
export class PaginationComponent {
  readonly meta = input.required<PaginationMeta>();
  readonly pageChange = output<number>();

  protected readonly pages = computed(() => {
    const m = this.meta();
    if (!m || m.pageCount <= 1) return [1];
    const current = m.page;
    const total = m.pageCount;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: number[] = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    if (start > 2) pages.push(-1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push(-1);
    pages.push(total);
    return pages;
  });
}
