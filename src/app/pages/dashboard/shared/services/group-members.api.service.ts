import { Injectable } from '@angular/core';
import { BaseCrudApiService } from '../../../../core/services/base-crud.api.service';
import { HttpClient } from '@angular/common/http';
import { ApplicationMessageCenterService } from '../../../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class GroupMembersApiService extends BaseCrudApiService {
  serviceUrl = 'v1/GroupMember/';
  constructor(http: HttpClient, handler: ApplicationMessageCenterService) {
    super(http, handler);
  }
  GetMembersByGroup(groupId: string) {
    return this.get(this.serviceUrl + 'GetMembersByGroup/', groupId);
  }
  GetMembersByEducator(educatorId: string) {
    return this.get(this.serviceUrl + 'GetAll/', educatorId);
  }
  GetAvailableSlots(req: any) {
    return this.get(this.serviceUrl + 'GetAvailableSlots', null, req);
  }
}
