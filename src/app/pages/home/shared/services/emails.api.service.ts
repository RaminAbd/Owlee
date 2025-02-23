import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../../core/services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { ApplicationMessageCenterService } from '../../../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class EmailsApiService extends BaseApiService {
  serviceUrl = 'v1/Email/';
  constructor(http: HttpClient, handler: ApplicationMessageCenterService) {
    super(http, handler);
  }

  SendEmail(req: any) {
    return this.post(this.serviceUrl + 'SendEmail', req);
  }
}
