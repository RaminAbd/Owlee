import { Component, inject } from '@angular/core';
import { DatePicker } from 'primeng/datepicker';
import { MultiSelect } from 'primeng/multiselect';
import {NgForOf, NgIf} from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MultipleMeetingService } from '../../../../dashboard/shared/pages/course-details/shared/components/multiple-meeting/multiple-meeting.service';
import { MultipleMeetingRequestModel } from '../../../../dashboard/shared/models/multiple-meeting-request.model';
import { SubtopicModel } from '../../../../dashboard/shared/models/subtopic.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormatDate } from '../../../../../core/extensions/format-date';
import { CalendarMeetingsCreateService } from './calendar-meetings-create.service';
import { CoursesResponseModel } from '../../../../admin-courses/shared/models/courses-response.model';
import { DashboardCourseModel } from '../../../../dashboard/shared/models/dashboard-course.model';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { GroupRequestModel } from '../../../../dashboard/shared/models/group-request.model';
import { TopicRequestModel } from '../../../../dashboard/shared/models/topic-request.model';

@Component({
  selector: 'app-calendar-meetings-create',
  imports: [
    DatePicker,
    MultiSelect,
    NgForOf,
    TranslatePipe,
    FormsModule,
    DropdownModule,
    NgIf,
  ],
  templateUrl: './calendar-meetings-create.component.html',
  styleUrl: './calendar-meetings-create.component.scss',
})
export class CalendarMeetingsCreateComponent {
  private service: CalendarMeetingsCreateService = inject(
    CalendarMeetingsCreateService,
  );
  request: MultipleMeetingRequestModel = new MultipleMeetingRequestModel();
  date: any;
  dates: any[] = [];
  isSubmitted = false;
  selectedTopics: string[] = [];
  courses: DashboardCourseModel[] = [];
  courseId: string;
  groups: GroupRequestModel[] = [];
  groupId: string;

  topics: TopicRequestModel[] = [];
  subTopics: SubtopicModel[] = [];
  duration: number = 0;
  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    this.service.component = this;
    this.courses = config.data.courses;
    this.courseId = config.data.courses[0].courseId;
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
        if (this.request.groupId) {
          let item = {
            showDate: this.formatDate(this.date),
            subtopics: this.selectedTopics,
            date: new Date(this.date).toISOString(),
            duration: this.duration,
          };
          this.request.meetings.push(item);
          this.selectedTopics = [];
          this.date = undefined;
        } else {
          this.service.message.showTranslatedWarningMessage(
            'Group field is required!',
          );
        }
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

  courseChanged() {
    this.service.getGroups();
    this.service.getAllTopics();
  }
}
