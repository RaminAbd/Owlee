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
import { Confirmation } from '../../../../../../../../../../../core/extensions/confirmation';
import { ConfirmationService } from 'primeng/api';
import { MultipleMeetingComponent } from '../../../../../components/multiple-meeting/multiple-meeting.component';
import { RangeMeetingComponent } from '../../../../../components/range-meeting/range-meeting.component';

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

  private confirmationService: ConfirmationService =
    inject(ConfirmationService);
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
        groupId: this.groupId,
      },
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        this.service.getAllMeetings();
      }
    });
  }

  deleteMeeting() {
    Confirmation.confirm(
      this.confirmationService,
      this.translate,
      'Are you sure you want to delete this meeting?',
      () => {
        this.service.delete();
      },
    );
  }

  editMeeting() {
    this.openUpsert(this.selectedTask.id);
  }

  openMultiple() {
    const ref = this.dialogService.open(MultipleMeetingComponent, {
      header: this.translate.instant('Schedule meetings'),
      width: '620px',
      height: '630px',
      data: {
        subTopics: this.subTopics,
        groupId: this.groupId,
      },
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        this.service.getAllMeetings();
      }
    });
  }

  openRange() {
    const ref = this.dialogService.open(RangeMeetingComponent, {
      header: this.translate.instant('Schedule meetings'),
      width: '70%',
      height: '90%',
      data: {
        groupId: this.groupId,
      },
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        this.service.getAllMeetings();
      }
    });
  }
}
