import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../shared/services/toast.service';
import type { CreateUserDto } from '../../models/user.model';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [RouterLink, FormsModule, CardComponent, ErrorMessageComponent, SafeHtmlPipe],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="flex items-center gap-3">
        <a routerLink="/users" class="btn-ghost gap-1.5 text-sm px-2">
          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.arrowLeft | safeHtml"></span>
          Back
        </a>
        <span style="color: var(--color-border);">/</span>
        <h2 class="text-lg font-bold font-display" style="color: var(--color-text);">
          {{ isEdit() ? 'Edit User' : 'New User' }}
        </h2>
      </div>

      <div class="card">
        <div class="px-6 pt-5 pb-4" style="border-bottom: 1px solid var(--color-border);">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background-color: rgba(86,211,100,0.12); color: #56D364;">
              <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.users | safeHtml"></div>
            </div>
            <div>
              <p class="text-sm font-semibold font-display" style="color: var(--color-text);">User Account</p>
              <p class="text-xs font-mono" style="color: var(--color-muted);">{{ isEdit() ? 'Update account information' : 'Create a new member account' }}</p>
            </div>
          </div>
        </div>

        <form (ngSubmit)="onSubmit()" class="p-6 space-y-5">
          <app-error-message [message]="error()" />

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--color-muted);">First Name</label>
              <input [(ngModel)]="form.name" name="name" required class="input" placeholder="John" />
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--color-muted);">Last Name</label>
              <input [(ngModel)]="form.lastName" name="lastName" required class="input" placeholder="Doe" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--color-muted);">Email</label>
            <input type="email" [(ngModel)]="form.email" name="email" required class="input" placeholder="john@example.com" />
          </div>

          @if (!isEdit()) {
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--color-muted);">Password</label>
              <input type="password" [(ngModel)]="form.password" name="password" required class="input" placeholder="••••••••" />
            </div>
          }

          <div class="flex items-center gap-3 pt-2" style="border-top: 1px solid var(--color-border);">
            <button type="submit" [disabled]="submitting()" class="btn-primary">
              @if (submitting()) {
                <span class="w-4 h-4 rounded-full animate-spin border-2 border-white/30 border-t-white"></span>
              }
              {{ submitting() ? 'Saving...' : isEdit() ? 'Update User' : 'Create User' }}
            </button>
            <a routerLink="/users" class="btn-secondary">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class UserFormPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly toast = inject(ToastService);
  protected readonly icons = ICONS;
  protected readonly isEdit = signal(false);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected form: CreateUserDto = { name: '', lastName: '', email: '', password: '' };
  private editId?: number;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = Number(id); this.isEdit.set(true);
      this.userService.getById(this.editId).subscribe({
        next: (res) => { this.form = { name: res.data.name, lastName: res.data.lastName, email: res.data.email, password: '' }; },
        error: (err) => this.error.set(err.error?.message ?? err.message),
      });
    }
  }

  protected onSubmit() {
    if (!this.form.name || !this.form.lastName || !this.form.email) { this.error.set('Name, last name, and email are required'); return; }
    if (!this.isEdit() && !this.form.password) { this.error.set('Password is required'); return; }
    this.submitting.set(true); this.error.set(null);
    const request = this.isEdit()
      ? this.userService.update(this.editId!, { name: this.form.name, lastName: this.form.lastName, email: this.form.email })
      : this.userService.create(this.form);
    request.subscribe({
      next: () => { this.toast.show(this.isEdit() ? 'User updated' : 'User created'); this.router.navigate(['/users']); },
      error: (err) => { this.error.set(err.error?.message ?? err.message); this.submitting.set(false); },
    });
  }
}
