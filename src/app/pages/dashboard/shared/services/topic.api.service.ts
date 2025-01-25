import {Injectable} from '@angular/core';
import {BaseCrudApiService} from '../../../../core/services/base-crud.api.service';
import {HttpClient} from '@angular/common/http';
import {ApplicationMessageCenterService} from '../../../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class TopicApiService extends BaseCrudApiService {
  serviceUrl = 'v1/Topic/';

  constructor(http: HttpClient, handler: ApplicationMessageCenterService) {
    super(http, handler);
  }

  GetAllByGroup(req: any) {
    return this.get(this.serviceUrl + 'GetAllByGroup/', null, req);
  }

  AddSubtopic(subTopic: any) {
    return this.post(this.serviceUrl + 'AddSubtopic', subTopic);
  }

  EditSubtopic(subTopic: any) {
    return this.post(this.serviceUrl + 'EditSubtopic', subTopic);
  }

  Copy(req: any) {
    return this.post(this.serviceUrl + 'Copy', req);
  }

  DeleteSubTopic(serviceUrl: string, id: string) {
    return this.delete(serviceUrl + 'DeleteSubtopic/', id);
  }

  AddFiles(req: any) {
    return this.post(this.serviceUrl + 'AddFiles', req);
  }

  DeleteFile(serviceUrl: string, id: string) {
    return this.delete(serviceUrl + 'DeleteFile/', id);
  }
}
