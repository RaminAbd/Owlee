import {inject, Injectable} from '@angular/core';
import {UpgradePlanComponent} from '../../../../../shared/components/upgrade-plan/upgrade-plan.component';
import {
  SubscriptionPackageApiService
} from '../../../../subscription-package/shared/services/subscription-package.api.service';
import {ApplicationMessageCenterService} from '../../../../../core/services/ApplicationMessageCenter.service';
import {SubscriptionsApiService} from '../../../../../system-pages/educator/shared/services/subscriptions.api.service';
import {EducatorPackagesComponent} from './educator-packages.component';

@Injectable({
  providedIn: 'root'
})
export class EducatorPackagesService {
  component: EducatorPackagesComponent;

  private service: SubscriptionPackageApiService = inject(
    SubscriptionPackageApiService,
  );
  private message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  private subsService: SubscriptionsApiService = inject(
    SubscriptionsApiService,
  );
  constructor() {}

  getPackages() {
    this.service.GetAll(this.service.serviceUrl).subscribe((resp) => {
      this.component.subscriptionPackages = resp.data;
      console.log(this.component.subscriptionPackages);
      this.getActive();
    });
  }

  getActive() {
    let userId: string = localStorage.getItem('userId') as string;
    this.service.GetActive(userId).subscribe((resp) => {
      console.log(resp.data);
      this.component.selectedPackage = resp.data;
      this.component.activePackage = resp.data;
    });
  }

  renew() {
    let userId: string = localStorage.getItem('userId') as string;
    const req = {
      educatorId: userId,
      packageId: this.component.selectedPackage.id,
      type: this.component.selectedPackageType,
    };
    this.subsService.Renew(req).subscribe((resp) => {
      this.component.loading = false;
      this.component.openExternalUrl(resp.data.url);
    });
  }

  canChange() {
    this.component.loading = true;
    let userId: string = localStorage.getItem('userId') as string;
    const req = {
      educatorId: userId,
      SubscriptionId: this.component.selectedPackage.id,
    };
    this.subsService.CanChange(req).subscribe((resp) => {
      if (resp.data.canChange) {
        this.renew();
      } else {
        this.component.loading = false;
        this.component.errorMessage =
          'Please continue current or select higher package';
      }
    });
  }

  canUpdate() {
    this.component.loading = true;
    let userId: string = localStorage.getItem('userId') as string;
    const req = {
      educatorId: userId,
      SubscriptionId: this.component.selectedPackage.id,
    };
    this.subsService.CanUpdate(req).subscribe((resp) => {
      if (resp.data.canChange) {
        this.renew();
      } else {
        this.component.loading = false;
        this.component.errorMessage = 'Please select higher package';
      }
    });
  }
}
