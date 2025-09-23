import { inject, Injectable } from '@angular/core';
import { CalendarComponent } from './calendar.component';
import { MeetingsApiService } from './shared/services/meetings.api.service';
import {CoursesApiService} from '../admin-courses/shared/services/courses.api.service';
import {StorageService} from '../../core/services/storage.service';
import {TranslateService} from '@ngx-translate/core';
import {SubtopicModel} from '../dashboard/shared/models/subtopic.model';
import {ApplicationMessageCenterService} from '../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  component: CalendarComponent;
  private service: MeetingsApiService = inject(MeetingsApiService);
  private coursesService: CoursesApiService = inject(CoursesApiService);
  private storage: StorageService = inject(StorageService);
  private translate: TranslateService = inject(TranslateService);
  private message: ApplicationMessageCenterService = inject(ApplicationMessageCenterService);
  constructor() {}

  getCourses() {
    let authResp = this.storage.getObject('authResponse');
    const req = {
      educatorId: authResp.id,
      lang: this.translate.currentLang,
    };
    this.coursesService.GetByEducator(req).subscribe((resp) => {
      this.component.courses = structuredClone(resp.data.courses);
    });
  }


  getMeetings() {
    this.service
      .GetMeetingsByEducator(this.component.meetingsRequest)
      .subscribe((resp) => {
        resp.data = resp.data.map((item: any) => ({
          ...item,
          time: this.extractTime(item),
        }));

        this.component.monthData = this.updateMonthData(
          this.component.currentDate,
          resp.data,
        );
        this.component.weekData = this.updateWeekData(
          this.component.currentDate,
          resp.data,
        );

        this.component.dayData = this.updateDayData(
          this.component.currentDate,
          resp.data,
        );

      });
  }

  extractTime(item: any): string {
    const startDate = new Date(item.date);
    const startHours = startDate.getUTCHours().toString().padStart(2, '0');
    const startMinutes = startDate.getUTCMinutes().toString().padStart(2, '0');

    const endDate = new Date(startDate.getTime() + item.duration * 60000);
    const endHours = endDate.getUTCHours().toString().padStart(2, '0');
    const endMinutes = endDate.getUTCMinutes().toString().padStart(2, '0');

    return `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
  }



  buildDateRequest(date: Date, viewMode: 'month' | 'week' | 'day'): void {
    let from: Date, to: Date;
    if (viewMode === 'month') {
      const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const firstDayOfGrid = new Date(firstDayOfMonth);
      firstDayOfGrid.setDate(firstDayOfGrid.getDate() - (firstDayOfGrid.getDay() || 7) + 1);
      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const lastDayOfGrid = new Date(lastDayOfMonth);
      lastDayOfGrid.setDate(lastDayOfGrid.getDate() + (7 - (lastDayOfGrid.getDay() || 7)));
      from = firstDayOfGrid;
      to = lastDayOfGrid;
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - (date.getDay() || 7) + 1);
      from = startOfWeek;
      to = new Date(startOfWeek);
      to.setDate(startOfWeek.getDate() + 6);
    } else {
      from = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0); // 00:00:00
      to = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59); // 23:59:59
    }
    this.component.meetingsRequest.from = from.toISOString();
    this.component.meetingsRequest.to = to.toISOString();
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

    // ---------- Normalization & detection ----------
    const stripTZ = (iso: string) => iso.replace(/(Z|[+-]\d{2}:\d{2})$/, '');

    // Heuristic: if time text like "20:00" === parsed.getUTCHours() &&
    // differs from parsed.getHours(), then the ISO likely carries UTC offset
    // but the sender intended local-time -> we should parse as local.
    const shouldTreatAsLocal = (() => {
      if (!scheduleData || !scheduleData.length) return false;
      const sample = scheduleData.slice(0, 5);
      for (const entry of sample) {
        if (!entry.date) continue;
        const parsed = new Date(entry.date);
        const timeText = typeof entry.time === 'string' ? entry.time.split(' - ')[0] : null;
        if (!timeText) continue;
        const hourFromText = Number(timeText.split(':')[0]);
        if (Number.isNaN(hourFromText)) continue;

        if (hourFromText === parsed.getUTCHours() && hourFromText !== parsed.getHours()) {
          // time string matches UTC hour, but actual Date() local hour differs:
          // this suggests the ISO had +00:00 but the server meant "20:00 local".
          return true;
        }
      }
      return false;
    })();

    const normalizedSchedule = (scheduleData || []).map((x: any) => {
      const parsed = x.date ? new Date(shouldTreatAsLocal ? stripTZ(x.date) : x.date) : null;
      return {
        ...x,
        _parsed: parsed,
        _y: parsed ? parsed.getFullYear() : null,
        _m: parsed ? parsed.getMonth() : null,
        _d: parsed ? parsed.getDate() : null,
      };
    });

    // ---------- Fill tasks by matching normalized schedule ----------
    allDays.forEach((dayItem) => {
      const y = dayItem.date.getFullYear();
      const m = dayItem.date.getMonth();
      const d = dayItem.date.getDate();

      if (normalizedSchedule.length) {
        const finded = normalizedSchedule.filter(
          (x: any) => x._y === y && x._m === m && x._d === d,
        );
        dayItem.tasks = finded || [];
        dayItem.tasks.sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
      }

      if (
        y === new Date().getFullYear() &&
        m === new Date().getMonth() &&
        d === new Date().getDate()
      ) {
        this.component.dayItemStateSaver = dayItem;
        if (!this.component.isMobile())
          this.component.handleSetDateInfo(this.component.dayItemStateSaver);
      }
    });

    return { monthName, weeks };
  }

  // updateMonthData(
  //   date: Date,
  //   scheduleData?: any,
  // ): { monthName: string; weeks: any[] } {
  //   console.log(scheduleData);
  //   const year = date.getFullYear();
  //   const month = date.getMonth();
  //   const monthName = date.toLocaleString('default', { month: 'long' });
  //   const daysInMonth = new Date(year, month + 1, 0).getDate();
  //   const daysArray: any[] = [];
  //   for (let i = 1; i <= daysInMonth; i++) {
  //     daysArray.push({
  //       tasks: [],
  //       date: new Date(year, month, i),
  //       dayNumber: i,
  //       disabled: false,
  //     });
  //   }
  //
  //   const weeks: any[] = [];
  //   let currentWeek: any = { days: [] };
  //
  //   daysArray.forEach((dayItem, index) => {
  //     const dayOfWeek = dayItem.date.getDay();
  //     currentWeek.days.push(dayItem);
  //     if (dayOfWeek === 0 || index === daysArray.length - 1) {
  //       weeks.push(currentWeek);
  //       currentWeek = { days: [] };
  //     }
  //   });
  //
  //   if (weeks[0].days.length && weeks[0].days[0].date.getDay() !== 1) {
  //     const previousMonthLastDay = new Date(year, month, 0).getDate();
  //     const daysToAdd = (weeks[0].days[0].date.getDay() || 7) - 1;
  //     const previousMonthDays = [];
  //     for (let i = daysToAdd; i > 0; i--) {
  //       previousMonthDays.push({
  //         tasks: [],
  //         date: new Date(year, month - 1, previousMonthLastDay - i + 1),
  //         dayNumber: previousMonthLastDay - i + 1,
  //         disabled: true,
  //       });
  //     }
  //     weeks[0].days = [...previousMonthDays, ...weeks[0].days];
  //   }
  //
  //   const lastWeek = weeks[weeks.length - 1];
  //   if (
  //     lastWeek.days.length &&
  //     lastWeek.days[lastWeek.days.length - 1].date.getDay() !== 0
  //   ) {
  //     const nextMonthFirstDay = 1;
  //     const daysToAdd =
  //       7 - lastWeek.days[lastWeek.days.length - 1].date.getDay();
  //     for (let i = 0; i < daysToAdd; i++) {
  //       lastWeek.days.push({
  //         tasks: [],
  //         date: new Date(year, month + 1, nextMonthFirstDay + i),
  //         dayNumber: nextMonthFirstDay + i,
  //         disabled: true,
  //       });
  //     }
  //   }
  //   const allDays: any[] = [];
  //   weeks.forEach((week) => {
  //     allDays.push(...week.days);
  //   });
  //
  //   allDays.forEach((dayItem) => {
  //     const year = dayItem.date.getFullYear();
  //     const month = dayItem.date.getMonth();
  //     const day = dayItem.date.getDate();
  //
  //     if (scheduleData) {
  //       const finded = scheduleData.filter(
  //         (x: any) =>
  //           new Date(x.date).getMonth() === month &&
  //           new Date(x.date).getDate() === day
  //       );
  //
  //       dayItem.tasks = finded || [];
  //       dayItem.tasks.sort(
  //         (a: any, b: any) =>
  //           new Date(a.date).getTime() - new Date(b.date).getTime(),
  //       );
  //     }
  //     if (
  //       year === new Date().getFullYear() &&
  //       month === new Date().getMonth() &&
  //       day === new Date().getDate()
  //     ) {
  //       this.component.dayItemStateSaver = dayItem;
  //       if (!this.component.isMobile())
  //         this.component.handleSetDateInfo(this.component.dayItemStateSaver);
  //     }
  //   });
  //
  //   return { monthName, weeks };
  // }

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

  updateWeekData(date: Date, scheduleData?: any): any {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - (date.getDay() || 7) + 1);
    const days: any[] = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      const dayItem = {
        hours: Array.from({ length: 24 }, (_, hour) => ({
          hour: hour, // 0 to 23
          tasks: [] as any[],
        })),
        date: dayDate,
        dayNumber: dayDate.getDate(),
        disabled: false,
      };
      if (scheduleData) {
        const finded = scheduleData.filter(
          (x: any) =>
            new Date(x.date).getFullYear() === dayDate.getFullYear() &&
            new Date(x.date).getMonth() === dayDate.getMonth() &&
            new Date(x.date).getDate() === dayDate.getDate(),
        );
        finded.forEach((task: any) => {
          let hour = 0;
          // Try parsing time field (e.g., "08:09" or "08:09am")
          if (task.time) {
            const timeMatch = task.time.match(/(\d{1,2}):(\d{2})(am|pm)?/i);
            if (timeMatch) {
              hour = parseInt(timeMatch[1], 10);
              const minutes = parseInt(timeMatch[2], 10);
              const period = timeMatch[3] ? timeMatch[3].toLowerCase() : '';
              if (period === 'pm' && hour !== 12) hour += 12;
              if (period === 'am' && hour === 12) hour = 0;
              // Ensure hour is within 0-23
              hour = hour % 24;
            } else {
              // Fallback to assuming 24-hour format if no am/pm
              hour = parseInt(task.time.split(':')[0], 10) % 24;
            }
          } else {
            // Fallback to date field if time is missing
            hour = new Date(task.date).getHours();
          }
          if (!isNaN(hour) && hour >= 0 && hour < 24) {
            if (dayItem.hours[hour]) {
              dayItem.hours[hour].tasks.push(task);
            }
          }
        });
        dayItem.hours.forEach((hourObj: any) => {
          hourObj.tasks.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        });
      }
      days.push(dayItem);
    }
    return { startDate: startOfWeek, days };
  }


  updateDayData(date: Date, scheduleData?: any): any {
    const dayItem = {
      hours: Array.from({ length: 24 }, (_, hour) => ({
        hour: hour, // 0 to 23
        tasks: [] as any[],
      })),
      date: new Date(date),
      dayNumber: date.getDate(),
      disabled: false,
    };
    if (scheduleData) {
      const finded = scheduleData.filter(
        (x: any) =>
          new Date(x.date).getFullYear() === date.getFullYear() &&
          new Date(x.date).getMonth() === date.getMonth() &&
          new Date(x.date).getDate() === date.getDate(),
      );
      finded.forEach((task: any) => {
        let hour = 0;
        // Try parsing time field (e.g., "08:09" or "08:09am")
        if (task.time) {
          const timeMatch = task.time.match(/(\d{1,2}):(\d{2})(am|pm)?/i);
          if (timeMatch) {
            hour = parseInt(timeMatch[1], 10);
            const period = timeMatch[3] ? timeMatch[3].toLowerCase() : '';
            if (period === 'pm' && hour !== 12) hour += 12;
            if (period === 'am' && hour === 12) hour = 0;
            // Ensure hour is within 0-23
            hour = hour % 24;
          } else {
            // Fallback to assuming 24-hour format if no am/pm
            hour = parseInt(task.time.split(':')[0], 10) % 24;
          }
        } else {
          // Fallback to date field if time is missing
          hour = new Date(task.date).getHours();
        }
        if (!isNaN(hour) && hour >= 0 && hour < 24) {
          if (dayItem.hours[hour]) {
            dayItem.hours[hour].tasks.push(task);
          }
        }
      });
      dayItem.hours.forEach((hourObj: any) => {
        hourObj.tasks.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      });
    }
    return dayItem;
  }

  delete(id:string) {
    this.service
      .Delete(this.service.serviceUrl, id)
      .subscribe((resp) => {
        if (resp.succeeded) {
          this.message.showTranslatedSuccessMessage('Deleted successfully.');
          this.getMeetings()
        }
      });
  }
}
