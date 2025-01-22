import { Injectable } from '@angular/core';
import {BaseCrudApiService} from '../../../../core/services/base-crud.api.service';
import {HttpClient} from '@angular/common/http';
import {ApplicationMessageCenterService} from '../../../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsApiService extends BaseCrudApiService {
  serviceUrl = 'v1/Group/';
  constructor(http: HttpClient, handler: ApplicationMessageCenterService) {
    super(http, handler);
  }
  GetAllByCourse(courseId:string){
    return this.get(this.serviceUrl + 'GetAllByCourse/', courseId);
  }

  GetAvailableGroupSlots(courseId:string){
    return this.get(this.serviceUrl + 'GetAvailableGroupSlots/', courseId);
  }
}
