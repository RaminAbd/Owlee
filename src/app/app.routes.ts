import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { RoleGuard } from './core/guards/role.guard';
import { CodeByRoleName } from './core/role-handlers/CodeByRoleName';
import { AdminChildrenRoutes } from './system-pages/admin/shared/models/admin-children-routes';
import { MainPageGuard } from './core/guards/main-page.guard';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  {
    path: 'main',
    canActivate: [MainPageGuard],
    loadComponent: () =>
      import('./pages/main/main.component').then((m) => m.MainComponent),
    children: [
      {
        path: 'admin',
        loadComponent: () =>
          import('./system-pages/admin/admin.component').then(
            (m) => m.AdminComponent,
          ),
        canActivate: [RoleGuard],
        data: { permissionTypes: CodeByRoleName['admin'] },
        children: AdminChildrenRoutes.children,
      },
    ],
  },
  { path: '', redirectTo: 'main', pathMatch: 'full' },
];
