import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {TopicRequestModel} from '../../../../../../../../models/topic-request.model';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {
  ApplicationMessageCenterService
} from '../../../../../../../../../../../core/services/ApplicationMessageCenter.service';

@Component({
  selector: 'app-sub-topic-upsert',
  imports: [
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './sub-topic-upsert.component.html',
  styleUrl: './sub-topic-upsert.component.scss'
})
export class SubTopicUpsertComponent {
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
    if (this.topic.subTopic.name) this.ref.close(this.topic);
    else {
      this.message.showTranslatedWarningMessage('Name field is required!');
    }
  }
}
