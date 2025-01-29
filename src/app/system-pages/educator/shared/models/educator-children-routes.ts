import { Route } from '@angular/router';
import { DashboardComponent } from '../../../../pages/dashboard/dashboard.component';
import { CoursesUpsertComponent } from '../../../../pages/dashboard/shared/pages/courses-upsert/courses-upsert.component';
import { CourseInfoComponent } from '../../../../pages/dashboard/shared/pages/course-details/shared/pages/course-info/course-info.component';
import { CourseDetailsComponent } from '../../../../pages/dashboard/shared/pages/course-details/course-details.component';
import { CourseGroupsComponent } from '../../../../pages/dashboard/shared/pages/course-details/shared/pages/course-groups/course-groups.component';
import {
  GroupDetailsComponent
} from '../../../../pages/dashboard/shared/pages/course-details/shared/pages/group-details/group-details.component';
import {
  GroupMaterialsComponent
} from '../../../../pages/dashboard/shared/pages/course-details/shared/pages/group-details/shared/pages/group-materials/group-materials.component';
import {
  GroupMembersComponent
} from '../../../../pages/dashboard/shared/pages/course-details/shared/pages/group-details/shared/pages/group-members/group-members.component';
import {PersonalInfoComponent} from '../../../../pages/personal-info/personal-info.component';
import {CalendarComponent} from '../../../../pages/calendar/calendar.component';

export class EducatorChildrenRoutes {
  static children: Route[] = [
    {
      path: 'dashboard',
      component: DashboardComponent,
      data: { title: 'Dashboard' },
    },
    {
      path: 'dashboard/course/upsert/:id',
      component: CoursesUpsertComponent,
      data: { title: 'Dashboard' },
    },
    {
      path: 'dashboard/course/info/:id',
      component: CourseDetailsComponent,
      data: { title: 'Dashboard' },
      children: [
        {
          path: 'about',
          component: CourseInfoComponent,
          data: { title: 'Dashboard' },
        },
        {
          path: 'groups',
          component: CourseGroupsComponent,
          data: { title: 'Dashboard' },
        },
        {
          path: 'groups/:groupId',
          component: GroupDetailsComponent,
          data: { title: 'Dashboard' },
          children:[
            {
              path: 'materials',
              component: GroupMaterialsComponent,
              data: { title: 'Dashboard' },
            },
            {
              path: 'members',
              component: GroupMembersComponent,
              data: { title: 'Dashboard' },
            },
            { path: '', redirectTo: 'materials', pathMatch: 'full' },
          ]
        },
        { path: '', redirectTo: 'about', pathMatch: 'full' },
      ],
    },

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
