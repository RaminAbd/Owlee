import { ScheduleTaskModel } from './schedule-task.model';
import { DateStringModel } from './date-string.model';

export class ActiveDateInfoModel {
  tasks: ScheduleTaskModel[] = [];
  date: any;
  dayNumber: number;
  disabled: boolean;
  dateString: DateStringModel = new DateStringModel();
}
