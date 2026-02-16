import { inject, Injectable } from '@angular/core';
import { MonthlyPaymentsApiService } from '../educator-plans/shared/services/monthly-payments.api.service';
import { EducatorPaymentsComponent } from '../educator-plans/shared/pages/educator-payments/educator-payments.component';
import { StudentPlansComponent } from './student-plans.component';
import { PaymentsResponseModel } from '../educator-plans/shared/models/payments-response.model';

@Injectable({
  providedIn: 'root',
})
export class StudentPlansService {
  private service: MonthlyPaymentsApiService = inject(
    MonthlyPaymentsApiService,
  );
  component: StudentPlansComponent;

  constructor() {}

  filter() {
    const req = {
      StudentId: localStorage.getItem('userId') as string,
    };
    this.service.Filter(req).subscribe((resp) => {
      console.log(resp.data);
      let data = resp.data.map((item: any) => ({
        ...item,
        student: item.firstName + ' ' + item.lastName,
      }));
      this.component.payments = structuredClone(data);
      this.component.filteredList = structuredClone(data);
    });
  }

  pay(item: PaymentsResponseModel) {
    const req = {
      paymentId: item.id,
    };
    item.loading = true;
    this.service.Pay(req).subscribe((resp) => {
      console.log(resp.data);
      item.loading = false;
      this.openExternalUrl(resp.data.url);
    },error => {item.loading = false;});
    console.log(req);
  }

  openExternalUrl(url: string) {
    window.location.href = url;
  }
}
