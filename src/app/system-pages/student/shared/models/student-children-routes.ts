import { Route } from '@angular/router';
import { CalendarComponent } from '../../../../pages/calendar/calendar.component';
import { PersonalInfoComponent } from '../../../../pages/personal-info/personal-info.component';
import {StudentDashboardComponent} from '../../../../pages/student-dashboard/student-dashboard.component';
import {
  StudentCourseDetailsComponent
} from '../../../../pages/student-dashboard/shared/pages/student-course-details/student-course-details.component';

export class StudentChildrenRoutes {
  static children: Route[] = [
    {
      path: 'dashboard',
      component: StudentDashboardComponent,
      data: { title: 'Dashboard' },
    },

    {
      path: 'dashboard/course/info/:id',
      component: StudentCourseDetailsComponent,
      data: {title: 'Dashboard'},
    },
    //   children: [
    //     {
    //       path: 'about',
    //       component: CourseInfoComponent,
    //       data: { title: 'Dashboard' },
    //     },
    //     {
    //       path: 'groups',
    //       component: CourseGroupsComponent,
    //       data: { title: 'Dashboard' },
    //     },
    //     {
    //       path: 'groups/:groupId',
    //       component: GroupDetailsComponent,
    //       data: { title: 'Dashboard' },
    //       children: [
    //         {
    //           path: 'materials',
    //           component: GroupMaterialsComponent,
    //           data: { title: 'Dashboard' },
    //         },
    //         {
    //           path: 'members',
    //           component: GroupMembersComponent,
    //           data: { title: 'Dashboard' },
    //         },
    //         { path: '', redirectTo: 'materials', pathMatch: 'full' },
    //       ],
    //     },
    //     { path: '', redirectTo: 'about', pathMatch: 'full' },
    //   ],
    // },

    {
      path: 'calendar',
      component: CalendarComponent,
      data: { title: 'Calendar' },
    },

    {
      path: 'personal-info',
      component: PersonalInfoComponent,
      data: { title: 'Personal Information' },
    },

    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    // { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
  ];
}
