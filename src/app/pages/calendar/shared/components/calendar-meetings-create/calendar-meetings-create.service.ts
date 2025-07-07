import { inject, Injectable } from '@angular/core';
import { MultipleMeetingComponent } from '../../../../dashboard/shared/pages/course-details/shared/components/multiple-meeting/multiple-meeting.component';
import { MeetingsApiService } from '../../services/meetings.api.service';
import { ApplicationMessageCenterService } from '../../../../../core/services/ApplicationMessageCenter.service';
import { CalendarMeetingsCreateComponent } from './calendar-meetings-create.component';
import { GroupsApiService } from '../../../../dashboard/shared/services/groups.api.service';
import { SubtopicModel } from '../../../../dashboard/shared/models/subtopic.model';
import { TopicApiService } from '../../../../dashboard/shared/services/topic.api.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class CalendarMeetingsCreateService {
  component: CalendarMeetingsCreateComponent;
  private meetingsService: MeetingsApiService = inject(MeetingsApiService);
  public message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  private service: GroupsApiService = inject(GroupsApiService);
  private topicsService: TopicApiService = inject(TopicApiService);
  private translate: TranslateService = inject(TranslateService);
  constructor() {}

  create() {
    this.meetingsService
      .CreateMany(this.component.request)
      .subscribe((resp) => {
        if (resp.succeeded) {
          setTimeout(() => {
            this.message.showTranslatedSuccessMessage('Successfully created!');

            this.component.ref.close(true);
            this.component.isSubmitted = false;
          }, 5000);
        }
      });
  }

  getGroups() {
    this.service.GetAllByCourse(this.component.courseId).subscribe((resp) => {
      this.component.groups = resp.data;
    });
  }

  getAllTopics() {
    const req = {
      id: this.component.courseId,
      lang: this.translate.currentLang,
    };
    this.topicsService.GetAllByCourse(req).subscribe((resp) => {
      this.component.subTopics = [];
      this.component.topics = resp.data;
      this.component.topics.forEach((x) => {
        x.subTopic = new SubtopicModel();
        this.component.subTopics.push(...x.subtopics);
      });
    });
  }
}
