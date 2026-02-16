import { inject, Injectable } from '@angular/core';
import { CoursesApiService } from '../../../../admin-courses/shared/services/courses.api.service';
import { CourseDetailsComponent } from './course-details.component';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../../../core/services/storage.service';
import { RatingsApiService } from '../../../../student-dashboard/shared/services/ratings.api.service';

@Injectable({
  providedIn: 'root',
})
export class CourseDetailsService {
  private service: CoursesApiService = inject(CoursesApiService);
  private translate: TranslateService = inject(TranslateService);
  private storage: StorageService = inject(StorageService);
  private ratingsService: RatingsApiService = inject(RatingsApiService);
  component: CourseDetailsComponent;
  constructor() {}

  getRatings() {
    const req = {
      courseId: this.component.id,
    };
    this.ratingsService.GetAllRatings(req).subscribe((resp) => {
      console.log(resp.data);
      this.component.ratings = resp.data;
      const totalCount = resp.data.reduce(
        (sum: any, item: any) => sum + item.value,
        0,
      );

      this.component.total = totalCount / resp.data.length;
    });
  }

  getDashboard() {
    let authResp = this.storage.getObject('authResponse');
    const req = {
      StudentId: authResp.id,
      lang: this.translate.currentLang,
    };
    this.service.getDashboard(req).subscribe((resp) => {
      this.component.filteredList = structuredClone(resp.data.courses);
    });
  }

  getCourse() {
    const req = {
      CourseId: this.component.id,
      lang: this.translate.currentLang,
    };
    this.service.GetDetailed(req).subscribe((resp) => {
      this.component.response = resp.data;
      this.component.response.takenSeatsPercentage =
        (this.component.response.takenSeats /
          this.component.response.minimumSeats) *
        100;

      this.component.expanderStates = Array.from(
        { length: this.component.response.topics.length },
        () => 'collapsed',
      );
      console.log(this.component.response);
    });
  }

  buy() {
    this.component.loading = true;
    const req = {
      CourseId: this.component.id,
      studentId: localStorage.getItem('userId') as string,
    };
    this.service.Subscribe(req).subscribe(
      (resp) => {
        this.component.loading = false;
        this.openExternalUrl(resp.data.url);
      },
      (error) => {
        this.component.loading = false;
      },
    );
  }

  openExternalUrl(url: string) {
    window.location.href = url;
  }
}
