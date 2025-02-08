import {Component, inject} from '@angular/core';
import {NgClass, NgForOf, NgIf, SlicePipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {CalendarService} from '../calendar/calendar.service';
import {MonthModel} from '../calendar/shared/models/month.model';
import {ActiveDateInfoModel} from '../calendar/shared/models/active-date-info.model';
import {EducatorMeetingsRequestModel} from '../calendar/shared/models/educator-meetings-request.model';
import {StudentCalendarService} from './student-calendar.service';
import {StudentMeetingsRequestModel} from './shared/models/student-meetings-request.model';

@Component({
  selector: 'app-student-calendar',
    imports: [
      NgClass, NgForOf, TranslatePipe, NgIf, SlicePipe
    ],
  templateUrl: './student-calendar.component.html',
  styleUrl: './student-calendar.component.scss'
})
export class StudentCalendarComponent {
  private service: StudentCalendarService = inject(StudentCalendarService);
  monthData: MonthModel = new MonthModel();
  weekDays: { name: string; shortName: string }[] = [];
  currentDate: Date = new Date();
  activeDateInfo: ActiveDateInfoModel = new ActiveDateInfoModel();
  meetingsRequest: StudentMeetingsRequestModel =
    new StudentMeetingsRequestModel();
  dayItemStateSaver: any;
  showMessage: boolean = false;

  constructor() {
    this.service.component = this;
    this.meetingsRequest.studentId = localStorage.getItem('userId') as string;
    this.service.buildDateRequest(new Date());
    this.weekDays = this.service.getWeekDays();
    this.monthData = this.service.updateMonthData(new Date());
    this.handleSetDateInfo(this.dayItemStateSaver);
  }

  handlePreviousMonth(): void {
    const previousMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1,
    );
    this.currentDate = previousMonth;
    this.service.buildDateRequest(previousMonth);
  }

  handleNextMonth(): void {
    const nextMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1,
    );
    this.currentDate = nextMonth;
    this.service.buildDateRequest(nextMonth);
  }

  handleSetDateInfo(day: any): void {
    day.dateString = this.service.formatDate(day.date);
    this.activeDateInfo = day;
    console.log(this.activeDateInfo);
  }

  isToday(date: Date) {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isActive(day: any) {
    return (
      this.activeDateInfo.date &&
      this.activeDateInfo.date.getDate() === day.date.getDate() &&
      this.activeDateInfo.date.getMonth() === day.date.getMonth() &&
      this.activeDateInfo.date.getFullYear() === day.date.getFullYear()
    );
  }

  copyToClipboard(item: any) {
    navigator.clipboard
      .writeText(item.link)
      .then(() => {
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 2000);
      })
      .catch((err) => console.error('Failed to copy: ', err));
  }
}
