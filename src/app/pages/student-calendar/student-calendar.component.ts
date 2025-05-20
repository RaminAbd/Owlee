import { Component, inject } from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf, SlicePipe} from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { CalendarService } from '../calendar/calendar.service';
import { MonthModel } from '../calendar/shared/models/month.model';
import { ActiveDateInfoModel } from '../calendar/shared/models/active-date-info.model';
import { EducatorMeetingsRequestModel } from '../calendar/shared/models/educator-meetings-request.model';
import { StudentCalendarService } from './student-calendar.service';
import { StudentMeetingsRequestModel } from './shared/models/student-meetings-request.model';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-student-calendar',
  imports: [NgClass, NgForOf, TranslatePipe, NgIf, SlicePipe, DropdownModule, ReactiveFormsModule,
    FormsModule, DatePipe,],
  templateUrl: './student-calendar.component.html',
  styleUrl: './student-calendar.component.scss',
})
export class StudentCalendarComponent {
  showActivities: boolean = false;
  viewModes: any[] = [
    { name: 'Monthly', value: 'month' },
    { name: 'Weekly', value: 'week' },
    { name: 'Daily', value: 'day' },
  ];
  viewMode: 'month' | 'week' | 'day' = 'month';
  private service: StudentCalendarService = inject(StudentCalendarService);
  monthData: MonthModel = new MonthModel();
  weekData: any = { startDate: new Date(), days: [] };
  dayData: any = { date: new Date(), tasks: [] };

  weekDays: { name: string; shortName: string }[] = [];
  currentDate: Date = new Date();
  activeDateInfo: ActiveDateInfoModel = new ActiveDateInfoModel();
  meetingsRequest: StudentMeetingsRequestModel =
    new StudentMeetingsRequestModel();
  dayItemStateSaver: any;
  showMessage: boolean = false;
  hoursOfDay: string[] = Array.from({ length: 24 }, (_, i) => {
    return `${i}:00`; // 0:00 to 23:00
  });
  constructor() {
    this.service.component = this;
    this.meetingsRequest.studentId = localStorage.getItem('userId') as string;
    this.service.buildDateRequest(new Date(), this.viewMode);
    this.weekDays = this.service.getWeekDays();
    this.monthData = this.service.updateMonthData(new Date());
    if (!this.isMobile()) this.handleSetDateInfo(this.dayItemStateSaver);
  }

  changeViewMode() {
    let newDate: Date;
    newDate = new Date(this.currentDate);
    newDate.setDate(this.currentDate.getDate());
    this.currentDate = newDate;
    this.updateViewData(newDate);
    this.service.buildDateRequest(newDate, this.viewMode);
  }

  handlePrevious(): void {
    let newDate: Date;
    if (this.viewMode === 'month') {
      newDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        1,
      );
    } else if (this.viewMode === 'week') {
      newDate = new Date(this.currentDate);
      newDate.setDate(this.currentDate.getDate() - 7);
    } else {
      newDate = new Date(this.currentDate);
      newDate.setDate(this.currentDate.getDate() - 1);
    }
    this.currentDate = newDate;
    this.updateViewData(newDate);
    this.service.buildDateRequest(newDate, this.viewMode);
  }

  handleNext(): void {
    let newDate: Date;
    if (this.viewMode === 'month') {
      newDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        1,
      );
    } else if (this.viewMode === 'week') {
      newDate = new Date(this.currentDate);
      newDate.setDate(this.currentDate.getDate() + 7);
    } else {
      newDate = new Date(this.currentDate);
      newDate.setDate(this.currentDate.getDate() + 1);
    }
    this.currentDate = newDate;
    this.updateViewData(newDate);
    this.service.buildDateRequest(newDate, this.viewMode);
  }

  updateViewData(date: Date): void {
    if (this.viewMode === 'month') {
      this.monthData = this.service.updateMonthData(date);
    } else if (this.viewMode === 'week') {
      this.weekData = this.service.updateWeekData(date);
    } else {
      this.dayData = this.service.updateDayData(date);
    }
  }

  isMobile(): boolean {
    console.log(window.matchMedia('(max-width: 1250px)').matches);
    return window.matchMedia('(max-width: 1250px)').matches;
  }

  handleSetDateInfo(day: any): void {
    day.dateString = this.service.formatDate(day.date);
    this.activeDateInfo = day;
    this.showActivities = true;
  }

  handleSetWeeklyDate(day: any, task?: any) {
    day.tasks = task ? [task] : [];
    this.handleSetDateInfo(day);
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

  handleSetDailyDate(day: any, task?: any) {
    day.tasks = task ? [task] : [];
    this.handleSetDateInfo(day);
  }
}
