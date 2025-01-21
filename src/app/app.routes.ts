import { Routes } from '@angular/router';
import { AuthComponent } from './auth/sign-in/auth.component';
import { RoleGuard } from './core/guards/role.guard';
import { CodeByRoleName } from './core/role-handlers/CodeByRoleName';
import { AdminChildrenRoutes } from './system-pages/admin/shared/models/admin-children-routes';
import { MainPageGuard } from './core/guards/main-page.guard';
import {SignUpComponent} from './auth/sign-up/sign-up.component';
import {EducatorChildrenRoutes} from './system-pages/educator/shared/models/educator-children-routes';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'sign-up', component: SignUpComponent },
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
      {
        path: 'educator',
        loadComponent: () =>
          import('./system-pages/educator/educator.component').then(
            (m) => m.EducatorComponent,
          ),
        canActivate: [RoleGuard],
        data: { permissionTypes: CodeByRoleName['educator'] },
        children: EducatorChildrenRoutes.children,
      },
      { path: '', redirectTo: 'admin', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'main', pathMatch: 'full' },
];
