import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { CourseRequestModel } from '../../../../../models/course-request.model';
import { GroupDetailsService } from './group-details.service';
import { TranslatePipe } from '@ngx-translate/core';
import { GroupRequestModel } from '../../../../../models/group-request.model';
import { TopicRequestModel } from '../../../../../models/topic-request.model';

@Component({
  selector: 'app-group-details',
  imports: [
    TranslatePipe,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.scss',
})
export class GroupDetailsComponent {
  public service: GroupDetailsService = inject(GroupDetailsService);
  public location: Location = inject(Location);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  courseId = this.route.parent?.snapshot.paramMap.get('id') as string;
  groupId = this.route.snapshot.paramMap.get('groupId') as string;
  course: CourseRequestModel = new CourseRequestModel();
  group: GroupRequestModel = new GroupRequestModel();

  constructor() {
    this.service.component = this;
    this.service.getCourse();
    this.service.getGroup();
  }
  back() {
    this.router.navigate([
      '/main/educator/dashboard/course/info',
      this.courseId,
      'groups',
    ]);
  }
}
