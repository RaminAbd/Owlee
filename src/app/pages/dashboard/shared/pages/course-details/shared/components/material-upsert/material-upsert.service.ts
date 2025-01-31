import {inject, Injectable} from '@angular/core';
import {MaterialUpsertComponent} from './material-upsert.component';
import {ApplicationMessageCenterService} from '../../../../../../../../core/services/ApplicationMessageCenter.service';
import {TopicApiService} from '../../../../../services/topic.api.service';
import {
  KnownLanguagesApiService
} from '../../../../../../../known-languages/shared/services/known-languages.api.service';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MaterialUpsertService {
  component: MaterialUpsertComponent;
  private service: TopicApiService = inject(TopicApiService);
  public translate: TranslateService = inject(TranslateService);
  private message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  private langService: KnownLanguagesApiService = inject(
    KnownLanguagesApiService,
  );

  constructor() {
  }

  getKnownLangs() {
    this.langService
      .GetAllByLang(this.langService.serviceUrl, this.translate.currentLang)
      .subscribe((resp) => {
        this.component.languages = resp.data;
      });
  }

  save() {
    delete this.component.request.index;
    if (!this.component.request.id) {
      this.buildCreateRequest();
    } else {
      this.buildUpdateRequest();
    }
  }

  buildCreateRequest() {
    this.component.request.subtopicId = this.component.subtopic.id;
    this.component.subtopic.files.push(this.component.request);
    const req = {
      subtopicId: this.component.subtopic.id,
      files: this.component.subtopic.files,
    };
    this.addFiles(req);
  }

  private buildUpdateRequest() {
    this.component.request.subtopicId = this.component.subtopic.id;
    this.component.subtopic.files.forEach((file, index) => {
      if (file.id === this.component.request.id) {
        this.component.subtopic.files[index] = this.component.request;
      }
    });
    const req = {
      subtopicId: this.component.subtopic.id,
      files: this.component.subtopic.files,
    };
    this.addFiles(req);
  }

  addFiles(req: any) {
    this.service.AddFiles(req).subscribe((resp) => {
      if (resp.succeeded) {
        this.component.ref.close(true);
      }
    });
  }
}
