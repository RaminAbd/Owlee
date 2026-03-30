import { inject, Injectable } from '@angular/core';
import { MonthlyPaymentsApiService } from '../educator-plans/shared/services/monthly-payments.api.service';
import { EducatorPaymentsComponent } from '../educator-plans/shared/pages/educator-payments/educator-payments.component';
import { AdminPaymentsComponent } from './admin-payments.component';

@Injectable({
  providedIn: 'root',
})
export class AdminPaymentsServiceService {
  private service: MonthlyPaymentsApiService = inject(
    MonthlyPaymentsApiService,
  );
  component: AdminPaymentsComponent;
  constructor() {}

  filter() {
    const req = {
      // EducatorId: localStorage.getItem('userId') as string,
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

  markAsPaid(item: any) {
    const req = {
      id: item.id,
    };
    this.service.MarkAsPaid(req).subscribe((resp) => {
      this.filter();
      item.loading = false;
    });
  }
}
