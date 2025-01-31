import { inject, Injectable } from '@angular/core';
import { CoursesUpsertComponent } from './courses-upsert.component';
import { CoursesApiService } from '../../../../admin-courses/shared/services/courses.api.service';
import { KnownLanguagesApiService } from '../../../../known-languages/shared/services/known-languages.api.service';
import { TranslateService } from '@ngx-translate/core';
import { BlobService } from '../../../../../core/services/blob.service';
import { StorageService } from '../../../../../core/services/storage.service';
import { ApplicationMessageCenterService } from '../../../../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class CoursesUpsertService {
  private service: CoursesApiService = inject(CoursesApiService);
  private message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  private langService: KnownLanguagesApiService = inject(
    KnownLanguagesApiService,
  );
  private blob = inject(BlobService);
  public translate: TranslateService = inject(TranslateService);
  private storage: StorageService = inject(StorageService);
  component: CoursesUpsertComponent;
  constructor() {}

  getCourse() {
    const req = {
      id: this.component.id,
      lang: this.translate.currentLang,
    };
    this.service
      .GetByIdByLang(this.service.serviceUrl, req)
      .subscribe((resp) => {
        this.component.request = resp.data;
      });
  }

  getKnownLangs() {
    this.langService
      .GetAllByLang(this.langService.serviceUrl, this.translate.currentLang)
      .subscribe((resp) => {
        this.component.languages = resp.data;
        if (this.component.id !== 'create') this.getCourse();
      });
  }

  getFile(e: any) {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      fd.append('file', files[i]);
      this.blob.UploadFile(fd).subscribe((resp: any) => {
        this.component.request.image.fileLoading = false;
        this.component.request.image = resp.data;
        this.component.request.image.fakeFile = null;
      });
    }
  }

  save() {
    let authResp = this.storage.getObject('authResponse');
    this.component.request.educatorId = authResp.id;
    if (
      !this.component.request.name ||
      !this.component.request.description ||
      !this.component.request.image.fileUrl ||
      !this.component.request.systemLanguageId
    ) {
      this.message.showTranslatedWarningMessage('Fill all fields');
    } else {
      this.component.id === 'create' ? this.create() : this.update();
    }
    console.log(this.component.request);
  }

  private create() {
    this.service
      .Create(this.service.serviceUrl, this.component.request)
      .subscribe((resp) => {
        if (resp.succeeded) {
          this.message.showTranslatedSuccessMessage('Created successfully.');
          this.component.location.back();
        }
      });
  }

  private update() {
    this.service
      .Update(this.service.serviceUrl, this.component.request)
      .subscribe((resp) => {
        if (resp.succeeded) {
          this.message.showTranslatedSuccessMessage('Updated successfully.');
          this.component.location.back();
        }
      });
  }
}
