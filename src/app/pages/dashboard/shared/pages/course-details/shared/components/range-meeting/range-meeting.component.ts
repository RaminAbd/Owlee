import { Component, inject } from '@angular/core';
import { DatePicker } from 'primeng/datepicker';
import { NgForOf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RangeMeetingService } from './range-meeting.service';
import { RangeRequestModel } from '../../../../../models/range-request.model';
import { DropdownModule } from 'primeng/dropdown';
import { ApplicationMessageCenterService } from '../../../../../../../../core/services/ApplicationMessageCenter.service';

@Component({
  selector: 'app-range-meeting',
  imports: [
    DatePicker,
    NgForOf,
    TranslatePipe,
    FormsModule,
    DropdownModule,
  ],
  templateUrl: './range-meeting.component.html',
  styleUrl: './range-meeting.component.scss',
})
export class RangeMeetingComponent {
  private service: RangeMeetingService = inject(RangeMeetingService);
  public message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  request: RangeRequestModel = new RangeRequestModel();
  from: any;
  to: any;
  hours: { name: string; value: number }[] = Array.from(
    { length: 24 },
    (_, i) => ({
      name: i.toString().padStart(2, '0'),
      value: i,
    }),
  );

  minutes: { name: string; value: number }[] = Array.from(
    { length: 60 },
    (_, i) => ({
      name: i.toString().padStart(2, '0'),
      value: i,
    }),
  );
  days: any[] = [
    {
      name: 'Monday',
      dayOfWeek: 0,
      hour: 0,
      minute: 0,
    },
    { name: 'Tuesday', dayOfWeek: 1, hour: 0, hourName: 0, minute: 0 },
    { name: 'Wednesday', dayOfWeek: 2, hour: 0, hourName: 0, minute: 0 },
    { name: 'Thursday', dayOfWeek: 3, hour: 0, hourName: 0, minute: 0 },
    { name: 'Friday', dayOfWeek: 4, hour: 0, hourName: 0, minute: 0 },
    { name: 'Saturday', dayOfWeek: 5, hour: 0, hourName: 0, minute: 0 },
    { name: 'Sunday', dayOfWeek: 6, hour: 0, hourName: 0, minute: 0 },
  ];

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    this.service.component = this;
    this.request.groupId = config.data.groupId;
  }

  save() {
    if (!this.from || !this.to) {
      this.message.showTranslatedWarningMessage('Fill all fields');
      return;
    }
    if (new Date(this.to) <= new Date(this.from)) {
      this.message.showTranslatedWarningMessage('Invalid dates');
      return;
    }
    this.request.from = new Date(this.from).toISOString();
    this.request.to = new Date(this.to).toISOString();
    this.days.forEach((day) => {
      day.hour = day.hourName - 4;
    });

    this.request.items = this.days.filter((x) => x.hourName !== 0);
    this.service.createSchedule();
    console.log(this.request);
  }

  deleteDay(i: number) {
    this.days.splice(i, 1);
  }
}
