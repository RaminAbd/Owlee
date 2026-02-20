import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UpgradePlanService } from '../../../../../shared/components/upgrade-plan/upgrade-plan.service';
import { MessageService } from 'primeng/api';
import { SubscriptionPackageModel } from '../../../../subscription-package/shared/models/subscription-package.model';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { EducatorPackagesService } from './educator-packages.service';

@Component({
  selector: 'app-educator-packages',
  imports: [
    LottieComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    NgClass,
    FormsModule,
  ],
  templateUrl: './educator-packages.component.html',
  styleUrl: './educator-packages.component.scss',
})
export class EducatorPackagesComponent {
  // public config: DynamicDialogConfig = inject(DynamicDialogConfig);
  // public ref: DynamicDialogRef = inject(DynamicDialogRef);
  private service: EducatorPackagesService = inject(EducatorPackagesService);
  private message: MessageService = inject(MessageService);
  subscriptionPackages: SubscriptionPackageModel[] = [];
  selectedPackage: SubscriptionPackageModel = new SubscriptionPackageModel();
  activePackage: SubscriptionPackageModel = new SubscriptionPackageModel();
  loading: boolean = false;
  selectedPackageType: number = 1;
  // upgradeType: number = this.config.data;
  errorMessage: string;
  privacyAccepted: boolean = false;
  isSubmitted: boolean = false;
  constructor() {
    this.service.component = this;
    this.service.getPackages();
    this.isSubmitted = false;
  }

  upgrade() {
    this.isSubmitted = true;
    if (this.privacyAccepted) {
      this.service.canChange();
    }
    if (!this.isSubmitted) {
      this.isSubmitted = true;
      if (this.privacyAccepted) {
        this.service.canChange();
      } else {
        this.isSubmitted = false;
      }
    }

    this.loading = true;
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
