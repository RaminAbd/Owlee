import { inject, Injectable } from '@angular/core';
import { StudentSignUpComponent } from '../student-sign-up/student-sign-up.component';
import { StudentsApiService } from '../../pages/students/shared/services/students.api.service';
import { KnownLanguagesApiService } from '../../pages/known-languages/shared/services/known-languages.api.service';
import { ApplicationMessageCenterService } from '../../core/services/ApplicationMessageCenter.service';
import { GroupMembersApiService } from '../../pages/dashboard/shared/services/group-members.api.service';
import { AuthApiService } from '../shared/services/auth.api.service';
import { AuthService } from '../sign-in/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { StudentSignUpNewComponent } from './student-sign-up-new.component';
import {VerificationApiService} from '../shared/services/verification.api.service';
import {LanguageService} from '../../core/services/language.service';

@Injectable({
  providedIn: 'root',
})
export class StudentSignUpNewService {
  component: StudentSignUpNewComponent;
  private service: StudentsApiService = inject(StudentsApiService);
  private knownLangService = inject(KnownLanguagesApiService);
  public message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );

  private groupMembersService: GroupMembersApiService = inject(
    GroupMembersApiService,
  );
  private langService: LanguageService = inject(LanguageService);
  private authApiService: AuthApiService = inject(AuthApiService);
  private authService: AuthService = inject(AuthService);
  public translate = inject(TranslateService);
  constructor() {}
  private verificationService: VerificationApiService = inject(
    VerificationApiService,
  );

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

  getGroupMember() {
    this.groupMembersService
      .GetById(
        this.groupMembersService.serviceUrl,
        this.component.groupMemberId,
      )
      .subscribe((resp) => {
        this.component.request.username = resp.data.email;
        this.component.request.groupMemberId = resp.data.id;
      });
  }

  validateFirstStep() {
    if (
      !this.component.request.firstName ||
      !this.component.request.lastName ||
      !this.component.request.phoneNumber ||
      !this.component.request.username ||
      !this.component.request.password ||
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

  private checkMailExists() {
    this.service
      .Exists(this.component.request.username)
      .subscribe((resp) => {
        if (resp.data.exists) {
          this.message.showTranslatedWarningMessage('Email already exists');
          this.component.firstStepPassed = false;
        } else {
          this.component.firstStepPassed = true;
          this.component.toggleExpander(1);
        }
      });
  }

  checkMail() {
    this.service
      .Exists(this.component.request.username)
      .subscribe((resp) => {
        if (resp.data.exists) {
          this.message.showTranslatedWarningMessage('Email already exists');
        } else {
          this.sendVerificationCode();
        }
      });
  }

  private sendVerificationCode() {
    const req = {
      email: this.component.request.username,
    };
    this.verificationService.SendVerification(req).subscribe((resp) => {
      this.message.showTranslatedSuccessMessage('Verification code sent');
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


  signup() {
    this.component.mainLoading = true;
    this.component.request.phoneNumber =
      this.component.request.phoneNumber.toString();

    console.log(this.component.request);
    this.service.SignUp(this.component.request).subscribe(
      (resp: any) => {
        this.component.mainLoading = false;
        if (resp.succeeded) {
          this.signIn();
        } else {
          this.component.mainLoading = false;
        }
      },
      (error) => (this.component.mainLoading = false),
    );
  }

  private signIn() {
    const req: any = {
      username: this.component.request.username,
      password: this.component.request.password,
      remember: true,
    };
    this.service.SignIn(req).subscribe((resp: any) => {
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
