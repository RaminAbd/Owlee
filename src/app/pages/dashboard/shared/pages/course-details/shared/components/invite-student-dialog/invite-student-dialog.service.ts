import { inject, Injectable } from '@angular/core';
import { InviteStudentDialogComponent } from './invite-student-dialog.component';
import { GroupMembersApiService } from '../../../../../services/group-members.api.service';
import {AccountsApiService} from '../../../../../../../../auth/shared/services/accounts.api.service';

@Injectable({
  providedIn: 'root',
})
export class InviteStudentDialogService {
  private service: GroupMembersApiService = inject(GroupMembersApiService);
  component: InviteStudentDialogComponent;
  constructor() {}

  createGroupMember() {
    const req = {
      groupId: this.component.groupId,
      emails: [this.component.form.value.email],
    };
    console.log(req)
    this.service
      .Create(this.service.serviceUrl, req)
      .subscribe((resp) => {
        if (resp.succeeded) {
          this.component.ref.close(true);
        }
      });
  }
}
