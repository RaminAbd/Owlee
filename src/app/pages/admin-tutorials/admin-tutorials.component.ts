import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {TableComponent} from '../../shared/components/table/table.component';
import {TutorialsResponseModel} from './shared/models/tutorials-response.model';
import {AdminTutorialsService} from './admin-tutorials.service';

@Component({
  selector: 'app-admin-tutorials',
  imports: [
    TableComponent
  ],
  templateUrl: './admin-tutorials.component.html',
  styleUrl: './admin-tutorials.component.scss'
})
export class AdminTutorialsComponent {
  private service: AdminTutorialsService = inject(AdminTutorialsService);
  private router: Router = inject(Router);
  items:TutorialsResponseModel[]=[]
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
