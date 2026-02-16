import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SetAttendancesDialogService } from './set-attendances-dialog.service';
import { StudentsResponseModel } from '../../../../students/shared/models/students-response.model';
import {ScheduleTaskModel} from '../../models/schedule-task.model';
import {MultiSelect} from 'primeng/multiselect';
import {NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-set-attendances-dialog',
  imports: [
    MultiSelect,
    NgIf,
    ReactiveFormsModule,
    TranslatePipe,
    FormsModule
  ],
  templateUrl: './set-attendances-dialog.component.html',
  styleUrl: './set-attendances-dialog.component.scss',
})
export class SetAttendancesDialogComponent {
  public config: DynamicDialogConfig = inject(DynamicDialogConfig);
  public ref: DynamicDialogRef = inject(DynamicDialogRef);
  private service: SetAttendancesDialogService = inject(
    SetAttendancesDialogService,
  );
  students: StudentsResponseModel[] = this.config.data.students;
  selectedStudents: StudentsResponseModel[] = this.config.data.selectedStudents;
  meeting:ScheduleTaskModel = this.config.data.meeting;
  loading: boolean = false;
  constructor() {
    this.service.component = this;
  }

  save() {
    this.service.setAttendances()
  }
}
