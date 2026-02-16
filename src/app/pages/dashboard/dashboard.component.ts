import { Component, inject } from '@angular/core';
import { DashboardResponseModel } from './shared/models/dashboard-response.model';
import { DashboardService } from './dashboard.service';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CoursesResponseModel } from '../admin-courses/shared/models/courses-response.model';
import { NgForOf } from '@angular/common';
import { DashboardCourseModel } from './shared/models/dashboard-course.model';

@Component({
  selector: 'app-dashboard',
  imports: [TranslatePipe, FormsModule, NgForOf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  response: DashboardResponseModel = new DashboardResponseModel();
  private service: DashboardService = inject(DashboardService);
  private router: Router = inject(Router);
  searchText: string;
  rating: number = 0;
  constructor() {
    this.service.component = this;
    this.service.getDashboard();
    this.service.getEducator();
  }
  create() {
    this.router.navigate(['/main/educator/dashboard/course/upsert', 'create']);
  }

  getInfo(item: DashboardCourseModel) {
    this.router.navigate([
      '/main/educator/dashboard/course/info',
      item.courseId,
    ]);
  }

  filteredList: DashboardCourseModel[] = [];

  searchByName() {
    this.filteredList = this.response.courses.filter((obj) =>
      obj.name.toLowerCase().includes(this.searchText.toLowerCase()),
    );
    console.log(this.filteredList);
  }
}
