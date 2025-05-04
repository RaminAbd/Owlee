import { Injectable } from '@angular/core';
import { BaseCrudApiService } from '../../../../core/services/base-crud.api.service';
import { HttpClient } from '@angular/common/http';
import { ApplicationMessageCenterService } from '../../../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionsApiService extends BaseCrudApiService {
  serviceUrl = 'v1/Subscriptions/';
  constructor(http: HttpClient, handler: ApplicationMessageCenterService) {
    super(http, handler);
  }
  GetStatus(userID: string) {
    return this.get(this.serviceUrl + 'GetStatus/', userID);
  }

  Renew(req: any) {
    return this.post(this.serviceUrl + 'Renew', req);
  }

  CanChange(req:any){
    return this.get(this.serviceUrl + 'CanChange', null, req);
  }
}
