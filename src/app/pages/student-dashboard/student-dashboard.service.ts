import {inject, Injectable} from '@angular/core';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {CoursesApiService} from '../admin-courses/shared/services/courses.api.service';
import {StorageService} from '../../core/services/storage.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ApplicationMessageCenterService} from '../../core/services/ApplicationMessageCenter.service';
import {StudentDashboardComponent} from './student-dashboard.component';
import {CategoriesApiService} from '../categories/shared/services/categories.api.service';
import {LanguageService} from '../../core/services/language.service';

@Injectable({
  providedIn: 'root'
})
export class StudentDashboardService {
  component: StudentDashboardComponent;
  private service: CoursesApiService = inject(CoursesApiService);
  private storage: StorageService = inject(StorageService);
  private translate: TranslateService = inject(TranslateService);
  private router: Router = inject(Router);
  private message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  public categoriesService: CategoriesApiService = inject(CategoriesApiService);
  private lang: LanguageService = inject(LanguageService);
  constructor() {}

  getDashboard() {
    let authResp = this.storage.getObject('authResponse');
    const req = {
      StudentId: authResp.id,
      lang: this.translate.currentLang,
    };
    this.service.getDashboard(req).subscribe((resp) => {
      this.component.response = resp.data;
      this.component.filteredList = structuredClone(resp.data.courses);
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
}
