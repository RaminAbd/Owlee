import { Route } from '@angular/router';
import { HomeComponent } from '../../../pages/home/home.component';
import { CoursesComponent } from '../../../pages/courses/courses.component';
import { AboutUsComponent } from '../../../pages/about-us/about-us.component';
import { CourseDetailsComponent } from '../../../pages/courses/shared/pages/course-details/course-details.component';
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
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    // { path: '**', redirectTo: 'projects', pathMatch: 'full' },
  ];
}
