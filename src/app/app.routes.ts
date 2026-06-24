import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { DefaultLayoutComponent } from './core/layout/default-layout.component';
import { LandingPage } from './features/landing/landing.page';
import { LoginPage } from './features/auth/login.page';
import { AdminDashboardPage } from './features/dashboard/admin-dashboard.page';
import { AthleteDashboardPage } from './features/dashboard/athlete-dashboard.page';
import { ExerciseListPage } from './features/exercises/exercise-list.page';
import { ExerciseFormPage } from './features/exercises/exercise-form.page';
import { RoutineListPage } from './features/routines/routine-list.page';
import { RoutineFormPage } from './features/routines/routine-form.page';
import { RoutineDetailPage } from './features/routines/routine-detail.page';
import { RoutineEditPage } from './features/routines/routine-edit.page';
import { UserListPage } from './features/users/user-list.page';
import { UserFormPage } from './features/users/user-form.page';
import { SessionListPage } from './features/sessions/session-list.page';
import { SessionFormPage } from './features/sessions/session-form.page';
import { SessionDetailPage } from './features/sessions/session-detail.page';
import { AssignmentPage } from './features/assignments/assignment.page';
import { AuthService } from './core/services/auth.service';

const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) return true;
  return router.createUrlTree(['/login']);
};

export const routes: Routes = [
  { path: '',      component: LandingPage, title: 'Gopher Gains' },
  { path: 'login', component: LoginPage,   title: 'Sign In' },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'admin',            component: AdminDashboardPage,  title: 'Dashboard' },
      { path: 'my',               component: AthleteDashboardPage, title: 'My Dashboard' },
      { path: 'exercises',        component: ExerciseListPage,    title: 'Exercises' },
      { path: 'exercises/new',    component: ExerciseFormPage,    title: 'New Exercise' },
      { path: 'exercises/:id',    component: ExerciseFormPage,    title: 'Edit Exercise' },
      { path: 'routines',         component: RoutineListPage,     title: 'Routines' },
      { path: 'routines/new',     component: RoutineFormPage,     title: 'New Routine' },
      { path: 'routines/:id',     component: RoutineDetailPage,   title: 'Routine Detail' },
      { path: 'routines/:id/edit',component: RoutineEditPage,     title: 'Edit Routine' },
      { path: 'users',            component: UserListPage,        title: 'Users' },
      { path: 'users/new',        component: UserFormPage,        title: 'New User' },
      { path: 'users/:id',        component: UserFormPage,        title: 'Edit User' },
      { path: 'sessions',         component: SessionListPage,     title: 'Sessions' },
      { path: 'sessions/new',     component: SessionFormPage,     title: 'New Session' },
      { path: 'sessions/:id',     component: SessionDetailPage,   title: 'Session Detail' },
      { path: 'assignments',      component: AssignmentPage,      title: 'Assignments' },
    ],
  },
  { path: '**', redirectTo: '/' },
];
