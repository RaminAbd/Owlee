import {Component, inject} from '@angular/core';
import {NgForOf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {StudentsResponseModel} from '../../../../students/shared/models/students-response.model';
import {ScheduleTaskModel} from '../../models/schedule-task.model';

@Component({
  selector: 'app-meeting-attendances-dialog',
  imports: [
    TranslatePipe,
    NgForOf
  ],
  templateUrl: './meeting-attendances-dialog.component.html',
  styleUrl: './meeting-attendances-dialog.component.scss'
})
export class MeetingAttendancesDialogComponent {
  public config: DynamicDialogConfig = inject(DynamicDialogConfig);
  public ref: DynamicDialogRef = inject(DynamicDialogRef);
  students: StudentsResponseModel[] = this.config.data.students;
  selectedStudents: StudentsResponseModel[] = this.config.data.selectedStudents;
  meeting:ScheduleTaskModel = this.config.data.meeting;
}
