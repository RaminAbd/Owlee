import { Component } from '@angular/core';
import { StorageService } from '../../core/services/storage.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import { BaseApiService } from '../../core/services/base.api.service';
import { Router } from '@angular/router';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MonthModel } from './shared/models/month.model';
import { ActiveDateInfoModel } from './shared/models/active-date-info.model';

@Component({
  selector: 'app-calendar',
  imports: [NgClass, NgForOf, TranslatePipe],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  monthData: MonthModel = new MonthModel();
  weekDays: { name: string; shortName: string }[] = [];
  currentDate: Date = new Date();
  scheduleData: any = {};
  activeDateInfo: ActiveDateInfoModel = new ActiveDateInfoModel();
  selectedTestId: string = '';
  completeVisible: boolean = false;

  constructor(
    private storage: StorageService,
    private translate: TranslateService,
    private api: BaseApiService,
    private router: Router,
  ) {
    this.weekDays = this.getWeekDays();
    this.monthData = this.updateMonthData(new Date());
    this.handleSetDateInfo(this.dayItemStateSaver);
  }

  ngOnInit(): void {
    const obj = {
      id: this.storage.getObject('authResponse').id,
      lang: this.translate.currentLang,
    };
    // this.api.get('v1/Schedules/Get/', null, obj).subscribe((resp: any) => {
    //   this.scheduleData = resp.data;
    //   this.monthData = this.updateMonthData(this.currentDate, resp.data);
    // });

    // this.weekDays = this.getWeekDays();
  }

  handlePreviousMonth(): void {
    const previousMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1,
    );
    const from = new Date(this.scheduleData.from);
    console.log(this.scheduleData);
    this.currentDate = previousMonth;
    this.monthData = this.updateMonthData(
      this.currentDate,
      this.scheduleData,
    );
    // if (previousMonth >= new Date(from.getFullYear(), from.getMonth(), 1)) {
    //
    // }
  }

  handleNextMonth(): void {
    const nextMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1,
    );
    const deadline = new Date(this.scheduleData.deadline);
    this.currentDate = nextMonth;
    this.monthData = this.updateMonthData(
      this.currentDate,
      this.scheduleData,
    );
    // if (nextMonth <= new Date(deadline.getFullYear(), deadline.getMonth(), 1)) {
    //
    // }
  }

  formatDate(dateString: string): { formattedDate: string; dayOfWeek: string } {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
    const dayOfWeek = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
    }).format(date);

    return { formattedDate, dayOfWeek };
  }

  handleSetDateInfo(day: any): void {
    day.dateString = this.formatDate(day.date);
    this.activeDateInfo = day;
  }

  getWeekDays(): { name: string; shortName: string }[] {
    const weekDays = [];
    const baseDate = new Date(Date.UTC(2024, 0, 1)); // Start with a known Monday

    for (let i = 0; i < 7; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      weekDays.push({
        name: date.toLocaleString('default', { weekday: 'long' }),
        shortName: date.toLocaleString('default', { weekday: 'short' }),
      });
    }

    return weekDays;
  }

  updateMonthData(
    date: Date,
    scheduleData?: any,
  ): { monthName: string; weeks: any[] } {
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthName = date.toLocaleString('default', { month: 'long' });
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray: any[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push({
        task: {},
        date: new Date(year, month, i),
        dayNumber: i,
        disabled: false,
      });
    }

    const weeks: any[] = [];
    let currentWeek: any = { days: [] };

    daysArray.forEach((dayItem, index) => {
      const dayOfWeek = dayItem.date.getDay();
      currentWeek.days.push(dayItem);
      if (dayOfWeek === 0 || index === daysArray.length - 1) {
        weeks.push(currentWeek);
        currentWeek = { days: [] };
      }
    });

    if (weeks[0].days.length && weeks[0].days[0].date.getDay() !== 1) {
      const previousMonthLastDay = new Date(year, month, 0).getDate();
      const daysToAdd = (weeks[0].days[0].date.getDay() || 7) - 1;
      const previousMonthDays = [];
      for (let i = daysToAdd; i > 0; i--) {
        previousMonthDays.push({
          task: {},
          date: new Date(year, month - 1, previousMonthLastDay - i + 1),
          dayNumber: previousMonthLastDay - i + 1,
          disabled: true,
        });
      }
      weeks[0].days = [...previousMonthDays, ...weeks[0].days];
    }

    const lastWeek = weeks[weeks.length - 1];
    if (
      lastWeek.days.length &&
      lastWeek.days[lastWeek.days.length - 1].date.getDay() !== 0
    ) {
      const nextMonthFirstDay = 1;
      const daysToAdd =
        7 - lastWeek.days[lastWeek.days.length - 1].date.getDay();
      for (let i = 0; i < daysToAdd; i++) {
        lastWeek.days.push({
          task: {},
          date: new Date(year, month + 1, nextMonthFirstDay + i),
          dayNumber: nextMonthFirstDay + i,
          disabled: true,
        });
      }
    }
    scheduleData = { tasks: [] };
    if (scheduleData) {
      const allDays: any[] = [];
      weeks.forEach((week) => {
        allDays.push(...week.days);
      });

      allDays.forEach((dayItem) => {
        const year = dayItem.date.getFullYear();
        const month = dayItem.date.getMonth();
        const day = dayItem.date.getDate();

        const finded = scheduleData.tasks.find(
          (x: any) =>
            new Date(x.date).getMonth() === month &&
            new Date(x.date).getDate() === day,
        );

        dayItem.task = finded || {};
        if (
          year === new Date().getFullYear() &&
          month === new Date().getMonth() &&
          day === new Date().getDate()
        ) {
         this.dayItemStateSaver = dayItem
        }
      });
    }
    return { monthName, weeks };
  }

  dayItemStateSaver:any;

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
}
