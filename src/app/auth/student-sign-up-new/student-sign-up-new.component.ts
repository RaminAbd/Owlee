import {Component, inject, OnDestroy} from '@angular/core';
import {StudentSignUpService} from '../student-sign-up/student-sign-up.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {KnownLanguagesResponseModel} from '../../pages/known-languages/shared/models/known-languages-response.model';
import {StudentSignupRequestModel} from '../student-sign-up/shared/models/student-signup-request.model';
import {LangChangeEvent, TranslatePipe} from '@ngx-translate/core';
import {AnimationItem} from 'lottie-web';
import {AnimationOptions, LottieComponent} from 'ngx-lottie';
import {StudentSignUpNewService} from './student-sign-up-new.service';
import {MultiSelect} from 'primeng/multiselect';
import {NgClass, NgIf} from '@angular/common';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-student-sign-up-new',
  imports: [
    LottieComponent,
    MultiSelect,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    NgClass,
    FormsModule
  ],
  templateUrl: './student-sign-up-new.component.html',
  styleUrl: './student-sign-up-new.component.scss',
  animations: [
    trigger('expanderAnimation', [
      state(
        'collapsed',
        style({
          maxHeight: '0px',
          opacity: 0,
          zIndex: -1,
          padding: 0,
        }),
      ),
      state(
        'expanded',
        style({
          // maxHeight: '200px',
          zIndex: 1,
          opacity: 1,
        }),
      ),
      transition('collapsed <=> expanded', [animate('0.1s ease-out')]),
    ]),
  ],
})
export class StudentSignUpNewComponent implements OnDestroy {
  private service: StudentSignUpNewService = inject(StudentSignUpNewService);
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
  expanderStates: string[] = [];
  fourthStepSubmitted = false;
  fourthStepPassed: boolean = false;
  constructor() {
    this.service.component = this;
    this.expanderStates = Array.from({ length: 2 }, () => 'collapsed');
    this.toggleExpander(0);

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

  toggleExpander(index: number) {
    this.expanderStates = this.expanderStates.map((_, i) =>
      i === index ? 'expanded' : 'collapsed',
    );
    console.log(this.expanderStates, index);
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

  validateFourthStep() {
    this.fourthStepSubmitted = true;
    const code = this.request.verificationCode?.toString();

    if (!code || code.length !== 4 || !this.request.privacyAccepted) {
      this.fourthStepPassed = false;
      this.service.message.showTranslatedWarningMessage('Fields are not valid');
    } else {
      this.fourthStepPassed = true;
      console.log(this.request);
      this.service.signup();
    }
  }

  sendCode() {
    if (!this.request.username) {
      this.service.message.showTranslatedWarningMessage('Mail is not valid');
    } else {
      this.service.checkMail();
    }
  }

  ngOnDestroy() {
    this.langSubscribtion.unsubscribe();
  }
}
