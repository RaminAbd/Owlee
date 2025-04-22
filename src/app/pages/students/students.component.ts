import { Component, inject } from '@angular/core';
import { SubscriptionPackageService } from '../subscription-package/subscription-package.service';
import { SubscriptionPackageModel } from '../subscription-package/shared/models/subscription-package.model';
import { StudentsService } from './students.service';
import { StudentsResponseModel } from './shared/models/students-response.model';
import { TableComponent } from '../../shared/components/table/table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-students',
  imports: [TableComponent],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
})
export class StudentsComponent {
  private service: StudentsService = inject(StudentsService);

  students: StudentsResponseModel[] = [];
  cols: any[] = [];
  constructor() {
    this.service.component = this;
    this.service.getAll();
    this.service.setCols();
  }
  tableActionHandler(e: any) {
    this.service.tableActionHandler(e);
  }

}
