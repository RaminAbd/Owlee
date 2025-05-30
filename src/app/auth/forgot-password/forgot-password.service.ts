import {inject, Injectable} from '@angular/core';
import {ForgotPasswordComponent} from './forgot-password.component';
import {EducatorsApiService} from '../../pages/educators/shared/services/educators.api.service';
import {AccountsApiService} from '../shared/services/accounts.api.service';
import {LanguageService} from '../../core/services/language.service';
import {BlobService} from '../../core/services/blob.service';
import {KnownLanguagesApiService} from '../../pages/known-languages/shared/services/known-languages.api.service';
import {ApplicationMessageCenterService} from '../../core/services/ApplicationMessageCenter.service';
import {VerificationApiService} from '../shared/services/verification.api.service';
import {AuthApiService} from '../shared/services/auth.api.service';
import {AuthService} from '../sign-in/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {AuthRequestModel} from '../shared/models/auth-request.model';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
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
  component:ForgotPasswordComponent;
  constructor() { }

  checkMail() {
    this.accountsService
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
      verificationCode:this.component.request.verificationCode,
    }
    this.authApiService.ForgotPassword(req).subscribe((resp) => {
      if(resp.succeeded){
        this.signIn();
      }
      else{
        this.component.loading = false
      }
    })
    console.log(req)
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
