import {Component, inject} from '@angular/core';
import {EducatorPaymentsService} from '../educator-plans/shared/pages/educator-payments/educator-payments.service';
import {PaymentsResponseModel} from '../educator-plans/shared/models/payments-response.model';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {Confirmation} from '../../core/extensions/confirmation';
import {StudentPlansService} from './student-plans.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-student-plans',
  imports: [
    DatePipe,
    FormsModule,
    NgForOf,
    NgIf,
    TranslatePipe
  ],
  templateUrl: './student-plans.component.html',
  styleUrl: './student-plans.component.scss'
})
export class StudentPlansComponent {
  private service: StudentPlansService = inject(StudentPlansService);
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


}
