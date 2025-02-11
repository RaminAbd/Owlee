import { inject, Injectable } from '@angular/core';
import { CalendarComponent } from './calendar.component';
import { MeetingsApiService } from './shared/services/meetings.api.service';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  component: CalendarComponent;
  private service: MeetingsApiService = inject(MeetingsApiService);

  constructor() {}

  getMeetings() {
    this.service
      .GetMeetingsByEducator(this.component.meetingsRequest)
      .subscribe((resp) => {
        resp.data = resp.data.map((item: any) => ({
          ...item,
          time: this.extractTime(item.date),
        }));

        this.component.monthData = this.updateMonthData(
          this.component.currentDate,
          resp.data,
        );
        console.log(resp.data);
      });
  }

  extractTime(isoDate: string): string {
    const dateObj = new Date(isoDate);
    const hours = dateObj.getUTCHours().toString().padStart(2, '0');
    const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  buildDateRequest(date: Date) {
    const today = date;
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 2);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.component.meetingsRequest.from = firstDay.toISOString();
    this.component.meetingsRequest.to = lastDay.toISOString();
    this.getMeetings();
  }

  getWeekDays(): { name: string; shortName: string }[] {
    const weekDays = [];
    const baseDate = new Date(Date.UTC(2024, 0, 1));

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
        tasks: [],
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
          tasks: [],
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
          tasks: [],
          date: new Date(year, month + 1, nextMonthFirstDay + i),
          dayNumber: nextMonthFirstDay + i,
          disabled: true,
        });
      }
    }
    const allDays: any[] = [];
    weeks.forEach((week) => {
      allDays.push(...week.days);
    });

    allDays.forEach((dayItem) => {
      const year = dayItem.date.getFullYear();
      const month = dayItem.date.getMonth();
      const day = dayItem.date.getDate();
      if (scheduleData) {
        const finded = scheduleData.filter(
          (x: any) =>
            new Date(x.date).getMonth() === month &&
            new Date(x.date).getDate() === day,
        );

        dayItem.tasks = finded || [];
        dayItem.tasks.sort((a:any, b:any) => new Date(a.date).getTime() - new Date(b.date).getTime());

      }
      if (
        year === new Date().getFullYear() &&
        month === new Date().getMonth() &&
        day === new Date().getDate()
      ) {
        this.component.dayItemStateSaver = dayItem;
        if(!this.component.isMobile()) this.component.handleSetDateInfo(this.component.dayItemStateSaver);
      }

    });
    return { monthName, weeks };
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
}
