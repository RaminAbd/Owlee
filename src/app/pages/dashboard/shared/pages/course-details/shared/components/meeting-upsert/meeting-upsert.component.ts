import { Component, inject } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MeetingUpsertService } from './meeting-upsert.service';
import { Calendar } from 'primeng/calendar';
import { MeetingRequestModel } from '../../../../../../../calendar/shared/models/meeting-request.model';
import { DatePickerModule } from 'primeng/datepicker';
import { SubtopicModel } from '../../../../../models/subtopic.model';
import { MultiSelect } from 'primeng/multiselect';
@Component({
  selector: 'app-meeting-upsert',
  imports: [
    DropdownModule,
    FormsModule,
    TranslatePipe,
    DatePickerModule,
    MultiSelect,
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
  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    this.service.component = this;
    this.subtopics = config.data.subTopics;
    this.id = config.data.id;
    if (this.id !== 'create') this.service.getMeeting();
  }

  save() {
    this.service.save();
  }
}
