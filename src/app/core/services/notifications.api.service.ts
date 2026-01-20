import { Injectable } from '@angular/core';
import { BaseCrudApiService } from './base-crud.api.service';
import { HttpClient } from '@angular/common/http';
import { ApplicationMessageCenterService } from './ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationsApiService extends BaseCrudApiService {
  ServiceUrl: string = 'v1/Notifications/';
  constructor(http: HttpClient, handler: ApplicationMessageCenterService) {
    super(http, handler);
  }

  getAllByReceiver(req: any) {
    return this.get(this.ServiceUrl + 'getAll', null, req);
  }

  MarkAsSeen(req: any) {
    return this.post(this.ServiceUrl + 'MarkAsSeen',  req);
  }

  MarkAsSeenAll(req: any) {
    return this.post(this.ServiceUrl + 'MarkAsSeenAll', req);
  }
}
