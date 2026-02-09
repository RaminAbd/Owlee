import { Injectable } from '@angular/core';
import {BaseCrudApiService} from '../../../../core/services/base-crud.api.service';
import {HttpClient} from '@angular/common/http';
import {ApplicationMessageCenterService} from '../../../../core/services/ApplicationMessageCenter.service';
import {AuthRequestModel} from '../../../../auth/shared/models/auth-request.model';

@Injectable({
  providedIn: 'root'
})
export class EducatorsApiService extends BaseCrudApiService {
  serviceUrl = 'v1/Educator/';
  constructor(http: HttpClient, handler: ApplicationMessageCenterService) {
    super(http, handler);
  }
  SignUp(req:any){
    return this.post(this.serviceUrl + 'SignUp', req)
  }

  SignIn(req: AuthRequestModel) {
    return this.post(this.serviceUrl + 'SignIn', req);
  }

  SignUpWithGoogle(req: any) {
    return this.post(this.serviceUrl + 'SignUpWithGoogle', req);
  }

  Exists(email:string){
    return this.get(this.serviceUrl + 'exists/', email);
  }

  ForgotPassword(req: any) {
    return this.post(this.serviceUrl + 'ForgotPassword', req)
  }

  ExistsByPersonalId(personalId:string){
    return this.get(this.serviceUrl + 'ExistsByPersonalId/', personalId);
  }
}
