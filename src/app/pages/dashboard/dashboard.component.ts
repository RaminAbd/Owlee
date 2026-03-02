import { Component, inject } from '@angular/core';
import { DashboardResponseModel } from './shared/models/dashboard-response.model';
import { DashboardService } from './dashboard.service';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CoursesResponseModel } from '../admin-courses/shared/models/courses-response.model';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { DashboardCourseModel } from './shared/models/dashboard-course.model';
import { DropdownModule } from 'primeng/dropdown';
import { CategoriesResponseModel } from '../categories/shared/models/categories-response.model';

@Component({
  selector: 'app-dashboard',
  imports: [TranslatePipe, FormsModule, NgForOf, NgClass, NgIf, DropdownModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  response: DashboardResponseModel = new DashboardResponseModel();
  private service: DashboardService = inject(DashboardService);
  private router: Router = inject(Router);
  searchText: string;
  categories: CategoriesResponseModel[] = [];
  rating: number = 0;
  categoryId: string;
  constructor() {
    this.service.component = this;
    this.service.getDashboard();
    this.service.getEducator();
    this.service.getCategories();
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
