import { inject, Injectable } from '@angular/core';
import { CoursesComponent } from './courses.component';
import { CoursesApiService } from '../admin-courses/shared/services/courses.api.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { CoursesResponseModel } from '../admin-courses/shared/models/courses-response.model';
import { LanguageService } from '../../core/services/language.service';
import { CategoriesApiService } from '../categories/shared/services/categories.api.service';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  protected coursesService: CoursesApiService = inject(CoursesApiService);
  protected translate: TranslateService = inject(TranslateService);
  private lang: LanguageService = inject(LanguageService);
  public categoriesService: CategoriesApiService = inject(CategoriesApiService);
  component: CoursesComponent;
  subscribe: any;
  constructor() {}

  subscribeToLangEvent() {
    this.subscribe = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.getAllCourses();
        this.getCategories();
      },
    );
  }

  getAllCourses() {
    this.coursesService
      .GetOpenCourses(this.translate.currentLang)
      .subscribe((resp) => {
        console.log(resp.data);
        this.component.courses = structuredClone(resp.data);
        this.component.filteredList = structuredClone(resp.data);
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

  addToFavorite(item: CoursesResponseModel) {
    const req = {
      courseId: item.id,
      studentId: localStorage.getItem('userId') as string,
    };
    this.coursesService.AddToFavorite(req).subscribe((resp) => {
      this.getAllCourses();
    });
  }
}
