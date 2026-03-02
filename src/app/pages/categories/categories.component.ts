import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {CategoriesService} from './categories.service';
import {CategoriesResponseModel} from './shared/models/categories-response.model';
import {TableComponent} from '../../shared/components/table/table.component';

@Component({
  selector: 'app-categories',
  imports: [
    TableComponent
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  private service: CategoriesService = inject(CategoriesService);
  private router: Router = inject(Router);
  items:CategoriesResponseModel[]=[]
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
