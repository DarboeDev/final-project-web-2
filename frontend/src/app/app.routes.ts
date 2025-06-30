import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ManagerGuard } from './guards/manager.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./components/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/layout/layout.component').then(
        (m) => m.LayoutComponent
      ),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/projects/project-list.component').then(
            (m) => m.ProjectListComponent
          ),
      },
      {
        path: 'projects/new',
        loadComponent: () =>
          import('./pages/projects/project-form.component').then(
            (m) => m.ProjectFormComponent
          ),
        canActivate: [ManagerGuard],
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import('./pages/projects/project-detail.component').then(
            (m) => m.ProjectDetailComponent
          ),
      },
      {
        path: 'projects/:id/edit',
        loadComponent: () =>
          import('./pages/projects/project-form.component').then(
            (m) => m.ProjectFormComponent
          ),
        canActivate: [ManagerGuard],
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/tasks/task-list.component').then(
            (m) => m.TaskListComponent
          ),
      },
      {
        path: 'tasks/new',
        loadComponent: () =>
          import('./pages/tasks/task-form.component').then(
            (m) => m.TaskFormComponent
          ),
      },
      {
        path: 'tasks/:id',
        loadComponent: () =>
          import('./pages/tasks/task-detail.component').then(
            (m) => m.TaskDetailComponent
          ),
      },
      {
        path: 'tasks/:id/edit',
        loadComponent: () =>
          import('./pages/tasks/task-form.component').then(
            (m) => m.TaskFormComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/user-profile/user-profile.component').then(
            (m) => m.UserProfileComponent
          ),
      },
      {
        path: 'users/:id',
        loadComponent: () =>
          import('./components/user-profile/user-profile.component').then(
            (m) => m.UserProfileComponent
          ),
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('./pages/admin/admin.component').then((m) => m.AdminComponent),
        canActivate: [AdminGuard],
      },
      {
        path: 'team',
        loadComponent: () =>
          import('./pages/team/team.component').then((m) => m.TeamComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
