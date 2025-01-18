import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService, SharedModule } from 'primeng/api';
import { Location, NgIf, NgFor, NgStyle } from '@angular/common';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [TableModule, SharedModule, NgIf, InputTextModule, NgFor, NgStyle, SkeletonModule, ConfirmPopupModule],
})
export class TableComponent {
  @Input() showCreate: boolean = true;
  array: any[] = [];
  @Input() set Array(e: any) {
    if (e) {
      this.loading = false;
      this.array = e;
    } else {
      this.loading = true;
      this.array = [];
    }
  }
  @Input() cols: any[] = [];
  @Input() FilterFields: any[];
  @Input() TableName: string;
  @Output() Action = new EventEmitter();
  loading: boolean = true;
  constructor(
    protected confirmationService: ConfirmationService,
    protected location: Location,
  ) {}
  getEventValue($event: any): string {
    return $event.target.value;
  }
  tableAction(data: any, type: number, event?: any) {
    var obj = {
      event: event,
      data: data,
      type: type,
    };
    this.Action.emit(obj);
  }
  confirm(data: any, type: number, event?: any) {
    this.confirmationService.confirm({
      target: event.target as any,
      message: 'Are you sure?',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tableAction(data, type, event);
      },
      reject: () => {},
    });
  }
  goBack() {
    this.location.back();
  }
}
