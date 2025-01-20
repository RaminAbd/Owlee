import { Injectable } from '@angular/core';
import { BaseCrudApiService } from '../../../../core/services/base-crud.api.service';
import { HttpClient } from '@angular/common/http';
import { ApplicationMessageCenterService } from '../../../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class KnownLanguagesApiService extends BaseCrudApiService {
  serviceUrl = 'v1/SystemLanguage/';
  constructor(http: HttpClient, handler: ApplicationMessageCenterService) {
    super(http, handler);
  }
}
