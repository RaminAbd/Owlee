import { Injectable } from '@angular/core';
import { BaseCrudApiService } from '../../../../../../../../../../core/services/base-crud.api.service';
import { HttpClient } from '@angular/common/http';
import { ApplicationMessageCenterService } from '../../../../../../../../../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class HomeWorksApiService extends BaseCrudApiService {
  serviceUrl = 'v1/HomeWorks/';

  constructor(http: HttpClient, handler: ApplicationMessageCenterService) {
    super(http, handler);
  }

  GetAllByCourse(courseId: string) {
    return this.get(this.serviceUrl + 'getAll/', courseId);
  }
  GetForSubmission(id: string) {
    return this.get(this.serviceUrl + 'GetForSubmission/', id);
  }

  override Update(serviceUrl: string, form: any) {
    return this.post(serviceUrl + 'Update', form);
  }

  GetAllForStudent(req: any) {
    return this.get(this.serviceUrl + 'GetAllForStudent', null, req);
  }

  Submit(form: any) {
    return this.post(this.serviceUrl + 'Submit', form);
  }
}
