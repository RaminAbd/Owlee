import { Injectable } from '@angular/core';
import { BaseCrudApiService } from '../../../../core/services/base-crud.api.service';
import { HttpClient } from '@angular/common/http';
import { ApplicationMessageCenterService } from '../../../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class MeetingsApiService extends BaseCrudApiService {
  serviceUrl = 'v1/Meeting/';
  constructor(http: HttpClient, handler: ApplicationMessageCenterService) {
    super(http, handler);
  }
  GetMeetingsByEducator(req: any) {
    return this.get(this.serviceUrl + 'GetMeetingsByEducator', null, req);
  }

  GetMeetingsByStudent(req: any) {
    return this.get(this.serviceUrl + 'GetMeetingsByStudent', null, req);
  }

  GetMeetingsByGroup(req: any) {
    return this.get(this.serviceUrl + 'GetMeetingsByGroup/', null, req);
  }

  CreateMany(req: any) {
    return this.post(this.serviceUrl + 'CreateMany', req);
  }
  CreateSchedule(req: any) {
    return this.post(this.serviceUrl + 'CreateSchedule', req);
  }
}
