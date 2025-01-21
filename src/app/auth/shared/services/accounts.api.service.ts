import { Injectable } from '@angular/core';
import {BaseApiService} from '../../../core/services/base.api.service';
import {HttpClient} from '@angular/common/http';
import {ApplicationMessageCenterService} from '../../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsApiService extends BaseApiService {
  serviceUrl = 'v1/Accounts/';
  constructor(http: HttpClient, handler: ApplicationMessageCenterService) {
    super(http, handler);
  }

  Exists(email:string){
    return this.get(this.serviceUrl + '/exists/', email);
  }
}
