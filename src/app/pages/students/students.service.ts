import { inject, Injectable } from '@angular/core';
import { StudentsApiService } from './shared/services/students.api.service';
import { StudentsComponent } from './students.component';
import { StudentsResponseModel } from './shared/models/students-response.model';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private service: StudentsApiService = inject(StudentsApiService);
  private router: Router = inject(Router);
  component: StudentsComponent;
  constructor() {}

  getAll() {
    this.service.GetAll(this.service.serviceUrl).subscribe((resp) => {
      this.component.students = resp.data.map(
        (item: StudentsResponseModel) => ({
          ...item,
          fullName: item.firstName + ' ' + item.lastName,
          status:item.isBlocked ? 'Blocked' : 'Active'
        }),
      );
    });
  }

  setCols() {
    this.component.cols = [
      { field: 'fullName', header: 'Name' },
      { field: 'username', header: 'Email' },
      { field: 'phoneNumber', header: 'Phone number' },
      { field: 'location', header: 'Location' },
      { field: 'status', header: 'Status' },
      { field: 'studentsActions', header: 'Actions' },
    ];
  }

  tableActionHandler(e: any) {
    switch (e.type) {
      case 3:
        this.delete(e.data.id);
        break;
      case 4:
        this.router.navigate(['/main/admin/students/', e.data.id]);
        break;
      case 5:
        this.changeStatus(e.data);
        break;

    }
  }
  delete(id: string) {
    this.service.Delete(this.service.serviceUrl, id).subscribe((resp) => {
      this.getAll();
    })
  }

  private changeStatus(data:any) {
    if(data.isBlocked){
      this.unBlock(data.id)
    }
    else{
      this.block(data.id)
    }
  }

  private unBlock(id:string) {
    this.service.UnBlock(id).subscribe((resp) => {
      this.getAll();
    })
  }

  private block(id:string) {
    this.service.Block(id).subscribe((resp) => {
      this.getAll();
    })
  }
}
