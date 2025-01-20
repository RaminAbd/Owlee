import { inject, Injectable } from '@angular/core';
import { SubscriptionPackageApiService } from '../../../../subscription-package/shared/services/subscription-package.api.service';
import { KnownLanguagesUpsertComponent } from './known-languages-upsert.component';
import { KnownLanguagesApiService } from '../../services/known-languages.api.service';

@Injectable({
  providedIn: 'root',
})
export class KnownLanguagesUpsertService {
  private service: KnownLanguagesApiService = inject(KnownLanguagesApiService);
  component: KnownLanguagesUpsertComponent;
  constructor() {}

  getInfo() {
    this.component.id === 'create' ? this.getForm() : this.getById();
  }

  private getForm() {
    this.service.GetForm(this.service.serviceUrl).subscribe((resp) => {
      this.component.request = resp.data;
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
  }

  private create() {
    this.service
      .Create(this.service.serviceUrl, this.component.request)
      .subscribe((resp) => {
        if (resp.succeeded) {
          this.component.message.showSuccessMessage(
            'Success',
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
          this.component.message.showSuccessMessage(
            'Success',
            'Successfully updated',
          );
          this.component.location.back();
        }
      });
  }

  private isValid() {
    let result = true;
    this.component.request.name.items.forEach((x) => {
      if (!x.value) {
        result = false;
        x.isValid = false;
      }
    });
    return result;
  }
}
