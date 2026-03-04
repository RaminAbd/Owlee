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
import {LanguageService} from '../../../../../../../../core/services/language.service';
import {DropdownModule} from 'primeng/dropdown';
import {NearestTime} from '../../../../../../../../core/extensions/get-nearest-time';
import {
  MatTimepicker,
  MatTimepickerInput,
  MatTimepickerModule,
  MatTimepickerToggle,
} from '@angular/material/timepicker';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {provideNativeDateAdapter} from '@angular/material/core';
@Component({
  selector: 'app-multiple-meeting',
  imports: [DatePicker, MultiSelect, TranslatePipe, FormsModule, NgForOf, NgIf, DropdownModule,    MatFormField,
    MatTimepickerInput,
    MatTimepickerToggle,
    MatTimepicker,
    MatInput,],
  providers: [provideNativeDateAdapter()],
  templateUrl: './multiple-meeting.component.html',
  styleUrl: './multiple-meeting.component.scss',
})
export class MultipleMeetingComponent {
  private service: MultipleMeetingService = inject(MultipleMeetingService);
  private language: LanguageService = inject(LanguageService);
  request: MultipleMeetingRequestModel = new MultipleMeetingRequestModel();
  date: any;
  time: any;
  dates: any[] = [];
  isSubmitted = false;
  subtopics: SubtopicModel[] = [];
  selectedTopics: string[] = [];
  duration: number = 0;
  colors:any[]=[
    { name: this.language.getByKey('Red'), value: '#EF4444' },
    { name: this.language.getByKey('Pink'), value: '#EC4899' },
    { name: this.language.getByKey('Purple'), value: '#A855F7' },
    { name: this.language.getByKey('Deep Purple'), value: '#6366F1' },
    { name: this.language.getByKey('Blue'), value: '#3B82F6' },
    { name: this.language.getByKey('Light Blue'), value: '#0EA5E9' },
    { name: this.language.getByKey('Cyan'), value: '#06B6D4' },
    { name: this.language.getByKey('Teal'), value: '#14B8A6' },
    { name: this.language.getByKey('Green'), value: '#22C55E' },
    { name: this.language.getByKey('Yellow'), value: '#EAB308' },
    { name: this.language.getByKey('Orange'), value: '#F97316' },
    { name: this.language.getByKey('Grey'), value: '#6B7280' }
  ]
  color:string='';
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
    if (this.date && this.time) {
      const date = new Date(this.date);
      const date2 = new Date(this.date);
      const time = new Date(this.time);
      date.setHours(time.getHours()+4, time.getMinutes(), 0, 0);
      date2.setHours(time.getHours(), time.getMinutes(), 0, 0);
      console.log(date.toISOString());
      if (this.duration > 0) {
        let item = {
          showDate: this.formatDate(date2),
          subtopics: this.selectedTopics,
          date: date.toISOString(),
          duration: this.duration,
          color:this.color ? this.color : '#c6e7ff'
        };
        this.request.meetings.push(item);
        this.selectedTopics = [];
        this.date = undefined;
        this.time = undefined;
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

  startDateSelected() {
    this.time = NearestTime.getTime(new Date());
  }
}
