import {Component, EventEmitter, Input, Output} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'app-paging-table-pagination',
    templateUrl: './paging-table-pagination.component.html',
    styleUrls: ['./paging-table-pagination.component.scss'],
    standalone: true,
    imports: [NgClass, NgIf, TranslateModule]
})
export class PagingTablePaginationComponent {
  @Input() Response:any;
  @Output() Paginate:any = new EventEmitter()
}
