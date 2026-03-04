import { Component, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { GroupRequestModel } from '../../../../../../../../models/group-request.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GroupUpsertService } from '../../../../../components/group-upsert/group-upsert.service';
import { AssignmentsRequestModel } from '../../models/assignments-request.model';
import { AssignmentUpsertDialogService } from './assignment-upsert-dialog.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { GroupsResponseModel } from '../../../../../../../../models/groups-response.model';
import { MultiSelect } from 'primeng/multiselect';
import { NgForOf, NgIf } from '@angular/common';
import { DatePicker } from 'primeng/datepicker';
import { FileModel } from '../../../../../../../../../../../core/models/File.model';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  MatTimepicker,
  MatTimepickerInput,
  MatTimepickerToggle,
} from '@angular/material/timepicker';
import { NearestTime } from '../../../../../../../../../../../core/extensions/get-nearest-time';

@Component({
  selector: 'app-assignment-upsert-dialog',
  imports: [
    DropdownModule,
    FormsModule,
    TranslatePipe,
    MultiSelect,
    NgForOf,
    DatePicker,
    NgIf,
    MatFormField,
    MatInput,
    MatTimepicker,
    MatTimepickerInput,
    MatTimepickerToggle,
  ],
  templateUrl: './assignment-upsert-dialog.component.html',
  styleUrl: './assignment-upsert-dialog.component.scss',
})
export class AssignmentUpsertDialogComponent {
  private translate: TranslateService = inject(TranslateService);
  request: AssignmentsRequestModel = new AssignmentsRequestModel();
  groups: GroupsResponseModel[] = [];
  fromDate: any;
  fromTime: any;
  date: any;
  time: any;

  loading: boolean = false;
  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private service: AssignmentUpsertDialogService,
  ) {
    this.service.component = this;
    this.request = config.data.request;
    console.log(config.data);
    if (this.request.id) {
      this.fromDate = new Date(this.request.availableFrom);
      this.fromTime = new Date(this.request.availableFrom);

      this.date = new Date(this.request.availableTo);
      this.time = new Date(this.request.availableTo);
    } else {
      this.groups = config.data.groups;
      this.request.courseId = config.data.courseId;
    }
  }

  getImage(e: any) {
    const input = e.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }
    this.request.file.fileLoading = true;
    this.service.uploadFile(input.files[0], (resp: any) => {
      this.request.files.push(resp.data);
      this.request.file.fileLoading = false;
    });
  }

  getFileName(fileName: string): string {
    if (fileName) {
      if (fileName.length > 30) {
        return this.changeFileName(fileName);
      } else {
        return fileName;
      }
    } else {
      return '';
    }
  }

  changeFileName(name: string) {
    return (
      name.substring(0, 10) +
      '...' +
      name.substring(name.length - 5, name.length)
    );
  }

  removeFile(item: FileModel, i: number) {
    item.fileLoading = true;
    this.service.removeFile(item, i);
  }

  startDateSelected() {
    this.fromTime = NearestTime.getTime(new Date());
  }

  endDateSelected() {
    this.time = NearestTime.getTime(new Date());
  }

  save() {
    this.service.save();
  }
}
