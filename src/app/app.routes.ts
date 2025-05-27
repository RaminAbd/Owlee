import { Routes } from '@angular/router';
import { AuthComponent } from './auth/sign-in/auth.component';
import { RoleGuard } from './core/guards/role.guard';
import { CodeByRoleName } from './core/role-handlers/CodeByRoleName';
import { AdminChildrenRoutes } from './system-pages/admin/shared/models/admin-children-routes';
import { MainPageGuard } from './core/guards/main-page.guard';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { EducatorChildrenRoutes } from './system-pages/educator/shared/models/educator-children-routes';
import { StudentSignUpComponent } from './auth/student-sign-up/student-sign-up.component';
import { StudentChildrenRoutes } from './system-pages/student/shared/models/student-children-routes';
import { HomeComponent } from './pages/home/home.component';
import { TermsComponent } from './pages/docs/terms/terms.component';
import { HomePrivacyComponent } from './pages/docs/home-privacy/home-privacy.component';
import {EducatorSignupPolicyComponent} from './pages/docs/educator-signup-policy/educator-signup-policy.component';
import {StudentSignupPolicyComponent} from './pages/docs/student-signup-policy/student-signup-policy.component';
import {EducatorPaymentPolicyComponent} from './pages/docs/educator-payment-policy/educator-payment-policy.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, data: { title: 'Home' } },
  { path: 'auth', component: AuthComponent, data: { title: 'Sign in' } },
  {
    path: 'terms-conditions',
    component: TermsComponent,
    data: { title: 'Terms' },
  },
  {
    path: 'privacy',
    component: HomePrivacyComponent,
    data: { title: 'Privacy' },
  },

  {
    path: 'educator-privacy',
    component: EducatorSignupPolicyComponent,
    data: { title: 'Privacy' },
  },
  {
    path: 'student-privacy',
    component: StudentSignupPolicyComponent,
    data: { title: 'Privacy' },
  },
  {
    path: 'payment-policy',
    component: EducatorPaymentPolicyComponent,
    data: { title: 'Privacy' },
  },


  { path: 'sign-up', component: SignUpComponent, data: { title: 'Sign up' } },
  {
    path: 'student-sign-up/:id',
    component: StudentSignUpComponent,
    data: { title: 'Sign up' },
  },
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
      {
        path: 'student',
        loadComponent: () =>
          import('./system-pages/student/student.component').then(
            (m) => m.StudentComponent,
          ),
        canActivate: [RoleGuard],
        data: { permissionTypes: CodeByRoleName['student'] },
        children: StudentChildrenRoutes.children,
      },
      { path: '**', redirectTo: 'admin', pathMatch: 'full' },
      { path: '', redirectTo: 'admin', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'main', pathMatch: 'full' },
  // { path: '', redirectTo: 'main', pathMatch: 'full' },
];
