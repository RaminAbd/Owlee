import { inject, Injectable } from '@angular/core';
import { SubscriptionPackageApiService } from '../../services/subscription-package.api.service';
import { SubscriptionPackageUpsertComponent } from './subscription-package-upsert.component';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionPackageUpsertService {
  private service: SubscriptionPackageApiService = inject(
    SubscriptionPackageApiService,
  );
  component: SubscriptionPackageUpsertComponent;
  constructor() {}

  getInfo() {
    if (this.component.id !== 'create') {
      this.getById();
    }
  }

  private getById() {
    this.service
      .GetById(this.service.serviceUrl, this.component.id)
      .subscribe((resp) => {
        this.component.request = resp.data;
      });
  }

  save() {
    if (this.isValid())
      this.component.id === 'create' ? this.create() : this.update();
    else this.component.message.showTranslatedWarningMessage('Fields are not valid');
  }

  isValid() {
    let result: boolean = true;
    if (
      !this.component.request.name ||
      !this.component.request.price ||
      !this.component.request.annualPrice ||
      !this.component.request.maxCapacity ||
      !this.component.request.openMaxCapacity ||
      !this.component.request.courseAmount ||
      !this.component.request.openCourseAmount ||
      !this.component.request.fileStorage ||
      !this.component.request.openFileStorage
      // !this.component.request.groupPerCourse ||
      // !this.component.request.peoplePerGroup
    ) {
      result = false;
    }
    return result;
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
}
