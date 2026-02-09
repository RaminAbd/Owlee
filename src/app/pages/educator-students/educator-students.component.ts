import {Component, inject} from '@angular/core';
import {
  GroupMembersService
} from '../dashboard/shared/pages/course-details/shared/pages/group-details/shared/pages/group-members/group-members.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {GroupMembersResponseModel} from '../dashboard/shared/models/group-members.response.model';
import {EducatorStudentsService} from './educator-students.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-educator-students',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    RouterLink,
    TranslatePipe,
    NgStyle
  ],
  templateUrl: './educator-students.component.html',
  styleUrl: './educator-students.component.scss'
})
export class EducatorStudentsComponent {
  private service: EducatorStudentsService = inject(EducatorStudentsService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  members: GroupMembersResponseModel[] = [];
  searchText: string;
  filteredList: GroupMembersResponseModel[] = [];
  allowedToAddGroup: boolean = true;
  showEditComment:boolean = false;
  showComments:boolean = false;
  constructor() {
    this.service.component = this;
    this.service.getAll();
  }

  searchByName() {
    this.filteredList = this.members.filter((obj) =>
      obj.email.toLowerCase().includes(this.searchText.toLowerCase()),
    );
  }

  remove(id: string): void {
    this.service.removeGroupMember(id);
  }

  editComment(id: string) {
    this.service.getComments(id)
  }
}
