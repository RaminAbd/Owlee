import { Route } from '@angular/router';
import { DashboardComponent } from '../../../../pages/dashboard/dashboard.component';
import { SubscriptionPackageComponent } from '../../../../pages/subscription-package/subscription-package.component';
import { SubscriptionPackageUpsertComponent } from '../../../../pages/subscription-package/shared/pages/subscription-package-upsert/subscription-package-upsert.component';
import { KnownLanguagesComponent } from '../../../../pages/known-languages/known-languages.component';
import { KnownLanguagesUpsertComponent } from '../../../../pages/known-languages/shared/pages/known-languages-upsert/known-languages-upsert.component';
import { StudentsComponent } from '../../../../pages/students/students.component';
import { EducatorsComponent } from '../../../../pages/educators/educators.component';
import { AdminCoursesComponent } from '../../../../pages/admin-courses/admin-courses.component';
import { StudentCourseDetailsComponent } from '../../../../pages/student-dashboard/shared/pages/student-course-details/student-course-details.component';
import { StudentDetailsComponent } from '../../../../pages/students/shared/pages/student-details/student-details.component';
import { EducatorDetailsComponent } from '../../../../pages/educators/shared/pages/educator-details/educator-details.component';
import {
  AdminCourseDetailsComponent
} from '../../../../pages/admin-courses/shared/pages/admin-course-details/admin-course-details.component';

export class AdminChildrenRoutes {
  static children: Route[] = [
    {
      path: 'subscription-packages',
      component: SubscriptionPackageComponent,
      data: { title: 'Subscription Packages' },
    },
    {
      path: 'subscription-packages/:id',
      component: SubscriptionPackageUpsertComponent,
      data: { title: 'Subscription Packages' },
    },

    {
      path: 'system-languages',
      component: KnownLanguagesComponent,
      data: { title: 'System Languages' },
    },
    {
      path: 'system-languages/:id',
      component: KnownLanguagesUpsertComponent,
      data: { title: 'System Languages' },
    },

    {
      path: 'students',
      component: StudentsComponent,
      data: { title: 'Students' },
    },
    {
      path: 'students/:id',
      component: StudentDetailsComponent,
      data: { title: 'Students' },
    },
    {
      path: 'educators',
      component: EducatorsComponent,
      data: { title: 'Educators' },
    },
    {
      path: 'educators/:id',
      component: EducatorDetailsComponent,
      data: { title: 'Educators' },
    },
    {
      path: 'courses',
      component: AdminCoursesComponent,
      data: { title: 'Courses' },
    },

    {
      path: 'courses/:id',
      component: AdminCourseDetailsComponent,
      data: { title: 'Dashboard' },
    },

    { path: '', redirectTo: 'courses', pathMatch: 'full' },
    { path: '**', redirectTo: 'courses', pathMatch: 'full' },
  ];
}
