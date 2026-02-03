import { Component, inject } from '@angular/core';
import { UserSubscriptionResponseModel } from '../../../../dashboard/shared/models/user-subscription-response.model';
import { EducatorSubscriptionsService } from './educator-subscriptions.service';
import { SubscriptionPackageModel } from '../../../../subscription-package/shared/models/subscription-package.model';
import {TranslatePipe} from '@ngx-translate/core';
import {DatePipe, NgIf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-educator-subscriptions',
  imports: [
    TranslatePipe,
    DatePipe,
    NgStyle,
    NgIf
  ],
  templateUrl: './educator-subscriptions.component.html',
  styleUrl: './educator-subscriptions.component.scss',
})
export class EducatorSubscriptionsComponent {
  private service: EducatorSubscriptionsService = inject(
    EducatorSubscriptionsService,
  );
  subscription: UserSubscriptionResponseModel =
    new UserSubscriptionResponseModel();
  selectedPackage: SubscriptionPackageModel = new SubscriptionPackageModel();

  constructor() {
    this.service.component = this;
    this.service.getSubscription();
    this.service.getActiveSubscription();
  }
}
