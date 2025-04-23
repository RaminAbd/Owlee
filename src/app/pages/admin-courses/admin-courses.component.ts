import { Component, inject } from '@angular/core';
import { CoursesResponseModel } from './shared/models/courses-response.model';
import { AdminCoursesService } from './admin-courses.service';
import { TableComponent } from '../../shared/components/table/table.component';
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
    this.service.getAll();
    this.service.setCols();
  }

  getInfo(e: any) {
    this.router.navigate(['/main/admin/courses/', e.data.courseId]);
  }
}
