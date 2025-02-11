import { inject, Injectable } from '@angular/core';
import { GroupMembersApiService } from '../../../../../../../../services/group-members.api.service';
import { GroupMembersComponent } from './group-members.component';
import {DialogService} from 'primeng/dynamicdialog';
import {InviteStudentDialogComponent} from '../../../../../components/invite-student-dialog/invite-student-dialog.component';
import {TranslateService} from '@ngx-translate/core';

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
    });
  }

  open() {
    const ref = this.dialogService.open(InviteStudentDialogComponent, {
      header: this.translate.instant('Add member'),
      width: '460px',
      data: this.component.groupId,
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

  removeGroupMember(id:string){
    this.service.Delete(this.service.serviceUrl, id).subscribe(resp=>{
      this.getAll()
    })
  }
}
