import { inject, Injectable } from '@angular/core';
import { SignUpComponent } from './sign-up.component';
import { ApplicationMessageCenterService } from '../../core/services/ApplicationMessageCenter.service';
import { LanguageService } from '../../core/services/language.service';
import { BlobService } from '../../core/services/blob.service';
import { KnownLanguagesApiService } from '../../pages/known-languages/shared/services/known-languages.api.service';
import { TranslateService } from '@ngx-translate/core';
import { VerificationApiService } from '../shared/services/verification.api.service';
import { EducatorsApiService } from '../../pages/educators/shared/services/educators.api.service';
import { AuthRequestModel } from '../shared/models/auth-request.model';
import { AuthApiService } from '../shared/services/auth.api.service';
import { AuthService } from '../sign-in/auth.service';
import { AccountsApiService } from '../shared/services/accounts.api.service';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  component: SignUpComponent;
  private service: EducatorsApiService = inject(EducatorsApiService);
  private accountsService: AccountsApiService = inject(AccountsApiService);
  private langService: LanguageService = inject(LanguageService);
  private blob = inject(BlobService);
  private knownLangService = inject(KnownLanguagesApiService);
  public message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  private verificationService: VerificationApiService = inject(
    VerificationApiService,
  );
  private authApiService: AuthApiService = inject(AuthApiService);
  private authService: AuthService = inject(AuthService);
  public translate = inject(TranslateService);
  constructor() {}

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

  validateFirstStep() {
    if (
      !this.component.request.firstName ||
      !this.component.request.lastName ||
      !this.component.request.phoneNumber ||
      !this.component.request.email ||
      !this.component.request.password ||
      !this.component.request.location ||
      !this.component.request.personalId ||
      !this.component.request.confirmPassword
    ) {
      this.message.showTranslatedWarningMessage('Fill all fields');
      this.component.firstStepPassed = false;
    } else {
      if (
        this.component.request.password !==
        this.component.request.confirmPassword
      ) {
        this.message.showTranslatedWarningMessage('Password mismatch');
      } else {
        this.checkMailExists();
      }
    }
  }

  private sendVerificationCode() {
    const req = {
      email: this.component.request.email,
    };
    this.verificationService.SendVerification(req).subscribe((resp) => {});
  }

  private checkMailExists() {
    this.accountsService
      .Exists(this.component.request.email)
      .subscribe((resp) => {
        if (resp.data.exists) {
          this.message.showTranslatedWarningMessage('Email already exists');
          this.component.firstStepPassed = false;
        } else {
          this.component.firstStepPassed = true;
          this.component.toggleExpander(1);
          this.sendVerificationCode();
        }
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
      this.component.secondStepPassed = true;
      this.component.toggleExpander(2);
    } else {
      this.component.dateInvalid = true;
      this.component.secondStepPassed = false;
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

  validateThirdStep() {
    if (this.component.request.qualifications.length > 0) {
      let result = true;
      this.component.request.qualifications.forEach((qualification) => {
        if (!qualification.title || !qualification.file.fileUrl) {
          result = false;
        }
      });
      if (result) {
        this.component.thirdStepPassed = true;
        this.component.toggleExpander(3);
      } else {
        this.component.thirdStepPassed = false;
        this.message.showTranslatedWarningMessage('Fill all fields');
      }
    } else {
      this.component.thirdStepPassed = true;
      this.component.toggleExpander(3);
    }
  }

  signup() {
    this.component.mainLoading = true;
    this.component.request.phoneNumber =
      this.component.request.phoneNumber.toString();
    this.service.SignUp(this.component.request).subscribe((resp: any) => {
      if (resp.succeeded) {
        this.signIn();
      }
    });
  }

  private signIn() {
    const req: AuthRequestModel = {
      userName: this.component.request.email,
      password: this.component.request.password,
      remember: false,
    };
    this.authApiService.SignIn(req).subscribe((resp: any) => {
      if (!resp.succeeded) {
        this.message.showTranslatedErrorMessage(
          'The username or password is incorrect!',
        );
      } else {
        this.authService.setToStorage(resp.data, req);
        this.authService.navigateByRole(resp.data).then();
      }
    });
  }
}
