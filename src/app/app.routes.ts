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
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {TransactionResultComponent} from './pages/transaction-result/transaction-result.component';
import {AdminSignInComponent} from './auth/admin-sign-in/admin-sign-in.component';
import {GoogleAuthCallbackComponent} from './auth/google-auth-callback/google-auth-callback.component';
import {StudentSignUpNewComponent} from './auth/student-sign-up-new/student-sign-up-new.component';
import {CoursesComponent} from './pages/courses/courses.component';
import {GuestChildrenRoutes} from './system-pages/guest/models/guest-children-routes';

export const routes: Routes = [

  { path: 'admin-access', component: AdminSignInComponent, data: { title: 'Sign in' } },
  { path: 'auth', component: AuthComponent, data: { title: 'Sign in' } },
  { path: 'auth/redirect/:id', component: AuthComponent, data: { title: 'Sign in' } },
  { path: 'auth/callback', component: GoogleAuthCallbackComponent },

  { path: 'forgot/:role', component: ForgotPasswordComponent, data: { title: 'Forgot password' } },
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
    path: 'student-sign-up',
    component: StudentSignUpNewComponent,
    data: { title: 'Sign up' },
  },
  {
    path: '',
    loadComponent: () =>
      import('./system-pages/guest/guest.component').then(
        (m) => m.GuestComponent
      ),
    children: GuestChildrenRoutes.children,
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

  { path: 'result/:id', component: TransactionResultComponent },
  { path: '**', redirectTo: 'main', pathMatch: 'full' },
  // { path: '', redirectTo: 'main', pathMatch: 'full' },
];
