import { Component, inject } from '@angular/core';
import {Location, NgForOf, NgStyle} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { CourseRequestModel } from '../../../../../models/course-request.model';
import { CourseGroupsService } from './course-groups.service';
import {GroupsResponseModel} from '../../../../../models/groups-response.model';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {DashboardCourseModel} from '../../../../../models/dashboard-course.model';

@Component({
  selector: 'app-course-groups',
  imports: [
    FormsModule,
    TranslatePipe,
    NgForOf,
    NgStyle
  ],
  templateUrl: './course-groups.component.html',
  styleUrl: './course-groups.component.scss',
})
export class CourseGroupsComponent {
  public location: Location = inject(Location);
  private service: CourseGroupsService = inject(CourseGroupsService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private confirmationService: ConfirmationService =
    inject(ConfirmationService);

  id = this.route.parent?.snapshot.paramMap.get('id') as string;
  request: CourseRequestModel = new CourseRequestModel();
  groups:GroupsResponseModel[]=[]
  searchText: string;
  constructor() {
    this.service.component = this;
    this.service.getCourse();
    this.service.getGroups();
  }

  back() {
    this.router.navigate(['/main/educator/dashboard']);
  }

  filteredList: GroupsResponseModel[] = [];

  searchByName() {
    this.filteredList = this.groups.filter((obj) =>
      obj.name.toLowerCase().includes(this.searchText.toLowerCase()),
    );
    console.log(this.filteredList);
  }

  checkSlots(){
    this.service.checkSlots()
  }

  getGroupItem(item: GroupsResponseModel) {
    this.router.navigate([
      '/main/educator/dashboard/course/info',
      item.courseId,
      'groups',
      item.id
    ]);
  }
}
