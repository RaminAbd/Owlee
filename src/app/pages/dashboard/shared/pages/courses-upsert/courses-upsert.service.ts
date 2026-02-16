import { inject, Injectable } from '@angular/core';
import { CoursesUpsertComponent } from './courses-upsert.component';
import { CoursesApiService } from '../../../../admin-courses/shared/services/courses.api.service';
import { KnownLanguagesApiService } from '../../../../known-languages/shared/services/known-languages.api.service';
import { TranslateService } from '@ngx-translate/core';
import { BlobService } from '../../../../../core/services/blob.service';
import { StorageService } from '../../../../../core/services/storage.service';
import { ApplicationMessageCenterService } from '../../../../../core/services/ApplicationMessageCenter.service';
import { UpgradePlanComponent } from '../../../../../shared/components/upgrade-plan/upgrade-plan.component';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';

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
  private router: Router = inject(Router);
  public dialogService: DialogService = inject(DialogService);
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
    this.buildRequest();
    console.log(this.component.request);
    if (
      !this.component.request.name ||
      !this.component.request.description ||
      !this.component.request.startDate ||
      !this.component.request.endDate ||
      !this.component.request.image.fileUrl ||
      !this.component.request.systemLanguageId
    ) {
      this.message.showTranslatedWarningMessage('Fill all fields');
    } else {
      this.component.id === 'create' ? this.checkSlots() : this.update();
    }
  }
  buildRequest() {
    if (this.component.startDate)
      this.component.request.startDate = this.component.startDate.toISOString();
    if (this.component.endDate)
      this.component.request.endDate = this.component.endDate.toISOString();
    if (this.component.lastDay)
      this.component.request.lastSubscriptionDate =
        this.component.lastDay.toISOString();
    this.component.request.learningPoints = this.component.request.learningPoints.filter(x=>x.value)
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

  checkSlots() {
    let educatorId = localStorage.getItem('userId') as string;
    const req = {
      EducatorId: educatorId,
      isOpen: this.component.request.isOpen,
    };
    this.service.GetAvailableCourseSlots(req).subscribe((resp) => {
      if (resp.data !== 0) {
        this.component.id === 'create' ? this.create() : this.update();
      } else {
        this.upgradePlan();
      }
    });
  }

  upgradePlan() {
    const ref = this.dialogService.open(UpgradePlanComponent, {
      width: '960px',
      style: {
        maxWidth: '95%',
      },
      data: 2,
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        this.checkSlots();
      }
    });
  }
}
