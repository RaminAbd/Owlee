import { Component, inject } from '@angular/core';
import { SubscriptionPackageModel } from '../../../pages/subscription-package/shared/models/subscription-package.model';
import { UpgradePlanService } from './upgrade-plan.service';
import { TranslatePipe } from '@ngx-translate/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-upgrade-plan',
  imports: [TranslatePipe, NgForOf, NgClass, LottieComponent, NgIf, RouterLink],
  templateUrl: './upgrade-plan.component.html',
  styleUrl: './upgrade-plan.component.scss',
})
export class UpgradePlanComponent {
  public config: DynamicDialogConfig = inject(DynamicDialogConfig);
  public ref: DynamicDialogRef = inject(DynamicDialogRef);
  private service: UpgradePlanService = inject(UpgradePlanService);
  subscriptionPackages: SubscriptionPackageModel[] = [];
  selectedPackage: SubscriptionPackageModel = new SubscriptionPackageModel();
  activePackage: SubscriptionPackageModel = new SubscriptionPackageModel();
  loading: boolean = false;
  selectedPackageType: number = 1;
  upgradeType: number = this.config.data;
  errorMessage:string
  constructor() {
    this.service.component = this;
    this.service.getPackages();
  }

  upgrade() {
    if (this.upgradeType === 1) {
      this.service.canChange();
    } else {
      if (this.activePackage.name === "Standard" && this.selectedPackage.name === "Standard") {
        this.errorMessage = 'Please select Pro or Pro Plus package';
      }
      else if (this.activePackage.name === "Pro") {
        if (this.selectedPackage.name !== "Pro Plus") {
          this.errorMessage = 'Please select Pro Plus package';
        } else {
          this.service.canChange();
        }
      }
      else if (this.activePackage.name === "Pro Plus") {
        this.errorMessage = 'You cannot upgrade your plan. Please contact customer support.';
      }
      else {
        this.service.canChange();
      }
    }
    // this.loading = true;

  }

  openExternalUrl(url: string) {
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
