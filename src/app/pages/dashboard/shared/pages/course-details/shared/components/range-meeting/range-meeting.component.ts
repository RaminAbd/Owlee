import { Component, inject } from '@angular/core';
import { DatePicker } from 'primeng/datepicker';
import { NgForOf, NgIf } from '@angular/common';
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
    NgIf,
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
  isSubmitted = false;
  hours: { name: string; value: number }[] = Array.from(
    { length: 19 }, // 24 - 5 = 19 items
    (_, i) => {
      const hour = i + 5;
      return {
        name: hour.toString().padStart(2, '0'),
        value: hour,
      };
    },
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
      duration: 0,
    },
    {
      name: 'Tuesday',
      dayOfWeek: 1,
      hour: 0,
      hourName: 0,
      minute: 0,
      duration: 0,
    },
    {
      name: 'Wednesday',
      dayOfWeek: 2,
      hour: 0,
      hourName: 0,
      minute: 0,
      duration: 0,
    },
    {
      name: 'Thursday',
      dayOfWeek: 3,
      hour: 0,
      hourName: 0,
      minute: 0,
      duration: 0,
    },
    {
      name: 'Friday',
      dayOfWeek: 4,
      hour: 0,
      hourName: 0,
      minute: 0,
      duration: 0,
    },
    {
      name: 'Saturday',
      dayOfWeek: 5,
      hour: 0,
      hourName: 0,
      minute: 0,
      duration: 0,
    },
    {
      name: 'Sunday',
      dayOfWeek: 6,
      hour: 0,
      hourName: 0,
      minute: 0,
      duration: 0,
    },
  ];
  deletedItems: { item: any; index: number }[] = [];

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    this.service.component = this;
    this.request.groupId = config.data.groupId;
  }

  save() {
    console.log(this.request, this.days);
    if (!this.from || !this.to) {
      this.message.showTranslatedWarningMessage('Fill all fields');
      return;
    }
    if (new Date(this.to) <= new Date(this.from)) {
      this.message.showTranslatedWarningMessage('Invalid dates');
      return;
    }

    this.request.from = new Date(
      new Date(this.from).getTime() + 4 * 60 * 60 * 1000,
    ).toISOString();
    this.request.to = new Date(
      new Date(this.to).getTime() + 4 * 60 * 60 * 1000,
    ).toISOString();
    this.days.forEach((day) => {
      day.hour = day.hourName ;
    });

    this.request.items = this.days.filter(
      (x) => x.hourName !== 0 && x.hourName,
    );
    if (this.request.items.length == 0) {
      this.message.showTranslatedWarningMessage('Select week day!');
      return;
    }
    let durationValid = true;
    this.request.items.forEach((item) => {
      if (item.duration < 1) durationValid = false;
    });

    if (!durationValid) {
      this.message.showTranslatedWarningMessage('Invalid durations');
      return;
    }

    if (!this.isSubmitted) {
      console.log(this.request);
      this.service.createSchedule();
      this.isSubmitted = true;
    }
  }

  deleteDay(i: number) {
    const deletedItem = this.days.splice(i, 1)[0];
    this.deletedItems.push({ item: deletedItem, index: i });
  }

  redo(): void {
    if (this.deletedItems.length > 0) {
      const last = this.deletedItems.pop();
      if (last) {
        this.days.splice(last.index, 0, last.item);
      }
    }

    console.log(this.deletedItems);
  }
}
