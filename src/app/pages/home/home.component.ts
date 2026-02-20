import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy
} from '@angular/core';
import { SubscriptionPackageModel } from '../subscription-package/shared/models/subscription-package.model';
import { HomeService } from './home.service';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FaqsResponseModel } from '../admin-faqs/shared/models/faqs-response.model';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionPanel,
} from 'primeng/accordion';
import { CoursesResponseModel } from '../admin-courses/shared/models/courses-response.model';
import {StorageService} from '../../core/services/storage.service';

@Component({
  selector: 'app-home',
  imports: [
    NgForOf,
    TranslatePipe,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    NgIf,
    DatePipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy, AfterViewInit  {
  private service: HomeService = inject(HomeService);
  private elementRef: ElementRef = inject(ElementRef);
  subscriptionPackages: SubscriptionPackageModel[] = [];
  private storage: StorageService = inject(StorageService);
  private fb: FormBuilder = inject(FormBuilder);
  isSubmitted: boolean = false;
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]],
    message: ['', [Validators.required]],
  });
  selectedPackageType: number = 1;
  selectedFAQsTab: number = 1;
  studentsFAQs: FaqsResponseModel[] = [];
  educatorsFAQs: FaqsResponseModel[] = [];
  courses: CoursesResponseModel[] = [];
  userSignedIn:boolean = !!localStorage.getItem('userId');
  constructor(private elRef: ElementRef,private route: ActivatedRoute) {
    this.service.component = this;
    let st = this.storage.getObject('authResponse');
    this.userSignedIn = !!(st && st.role === 'Student');
    this.service.subscribeToLangEvent();
    this.service.getAllPackages();
    this.service.getAllCourses();
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      const sectionId = params['scrollTo'];
      if (sectionId) {
        setTimeout(() => {
          this.scrollToElement(sectionId);
        }, 0);
      }
    });
  }

  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (!element) return;

    const headerOffset = 80; // your fixed header height
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  send() {
    this.isSubmitted = true;
    this.service.send();
  }

  ngOnDestroy() {
    this.service.subscribe.unsubscribe();
  }

  makeFavorite(item: CoursesResponseModel) {
    this.service.addToFavorite(item);
  }
}
