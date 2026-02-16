import { Component, inject, Input } from '@angular/core';
import { GroupMembersService } from './group-members.service';
import { GroupMembersResponseModel } from '../../../../../../../../models/group-members.response.model';
import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {CourseRequestModel} from '../../../../../../../../models/course-request.model';

@Component({
  selector: 'app-group-members',
  imports: [
    NgForOf,
    ReactiveFormsModule,
    TranslatePipe,
    FormsModule,
    NgStyle,
    NgIf,
  ],
  templateUrl: './group-members.component.html',
  styleUrl: './group-members.component.scss',
})
export class GroupMembersComponent {
  private service: GroupMembersService = inject(GroupMembersService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  groupId = this.route.parent?.snapshot.paramMap.get('groupId') as string;
  courseId = this.route.parent?.parent?.snapshot.paramMap.get('id') as string;
  members: GroupMembersResponseModel[] = [];
  searchText: string;
  course: CourseRequestModel = new CourseRequestModel();
  filteredList: GroupMembersResponseModel[] = [];
  allowedToAddGroup: boolean = true;
  showEditComment:boolean = false;
  showComments:boolean = false;
  constructor() {
    console.log(this.courseId, "courseId")
    this.service.component = this;
    this.service.getAll();
    this.service.getCourse();
  }

  searchByName() {
    this.filteredList = this.members.filter((obj) =>
      obj.email.toLowerCase().includes(this.searchText.toLowerCase()),
    );
  }

  openInvitation() {
    this.service.open();
  }

  remove(id: string): void {
    this.service.removeGroupMember(id);
  }

  upgradePlan() {
    this.service.upgradePlan();
  }

  editComment(id: string) {
    this.service.getComments(id)
  }
}
