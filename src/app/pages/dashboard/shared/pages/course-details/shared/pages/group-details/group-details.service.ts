import { inject, Injectable } from '@angular/core';
import { CourseGroupsComponent } from '../course-groups/course-groups.component';
import { GroupDetailsComponent } from './group-details.component';
import { CoursesApiService } from '../../../../../../../admin-courses/shared/services/courses.api.service';
import { GroupsApiService } from '../../../../../services/groups.api.service';
import { TranslateService } from '@ngx-translate/core';
import {TopicApiService} from '../../../../../services/topic.api.service';

@Injectable({
  providedIn: 'root',
})
export class GroupDetailsService {
  component: GroupDetailsComponent;
  private coursesService: CoursesApiService = inject(CoursesApiService);
  private service: GroupsApiService = inject(GroupsApiService);
  private translate: TranslateService = inject(TranslateService);
  private topicsService: TopicApiService = inject(TopicApiService);

  getCourse() {
    const req = {
      id: this.component.courseId,
      lang: this.translate.currentLang,
    };
    this.coursesService
      .GetByIdByLang(this.coursesService.serviceUrl, req)
      .subscribe((resp) => {
        this.component.course = resp.data;
      });
  }

  getGroup() {
    this.service
      .GetById(this.service.serviceUrl, this.component.groupdId)
      .subscribe((resp) => {
        this.component.group = resp.data;
      });
  }

  getAllTopics(){
    const req ={
      groupId: this.component.groupdId,
      lang: this.translate.currentLang,
    }
    this.topicsService.GetAllByGroup(req).subscribe((resp) => {
      this.component.topics = resp.data;
    })
  }
}
