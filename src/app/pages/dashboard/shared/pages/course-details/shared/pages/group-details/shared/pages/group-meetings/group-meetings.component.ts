import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ScheduleTaskModel } from '../../../../../../../../../../calendar/shared/models/schedule-task.model';
import { GroupMembersResponseModel } from '../../../../../../../../models/group-members.response.model';
import { MeetingUpsertComponent } from '../../../../../components/meeting-upsert/meeting-upsert.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Popover } from 'primeng/popover';
import { ActivatedRoute } from '@angular/router';
import { GroupMeetingsService } from './group-meetings.service';
import { TopicRequestModel } from '../../../../../../../../models/topic-request.model';
import { SubtopicModel } from '../../../../../../../../models/subtopic.model';

@Component({
  selector: 'app-group-meetings',
  imports: [FormsModule, NgForOf, TranslatePipe, Popover],
  templateUrl: './group-meetings.component.html',
  styleUrl: './group-meetings.component.scss',
})
export class GroupMeetingsComponent {
  meetings: ScheduleTaskModel[] = [];
  private service: GroupMeetingsService = inject(GroupMeetingsService);
  private translate: TranslateService = inject(TranslateService);
  public dialogService: DialogService = inject(DialogService);
  selectedTask: ScheduleTaskModel = new ScheduleTaskModel();
  private route: ActivatedRoute = inject(ActivatedRoute);
  courseId = this.route.parent?.parent?.snapshot.paramMap.get('id') as string;
  groupId = this.route.parent?.snapshot.paramMap.get('groupId') as string;
  topics: TopicRequestModel[] = [];
  subTopics: SubtopicModel[] = [];
  constructor() {
    this.service.component = this;
    this.service.getAllMeetings();
    this.service.getAllTopics();
  }

  openUpsert(id: string) {
    const ref = this.dialogService.open(MeetingUpsertComponent, {
      header: this.translate.instant('Schedule a meeting'),
      width: '620px',
      height: '630px',
      data: {
        id: id,
        subTopics: this.subTopics,
      },
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        this.service.getAllMeetings()
      }
    });
  }

  deleteMeeting() {}

  editMeeting() {
    this.openUpsert(this.selectedTask.id);
  }
}
