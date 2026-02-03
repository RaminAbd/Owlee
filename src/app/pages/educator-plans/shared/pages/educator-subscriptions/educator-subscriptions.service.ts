import { inject, Injectable } from '@angular/core';
import { SubscriptionsApiService } from '../../../../../system-pages/educator/shared/services/subscriptions.api.service';
import { EducatorSubscriptionsComponent } from './educator-subscriptions.component';
import { SubscriptionPackageApiService } from '../../../../subscription-package/shared/services/subscription-package.api.service';

@Injectable({
  providedIn: 'root',
})
export class EducatorSubscriptionsService {
  private service: SubscriptionPackageApiService = inject(
    SubscriptionPackageApiService,
  );
  private subsService: SubscriptionsApiService = inject(
    SubscriptionsApiService,
  );
  component: EducatorSubscriptionsComponent;
  constructor() {}

  getSubscription() {
    this.subsService
      .getByEducatorId(localStorage.getItem('userId') as string)
      .subscribe((resp) => {
        console.log(resp.data);
        this.component.subscription = resp.data;
        this.component.subscription.usedPercentage =
          ((this.component.subscription.fileStorage) /
            this.component.subscription.maxFileStorage) *
          100;
      });
  }

  getActiveSubscription() {
    this.service
      .GetActive(localStorage.getItem('userId') as string)
      .subscribe((resp) => {
        this.component.selectedPackage = resp.data;
        console.log(resp.data);
      });
  }
}
