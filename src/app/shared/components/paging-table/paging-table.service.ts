import { Injectable } from '@angular/core';
import {PagingTableComponent} from "./paging-table.component";

@Injectable({
  providedIn: 'root'
})
export class PagingTableService {
  component:PagingTableComponent
  constructor() { }

  sortByField(col: any) {
    if (col.sorting) {
      if (col.value === null) {
        this.component.cols.find((x) => x.field === col.field).sortValue = true;
      } else {
        this.component.cols.find((x) => x.field === col.field).sortValue =
          !this.component.cols.find((x) => x.field === col.field).sortValue;
      }
      this.component.cols
        .filter((x) => x.field !== col.field)
        .forEach((i) => (i.sortValue = null));
      this.component.pagingRequest.SortField = col.field;
      this.component.pagingRequest.SortOrder = col.sortValue ? 1 : -1;
      this.component.FilterCustomers();
    }
  }
}
