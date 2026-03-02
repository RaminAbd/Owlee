import { Route } from '@angular/router';
import { HomeComponent } from '../../../pages/home/home.component';
import { CoursesComponent } from '../../../pages/courses/courses.component';
import { AboutUsComponent } from '../../../pages/about-us/about-us.component';
import { CourseDetailsComponent } from '../../../pages/courses/shared/pages/course-details/course-details.component';
import {TermsComponent} from '../../../pages/docs/terms/terms.component';
import {HomePrivacyComponent} from '../../../pages/docs/home-privacy/home-privacy.component';
import {
  EducatorSignupPolicyComponent
} from '../../../pages/docs/educator-signup-policy/educator-signup-policy.component';
import {StudentSignupPolicyComponent} from '../../../pages/docs/student-signup-policy/student-signup-policy.component';
import {
  EducatorPaymentPolicyComponent
} from '../../../pages/docs/educator-payment-policy/educator-payment-policy.component';
export class GuestChildrenRoutes {
  static children: Route[] = [
    { path: 'home', component: HomeComponent, data: { title: 'Home' } },
    {
      path: 'courses',
      component: CoursesComponent,
      data: { title: 'Courses' },
    },
    {
      path: 'courses/:id',
      component: CourseDetailsComponent,
      data: { title: 'Courses' },
    },
    {
      path: 'about',
      component: AboutUsComponent,
      data: { title: 'About Us' },
    },
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
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    // { path: '**', redirectTo: 'projects', pathMatch: 'full' },
  ];
}
