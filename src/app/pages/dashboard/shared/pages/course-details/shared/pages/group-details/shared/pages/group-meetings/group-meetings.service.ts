import { inject, Injectable } from '@angular/core';
import { SubtopicModel } from '../../../../../../../../models/subtopic.model';
import { GroupMeetingsComponent } from './group-meetings.component';
import { TranslateService } from '@ngx-translate/core';
import { TopicApiService } from '../../../../../../../../services/topic.api.service';
import { FormatDate } from '../../../../../../../../../../../core/extensions/format-date';
import { MeetingsApiService } from '../../../../../../../../../../calendar/shared/services/meetings.api.service';
import {
  ApplicationMessageCenterService
} from '../../../../../../../../../../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class GroupMeetingsService {
  component: GroupMeetingsComponent;
  private translate: TranslateService = inject(TranslateService);
  private topicsService: TopicApiService = inject(TopicApiService);
  private service: MeetingsApiService = inject(MeetingsApiService);
  private message:ApplicationMessageCenterService = inject(ApplicationMessageCenterService);
  constructor() {}

  getAllMeetings() {
    var req = {
      groupId: this.component.groupId,
    };
    this.service.GetMeetingsByGroup(req).subscribe((resp) => {
      this.component.meetings = resp.data.map((item: any) => ({
        ...item,
        date: this.formatDate(item.date),
      }));
    });
  }

  formatDate(date: any) {
    return new FormatDate(new Date(date), true).formattedDate;
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

  delete() {
    this.service
      .Delete(this.service.serviceUrl, this.component.selectedTask.id)
      .subscribe((resp) => {
        if (resp.succeeded) {
          this.message.showTranslatedSuccessMessage('Deleted successfully.');
          this.getAllMeetings()
        }
      });
  }
}
