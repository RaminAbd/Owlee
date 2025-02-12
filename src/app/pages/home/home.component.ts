import { Component, ElementRef, inject, OnInit } from '@angular/core';
import { HomeHeaderComponent } from './shared/components/home-header/home-header.component';
import { SubscriptionPackageModel } from '../subscription-package/shared/models/subscription-package.model';
import { HomeService } from './home.service';
import { NgForOf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [HomeHeaderComponent, NgForOf, TranslatePipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private service: HomeService = inject(HomeService);
  private elementRef: ElementRef = inject(ElementRef);
  subscriptionPackages: SubscriptionPackageModel[] = [];
  constructor() {
    this.service.component = this;
    this.service.getAllPackages();
  }
  ngOnInit(): void {
    this.elementRef.nativeElement
      .querySelectorAll('a[href^="#"]')
      .forEach((anchor: any) => {
        anchor.addEventListener('click', (e: any) => {
          e.preventDefault();

          const targetId = anchor.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
  }


}
