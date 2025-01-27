import { Component, inject, Input } from '@angular/core';
import { GroupMembersService } from './group-members.service';
import { GroupMembersResponseModel } from '../../../../../../../../models/group-members.response.model';
import { NgForOf, NgStyle } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-group-members',
  imports: [NgForOf, ReactiveFormsModule, TranslatePipe, FormsModule, NgStyle],
  templateUrl: './group-members.component.html',
  styleUrl: './group-members.component.scss',
})
export class GroupMembersComponent {
  private service: GroupMembersService = inject(GroupMembersService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  groupId = this.route.parent?.snapshot.paramMap.get('groupId') as string;
  members: GroupMembersResponseModel[] = [];
  searchText: string;
  filteredList: GroupMembersResponseModel[] = [];
  constructor() {
    this.service.component = this;
    this.service.getAll();
  }

  searchByName() {
    this.filteredList = this.members.filter((obj) =>
      obj.email.toLowerCase().includes(this.searchText.toLowerCase()),
    );
  }

  openInvitation() {
    this.service.open();
  }

  remove(id:string): void {
    this.service.removeGroupMember(id)
  }
}
