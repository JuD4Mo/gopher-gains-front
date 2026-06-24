import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { PaginationComponent } from '../../shared/components/pagination.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { UserService } from '../../services/user.service';
import type { User } from '../../models/user.model';
import type { PaginationMeta } from '../../models/api-response.model';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [RouterLink, FormsModule, CardComponent, LoadingSpinnerComponent, EmptyStateComponent, PaginationComponent, ErrorMessageComponent, SafeHtmlPipe],
  template: `
    <div class="space-y-6">

      <!-- Page header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg flex items-center justify-center" style="background-color: rgba(86,211,100,0.12); color: #56D364;">
            <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.users | safeHtml"></div>
          </div>
          <div>
            <h2 class="text-lg font-bold font-display leading-none" style="color: var(--color-text);">Users</h2>
            <p class="text-xs font-mono mt-0.5" style="color: var(--color-muted);">Registered members</p>
          </div>
        </div>
        <a routerLink="/users/new" class="btn-primary">
          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.plus | safeHtml"></span>
          New User
        </a>
      </div>

      <!-- Table card -->
      <div class="card">
        <!-- Filter -->
        <div class="p-5" style="border-bottom: 1px solid var(--color-border);">
          <div class="relative max-w-xs">
            <div
              class="absolute inset-y-0 left-3 flex items-center pointer-events-none [&>svg]:w-4 [&>svg]:h-4"
              style="color: var(--color-muted);"
              [innerHTML]="icons.search | safeHtml"
            ></div>
            <input [(ngModel)]="nameFilter" (input)="onFilterChange()" placeholder="Search users..." class="input pl-9" />
          </div>
        </div>

        @if (loading()) { <app-loading-spinner /> }
        @else if (error()) { <app-error-message [message]="error()" /> }
        @else if (users().length === 0) { <app-empty-state [icon]="icons.emptyBox" title="No users yet" message="Register your first user." /> }
        @else {
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr>
                  <th class="table-header-cell">Name</th>
                  <th class="table-header-cell hidden sm:table-cell">Email</th>
                  <th class="table-header-cell text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (u of users(); track u.id) {
                  <tr class="table-row">
                    <td class="table-cell">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono flex-shrink-0"
                          style="background-color: var(--color-accent-dim); color: var(--color-accent);"
                        >{{ u.name.charAt(0).toUpperCase() }}{{ u.lastName.charAt(0).toUpperCase() }}</div>
                        <span class="font-medium">{{ u.name }} {{ u.lastName }}</span>
                      </div>
                    </td>
                    <td class="table-cell hidden sm:table-cell font-mono" style="color: var(--color-muted);">{{ u.email }}</td>
                    <td class="table-cell text-right">
                      <a
                        [routerLink]="['/users', u.id]"
                        class="btn-ghost text-xs px-2.5 py-1.5"
                        [attr.aria-label]="'Edit ' + u.name + ' ' + u.lastName"
                      >
                        <span class="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.edit | safeHtml"></span>
                        Edit
                      </a>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div class="px-5 pb-5">
            <app-pagination [meta]="pagination()" (pageChange)="onPageChange($event)" />
          </div>
        }
      </div>
    </div>
  `,
})
export class UserListPage implements OnInit {
  private readonly userService = inject(UserService);
  protected readonly icons = ICONS;
  protected readonly users = signal<User[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly pagination = signal<PaginationMeta>({ page: 1, perPage: 10, pageCount: 0, totalCount: 0 });
  protected nameFilter = '';
  private currentPage = 1;

  ngOnInit() { this.load(); }
  private load() {
    this.loading.set(true); this.error.set(null);
    this.userService.getAll({ name: this.nameFilter || undefined, page: this.currentPage }).subscribe({
      next: (res) => { this.users.set(res.data); if (res.meta) this.pagination.set(res.meta); this.loading.set(false); },
      error: (err) => { this.error.set(err.error?.message ?? err.message); this.loading.set(false); },
    });
  }
  protected onFilterChange() { this.currentPage = 1; this.load(); }
  protected onPageChange(p: number) { this.currentPage = p; this.load(); }
}
