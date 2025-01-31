import {Component, inject, OnDestroy} from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import {LangChangeEvent, TranslatePipe} from '@ngx-translate/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EducatorSignupRequestModel } from '../../auth/sign-up/shared/models/educator-signup-request.model';
import { PersonalInfoService } from './personal-info.service';
import { KnownLanguagesResponseModel } from '../known-languages/shared/models/known-languages-response.model';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelect } from 'primeng/multiselect';
import { EducatorQualificationModel } from '../../auth/sign-up/shared/models/educator-qualification.model';
import { FileModel } from '../../core/models/File.model';
import {AnimationOptions, LottieComponent} from 'ngx-lottie';
import {AnimationItem} from 'lottie-web';

@Component({
  selector: 'app-personal-info',
  imports: [
    NgClass,
    TranslatePipe,
    ReactiveFormsModule,
    NgIf,
    DropdownModule,
    MultiSelect,
    NgForOf,
    FormsModule,
    LottieComponent,
  ],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.scss',
})
export class PersonalInfoComponent  implements OnDestroy {
  private service: PersonalInfoService = inject(PersonalInfoService);
  private fb: FormBuilder = inject(FormBuilder);
  request: EducatorSignupRequestModel = new EducatorSignupRequestModel();
  selectedTab: number = 1;
  isSubmitted = false;
  knownLangs: KnownLanguagesResponseModel[] = [];
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
  oldPassVisible: boolean = false;
  passVisible: boolean = false;
  repeatPassVisible: boolean = false;

  passSubmitted: boolean = false;
  langSubscribtion:any
  constructor() {
    this.service.component = this;
    this.service.getLanguages();
    this.service.getEducatorInfo();
    this.service.initMonths();

    this.langSubscribtion = this.service.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.service.getLanguages();
    });
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
    this.isSubmitted = false;
    let newItem = new EducatorQualificationModel();
    newItem.file = new FileModel();
    this.request.qualifications.push(newItem);
  }

  removeQualification(i: number) {
    this.request.qualifications.splice(i, 1);
  }

  validatePasswords() {
    this.passSubmitted = true;
    if(this.service.validatePasswords()) {
      this.service.savePassword();
    }
  }
  private animationItem: AnimationItem | undefined;
  mainLoading:boolean = false;
  options: AnimationOptions = {
    path: 'Animation.json',
    loop: true,
    autoplay: false
  };

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
    if (this.animationItem) {
      this.animationItem.play();
    }
  }
  ngOnDestroy() {
    this.langSubscribtion.unsubscribe()
  }
}
