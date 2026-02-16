import { inject, Injectable } from '@angular/core';
import { CoursesComponent } from './courses.component';
import { CoursesApiService } from '../admin-courses/shared/services/courses.api.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  protected coursesService: CoursesApiService = inject(CoursesApiService);
  protected translate: TranslateService = inject(TranslateService);
  component: CoursesComponent;
  subscribe: any;
  constructor() {}

  subscribeToLangEvent() {
    this.subscribe = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.getAllCourses();
      },
    );
  }

  getAllCourses() {
    this.coursesService
      .GetOpenCourses(this.translate.currentLang)
      .subscribe((resp) => {
        console.log(resp.data);
        this.component.courses = resp.data;
      });
  }
}
