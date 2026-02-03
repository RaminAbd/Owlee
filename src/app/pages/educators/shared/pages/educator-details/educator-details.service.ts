import { inject, Injectable } from '@angular/core';
import { EducatorsApiService } from '../../services/educators.api.service';
import { TranslateService } from '@ngx-translate/core';
import { BlobService } from '../../../../../core/services/blob.service';
import { StorageService } from '../../../../../core/services/storage.service';
import { AuthApiService } from '../../../../../auth/shared/services/auth.api.service';
import { KnownLanguagesApiService } from '../../../../known-languages/shared/services/known-languages.api.service';
import { ApplicationMessageCenterService } from '../../../../../core/services/ApplicationMessageCenter.service';
import { LanguageService } from '../../../../../core/services/language.service';
import { EducatorSignupRequestModel } from '../../../../../auth/sign-up/shared/models/educator-signup-request.model';
import { EducatorDetailsComponent } from './educator-details.component';
import { CoursesApiService } from '../../../../admin-courses/shared/services/courses.api.service';
import { FileModel } from '../../../../../core/models/File.model';
import { SubscriptionPackageApiService } from '../../../../subscription-package/shared/services/subscription-package.api.service';
import { SubscriptionsApiService } from '../../../../../system-pages/educator/shared/services/subscriptions.api.service';

@Injectable({
  providedIn: 'root',
})
export class EducatorDetailsService {
  component: EducatorDetailsComponent;
  private service = inject(EducatorsApiService);
  public translate = inject(TranslateService);
  private blob = inject(BlobService);
  private storage = inject(StorageService);
  private authService = inject(AuthApiService);
  private knownLangService = inject(KnownLanguagesApiService);
  public message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  private langService: LanguageService = inject(LanguageService);
  private coursesService: CoursesApiService = inject(CoursesApiService);
  constructor() {}
  private packagesService: SubscriptionPackageApiService = inject(
    SubscriptionPackageApiService,
  );
  private subsService: SubscriptionsApiService = inject(
    SubscriptionsApiService,
  );
  getDashboard() {
    const req = {
      educatorId: this.component.id,
      lang: this.translate.currentLang,
    };
    this.coursesService.GetByEducator(req).subscribe((resp) => {
      this.component.response = resp.data;
    });
  }

  getEducatorInfo() {
    this.service
      .GetById(this.service.serviceUrl, this.component.id)
      .subscribe((resp) => {
        this.setDates(resp.data);
        this.component.request = resp.data;
        if (!this.component.request.profileImage)
          this.component.request.profileImage = new FileModel();
        this.component.request.profileImage.isValid = true;
        this.component.request.qualifications.forEach((qualification) => {
          qualification.file.isValid = true;
        });
      });
  }

  private setDates(data: any) {
    this.setYear(data);
    this.setMonth(data);
    this.setDay(data);
  }

  private setYear(data: any) {
    const year = new Date(data.dateOfBirth).getFullYear();
    const findedYear = this.component.years.find(
      (x) => x.name === year.toString(),
    );
    this.component.selectedYear = findedYear
      ? findedYear
      : this.component.years[0];
  }

  private setMonth(data: any) {
    const month = new Date(data.dateOfBirth).getMonth();
    const findedMonth = this.component.months.find(
      (x) => x.value === month + 1,
    );
    this.component.selectedMonth = findedMonth
      ? findedMonth
      : this.component.months[0];
  }

  private setDay(data: any) {
    const day = new Date(data.dateOfBirth).getDate();
    const findedDay = this.component.days.find(
      (x) => x.name === day.toString(),
    );
    this.component.selectedDay = findedDay ? findedDay : this.component.days[0];
  }

  getLanguages() {
    this.knownLangService
      .GetAllByLang(
        this.knownLangService.serviceUrl,
        this.translate.currentLang,
      )
      .subscribe((resp) => {
        this.component.knownLangs = resp.data;
      });
  }

  initMonths() {
    this.component.months = [
      { name: this.langService.getByKey('January'), value: 1 },
      { name: this.langService.getByKey('February'), value: 2 },
      { name: this.langService.getByKey('March'), value: 3 },
      { name: this.langService.getByKey('April'), value: 4 },
      { name: this.langService.getByKey('May'), value: 5 },
      { name: this.langService.getByKey('June'), value: 6 },
      { name: this.langService.getByKey('July'), value: 7 },
      { name: this.langService.getByKey('August'), value: 8 },
      { name: this.langService.getByKey('September'), value: 9 },
      { name: this.langService.getByKey('October'), value: 10 },
      { name: this.langService.getByKey('November'), value: 11 },
      { name: this.langService.getByKey('December'), value: 12 },
    ];
  }

  save() {
    if (this.validate()) {
      this.component.request.personalId =
        this.component.request.personalId.toString();
      this.component.mainLoading = true;
      this.updatePersonalInfo();
    }
  }

  updatePersonalInfo() {
    this.service
      .Update(this.service.serviceUrl, this.component.request)
      .subscribe((resp) => {
        if (resp.succeeded) {
          this.message.showTranslatedSuccessMessage('Successfully updated!');
          this.getEducatorInfo();
          this.component.isSubmitted = false;
          this.component.mainLoading = false;
        }
      });
  }

  validate() {
    let result = true;
    this.validateAge();
    if (
      !this.component.request.firstName ||
      !this.component.request.lastName ||
      !this.component.request.personalId ||
      !this.component.request.phoneNumber ||
      !this.component.request.userName ||
      !this.component.request.location ||
      !this.component.request.profileImage.fileUrl ||
      this.component.request.systemLanguages.length === 0 ||
      this.component.dateInvalid
    ) {
      result = false;
      this.message.showTranslatedWarningMessage('Fields are not valid');
    }

    if (!/^[a-zA-Z]+$/.test(this.component.request.firstName)) {
      this.message.showTranslatedWarningMessage('First name is not valid');
      result = false;
    }

    if (!/^[a-zA-Z]+$/.test(this.component.request.lastName)) {
      this.message.showTranslatedWarningMessage('Last name is not valid');
      result = false;
    }

    if (!/^\d{9}$/.test(this.component.request.phoneNumber)) {
      this.message.showTranslatedWarningMessage('Phone number is not valid');
      result = false;
    }

    if (!/^\d{11}$/.test(this.component.request.personalId)) {
      this.message.showTranslatedWarningMessage('Personal Id is not valid');
      result = false;
    }

    if (this.component.request.qualifications.length !== 0) {
      this.component.request.qualifications.forEach((qualification) => {
        if (!qualification.file.fileUrl || !qualification.title) {
          result = false;
        }
      });
    }

    return result;
  }

  getFile(e: any, fileHandler: any) {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      fd.append('file', files[i]);
      this.blob.UploadFile(fd).subscribe((resp: any) => {
        fileHandler(resp);
      });
    }
  }

  minimumAge: number = 18;
  ageValid: boolean = false;
  validateAge(): void {
    const combinedDate = new Date(
      Number(this.component.selectedYear.name),
      Number(this.component.selectedMonth.value) - 1,
      Number(this.component.selectedDay.name),
    );
    if (!combinedDate) {
      this.ageValid = false;
      return;
    }

    const today = new Date();
    const ageDifference = today.getFullYear() - combinedDate.getFullYear();

    if (ageDifference > this.minimumAge) {
      this.ageValid = true;
    } else if (ageDifference === this.minimumAge) {
      if (
        today.getMonth() > combinedDate.getMonth() ||
        (today.getMonth() === combinedDate.getMonth() &&
          today.getDate() >= combinedDate.getDate())
      ) {
        this.ageValid = true;
      } else {
        this.ageValid = false;
      }
    } else {
      this.ageValid = false;
    }
    if (this.ageValid) {
      this.component.dateInvalid = false;
      this.combineDateTime();
    } else {
      this.component.dateInvalid = true;
      this.message.showTranslatedWarningMessage(
        'You must be at least 18 years old.',
      );
    }
  }

  combineDateTime() {
    const combinedDate = new Date(
      Number(this.component.selectedYear.name),
      Number(this.component.selectedMonth.value) - 1,
      Number(this.component.selectedDay.name),
    );
    var date = new Date(
      combinedDate.setHours(combinedDate.getHours() + 10),
    ).toISOString();
    this.component.request.dateOfBirth = date;
  }

  savePassword() {
    console.log(this.component.request);
    let req = {
      id: this.component.request.id,
      password: this.component.request.password,
    };
    this.authService.ChangePassword(req).subscribe((resp: any) => {});
  }

  getSubscription() {
    this.subsService.getByEducatorId(this.component.id).subscribe((resp) => {
      console.log(resp.data);
      this.component.subscription = resp.data;
      this.component.subscription.usedPercentage =
        (this.component.subscription.fileStorage /
          this.component.subscription.maxFileStorage) *
        100;
    });
  }

  getActiveSubscription() {
    this.packagesService.GetActive(this.component.id).subscribe((resp) => {
      this.component.selectedPackage = resp.data;
      console.log(resp.data);
    });
  }
}
