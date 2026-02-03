import { Component, inject } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { TopicRequestModel } from '../../../../dashboard/shared/models/topic-request.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApplicationMessageCenterService } from '../../../../../core/services/ApplicationMessageCenter.service';
import {ApplySaleDialogService} from './apply-sale-dialog.service';

@Component({
  selector: 'app-apply-sale-dialog',
  imports: [ReactiveFormsModule, TranslatePipe, FormsModule],
  templateUrl: './apply-sale-dialog.component.html',
  styleUrl: './apply-sale-dialog.component.scss',
})
export class ApplySaleDialogComponent {
  public service: ApplySaleDialogService = inject(ApplySaleDialogService);
  public config: DynamicDialogConfig = inject(DynamicDialogConfig);
  public ref: DynamicDialogRef = inject(DynamicDialogRef);
  private message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  educatorId: string = this.config.data;
  amount: number;
  loading:boolean = false;
  constructor() {
    this.service.component = this;
  }

  save() {
    if(!this.amount || this.amount <= 0) {
      this.message.showTranslatedWarningMessage('Amount is not valid')
    }else{
      this.service.applySale()
    }
  }
}
