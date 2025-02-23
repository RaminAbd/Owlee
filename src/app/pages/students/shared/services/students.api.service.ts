import { Injectable } from '@angular/core';
import { BaseCrudApiService } from '../../../../core/services/base-crud.api.service';
import { HttpClient } from '@angular/common/http';
import { ApplicationMessageCenterService } from '../../../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class StudentsApiService extends BaseCrudApiService {
  serviceUrl = 'v1/Students/';
  constructor(http: HttpClient, handler: ApplicationMessageCenterService) {
    super(http, handler);
  }

  SignUp(req: any) {
    return this.post(this.serviceUrl + 'SignUp', req);
  }

  GetInvitations(req:any) {
    return this.get(this.serviceUrl + 'GetInvitations/', null, req);
  }

  Accept(req: any) {
    return this.post(this.serviceUrl + 'AcceptInvitation', req);
  }
  Reject(req: any) {
    return this.post(this.serviceUrl + 'RejectInvitation', req);
  }
}
