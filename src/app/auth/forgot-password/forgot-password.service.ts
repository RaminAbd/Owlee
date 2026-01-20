import { inject, Injectable } from '@angular/core';
import { ForgotPasswordComponent } from './forgot-password.component';
import { EducatorsApiService } from '../../pages/educators/shared/services/educators.api.service';
import { AccountsApiService } from '../shared/services/accounts.api.service';
import { ApplicationMessageCenterService } from '../../core/services/ApplicationMessageCenter.service';
import { VerificationApiService } from '../shared/services/verification.api.service';
import { AuthService } from '../sign-in/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { StudentsApiService } from '../../pages/students/shared/services/students.api.service';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
  public service: EducatorsApiService | StudentsApiService;
  public educatorsService: EducatorsApiService = inject(EducatorsApiService);
  public studentsService: StudentsApiService = inject(StudentsApiService);
  public message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  private verificationService: VerificationApiService = inject(
    VerificationApiService,
  );
  private authService: AuthService = inject(AuthService);
  public translate = inject(TranslateService);
  component: ForgotPasswordComponent;
  constructor() {}

  checkMail() {
    this.service
      .Exists(this.component.request.email)
      .subscribe((resp) => {
        if (!resp.data.exists) {
          this.message.showTranslatedWarningMessage('Email does not exist');
        } else {
          this.sendVerificationCode();
        }
      });
  }

  private sendVerificationCode() {
    const req = {
      email: this.component.request.email,
    };
    this.verificationService.SendVerification(req).subscribe((resp) => {
      this.message.showTranslatedSuccessMessage('Verification code sent');
    });
  }

  forgotPassword() {
    const req = {
      username: this.component.request.email,
      newPassword: this.component.request.password,
      verificationCode: this.component.request.verificationCode,
    };
    this.service.ForgotPassword(req).subscribe((resp) => {
      if (resp.succeeded) {
        this.signIn();
      } else {
        this.component.loading = false;
      }
    });
    console.log(req);
  }

  private signIn() {
    const req: any = {
      userName: this.component.request.email,
      password: this.component.request.password,
      remember: false,
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
