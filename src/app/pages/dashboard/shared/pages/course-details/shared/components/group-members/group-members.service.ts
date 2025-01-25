import { inject, Injectable } from '@angular/core';
import { GroupMembersApiService } from '../../../../../services/group-members.api.service';
import { GroupMembersComponent } from './group-members.component';

@Injectable({
  providedIn: 'root',
})
export class GroupMembersService {
  private service: GroupMembersApiService = inject(GroupMembersApiService);
  component: GroupMembersComponent;
  constructor() {}

  getAll() {
    this.service.GetMembersByGroup(this.component.groupId).subscribe((resp) => {
      this.component.members = resp.data;
    });
  }
}
