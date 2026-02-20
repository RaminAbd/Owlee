import {inject, Injectable} from '@angular/core';
import {CoursesApiService} from '../admin-courses/shared/services/courses.api.service';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {CoursesComponent} from '../courses/courses.component';
import {CoursesResponseModel} from '../admin-courses/shared/models/courses-response.model';
import {FavoriteCoursesComponent} from './favorite-courses.component';

@Injectable({
  providedIn: 'root'
})
export class FavoriteCoursesService {
  protected coursesService: CoursesApiService = inject(CoursesApiService);
  protected translate: TranslateService = inject(TranslateService);
  component: FavoriteCoursesComponent;
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
    const req = {
      studentId: localStorage.getItem('userId'),
      lang:this.translate.currentLang
    }
    this.coursesService
      .GetFavoriteCourses(this.translate.currentLang)
      .subscribe((resp) => {
        console.log(resp.data);
        this.component.courses = resp.data;
      });
  }

  addToFavorite(item: CoursesResponseModel) {
    const req = {
      courseId: item.id,
      studentId:localStorage.getItem('userId') as string
    }
    this.coursesService.AddToFavorite(req).subscribe((resp) => {
      this.getAllCourses()
    })
  }
}
