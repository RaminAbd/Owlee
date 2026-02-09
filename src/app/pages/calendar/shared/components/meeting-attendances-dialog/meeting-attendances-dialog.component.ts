import {Component, inject} from '@angular/core';
import {MultiSelect} from 'primeng/multiselect';
import {NgForOf, NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {SetAttendancesDialogService} from '../set-attendances-dialog/set-attendances-dialog.service';
import {StudentsResponseModel} from '../../../../students/shared/models/students-response.model';
import {ScheduleTaskModel} from '../../models/schedule-task.model';

@Component({
  selector: 'app-meeting-attendances-dialog',
  imports: [
    MultiSelect,
    NgIf,
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
