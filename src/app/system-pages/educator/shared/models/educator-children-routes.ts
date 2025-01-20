import { Route } from '@angular/router';
import {DashboardComponent} from '../../../../pages/dashboard/dashboard.component';

export class AdminChildrenRoutes {
  static children: Route[] = [
    { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
  ];
}
