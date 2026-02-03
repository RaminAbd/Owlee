import { Component, inject } from '@angular/core';
import { EducatorPaymentsService } from './educator-payments.service';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PaymentsResponseModel } from '../../models/payments-response.model';
import { GroupsResponseModel } from '../../../../dashboard/shared/models/groups-response.model';
import { Confirmation } from '../../../../../core/extensions/confirmation';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-educator-payments',
  imports: [FormsModule, NgForOf, NgIf, TranslatePipe, DatePipe],
  templateUrl: './educator-payments.component.html',
  styleUrl: './educator-payments.component.scss',
})
export class EducatorPaymentsComponent {
  private service: EducatorPaymentsService = inject(EducatorPaymentsService);
  payments: PaymentsResponseModel[] = [];
  filteredList: PaymentsResponseModel[] = [];
  searchText: string;
  private translate: TranslateService = inject(TranslateService);
  private confirmationService: ConfirmationService =
    inject(ConfirmationService);
  constructor() {
    this.service.component = this;
    this.service.filter();
  }

  searchByName() {
    const text = this.searchText.trim().toLowerCase();

    if (!text) {
      this.filteredList = [...this.payments];
      return;
    }

    this.filteredList = this.payments.filter((user) =>
      [user.course, user.student].some((field) =>
        field.toLowerCase().includes(this.searchText),
      ),
    );
    console.log(this.filteredList);
  }

  confirm(item: any) {
    Confirmation.confirm(
      this.confirmationService,
      this.translate,
      'Are you sure you want to mark this as paid?',
      () => {
        item.loading = true;
        this.service.markAsPaid(item);
      },
    );
  }
}
