import {Component} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {MaterialUpsertService} from './material-upsert.service';
import {TopicMaterialModel} from '../../../../../models/topic-material.model';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {
  KnownLanguagesResponseModel
} from '../../../../../../../known-languages/shared/models/known-languages-response.model';
import {SubtopicModel} from '../../../../../models/subtopic.model';

@Component({
  selector: 'app-material-upsert',
  imports: [DropdownModule, ReactiveFormsModule, TranslatePipe, FormsModule],
  templateUrl: './material-upsert.component.html',
  styleUrl: './material-upsert.component.scss',
})
export class MaterialUpsertComponent {
  request: TopicMaterialModel = new TopicMaterialModel();
  subtopic: SubtopicModel = new SubtopicModel();
  languages: KnownLanguagesResponseModel[] = [];

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private service: MaterialUpsertService,
  ) {
    this.service.component = this;
    this.request = structuredClone(config.data.material);
    this.subtopic = structuredClone(config.data.subTopic);
    this.service.getKnownLangs();
  }

  save() {
    this.service.save();
  }
}
