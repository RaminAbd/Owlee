import { Component, inject } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MeetingUpsertService } from './meeting-upsert.service';
import { MeetingRequestModel } from '../../../../../../../calendar/shared/models/meeting-request.model';
import { DatePickerModule } from 'primeng/datepicker';
import { SubtopicModel } from '../../../../../models/subtopic.model';
import { MultiSelect } from 'primeng/multiselect';
import {NgIf} from "@angular/common";
import {LanguageService} from '../../../../../../../../core/services/language.service';
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from "@angular/material/timepicker";
import {NearestTime} from '../../../../../../../../core/extensions/get-nearest-time';
@Component({
  selector: 'app-meeting-upsert',
    imports: [
        DropdownModule,
        FormsModule,
        TranslatePipe,
        DatePickerModule,
        MultiSelect,
        NgIf,
        MatFormField,
        MatInput,
        MatTimepicker,
        MatTimepickerInput,
        MatTimepickerToggle,
    ],
  templateUrl: './meeting-upsert.component.html',
  styleUrl: './meeting-upsert.component.scss',
})
export class MeetingUpsertComponent {
  private service: MeetingUpsertService = inject(MeetingUpsertService);
  private language: LanguageService = inject(LanguageService);
  request: MeetingRequestModel = new MeetingRequestModel();
  id: string;
  date: any;
  time: any;
  subtopics: SubtopicModel[] = [];
  isSubmitted = false;
  colors: any[] = [
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
  ];
  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    this.service.component = this;
    this.subtopics = config.data.subTopics;
    this.request.id = config.data.id;
    this.request.groupId = config.data.groupId;
    if (this.request.id !== 'create') this.service.getMeeting();
  }

  save() {
    this.isSubmitted = true;
    this.service.save();
  }

  startDateSelected() {
    this.time = NearestTime.getTime(new Date());
  }
}
