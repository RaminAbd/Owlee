import { Route } from '@angular/router';
import {DashboardComponent} from '../../../../pages/dashboard/dashboard.component';
import {CoursesUpsertComponent} from '../../../../pages/dashboard/shared/pages/courses-upsert/courses-upsert.component';

export class EducatorChildrenRoutes {
  static children: Route[] = [
    { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
    { path: 'course/upsert/:id', component: CoursesUpsertComponent, data: { title: 'Course' } },


    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    // { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
  ];
}
