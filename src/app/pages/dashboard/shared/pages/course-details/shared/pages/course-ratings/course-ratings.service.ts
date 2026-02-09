import {inject, Injectable} from '@angular/core';
import {CourseInfoComponent} from '../course-info/course-info.component';
import {CoursesApiService} from '../../../../../../../admin-courses/shared/services/courses.api.service';
import {CourseRatingsComponent} from './course-ratings.component';
import {TranslateService} from '@ngx-translate/core';
import {RatingsApiService} from '../../../../../../../student-dashboard/shared/services/ratings.api.service';

@Injectable({
  providedIn: 'root'
})
export class CourseRatingsService {
  component: CourseRatingsComponent;
  public translate: TranslateService = inject(TranslateService);
  private ratingsService: RatingsApiService = inject(RatingsApiService);
  private service: CoursesApiService = inject(CoursesApiService);
  constructor() { }

  getCourse() {
    const req = {
      id: this.component.id,
      lang: this.translate.currentLang,
    };
    this.service
      .GetByIdByLang(this.service.serviceUrl, req)
      .subscribe((resp) => {
        this.component.request = resp.data;

      });
  }

  getOverview(){
    const req = {
      courseId:this.component.id
    }
    this.ratingsService.GetOverview(req).subscribe((resp) => {
      const totalCount = resp.data.reduce((sum:any, item:any) => sum + item.count, 0);
      this.component.total = totalCount;
      this.component.ratings = resp.data.map((item:any)=>({
        ...item,
        percentage: totalCount > 0
          ? +(item.count / totalCount * 100).toFixed(2)
          : 0
      }))
      console.log(this.component.ratings);
    })
  }
}
