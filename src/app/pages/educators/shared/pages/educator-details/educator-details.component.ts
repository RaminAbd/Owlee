import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EducatorSignupRequestModel } from '../../../../../auth/sign-up/shared/models/educator-signup-request.model';
import { KnownLanguagesResponseModel } from '../../../../known-languages/shared/models/known-languages-response.model';
import { LangChangeEvent, TranslatePipe } from '@ngx-translate/core';
import { EducatorQualificationModel } from '../../../../../auth/sign-up/shared/models/educator-qualification.model';
import { FileModel } from '../../../../../core/models/File.model';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { EducatorDetailsService } from './educator-details.service';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelect } from 'primeng/multiselect';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardResponseModel } from '../../../../dashboard/shared/models/dashboard-response.model';
import { DashboardCourseModel } from '../../../../dashboard/shared/models/dashboard-course.model';

@Component({
  selector: 'app-educator-details',
  imports: [
    DropdownModule,
    LottieComponent,
    MultiSelect,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    TranslatePipe,
    NgClass,
    FormsModule,
  ],
  templateUrl: './educator-details.component.html',
  styleUrl: './educator-details.component.scss',
})
export class EducatorDetailsComponent {
  private service: EducatorDetailsService = inject(EducatorDetailsService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  id: string = this.route.snapshot.paramMap.get('id') as string;
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
  passVisible: boolean = false;

  langSubscribtion: any;

  response: DashboardResponseModel = new DashboardResponseModel();
  constructor() {
    this.service.component = this;
    this.service.getLanguages();
    this.service.getEducatorInfo();
    this.service.initMonths();
    this.service.getDashboard();

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
    if (this.request.password) {
      this.service.savePassword();
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
    this.isSubmitted = false;
    let newItem = new EducatorQualificationModel();
    newItem.file = new FileModel();
    this.request.qualifications.push(newItem);
  }

  removeQualification(i: number) {
    this.request.qualifications.splice(i, 1);
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

  getInfo(item: DashboardCourseModel) {
    this.router.navigate(['/main/admin/courses/', item.courseId]);
  }
  ngOnDestroy() {
    this.langSubscribtion.unsubscribe();
  }
}
