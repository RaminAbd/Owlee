import { Component, inject } from '@angular/core';
import { SubscriptionPackageModel } from '../../../pages/subscription-package/shared/models/subscription-package.model';
import { UpgradePlanService } from './upgrade-plan.service';
import {TranslatePipe} from '@ngx-translate/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {AnimationOptions, LottieComponent} from 'ngx-lottie';
import {AnimationItem} from 'lottie-web';

@Component({
  selector: 'app-upgrade-plan',
  imports: [
    TranslatePipe,
    NgForOf,
    NgClass,
    LottieComponent,
    NgIf
  ],
  templateUrl: './upgrade-plan.component.html',
  styleUrl: './upgrade-plan.component.scss',
})
export class UpgradePlanComponent {
  private service: UpgradePlanService = inject(UpgradePlanService);
  subscriptionPackages: SubscriptionPackageModel[] = [];
  selectedPackage: SubscriptionPackageModel = new SubscriptionPackageModel();
  activePackage: SubscriptionPackageModel = new SubscriptionPackageModel();
  loading:boolean = false;
  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    this.service.component = this;
    this.service.getPackages();
  }

  upgrade() {
    this.loading = true;
    this.service.renew()
  }

  openExternalUrl(url:string) {
    window.location.href = url;
  }

  private animationItem: AnimationItem | undefined;

  options: AnimationOptions = {
    path: 'Animation.json',
    loop: true,
    autoplay: false,
  };

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
    if (this.animationItem) {
      this.animationItem.play();
    }
  }
}
