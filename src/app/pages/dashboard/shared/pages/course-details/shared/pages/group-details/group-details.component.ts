import { Component, inject } from '@angular/core';
import { Location, NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { CourseRequestModel } from '../../../../../models/course-request.model';
import { GroupDetailsService } from './group-details.service';
import { TranslatePipe } from '@ngx-translate/core';
import {GroupRequestModel} from '../../../../../models/group-request.model';

@Component({
  selector: 'app-group-details',
  imports: [NgClass, TranslatePipe],
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.scss',
})
export class GroupDetailsComponent {
  public service: GroupDetailsService = inject(GroupDetailsService);
  public location: Location = inject(Location);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private confirmationService: ConfirmationService =
    inject(ConfirmationService);

  courseId = this.route.parent?.snapshot.paramMap.get('id') as string;
  groupdId = this.route.snapshot.paramMap.get('groupId') as string;
  course: CourseRequestModel = new CourseRequestModel();
  group:GroupRequestModel = new GroupRequestModel()
  selectedTab = 1;
  constructor() {
    this.service.component = this;
    this.service.getCourse();
    this.service.getGroup();
  }
  back() {
    this.router.navigate([
      '/main/educator/dashboard/course/info',
      this.courseId,'groups'
    ]);
  }
}
