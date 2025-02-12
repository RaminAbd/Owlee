import { inject, Injectable } from '@angular/core';
import { HomeComponent } from './home.component';
import { SubscriptionPackageApiService } from '../subscription-package/shared/services/subscription-package.api.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  component: HomeComponent;
  private service: SubscriptionPackageApiService = inject(
    SubscriptionPackageApiService,
  );

  getAllPackages() {
    this.service.GetAll(this.service.serviceUrl).subscribe((resp) => {
      this.component.subscriptionPackages = resp.data;
    });
  }
}
