import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultipleMeetingService } from './multiple-meeting.service';
import { MultipleMeetingRequestModel } from '../../../../../models/multiple-meeting-request.model';
import { DatePicker } from 'primeng/datepicker';
import { MultiSelect } from 'primeng/multiselect';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { FormatDate } from '../../../../../../../../core/extensions/format-date';
import { SubtopicModel } from '../../../../../models/subtopic.model';

@Component({
  selector: 'app-multiple-meeting',
  imports: [DatePicker, MultiSelect, TranslatePipe, FormsModule, NgForOf, NgIf],
  templateUrl: './multiple-meeting.component.html',
  styleUrl: './multiple-meeting.component.scss',
})
export class MultipleMeetingComponent {
  private service: MultipleMeetingService = inject(MultipleMeetingService);
  request: MultipleMeetingRequestModel = new MultipleMeetingRequestModel();
  date: any;
  dates: any[] = [];
  isSubmitted = false;
  subtopics: SubtopicModel[] = [];
  selectedTopics: string[] = [];
  duration: number = 0;
  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    this.service.component = this;
    this.subtopics = config.data.subTopics;
    this.request.groupId = config.data.groupId;
  }

  save() {
    console.log(this.request);
    if (this.request.meetings.length > 0) {
      if (!this.isSubmitted) {
        this.service.create();
        this.isSubmitted = true;
      }
    } else {
      this.service.message.showTranslatedWarningMessage('At least 1 meeting!');
    }
  }

  addMeeting() {
    if (this.date) {
      if (this.duration > 0) {
        let item = {
          showDate: this.formatDate(this.date),
          subtopics: this.selectedTopics,
          date: new Date(
            new Date(this.date).getTime() + 4 * 60 * 60 * 1000,
          ).toISOString(),
          duration: this.duration,
        };
        this.request.meetings.push(item);
        this.selectedTopics = [];
        this.date = undefined;
      } else {
        this.service.message.showTranslatedWarningMessage(
          "Duration can't be 0",
        );
      }
    } else {
      this.service.message.showTranslatedWarningMessage(
        'Date field is required!',
      );
    }
    // if (this.selectedTopics.length > 0) {
    //
    // } else {
    //   this.service.message.showTranslatedWarningMessage(
    //     'Topic field is required!',
    //   );
    // }
  }

  formatDate(date: any) {
    return new FormatDate(new Date(date), true).formattedDate;
  }
  deleteMeeting(i: any) {
    this.request.meetings.splice(i, 1);
  }
}
