import {Component, inject} from '@angular/core';
import {
  MeetingUpsertService
} from '../../../../dashboard/shared/pages/course-details/shared/components/meeting-upsert/meeting-upsert.service';
import {MeetingRequestModel} from '../../models/meeting-request.model';
import {CalendarMeetingEditService} from './calendar-meeting-edit.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DashboardCourseModel} from '../../../../dashboard/shared/models/dashboard-course.model';
import {DatePicker, DatePickerModule} from 'primeng/datepicker';
import {MultiSelect} from 'primeng/multiselect';
import {NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {DropdownModule} from 'primeng/dropdown';
import {TopicRequestModel} from '../../../../dashboard/shared/models/topic-request.model';
import {SubtopicModel} from '../../../../dashboard/shared/models/subtopic.model';
import {LanguageService} from '../../../../../core/services/language.service';

@Component({
  selector: 'app-calendar-meeting-edit',
  imports: [
    DropdownModule,
    FormsModule,
    TranslatePipe,
    DatePickerModule,
    MultiSelect,
    NgIf,
  ],
  templateUrl: './calendar-meeting-edit.component.html',
  styleUrl: './calendar-meeting-edit.component.scss'
})
export class CalendarMeetingEditComponent {
  private service: CalendarMeetingEditService = inject(CalendarMeetingEditService);
  private language:LanguageService = inject(LanguageService)
  request: MeetingRequestModel = new MeetingRequestModel();
  id: string;
  isSubmitted = false;
  date: any;
  courses: DashboardCourseModel[] = [];
  topics: TopicRequestModel[] = [];
  subTopics: SubtopicModel[] = [];
  loading: boolean = false;
  colors:any[]=[
    {name:this.language.getByKey('Blue'), value:'#c6e7ff'},
    {name:this.language.getByKey('Red'), value:'#F47DCA'},
  ]
  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    this.service.component = this;
    this.request.id = config.data.id;
    this.courses = config.data.courses;
    this.service.getMeeting();
  }

  save() {
    this.loading = true;
    this.service.save()
  }
}
