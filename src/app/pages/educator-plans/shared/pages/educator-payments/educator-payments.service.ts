import { inject, Injectable } from '@angular/core';
import { MonthlyPaymentsApiService } from '../../services/monthly-payments.api.service';
import { EducatorPaymentsComponent } from './educator-payments.component';

@Injectable({
  providedIn: 'root',
})
export class EducatorPaymentsService {
  private service: MonthlyPaymentsApiService = inject(
    MonthlyPaymentsApiService,
  );
  component: EducatorPaymentsComponent;
  constructor() {}

  filter() {
    const req = {
      EducatorId: localStorage.getItem('userId') as string,
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
