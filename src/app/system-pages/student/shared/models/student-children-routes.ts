import { Route } from '@angular/router';
import { CalendarComponent } from '../../../../pages/calendar/calendar.component';
import { PersonalInfoComponent } from '../../../../pages/personal-info/personal-info.component';
import {StudentDashboardComponent} from '../../../../pages/student-dashboard/student-dashboard.component';
import {
  StudentCourseDetailsComponent
} from '../../../../pages/student-dashboard/shared/pages/student-course-details/student-course-details.component';
import {StudentPersonalInfoComponent} from '../../../../pages/student-personal-info/student-personal-info.component';
import {StudentCalendarComponent} from '../../../../pages/student-calendar/student-calendar.component';
import {InvitationsComponent} from '../../../../pages/invitations/invitations.component';
import {
  StudentAssignmentDetailsComponent
} from '../../../../pages/student-dashboard/shared/pages/student-assignment-details/student-assignment-details.component';

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

    {
      path: 'dashboard/course/info/:id/:assignmentId',
      component: StudentAssignmentDetailsComponent,
      data: {title: 'Dashboard'},
    },

    {
      path: 'calendar',
      component: StudentCalendarComponent,
      data: { title: 'Calendar' },
    },

    {
      path: 'personal-info',
      component: StudentPersonalInfoComponent,
      data: { title: 'Personal Information' },
    },

    {
      path: 'invitations',
      component: InvitationsComponent,
      data: { title: 'Invitations' },
    },


    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
  ];
}
