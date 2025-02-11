import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionResultService } from './transaction-result.service';
import {AnimationOptions, LottieComponent} from "ngx-lottie";
import {AnimationItem} from 'lottie-web';

@Component({
  selector: 'app-transaction-result',
    imports: [TranslatePipe, NgIf, LottieComponent],
  templateUrl: './transaction-result.component.html',
  styleUrl: './transaction-result.component.scss',
})
export class TransactionResultComponent {
  private service: TransactionResultService = inject(TransactionResultService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id') as string;
  success: boolean = false;
  loading:boolean = true;
  constructor() {
    this.service.component = this;
    this.service.checkStatus();
  }
  goToDashboard() {
    this.router.navigateByUrl('main/educator/dashboard');
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
