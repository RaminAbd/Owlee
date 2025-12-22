import { Component, inject, OnDestroy } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { MultiSelect } from 'primeng/multiselect';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LangChangeEvent, TranslatePipe } from '@ngx-translate/core';
import { EducatorSignupRequestModel } from '../../auth/sign-up/shared/models/educator-signup-request.model';
import { KnownLanguagesResponseModel } from '../known-languages/shared/models/known-languages-response.model';
import { EducatorQualificationModel } from '../../auth/sign-up/shared/models/educator-qualification.model';
import { FileModel } from '../../core/models/File.model';
import { AnimationItem } from 'lottie-web';
import { StudentPersonalInfoService } from './student-personal-info.service';
import {StudentSignupRequestModel} from '../../auth/student-sign-up/shared/models/student-signup-request.model';

@Component({
  selector: 'app-student-personal-info',
  imports: [
    DropdownModule,
    LottieComponent,
    MultiSelect,
    NgIf,
    ReactiveFormsModule,
    TranslatePipe,
    NgClass,
    FormsModule,
  ],
  templateUrl: './student-personal-info.component.html',
  styleUrl: './student-personal-info.component.scss',
})
export class StudentPersonalInfoComponent implements OnDestroy {
  private service: StudentPersonalInfoService = inject(
    StudentPersonalInfoService,
  );
  request: StudentSignupRequestModel = new StudentSignupRequestModel();
  selectedTab: number = 1;
  isSubmitted = false;
  knownLangs: KnownLanguagesResponseModel[] = [];

  oldPassVisible: boolean = false;
  passVisible: boolean = false;
  repeatPassVisible: boolean = false;

  passSubmitted: boolean = false;
  langSubscribtion: any;

  constructor() {
    this.service.component = this;
    this.service.getLanguages();
    // this.service.getStudentInfo();

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
    this.isSubmitted = true;
    this.service.save();
  }

  validatePasswords() {
    this.passSubmitted = true;
    if (this.service.validatePasswords()) {
      this.service.savePassword();
    }
  }

  private animationItem: AnimationItem | undefined;
  mainLoading: boolean = false;
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
