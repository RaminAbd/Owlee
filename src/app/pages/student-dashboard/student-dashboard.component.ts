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
import {DropdownModule} from 'primeng/dropdown';
import {CategoriesResponseModel} from '../categories/shared/models/categories-response.model';

@Component({
  selector: 'app-student-dashboard',
  imports: [
    NgForOf,
    ReactiveFormsModule,
    TranslatePipe,
    FormsModule,
    DropdownModule
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
})
export class StudentDashboardComponent {
  response: StudentDashboardResponseModel = new StudentDashboardResponseModel();
  private service: StudentDashboardService = inject(StudentDashboardService);
  private router: Router = inject(Router);
  categoryId: string;
  categories: CategoriesResponseModel[] = [];
  searchText: string;
  constructor() {
    this.service.component = this;
    this.service.getDashboard();
    this.service.getCategories();
  }

  getInfo(item: DashboardCourseModel) {
    console.log(item)
    this.router.navigate([
      '/main/student/dashboard/course/info',
      item.id,
    ]);
  }

  filteredList: DashboardCourseModel[] = [];

  search() {
    const text = this.searchText?.trim().toLowerCase() || '';

    this.filteredList = this.response.courses.filter((item) => {
      const matchesText =
        !text ||
        String(item.name || '')
          .toLowerCase()
          .includes(text);

      const matchesCategory =
        !this.categoryId ||               // null / undefined
        this.categoryId === 'all' ||      // "All" selected
        item.categoryId === this.categoryId;

      return matchesText && matchesCategory;
    });
  }
}
