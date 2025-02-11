import { Component, inject } from '@angular/core';
import { TopicRequestModel } from '../../../../../../../../models/topic-request.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ApplicationMessageCenterService } from '../../../../../../../../../../../core/services/ApplicationMessageCenter.service';

@Component({
  selector: 'app-topic-upsert',
  imports: [DropdownModule, FormsModule, TranslatePipe],
  templateUrl: './topic-upsert.component.html',
  styleUrl: './topic-upsert.component.scss',
})
export class TopicUpsertComponent {
  topic: TopicRequestModel = new TopicRequestModel();
  public config: DynamicDialogConfig = inject(DynamicDialogConfig);
  public ref: DynamicDialogRef = inject(DynamicDialogRef);
  private message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  constructor() {
    this.topic = structuredClone(this.config.data);
  }

  save() {
    if (this.topic.name) this.ref.close(this.topic);
    else {
      this.message.showTranslatedWarningMessage('Name field is required!');
    }
  }
}
