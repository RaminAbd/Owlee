import { inject, Injectable } from '@angular/core';
import { SubscriptionPackageApiService } from '../../../../subscription-package/shared/services/subscription-package.api.service';
import { KnownLanguagesUpsertComponent } from './known-languages-upsert.component';
import { KnownLanguagesApiService } from '../../services/known-languages.api.service';
import { BlobService } from '../../../../../core/services/blob.service';
import { FileModel } from '../../../../../core/models/File.model';

@Injectable({
  providedIn: 'root',
})
export class KnownLanguagesUpsertService {
  private service: KnownLanguagesApiService = inject(KnownLanguagesApiService);
  private blob = inject(BlobService);

  component: KnownLanguagesUpsertComponent;
  constructor() {}

  getInfo() {
    this.component.id === 'create' ? this.getForm() : this.getById();
  }

  private getForm() {
    this.service.GetForm(this.service.serviceUrl).subscribe((resp) => {
      this.component.request = resp.data;
      this.component.request.icon = new FileModel();
      this.component.request.icon.isValid = true;
      this.component.request.name.items.map((x) => (x.isValid = true));
    });
  }

  private getById() {
    this.service
      .GetById(this.service.serviceUrl, this.component.id)
      .subscribe((resp) => {
        this.component.request = resp.data;
        this.component.request.name.items.map((x) => (x.isValid = true));
      });
  }

  save() {
    if (this.isValid())
      this.component.id === 'create' ? this.create() : this.update();
    else
      this.component.message.showTranslatedWarningMessage(
        'Fields are not valid',
      );
  }

  private create() {
    this.service
      .Create(this.service.serviceUrl, this.component.request)
      .subscribe((resp) => {
        if (resp.succeeded) {
          this.component.message.showTranslatedSuccessMessage(
            'Successfully created',
          );
          this.component.location.back();
        }
      });
  }

  private update() {
    this.service
      .Update(this.service.serviceUrl, this.component.request)
      .subscribe((resp) => {
        if (resp.succeeded) {
          this.component.message.showTranslatedSuccessMessage(
            'Successfully updated',
          );
          this.component.location.back();
        }
      });
  }

  private isValid() {
    let result = true;
    if (!this.component.request.icon.fileUrl) {
      this.component.request.icon.isValid = false;
      result = false;
    }
    this.component.request.name.items.forEach((x) => {
      if (!x.value) {
        result = false;
        x.isValid = false;
      } else {
        x.isValid = true;
      }
    });
    return result;
  }

  getFile(e: any, fileHandler: any) {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      fd.append('file', files[i]);
      this.blob.UploadFile(fd).subscribe((resp: any) => {
        fileHandler(resp);
      });
    }
  }
}
