import { Component, inject, OnDestroy } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LangChangeEvent, TranslatePipe } from '@ngx-translate/core';
import { EducatorSignupRequestModel } from './shared/models/educator-signup-request.model';
import { SignUpService } from './sign-up.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DropdownModule } from 'primeng/dropdown';
import { KnownLanguagesResponseModel } from '../../pages/known-languages/shared/models/known-languages-response.model';
import { MultiSelect } from 'primeng/multiselect';
import { EducatorQualificationModel } from './shared/models/educator-qualification.model';
import { FileModel } from '../../core/models/File.model';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-sign-up',
  imports: [
    NgIf,
    ReactiveFormsModule,
    TranslatePipe,
    FormsModule,
    DropdownModule,
    NgClass,
    MultiSelect,
    NgForOf,
    LottieComponent,
  ],
  templateUrl: './sign-up.component.html',
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
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnDestroy {
  private service: SignUpService = inject(SignUpService);
  private fb: FormBuilder = inject(FormBuilder);
  mainLoading: boolean = false;

  knownLangs: KnownLanguagesResponseModel[] = [];
  expanderStates: string[] = [];

  request: EducatorSignupRequestModel = new EducatorSignupRequestModel();
  firstStepSubmitted = false;
  firstStepPassed: boolean = false;
  passVisible: boolean = false;
  repeatVisible: boolean = false;

  firstStepForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
    personalId: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    email: ['', [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    location: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.pattern(/^.{6,}$/)]],
    confirmPassword: ['', [Validators.required, Validators.pattern(/^.{6,}$/)]],
  });

  secondStepSubmitted = false;
  secondStepPassed: boolean = false;

  secondStepForm: FormGroup = this.fb.group({
    day: ['', [Validators.required]],
    month: ['', [Validators.required]],
    year: ['', [Validators.required]],
    profileImage: [''],
    langs: ['', [Validators.required]],
  });
  days: { name: string }[] = Array.from({ length: 31 }, (_, index) => ({
    name: (index + 1).toString(),
  }));
  months: { name: string; value: number }[] = [];
  years: { name: string }[] = Array.from({ length: 100 }, (_, index) => ({
    name: (new Date().getFullYear() - 18 - index).toString(),
  }));
  selectedDay: any;
  selectedMonth: any;
  selectedYear: any;
  dateInvalid = false;

  thirdStepSubmitted = false;
  thirdStepPassed: boolean = false;

  fourthStepSubmitted = false;
  fourthStepPassed: boolean = false;
  langSubscribtion: any;
  constructor() {
    this.service.component = this;
    this.service.getLanguages();
    this.expanderStates = Array.from({ length: 4 }, () => 'collapsed');
    this.toggleExpander(0);
    this.service.initMonths();

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

  validateSecondStep() {
    this.secondStepSubmitted = true;
    if (
      this.secondStepForm.valid &&
      this.request.profileImage.fileUrl &&
      this.request.systemLanguages.length > 0
    ) {
      this.service.validateAge();
    } else {
      this.secondStepPassed = false;
      this.service.message.showTranslatedWarningMessage('Fields are not valid');
    }
  }

  getFile(e: any) {
    this.request.profileImage.fileLoading = true;
    this.service.getFile(e, (resp: any) => {
      this.request.profileImage.fileLoading = false;
      this.request.profileImage = resp.data;
      this.request.profileImage.fakeFile = null;
      this.request.profileImage.isValid = true;
    });
  }

  getFileName(fileName: string): string {
    if (fileName) {
      if (fileName.length > 30) {
        return this.changeFileName(fileName);
      } else {
        return fileName;
      }
    } else {
      return '';
    }
  }

  changeFileName(name: string) {
    return (
      name.substring(0, 10) +
      '...' +
      name.substring(name.length - 5, name.length)
    );
  }

  getFiles(e: any, item: EducatorQualificationModel) {
    item.file.fileLoading = true;
    this.service.getFile(e, (resp: any) => {
      item.file = resp.data;
      item.file.fileLoading = false;
      item.file.isValid = true;
      item.file.fakeFile = null;
    });
  }

  addQualification() {
    this.thirdStepSubmitted = false;
    this.thirdStepPassed = false;
    let newItem = new EducatorQualificationModel();
    newItem.file = new FileModel();
    this.request.qualifications.push(newItem);
  }
  removeQualification(i: number) {
    this.request.qualifications.splice(i, 1);
  }

  validateThirdStep() {
    this.thirdStepSubmitted = true;
    this.service.validateThirdStep();
  }

  validateFourthStep() {
    this.fourthStepSubmitted = true;
    if (this.request.verificationCode.toString().length !== 4) {
      this.fourthStepPassed = false;
      this.service.message.showTranslatedWarningMessage('Fields are not valid');
    } else {
      this.fourthStepPassed = true;
      this.service.signup();
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
