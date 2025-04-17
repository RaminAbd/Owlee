import { Component, inject } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { EducatorsService } from './educators.service';
import { EducatorsResponseModel } from './shared/models/educators-response.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-educators',
  imports: [TableComponent],
  templateUrl: './educators.component.html',
  styleUrl: './educators.component.scss',
})
export class EducatorsComponent {
  private service: EducatorsService = inject(EducatorsService);
  private router: Router = inject(Router);
  educators: EducatorsResponseModel[] = [];
  cols: any[] = [];
  constructor() {
    this.service.component = this;
    this.service.getAll();
    this.service.setCols();
  }

  getInfo(e: any) {
    this.router.navigate(['/main/admin/educators/', e.data.id]);
  }
}
