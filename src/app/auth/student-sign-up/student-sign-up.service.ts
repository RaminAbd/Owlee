import { inject, Injectable } from '@angular/core';
import { KnownLanguagesApiService } from '../../pages/known-languages/shared/services/known-languages.api.service';
import { ApplicationMessageCenterService } from '../../core/services/ApplicationMessageCenter.service';
import { AuthApiService } from '../shared/services/auth.api.service';
import { AuthService } from '../sign-in/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthRequestModel } from '../shared/models/auth-request.model';
import { StudentSignUpComponent } from './student-sign-up.component';
import { StudentsApiService } from '../../pages/students/shared/services/students.api.service';
import { GroupMembersApiService } from '../../pages/dashboard/shared/services/group-members.api.service';

@Injectable({
  providedIn: 'root',
})
export class StudentSignUpService {
  component: StudentSignUpComponent;
  private service: StudentsApiService = inject(StudentsApiService);
  private knownLangService = inject(KnownLanguagesApiService);
  public message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );

  private groupMembersService: GroupMembersApiService = inject(
    GroupMembersApiService,
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

  getGroupMember() {
    this.groupMembersService
      .GetById(
        this.groupMembersService.serviceUrl,
        this.component.groupMemberId,
      )
      .subscribe((resp) => {
        this.component.request.userName = resp.data.email;
        this.component.request.groupMemberId = resp.data.id;
      });
  }

  validateFirstStep() {
    if (
      !this.component.request.firstName ||
      !this.component.request.lastName ||
      !this.component.request.phoneNumber ||
      !this.component.request.userName ||
      !this.component.request.password ||
      !this.component.request.location ||
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
        this.signup();
      }
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
      userName: this.component.request.userName,
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
