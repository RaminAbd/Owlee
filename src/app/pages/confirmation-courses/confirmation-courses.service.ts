import {inject, Injectable} from '@angular/core';
import {CoursesApiService} from '../admin-courses/shared/services/courses.api.service';
import {KnownLanguagesApiService} from '../known-languages/shared/services/known-languages.api.service';
import {TranslateService} from '@ngx-translate/core';
import {AdminCoursesComponent} from '../admin-courses/admin-courses.component';
import {KnownLanguagesResponseModel} from '../known-languages/shared/models/known-languages-response.model';
import {ConfirmationCoursesComponent} from './confirmation-courses.component';
import {FormatDate} from '../../core/extensions/format-date';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationCoursesService {
  private service: CoursesApiService = inject(CoursesApiService);
  private translate: TranslateService = inject(TranslateService);
  component: ConfirmationCoursesComponent;
  constructor() {}

  getAll() {
    this.service
      .GetToConfirm(this.translate.currentLang)
      .subscribe((resp) => {
        this.component.courses = resp.data.map((course: any) => {
          return {
            ...course,
            start: this.formatDate(course.startDate),
            end: this.formatDate(course.endDate),
          };
        });
      });
  }

  formatDate(date: any) {
    return new FormatDate(new Date(date), false).formattedDate;
  }

  setCols() {
    this.component.cols = [
      { field: 'name', header: 'Name' },
      { field: 'educatorName', header: 'Educator' },
      { field: 'language', header: 'Language' },
      { field: 'start', header: 'Start date' },
      { field: 'end', header: 'End date' },
      { field: 'status', header: 'Status' },
      { field: 'showActions', header: 'Actions' },
    ];
  }
}
