import { Route } from '@angular/router';
import { DashboardComponent } from '../../../../pages/dashboard/dashboard.component';
import { CoursesUpsertComponent } from '../../../../pages/dashboard/shared/pages/courses-upsert/courses-upsert.component';
import { CourseInfoComponent } from '../../../../pages/dashboard/shared/pages/course-details/shared/pages/course-info/course-info.component';
import { CourseDetailsComponent } from '../../../../pages/dashboard/shared/pages/course-details/course-details.component';
import { CourseGroupsComponent } from '../../../../pages/dashboard/shared/pages/course-details/shared/pages/course-groups/course-groups.component';
import { GroupDetailsComponent } from '../../../../pages/dashboard/shared/pages/course-details/shared/pages/group-details/group-details.component';
import { GroupMaterialsComponent } from '../../../../pages/dashboard/shared/pages/course-details/shared/pages/group-materials/group-materials.component';
import { GroupMembersComponent } from '../../../../pages/dashboard/shared/pages/course-details/shared/pages/group-details/shared/pages/group-members/group-members.component';
import { PersonalInfoComponent } from '../../../../pages/personal-info/personal-info.component';
import { CalendarComponent } from '../../../../pages/calendar/calendar.component';
import { GroupMeetingsComponent } from '../../../../pages/dashboard/shared/pages/course-details/shared/pages/group-details/shared/pages/group-meetings/group-meetings.component';
import { TransactionResultComponent } from '../../../../pages/transaction-result/transaction-result.component';
import { LecturerHelpComponent } from '../../../../pages/lecturer-help/lecturer-help.component';
import { LecturerTutorialsComponent } from '../../../../pages/lecturer-help/shared/pages/lecturer-tutorials/lecturer-tutorials.component';
import { LecturerFaqsComponent } from '../../../../pages/lecturer-help/shared/pages/lecturer-faqs/lecturer-faqs.component';
import { CourseAssignmentsComponent } from '../../../../pages/dashboard/shared/pages/course-details/shared/pages/course-assignments/course-assignments.component';
import { AssignmentDetailsComponent } from '../../../../pages/dashboard/shared/pages/course-details/shared/pages/course-assignments/shared/pages/assignment-details/assignment-details.component';
import { EducatorPlansComponent } from '../../../../pages/educator-plans/educator-plans.component';
import { EducatorSubscriptionsComponent } from '../../../../pages/educator-plans/shared/pages/educator-subscriptions/educator-subscriptions.component';
import { EducatorPackagesComponent } from '../../../../pages/educator-plans/shared/pages/educator-packages/educator-packages.component';
import { EducatorPaymentsComponent } from '../../../../pages/educator-plans/shared/pages/educator-payments/educator-payments.component';
import {
  MemberDetailsComponent
} from '../../../../pages/dashboard/shared/pages/course-details/shared/pages/group-details/shared/pages/group-members/pages/member-details/member-details.component';

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
          path: 'materials',
          component: GroupMaterialsComponent,
          data: { title: 'Dashboard' },
        },
        {
          path: 'assignments',
          component: CourseAssignmentsComponent,
          data: { title: 'Dashboard' },
        },
        {
          path: 'assignments/:id',
          component: AssignmentDetailsComponent,
          data: { title: 'Dashboard' },
        },
        {
          path: 'groups/:groupId',
          component: GroupDetailsComponent,
          data: { title: 'Dashboard' },
          children: [
            {
              path: 'members',
              component: GroupMembersComponent,
              data: { title: 'Dashboard' },
            },
            {
              path: 'members/:id',
              component: MemberDetailsComponent,
              data: { title: 'Dashboard' },
            },
            {
              path: 'meetings',
              component: GroupMeetingsComponent,
              data: { title: 'Dashboard' },
            },
            { path: '', redirectTo: 'members', pathMatch: 'full' },
          ],
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

    {
      path: 'help',
      component: LecturerHelpComponent,
      data: { title: 'Help' },
      children: [
        {
          path: 'tutorials',
          component: LecturerTutorialsComponent,
          data: { title: 'Help' },
        },
        {
          path: 'faqs',
          component: LecturerFaqsComponent,
          data: { title: 'Help' },
        },
        { path: '', redirectTo: 'tutorials', pathMatch: 'full' },
      ],
    },

    {
      path: 'plans',
      component: EducatorPlansComponent,
      data: { title: 'Plans' },
      children: [
        {
          path: 'subscriptions',
          component: EducatorSubscriptionsComponent,
          data: { title: 'Plans' },
        },
        {
          path: 'packages',
          component: EducatorPackagesComponent,
          data: { title: 'Plans' },
        },
        {
          path: 'payments',
          component: EducatorPaymentsComponent,
          data: { title: 'Plans' },
        },
        { path: '', redirectTo: 'subscriptions', pathMatch: 'full' },
      ],
    },

    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    // { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
  ];
}
