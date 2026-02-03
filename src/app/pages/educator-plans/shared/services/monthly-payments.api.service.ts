import { Injectable } from '@angular/core';
import { BaseCrudApiService } from '../../../../core/services/base-crud.api.service';
import { HttpClient } from '@angular/common/http';
import { ApplicationMessageCenterService } from '../../../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class MonthlyPaymentsApiService extends BaseCrudApiService {
  serviceUrl = 'v1/MonthlyPayments/';
  constructor(http: HttpClient, handler: ApplicationMessageCenterService) {
    super(http, handler);
  }

  Filter(req: any) {
    return this.get(this.serviceUrl + 'Filter', null, req);
  }

  MarkAsPaid(req: any) {
    return this.post(this.serviceUrl + 'MarkAsPaid', req);
  }
}
