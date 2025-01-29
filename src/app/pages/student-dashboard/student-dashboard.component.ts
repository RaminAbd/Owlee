import { Component, inject } from '@angular/core';
import { DashboardResponseModel } from '../dashboard/shared/models/dashboard-response.model';
import { DashboardService } from '../dashboard/dashboard.service';
import { Router } from '@angular/router';
import { DashboardCourseModel } from '../dashboard/shared/models/dashboard-course.model';
import { StudentDashboardService } from './student-dashboard.service';
import { StudentDashboardResponseModel } from './shared/models/student-dashboard-response.model';
import {NgForOf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-student-dashboard',
  imports: [
    NgForOf,
    ReactiveFormsModule,
    TranslatePipe,
    FormsModule
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
})
export class StudentDashboardComponent {
  response: StudentDashboardResponseModel = new StudentDashboardResponseModel();
  private service: StudentDashboardService = inject(StudentDashboardService);
  private router: Router = inject(Router);
  searchText: string;
  constructor() {
    this.service.component = this;
    this.service.getDashboard();
  }

  getInfo(item: DashboardCourseModel) {
    this.router.navigate([
      '/main/student/dashboard/course/info',
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
