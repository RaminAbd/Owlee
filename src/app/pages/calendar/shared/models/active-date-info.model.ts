import {ScheduleTaskModel} from './quest/schedule-task.model';

export class ActiveDateInfoModel {
  task: ScheduleTaskModel = new ScheduleTaskModel();
  date: any;
  dayNumber: number;
  disabled: boolean;
  dateString: {
    formattedDate: string;
    dayOfWeek: string;
  };
}
