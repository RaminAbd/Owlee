import { Injectable } from '@angular/core';
import {BaseCrudApiService} from '../../../../core/services/base-crud.api.service';
import {HttpClient} from '@angular/common/http';
import {ApplicationMessageCenterService} from '../../../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root'
})
export class NotesApiService extends BaseCrudApiService {
  serviceUrl = 'v1/Notes/';

  constructor(http: HttpClient, handler: ApplicationMessageCenterService) {
    super(http, handler);
  }

  GetAllByStudent(req:any){
    return this.get(this.serviceUrl + 'GetAll',null, req)
  }
}
