import { inject, Injectable } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { CoursesApiService } from '../admin-courses/shared/services/courses.api.service';
import { StorageService } from '../../core/services/storage.service';
import { Language, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ApplicationMessageCenterService } from '../../core/services/ApplicationMessageCenter.service';
import { UpgradePlanComponent } from '../../shared/components/upgrade-plan/upgrade-plan.component';
import { DialogService } from 'primeng/dynamicdialog';
import { EducatorsApiService } from '../educators/shared/services/educators.api.service';
import { CategoriesApiService } from '../categories/shared/services/categories.api.service';
import { LanguageService } from '../../core/services/language.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  component: DashboardComponent;
  private service: CoursesApiService = inject(CoursesApiService);
  private educatorsService: EducatorsApiService = inject(EducatorsApiService);
  private storage: StorageService = inject(StorageService);
  private lang: LanguageService = inject(LanguageService);
  private translate: TranslateService = inject(TranslateService);
  public categoriesService: CategoriesApiService = inject(CategoriesApiService);

  constructor() {}

  getEducator() {
    this.educatorsService
      .GetById(
        this.educatorsService.serviceUrl,
        localStorage.getItem('userId') as string,
      )
      .subscribe((resp) => {
        console.log(resp.data, 'educator');
        this.component.rating = resp.data.rating;
      });
  }

  getCategories() {
    this.categoriesService
      .GetAllByLang(
        this.categoriesService.serviceUrl,
        this.translate.currentLang,
      )
      .subscribe((resp) => {
        this.component.categories = resp.data;
        this.component.categories.unshift({
          name: this.lang.getByKey('All'),
          id: 'all',
        });
        console.log(this.component.categories);
      });
  }

  getDashboard() {
    let authResp = this.storage.getObject('authResponse');
    const req = {
      educatorId: authResp.id,
      lang: this.translate.currentLang,
    };
    this.service.GetByEducator(req).subscribe((resp) => {
      this.component.response = resp.data;
      this.component.filteredList = structuredClone(resp.data.courses);
    });
  }
}
/*
 * type 1 - group
 * type 2 - individual
 * implType 1 - Online
 * implType 2 - Offline
 * */
