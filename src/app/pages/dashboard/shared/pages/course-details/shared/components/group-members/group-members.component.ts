import { Component, inject, Input } from '@angular/core';
import { GroupMembersService } from './group-members.service';
import {GroupMembersResponseModel} from '../../../../../models/group-members.response.model';
import {GroupsResponseModel} from '../../../../../models/groups-response.model';
import {NgForOf, NgStyle} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-group-members',
  imports: [
    NgForOf,
    ReactiveFormsModule,
    TranslatePipe,
    FormsModule,
    NgStyle
  ],
  templateUrl: './group-members.component.html',
  styleUrl: './group-members.component.scss',
})
export class GroupMembersComponent {
  private service: GroupMembersService = inject(GroupMembersService);
  @Input() set groupId(e:string) {
    this.service.component = this;
    this.service.getAll();
  };
  members:GroupMembersResponseModel[]=[]
  searchText:string;
  constructor() {

  }

  filteredList: GroupMembersResponseModel[] = [];

  searchByName() {
    this.filteredList = this.members.filter((obj) =>
      obj.email.toLowerCase().includes(this.searchText.toLowerCase()),
    );
    console.log(this.filteredList);
  }

  openInvitation() {

  }
}
