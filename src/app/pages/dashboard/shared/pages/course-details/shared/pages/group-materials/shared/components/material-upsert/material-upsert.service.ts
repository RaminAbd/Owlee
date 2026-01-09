import { inject, Injectable } from '@angular/core';
import { MaterialUpsertComponent } from './material-upsert.component';
import { ApplicationMessageCenterService } from '../../../../../../../../../../../core/services/ApplicationMessageCenter.service';
import { TopicApiService } from '../../../../../../../../services/topic.api.service';
import { KnownLanguagesApiService } from '../../../../../../../../../../known-languages/shared/services/known-languages.api.service';
import { TranslateService } from '@ngx-translate/core';
import { BlobService } from '../../../../../../../../../../../core/services/blob.service';
import { SubscriptionsApiService } from '../../../../../../../../../../../system-pages/educator/shared/services/subscriptions.api.service';

@Injectable({
  providedIn: 'root',
})
export class MaterialUpsertService {
  component: MaterialUpsertComponent;
  private service: TopicApiService = inject(TopicApiService);
  private blob: BlobService = inject(BlobService);
  private subsService: SubscriptionsApiService = inject(
    SubscriptionsApiService,
  );
  public translate: TranslateService = inject(TranslateService);
  private message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  private langService: KnownLanguagesApiService = inject(
    KnownLanguagesApiService,
  );

  constructor() {}

  getSubscription() {
    this.subsService
      .getByEducatorId(localStorage.getItem('userId') as string)
      .subscribe((resp) => {
        console.log(resp.data);
        this.component.subscription = resp.data;
        // this.component.subscription.maxCapacity = 10;
      });
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
    if (this.isValid()) {
      if (this.component.request.fakeFile) {
        this.getFile((resp: any) => {
          this.component.request.file = resp.data;

          this.setSize();
        });
      } else {
        this.build();
      }
    } else {
      this.component.loading = false;
      this.message.showTranslatedWarningMessage('Field are not valid');
    }
  }
  setSize() {
    console.log(this.component.request);
    const req = {
      fileId: this.component.request.file.id,
      educatorId: localStorage.getItem('userId') as string,
      courseId: this.component.courseId,
      size: Number(this.component.request.fakeFile.fileMB),
    };
    console.log(req);
    this.blob.SetSize(req).subscribe((resp: any) => {
      this.build();
    });
  }
  build() {
    if (this.component.startDate)
      this.component.request.availableFrom =
        this.component.startDate.toISOString();
    if (this.component.endDate)
      this.component.request.availableTo = this.component.endDate.toISOString();
    if (!this.component.request.id) {
      this.buildCreateRequest();
    } else {
      this.buildUpdateRequest();
    }
  }

  isValid() {
    let result = true;
    if (
      !this.component.request.name ||
      !this.component.request.systemLanguageId
    ) {
      result = false;
    }

    const hasUrl = !!this.component.request.url;
    const hasFile = !!this.component.request.fakeFile;
    console.log(hasUrl, hasFile);
    if (hasUrl === hasFile) {
      result = false;
    }

    return result;
  }

  buildCreateRequest() {
    this.component.request.subtopicId = this.component.subtopic.id;
    this.component.subtopic.files.push(this.component.request);
    const req = {
      subtopicId: this.component.subtopic.id,
      files: this.component.subtopic.files,
    };
    console.log(req);
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
    console.log(req);
    this.addFiles(req);
  }

  addFiles(req: any) {
    this.service.AddFiles(req).subscribe(
      (resp) => {
        if (resp.succeeded) {
          this.component.ref.close(true);
          this.component.loading = false;
        }
      },
      (error) => {
        this.component.loading = false;
      },
    );
  }

  getFile(callback: any) {
    const fd = new FormData();
    fd.append('file', this.component.request.fakeFile);
    this.blob.UploadFile(fd).subscribe((resp: any) => {
      callback(resp);
    });
  }
}
