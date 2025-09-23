import { inject, Injectable } from '@angular/core';
import { CalendarMeetingEditComponent } from './calendar-meeting-edit.component';
import { MeetingsApiService } from '../../services/meetings.api.service';
import { ApplicationMessageCenterService } from '../../../../../core/services/ApplicationMessageCenter.service';
import { SubtopicModel } from '../../../../dashboard/shared/models/subtopic.model';
import { TranslateService } from '@ngx-translate/core';
import { TopicApiService } from '../../../../dashboard/shared/services/topic.api.service';

@Injectable({
  providedIn: 'root',
})
export class CalendarMeetingEditService {
  private meetingsService: MeetingsApiService = inject(MeetingsApiService);
  private message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  private translate: TranslateService = inject(TranslateService);
  private topicsService: TopicApiService = inject(TopicApiService);
  component: CalendarMeetingEditComponent;
  constructor() {}

  getMeeting() {
    this.component.request.subtopics = [];
    this.meetingsService
      .GetById(this.meetingsService.serviceUrl, this.component.request.id)
      .subscribe((resp) => {
        this.getAllTopics(resp.data);
      });
  }

  getAllTopics(meeting: any) {
    const req = {
      id: meeting.courseId,
      lang: this.translate.currentLang,
    };
    this.topicsService.GetAllByCourse(req).subscribe((resp) => {
      this.component.subTopics = [];
      this.component.topics = resp.data;
      this.component.topics.forEach((x) => {
        x.subTopic = new SubtopicModel();
        this.component.subTopics.push(...x.subtopics);
      });
      this.component.request = meeting;
      // this.component.date = new Date(meeting.date);
      this.component.date = new Date(
        new Date(meeting.date).getTime() - 4 * 60 * 60 * 1000,
      );
      this.component.request.subtopics = meeting.subtopics.map(
        (x: any) => x.id,
      );
    });
  }

  save() {
    this.component.request.date = new Date(
      new Date(this.component.date).getTime() + 4 * 60 * 60 * 1000,
    ).toISOString();
    if (this.isValid()) this.update();
    else this.message.showTranslatedWarningMessage('Fields are not valid');
  }

  isValid() {
    let result = true;
    if (!this.component.request.date || !this.component.request.duration)
      result = false;
    return result;
  }

  update() {
    this.meetingsService
      .Update(this.meetingsService.serviceUrl, this.component.request)
      .subscribe(
        (resp) => {
          if (resp.succeeded) {
            setTimeout(() => {
              this.message.showTranslatedSuccessMessage(
                'Created successfully.',
              );
              this.component.ref.close(true);
            }, 5000);
          }
        },
        (err) => {
          this.component.loading = false;
        },
      );
  }
}
