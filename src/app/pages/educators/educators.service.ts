import { inject, Injectable } from '@angular/core';
import { StudentsResponseModel } from '../students/shared/models/students-response.model';
import { EducatorsComponent } from './educators.component';
import { EducatorsApiService } from './shared/services/educators.api.service';
import {EducatorsResponseModel} from './shared/models/educators-response.model';
import {FormatDate} from '../../core/extensions/format-date';

@Injectable({
  providedIn: 'root',
})
export class EducatorsService {
  private service: EducatorsApiService = inject(EducatorsApiService);
  component: EducatorsComponent;
  constructor() {}

  getAll() {
    this.service.GetAll(this.service.serviceUrl).subscribe((resp) => {
      this.component.educators = resp.data.map(
        (item: EducatorsResponseModel) => ({
          ...item,
          fullName: item.firstName + ' ' + item.lastName,
          dateOfBirth: this.formatDate(item.dateOfBirth),
        }),
      );
    });
  }

  formatDate(date: any) {
    return new FormatDate(new Date(date), false).formattedDate;
  }

  setCols() {
    this.component.cols = [
      { field: 'fullName', header: 'Name' },
      { field: 'userName', header: 'Email' },
      { field: 'phoneNumber', header: 'Phone number' },
      { field: 'dateOfBirth', header: 'Date of birth' },
      { field: 'location', header: 'Location' },
      { field: 'showActions', header: 'Actions' },
    ];
  }
}
