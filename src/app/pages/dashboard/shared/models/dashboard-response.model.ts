import { CoursesResponseModel } from '../../../admin-courses/shared/models/courses-response.model';

export class DashboardResponseModel {
  courses: CoursesResponseModel[] = [];
  coursesCount: number;
  groupsCount: number;
  studentCount: number;
}
