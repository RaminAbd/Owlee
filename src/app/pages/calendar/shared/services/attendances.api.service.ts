import { Injectable } from '@angular/core';
import { BaseCrudApiService } from '../../../../core/services/base-crud.api.service';
import { HttpClient } from '@angular/common/http';
import { ApplicationMessageCenterService } from '../../../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class AttendancesApiService extends BaseCrudApiService {
  serviceUrl = 'v1/Attendances/';
  constructor(http: HttpClient, handler: ApplicationMessageCenterService) {
    super(http, handler);
  }

  Set(req: any) {
    return this.post(this.serviceUrl + 'set', req);
  }

  Filter(req:any){
    return this.get(this.serviceUrl + 'filter', null, req);
  }
}
