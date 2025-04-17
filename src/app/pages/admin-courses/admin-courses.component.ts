import { Component, inject } from '@angular/core';
import { CoursesResponseModel } from './shared/models/courses-response.model';
import { EducatorsService } from '../educators/educators.service';
import { EducatorsResponseModel } from '../educators/shared/models/educators-response.model';
import { AdminCoursesService } from './admin-courses.service';
import { TableComponent } from '../../shared/components/table/table.component';
import { DashboardCourseModel } from '../dashboard/shared/models/dashboard-course.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-courses',
  imports: [TableComponent],
  templateUrl: './admin-courses.component.html',
  styleUrl: './admin-courses.component.scss',
})
export class AdminCoursesComponent {
  private service: AdminCoursesService = inject(AdminCoursesService);
  private router: Router = inject(Router);
  courses: CoursesResponseModel[] = [];
  cols: any[] = [];
  constructor() {
    this.service.component = this;
    this.service.getAllLanguages();
    this.service.setCols();
  }

  getInfo(e:any) {
    this.router.navigate(['/main/admin/courses/', e.data.id]);
  }
}
