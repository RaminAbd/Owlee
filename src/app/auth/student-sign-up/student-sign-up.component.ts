import { Component, inject, OnDestroy } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { MultiSelect } from 'primeng/multiselect';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LangChangeEvent, TranslatePipe } from '@ngx-translate/core';
import { KnownLanguagesResponseModel } from '../../pages/known-languages/shared/models/known-languages-response.model';
import { EducatorSignupRequestModel } from '../sign-up/shared/models/educator-signup-request.model';
import { AnimationItem } from 'lottie-web';
import { StudentSignUpService } from './student-sign-up.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StudentSignupRequestModel } from './shared/models/student-signup-request.model';

@Component({
  selector: 'app-student-sign-up',
  imports: [
    NgIf,
    ReactiveFormsModule,
    TranslatePipe,
    FormsModule,
    DropdownModule,
    NgClass,
    MultiSelect,
    LottieComponent,
    RouterLink,
  ],
  templateUrl: './student-sign-up.component.html',
  styleUrl: './student-sign-up.component.scss',
})
export class StudentSignUpComponent implements OnDestroy {
  private service: StudentSignUpService = inject(StudentSignUpService);
  private fb: FormBuilder = inject(FormBuilder);
  private route: ActivatedRoute = inject(ActivatedRoute);
  groupMemberId = this.route.snapshot.paramMap.get('id') as string;
  mainLoading: boolean = false;
  knownLangs: KnownLanguagesResponseModel[] = [];
  request: StudentSignupRequestModel = new StudentSignupRequestModel();
  firstStepSubmitted = false;
  firstStepPassed: boolean = false;
  passVisible: boolean = false;
  repeatVisible: boolean = false;
  firstStepForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
    langs: [''],
    username: [
      { value: '', disabled: this.groupMemberId },
      [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)],
    ],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    location: ['', [Validators.required]],
    privacyAccepted: [false, [Validators.required]],
    password: ['', [Validators.required, Validators.pattern(/^.{6,}$/)]],
    confirmPassword: ['', [Validators.required, Validators.pattern(/^.{6,}$/)]],
  });
  langSubscribtion: any;
  constructor() {
    this.service.component = this;
    this.service.getLanguages();
    if (this.groupMemberId) {
      this.service.getGroupMember();
    }
    this.langSubscribtion = this.service.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.service.getLanguages();
      },
    );
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'e' || event.key === 'E') {
      event.preventDefault();
    }
  }

  validateFirstStep() {
    this.firstStepSubmitted = true;
    console.log();
    if (this.firstStepForm.valid) {
      this.service.validateFirstStep();
    } else {
      this.service.message.showTranslatedWarningMessage('Fields are not valid');
      this.firstStepPassed = false;
    }
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
  ngOnDestroy() {
    this.langSubscribtion.unsubscribe();
  }
}
