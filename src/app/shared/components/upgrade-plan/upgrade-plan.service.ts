import { inject, Injectable } from '@angular/core';
import { SubscriptionPackageApiService } from '../../../pages/subscription-package/shared/services/subscription-package.api.service';
import { UpgradePlanComponent } from './upgrade-plan.component';
import { SubscriptionsApiService } from '../../../system-pages/educator/shared/services/subscriptions.api.service';

@Injectable({
  providedIn: 'root',
})
export class UpgradePlanService {
  component: UpgradePlanComponent;

  private service: SubscriptionPackageApiService = inject(
    SubscriptionPackageApiService,
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
      type:this.component.selectedPackageType
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
    }
    this.subsService.CanChange(req).subscribe((resp) => {
      if(resp.data.canChange){
        // this.renew()
      }
      else{
        this.component.loading = false;
      }
    })
  }
}
