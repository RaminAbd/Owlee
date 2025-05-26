import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GroupUpsertService } from './group-upsert.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { GroupRequestModel } from '../../../../../models/group-request.model';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-group-upsert',
  imports: [TranslatePipe, FormsModule, DropdownModule],
  templateUrl: './group-upsert.component.html',
  styleUrl: './group-upsert.component.scss',
})
export class GroupUpsertComponent {
  private translate: TranslateService = inject(TranslateService);
  request: GroupRequestModel = new GroupRequestModel();
  types: any[] = [
    { name: this.translate.instant('Group'), value: 1 },
    { name: this.translate.instant('Individual'), value: 2 },
  ];
  implementationTypes: any[] = [
    { name: this.translate.instant('Online'), value: 1 },
    { name: this.translate.instant('Offline'), value: 2 },
  ];
  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private service: GroupUpsertService,
  ) {
    this.service.component = this;
    this.request.courseId = config.data.courseId;
    this.request.id = config.data.groupId;
    if (this.request.id !== 'create') {
      this.request = config.data.group;
    }
    console.log(config.data);
  }

  save() {
    this.service.save();
  }
}
