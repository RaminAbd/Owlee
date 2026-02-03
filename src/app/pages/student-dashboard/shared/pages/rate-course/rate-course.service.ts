import { inject, Injectable } from '@angular/core';
import { RateCourseComponent } from './rate-course.component';
import { CoursesApiService } from '../../../../admin-courses/shared/services/courses.api.service';
import { TranslateService } from '@ngx-translate/core';
import { RatingsApiService } from '../../services/ratings.api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RateCourseService {
  private service: CoursesApiService = inject(CoursesApiService);
  public translate: TranslateService = inject(TranslateService);
  private ratingsService: RatingsApiService = inject(RatingsApiService);
  private router: Router = inject(Router);
  component: RateCourseComponent;
  constructor() {}

  getRating() {
    const req = {
      studentId: localStorage.getItem('userId') as string,
      courseId: this.component.courseId,
    };
    this.ratingsService.GetRating(req).subscribe((resp) => {
      this.component.value = resp.data.value;
    });
  }

  getCourse() {
    const req = {
      CourseId: this.component.courseId,
      lang: this.translate.currentLang,
    };
    this.service.GetDetailed(req).subscribe((resp) => {
      this.component.response = resp.data;
      console.log(this.component.response);
    });
  }

  rate() {
    const req = {
      studentId: localStorage.getItem('userId') as string,
      educatorId: this.component.response.educatorId,
      courseId: this.component.response.id,
      rating: this.component.value,
    };
    this.ratingsService.Rate(req).subscribe((resp) => {
      this.router.navigate([
        'main/student/dashboard/course/info/',
        this.component.courseId,
      ]);
    });
  }
}
