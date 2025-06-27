import { inject, Injectable } from '@angular/core';
import { GroupMembersApiService } from '../../../../../../../../services/group-members.api.service';
import { GroupMembersComponent } from './group-members.component';
import { DialogService } from 'primeng/dynamicdialog';
import { InviteStudentDialogComponent } from '../../../../../components/invite-student-dialog/invite-student-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { UpgradePlanComponent } from '../../../../../../../../../../../shared/components/upgrade-plan/upgrade-plan.component';

@Injectable({
  providedIn: 'root',
})
export class GroupMembersService {
  private service: GroupMembersApiService = inject(GroupMembersApiService);
  component: GroupMembersComponent;
  public dialogService: DialogService = inject(DialogService);
  public translate: TranslateService = inject(TranslateService);

  constructor() {}

  getAll() {
    this.service.GetMembersByGroup(this.component.groupId).subscribe((resp) => {
      this.component.members = resp.data;
      this.component.filteredList = structuredClone(resp.data);
      this.checkSlots();
    });
  }

  open() {
    const ref = this.dialogService.open(InviteStudentDialogComponent, {
      header: this.translate.instant('Add member'),
      width: '460px',
      data: {
        groupId: this.component.groupId,
        members: this.component.members,
      },
      style: {
        maxWidth: '95%',
      },
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        this.getAll();
      }
    });
  }

  removeGroupMember(id: string) {
    this.service.Delete(this.service.serviceUrl, id).subscribe((resp) => {
      this.getAll();
    });
  }

  upgradePlan() {
    const ref = this.dialogService.open(UpgradePlanComponent, {
      width: '960px',
      style: {
        maxWidth: '95%',
      },
      data:2
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        this.checkSlots();
      }
    });
  }

  checkSlots() {
    this.service.GetAvailableSlots(this.component.groupId).subscribe((resp) => {
      console.log(resp.data);
      if (resp.data !== 0) {
        this.component.allowedToAddGroup = true;
      } else {
        this.component.allowedToAddGroup = false;
      }
    });
  }
}
