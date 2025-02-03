import { ScheduleTaskModel } from './schedule-task.model';

export class DayModel {
  date: Date;
  dayNumber: number;
  disabled: boolean;
  tasks: ScheduleTaskModel[] = [];
}
