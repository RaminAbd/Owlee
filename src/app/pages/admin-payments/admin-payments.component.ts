import { Component, inject } from '@angular/core';
import { EducatorPaymentsService } from '../educator-plans/shared/pages/educator-payments/educator-payments.service';
import { PaymentsResponseModel } from '../educator-plans/shared/models/payments-response.model';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Confirmation } from '../../core/extensions/confirmation';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminPaymentsServiceService } from './admin-payments.service.service';

@Component({
  selector: 'app-admin-payments',
  imports: [DatePipe, FormsModule, NgForOf, NgIf, TranslatePipe],
  templateUrl: './admin-payments.component.html',
  styleUrl: './admin-payments.component.scss',
})
export class AdminPaymentsComponent {
  private service: AdminPaymentsServiceService = inject(
    AdminPaymentsServiceService,
  );
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
