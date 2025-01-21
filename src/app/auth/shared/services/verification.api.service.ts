import { Injectable } from '@angular/core';
import {BaseApiService} from '../../../core/services/base.api.service';
import {HttpClient} from '@angular/common/http';
import {ApplicationMessageCenterService} from '../../../core/services/ApplicationMessageCenter.service';
import {AuthRequestModel} from '../models/auth-request.model';
import {AuthResponseModel} from '../models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class VerificationApiService extends BaseApiService {
  serviceUrl = 'v1/Verification/';
  constructor(http: HttpClient, handler: ApplicationMessageCenterService) {
    super(http, handler);
  }
  SendVerification(req: any) {
    return this.post(this.serviceUrl + 'SendVerification', req);
  }
}
