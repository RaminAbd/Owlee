import { inject, Injectable } from '@angular/core';
import { StudentsApiService } from './shared/services/students.api.service';
import { StudentsComponent } from './students.component';
import { StudentsResponseModel } from './shared/models/students-response.model';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private service: StudentsApiService = inject(StudentsApiService);
  component: StudentsComponent;
  constructor() {}

  getAll() {
    this.service.GetAll(this.service.serviceUrl).subscribe((resp) => {
      this.component.students = resp.data.map(
        (item: StudentsResponseModel) => ({
          ...item,
          fullName: item.firstName + ' ' + item.lastName,
        }),
      );
    });
  }

  setCols() {
    this.component.cols = [
      { field: 'fullName', header: 'Name' },
      { field: 'username', header: 'Email' },
      { field: 'phoneNumber', header: 'Phone Number' },
      { field: 'location', header: 'Location' },
    ];
  }
}
