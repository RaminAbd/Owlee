import { Injectable } from '@angular/core';
import { BaseCrudApiService } from '../../../../core/services/base-crud.api.service';
import { HttpClient } from '@angular/common/http';
import { ApplicationMessageCenterService } from '../../../../core/services/ApplicationMessageCenter.service';
import { AuthRequestModel } from '../../../../auth/shared/models/auth-request.model';
import { AuthResponseModel } from '../../../../auth/shared/models/auth-response.model';

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

  SignIn(req: AuthRequestModel) {
    return this.post(this.serviceUrl + 'SignIn', req);
  }

  SignUpWithGoogle(req: any) {
    return this.post(this.serviceUrl + 'SignUpWitGoogle', req);
  }

  GetInvitations(req: any) {
    return this.get(this.serviceUrl + 'GetInvitations/', null, req);
  }

  Accept(req: any) {
    return this.post(this.serviceUrl + 'AcceptInvitation', req);
  }
  Reject(req: any) {
    return this.post(this.serviceUrl + 'RejectInvitation', req);
  }

  Block(id: string) {
    return this.get(this.serviceUrl + 'Block/', id);
  }
  UnBlock(id: string) {
    return this.get(this.serviceUrl + 'UnBlock/', id);
  }

  EditPersonalInfo(req: any) {
    return this.post(this.serviceUrl + 'EditPersonalInfo', req);
  }

  Exists(email:string){
    return this.get(this.serviceUrl + 'exists/', email);
  }

  ForgotPassword(req: any) {
    return this.post(this.serviceUrl + 'ForgotPassword', req)
  }
}
