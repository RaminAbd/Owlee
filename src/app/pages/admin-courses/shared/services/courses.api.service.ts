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

  GetAvailableCourseSlots(req: any) {
    return this.get(this.serviceUrl + 'GetAvailableCourseSlots', null, req);
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

  GetAllDashboard(lang: string) {
    return this.get(this.serviceUrl + 'GetAllDashboard/', lang);
  }

  GetStudents(id: string) {
    return this.get(this.serviceUrl + 'GetStudents/', id);
  }

  GetOpenCourses(lang: string) {
    return this.get(this.serviceUrl + 'GetOpenCourses/', lang);
  }

  Subscribe(req: any) {
    return this.post(this.serviceUrl + 'Subscribe', req);
  }
}
