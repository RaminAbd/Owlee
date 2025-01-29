import { ScheduleTaskModel } from './schedule-task.model';

export class ScheduleResponseModel {
  from: string;
  deadline: string;
  tasks: ScheduleTaskModel[] = [];
  disabled: boolean;
}
