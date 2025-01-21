import { Injectable } from '@angular/core';
import {BaseCrudApiService} from '../../../../core/services/base-crud.api.service';
import {HttpClient} from '@angular/common/http';
import {ApplicationMessageCenterService} from '../../../../core/services/ApplicationMessageCenter.service';

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
}
