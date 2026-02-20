import { Component, inject } from '@angular/core';
import { UserSubscriptionResponseModel } from '../../../../dashboard/shared/models/user-subscription-response.model';
import { EducatorSubscriptionsService } from './educator-subscriptions.service';
import { SubscriptionPackageModel } from '../../../../subscription-package/shared/models/subscription-package.model';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe, NgIf, NgStyle } from '@angular/common';
import { UpgradePlanComponent } from '../../../../../shared/components/upgrade-plan/upgrade-plan.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-educator-subscriptions',
  imports: [TranslatePipe, DatePipe, NgStyle, NgIf],
  templateUrl: './educator-subscriptions.component.html',
  styleUrl: './educator-subscriptions.component.scss',
})
export class EducatorSubscriptionsComponent {
  private service: EducatorSubscriptionsService = inject(
    EducatorSubscriptionsService,
  );
  private dialogService: DialogService = inject(DialogService);
  subscription: UserSubscriptionResponseModel =
    new UserSubscriptionResponseModel();
  selectedPackage: SubscriptionPackageModel = new SubscriptionPackageModel();

  constructor() {
    this.service.component = this;
    this.service.getSubscription();
    this.service.getActiveSubscription();
  }

  upgradePlan() {
    const ref = this.dialogService.open(UpgradePlanComponent, {
      width: '1100px',
      style: {
        maxWidth: '95%',
      },
      data: 1,
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        this.service.getSubscription();
        this.service.getActiveSubscription();
      }
    });
  }
}
