import { Component, EventEmitter, Input, Output } from '@angular/core';
import {ConfirmationService, SharedModule} from 'primeng/api';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {PagingTableService} from "./paging-table.service";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {InputTextModule} from "primeng/inputtext";
import {MultiSelectModule} from "primeng/multiselect";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {SkeletonModule} from "primeng/skeleton";
import {TableModule} from "primeng/table";
import {
  PagingTablePaginationComponent
} from "./shared/components/paging-table-pagination/paging-table-pagination.component";
import {PagingResponseModel} from '../../../core/models/paging-response.model';
import {PagingRequestModel} from '../../../core/models/paging-request.model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-paging-table',
  templateUrl: './paging-table.component.html',
  styleUrls: ['./paging-table.component.scss'],
  standalone: true,
  imports: [
    ConfirmPopupModule,
    InputTextModule,
    MultiSelectModule,
    NgForOf,
    NgIf,
    PaginatorModule,
    SharedModule,
    SkeletonModule,
    TableModule,
    TranslateModule,
    NgStyle,
    NgClass,
    PagingTablePaginationComponent,
    FormsModule
  ]
})
export class PagingTableComponent {
  response: PagingResponseModel = new PagingResponseModel();

  @Input() set Response(e: any) {
    if (e.items) {
      this.response = e;
      this.loading = false;
    }
  }
  pagingRequest: PagingRequestModel = new PagingRequestModel();
  @Input() cols: any[] = [];
  @Input() TableName: string;
  @Output() Filter: any = new EventEmitter();
  @Output() action: any = new EventEmitter();

  loading: boolean = true;
  constructor(
    private service: PagingTableService,
    protected confirmationService: ConfirmationService,
    private translate: TranslateService,
  ) {
    this.service.component = this;
  }
  sortByField(col: any) {
    this.service.sortByField(col);
  }

  Paginate(pageIndex: number) {
    this.pagingRequest.PageIndex = pageIndex;
    this.FilterCustomers();
  }

  FilterCustomers() {
    this.Filter.emit(this.pagingRequest);
  }

  clear() {
    this.pagingRequest.SearchText = '';
    this.FilterCustomers()
  }

}
