import { Component, inject } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { KnownLanguagesService } from './known-languages.service';
import {KnownLanguagesResponseModel} from './shared/models/known-languages-response.model';

@Component({
  selector: 'app-known-languages',
  imports: [TableComponent],
  templateUrl: './known-languages.component.html',
  styleUrl: './known-languages.component.scss',
})
export class KnownLanguagesComponent {
  private service: KnownLanguagesService = inject(KnownLanguagesService);
  languages: KnownLanguagesResponseModel[] = [];
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
