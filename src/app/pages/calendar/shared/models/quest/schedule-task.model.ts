import {ScheduleTaskItemModel} from "./schedule-task-item.model";

export class ScheduleTaskModel{
  date: string
  items: ScheduleTaskItemModel[] = []
  completed: boolean
  isToday:boolean;
}
