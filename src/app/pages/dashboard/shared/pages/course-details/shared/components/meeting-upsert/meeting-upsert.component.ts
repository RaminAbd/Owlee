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
@Component({
  selector: 'app-meeting-upsert',
    imports: [
        DropdownModule,
        FormsModule,
        TranslatePipe,
        DatePickerModule,
        MultiSelect,
        NgIf,
    ],
  templateUrl: './meeting-upsert.component.html',
  styleUrl: './meeting-upsert.component.scss',
})
export class MeetingUpsertComponent {
  private service: MeetingUpsertService = inject(MeetingUpsertService);
  request: MeetingRequestModel = new MeetingRequestModel();
  id: string;
  date: any;
  subtopics: SubtopicModel[] = [];
  isSubmitted = false;
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
}
