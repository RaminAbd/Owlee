import { inject, Injectable } from '@angular/core';
import { GroupMembersApiService } from '../dashboard/shared/services/group-members.api.service';
import { GroupMembersComponent } from '../dashboard/shared/pages/course-details/shared/pages/group-details/shared/pages/group-members/group-members.component';
import { DialogService } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { InviteStudentDialogComponent } from '../dashboard/shared/pages/course-details/shared/components/invite-student-dialog/invite-student-dialog.component';
import { UpgradePlanComponent } from '../../shared/components/upgrade-plan/upgrade-plan.component';
import { MemberCommentComponent } from '../dashboard/shared/pages/course-details/shared/pages/group-details/shared/pages/group-members/components/member-comment/member-comment.component';
import { EducatorStudentsComponent } from './educator-students.component';

@Injectable({
  providedIn: 'root',
})
export class EducatorStudentsService {
  private service: GroupMembersApiService = inject(GroupMembersApiService);
  component: EducatorStudentsComponent;
  public dialogService: DialogService = inject(DialogService);
  public translate: TranslateService = inject(TranslateService);
  constructor() {}

  getAll() {
    this.service
      .GetMembersByEducator(localStorage.getItem('userId') as string)
      .subscribe((resp) => {
        this.component.members = resp.data;
        this.component.filteredList = structuredClone(resp.data);
        console.log(this.component.members, 'members');
      });
  }

  removeGroupMember(id: string) {
    this.service.Delete(this.service.serviceUrl, id).subscribe((resp) => {
      this.getAll();
    });
  }

  getComments(id: string) {
    const req = {
      EducatorId: localStorage.getItem('userId') as string,
      StudentId: id,
    };
    console.log(req);
    const ref = this.dialogService.open(MemberCommentComponent, {
      width: '456px',
      header: this.translate.instant('Notes'),
      closable: true,
      style: {
        maxWidth: '95%',
      },
      data: {
        request: req,
      },
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        // this.checkSlots();
      }
    });
  }
}
