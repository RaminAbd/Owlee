import { Component, ElementRef, inject, OnInit } from '@angular/core';
import { HomeHeaderComponent } from './shared/components/home-header/home-header.component';
import { SubscriptionPackageModel } from '../subscription-package/shared/models/subscription-package.model';
import { HomeService } from './home.service';
import {NgClass, NgForOf} from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [
    HomeHeaderComponent,
    NgForOf,
    TranslatePipe,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private service: HomeService = inject(HomeService);
  private elementRef: ElementRef = inject(ElementRef);
  subscriptionPackages: SubscriptionPackageModel[] = [];
  private fb: FormBuilder = inject(FormBuilder);
  isSubmitted: boolean = false;
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]],
    message: ['', [Validators.required]],
  });
  selectedPackageType:number = 1
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

  send() {
    this.isSubmitted = true;
    this.service.send()
  }
}
