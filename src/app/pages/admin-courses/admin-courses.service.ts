import {inject, Injectable} from '@angular/core';
import {FormatDate} from '../../core/extensions/format-date';
import {CoursesApiService} from './shared/services/courses.api.service';
import {AdminCoursesComponent} from './admin-courses.component';

@Injectable({
  providedIn: 'root'
})
export class AdminCoursesService {
  private service: CoursesApiService = inject(CoursesApiService);
  component: AdminCoursesComponent;
  constructor() {}

  getAll() {
    this.service.GetAll(this.service.serviceUrl).subscribe((resp) => {
      this.component.courses = resp.data;
    });
  }

  setCols() {
    this.component.cols = [
      { field: 'name', header: 'Name' },
      { field: 'language', header: 'Language' },
      { field: 'description', header: 'Description' },
    ];
  }
}
