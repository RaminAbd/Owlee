import {Route} from '@angular/router';
import {DashboardComponent} from '../../../../pages/dashboard/dashboard.component';
import {SubscriptionPackageComponent} from '../../../../pages/subscription-package/subscription-package.component';

export class AdminChildrenRoutes {
  static children: Route[] = [
    { path: 'dashboard', component: DashboardComponent },

    { path: 'subscription-packages', component: SubscriptionPackageComponent },

    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
  ];
}
