import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseApiService} from './base.api.service';
import {ApplicationMessageCenterService} from './ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class BaseCrudApiService extends BaseApiService {
  constructor(http: HttpClient, handler: ApplicationMessageCenterService) {
    super(http, handler);
  }

  GetForm(serviceUrl: string) {
    return this.get(serviceUrl + 'GetForm', null, null);
  }

  GetAll(serviceUrl: string) {
    return this.get(serviceUrl + 'GetAll/', null, null);
  }

  GetAllByLang(serviceUrl: string, lang: any) {
    return this.get(serviceUrl + 'GetAll/', lang, null);
  }

  Create(serviceUrl: string, form: any) {
    return this.post(serviceUrl + 'Create', form);
  }

  Update(serviceUrl: string, form: any) {
    return this.post(serviceUrl + 'Edit', form);
  }

  GetById(serviceUrl: string, id: string) {
    return this.get(serviceUrl + 'Get/', id, null);
  }

  Delete(serviceUrl: string, id: string) {
    return this.delete(serviceUrl + 'Delete/', id);
  }

  GetByIdByLang(serviceUrl: string, req: any) {
    return this.get(serviceUrl + 'Get/', null, req);
  }

  GetAllWithPaging(serviceUrl: string, req: any) {
    return this.get(serviceUrl + 'GetAll', null, req);
  }
}
