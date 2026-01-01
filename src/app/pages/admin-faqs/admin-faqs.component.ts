import {Component, inject} from '@angular/core';
import {AdminFaqsService} from './admin-faqs.service';
import {Router} from '@angular/router';
import {FaqsResponseModel} from './shared/models/faqs-response.model';
import {TableComponent} from '../../shared/components/table/table.component';

@Component({
  selector: 'app-admin-faqs',
  imports: [
    TableComponent
  ],
  templateUrl: './admin-faqs.component.html',
  styleUrl: './admin-faqs.component.scss'
})
export class AdminFaqsComponent {
  private service: AdminFaqsService = inject(AdminFaqsService);
  private router: Router = inject(Router);
  items:FaqsResponseModel[]=[]
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
