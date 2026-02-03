import { inject, Injectable } from '@angular/core';
import { StudentsResponseModel } from '../students/shared/models/students-response.model';
import { EducatorsComponent } from './educators.component';
import { EducatorsApiService } from './shared/services/educators.api.service';
import { EducatorsResponseModel } from './shared/models/educators-response.model';
import { FormatDate } from '../../core/extensions/format-date';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class EducatorsService {
  private service: EducatorsApiService = inject(EducatorsApiService);
  private router: Router = inject(Router);
  component: EducatorsComponent;
  constructor() {}

  getAll() {
    this.service.GetAll(this.service.serviceUrl).subscribe((resp) => {
      this.component.educators = resp.data.map(
        (item: EducatorsResponseModel) => ({
          ...item,
          fullName: item.firstName + ' ' + item.lastName,
          dateOfBirth: this.formatDate(item.dateOfBirth),
          createdAt: item.createdAt ? this.formatDate(item.createdAt) : '',
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
      { field: 'createdAt', header: 'Created date' },
      { field: 'educatorsActions', header: 'Actions' },
    ];
  }

  tableActionHandler(e: any) {
    switch (e.type) {
      case 3:
        this.delete(e.data.id);
        break;
      case 4:
        this.router.navigate(['/main/admin/educators/', e.data.id]);
        break;
    }
  }
  delete(id: string) {
    this.service.Delete(this.service.serviceUrl, id).subscribe((resp) => {
      this.getAll();
    });
  }
}
