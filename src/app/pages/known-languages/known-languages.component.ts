import {Component, inject, OnDestroy} from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { KnownLanguagesService } from './known-languages.service';
import {KnownLanguagesResponseModel} from './shared/models/known-languages-response.model';
import {LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-known-languages',
  imports: [TableComponent],
  templateUrl: './known-languages.component.html',
  styleUrl: './known-languages.component.scss',
})
export class KnownLanguagesComponent implements OnDestroy {
  private service: KnownLanguagesService = inject(KnownLanguagesService);
  languages: KnownLanguagesResponseModel[] = [];
  cols: any[] = [];
  langSubscribtion:any
  constructor() {
    this.service.component = this;
    this.service.getAll();
    this.service.setCols();
    this.langSubscribtion = this.service.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.service.getAll();
    });
  }

  tableActionHandler(e: any) {
    this.service.tableActionHandler(e);
  }
  ngOnDestroy() {
    this.langSubscribtion.unsubscribe()
  }
}
