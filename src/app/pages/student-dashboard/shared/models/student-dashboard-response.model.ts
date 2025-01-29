import {DashboardCourseModel} from '../../../dashboard/shared/models/dashboard-course.model';

export class StudentDashboardResponseModel {
  courses: DashboardCourseModel[] = [];
  coursesCount: number;
  todayMeetingCount: number;
  materialsCount: number;
}
