import { Injectable, signal } from '@angular/core';
import type { UserRole } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'gg_role';

  readonly currentRole = signal<UserRole | null>(this.loadRole());

  private loadRole(): UserRole | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored === 'admin' || stored === 'user') return stored;
    return null;
  }

  isAuthenticated(): boolean {
    return this.currentRole() !== null;
  }

  login(role: UserRole): void {
    localStorage.setItem(this.STORAGE_KEY, role);
    this.currentRole.set(role);
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentRole.set(null);
  }
}
