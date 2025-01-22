import { DashboardCourseModel } from './dashboard-course.model';

export class DashboardResponseModel {
  courses: DashboardCourseModel[] = [];
  coursesCount: number;
  groupsCount: number;
  studentCount: number;
}
