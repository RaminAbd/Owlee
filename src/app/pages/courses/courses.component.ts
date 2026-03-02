import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoursesService } from './courses.service';
import { CoursesResponseModel } from '../admin-courses/shared/models/courses-response.model';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { StorageService } from '../../core/services/storage.service';
import { CategoriesResponseModel } from '../categories/shared/models/categories-response.model';
import { DashboardCourseModel } from '../dashboard/shared/models/dashboard-course.model';
import {FormsModule} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';

@Component({
  selector: 'app-courses',
  imports: [DatePipe, NgForOf, RouterLink, TranslatePipe, NgIf, FormsModule, DropdownModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent implements OnDestroy {
  private service: CoursesService = inject(CoursesService);
  private storage: StorageService = inject(StorageService);
  courses: CoursesResponseModel[] = [];
  filteredList: CoursesResponseModel[] = [];

  userSignedIn: boolean = !!localStorage.getItem('userId');
  categories: CategoriesResponseModel[] = [];
  categoryId: string;
  searchText: string;

  constructor() {
    this.service.component = this;
    let st = this.storage.getObject('authResponse');
    this.userSignedIn = !!(st && st.role === 'Student');
    this.service.subscribeToLangEvent();
    this.service.getAllCourses();
    this.service.getCategories();
  }

  ngOnDestroy() {
    this.service.subscribe.unsubscribe();
  }

  makeFavorite(item: CoursesResponseModel) {
    this.service.addToFavorite(item);
  }

  search() {
    const text = this.searchText?.trim().toLowerCase() || '';

    this.filteredList = this.courses.filter((item) => {
      const matchesText =
        !text ||
        String(item.name || '')
          .toLowerCase()
          .includes(text);

      const matchesCategory =
        !this.categoryId || // null / undefined
        this.categoryId === 'all' || // "All" selected
        item.categoryId === this.categoryId;

      return matchesText && matchesCategory;
    });
  }
}
