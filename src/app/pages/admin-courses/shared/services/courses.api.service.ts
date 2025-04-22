import { Injectable } from '@angular/core';
import { BaseCrudApiService } from '../../../../core/services/base-crud.api.service';
import { HttpClient } from '@angular/common/http';
import { ApplicationMessageCenterService } from '../../../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class CoursesApiService extends BaseCrudApiService {
  serviceUrl = 'v1/Courses/';
  constructor(http: HttpClient, handler: ApplicationMessageCenterService) {
    super(http, handler);
  }

  GetByEducator(req: any) {
    return this.get(this.serviceUrl + 'GetByEducator/', null, req);
  }

  GetAvailableCourseSlots(educatorId: string) {
    return this.get(this.serviceUrl + 'GetAvailableCourseSlots/', educatorId);
  }

  Copy(req: any) {
    return this.post(this.serviceUrl + 'Copy', req);
  }

  getDashboard(req: any) {
    return this.get(this.serviceUrl + 'Dashboard/', null, req);
  }

  GetDetailed(req: any) {
    return this.get(this.serviceUrl + 'GetDetailed/', null, req);
  }

  GetAllDashboard(lang:string){
    return this.get(this.serviceUrl + 'GetAllDashboard/', lang);
  }
}
