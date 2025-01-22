import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GroupUpsertService } from './group-upsert.service';
import { TranslatePipe } from '@ngx-translate/core';
import { GroupRequestModel } from '../../../../../models/group-request.model';
import { FormsModule } from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';

@Component({
  selector: 'app-group-upsert',
  imports: [TranslatePipe, FormsModule, DropdownModule],
  templateUrl: './group-upsert.component.html',
  styleUrl: './group-upsert.component.scss',
})
export class GroupUpsertComponent {
  request: GroupRequestModel = new GroupRequestModel();
  types: any[] = [
    { name: 'Group', value: 1 },
    { name: 'Individual', value: 2 },
  ];
  implementationTypes: any[] = [
    { name: 'Online', value: 1 },
    { name: 'Offline', value: 2 },
  ];
  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private service: GroupUpsertService,
  ) {
    this.service.component = this;
    this.request.courseId = config.data.courseId;
    this.request.id = config.data.groupId;
  }


  save() {
    this.service.save()
  }
}
