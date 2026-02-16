import { Injectable } from '@angular/core';
import { BaseCrudApiService } from '../../../../core/services/base-crud.api.service';
import { HttpClient } from '@angular/common/http';
import { ApplicationMessageCenterService } from '../../../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class RatingsApiService extends BaseCrudApiService {
  serviceUrl = 'v1/Ratings/';
  constructor(http: HttpClient, handler: ApplicationMessageCenterService) {
    super(http, handler);
  }

  Rate(req: any) {
    return this.post(this.serviceUrl + 'Rate', req);
  }

  GetRating(req: any) {
    return this.get(this.serviceUrl + 'Get', null, req);
  }

  GetOverview(req: any) {
    return this.get(this.serviceUrl + 'GetOverview', null, req);
  }

  GetAllRatings(req: any) {
    return this.get(this.serviceUrl + 'GetAll', null, req);
  }
}
