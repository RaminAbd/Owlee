import { Injectable } from '@angular/core';
import { AuthComponent } from './auth.component';
import { AuthApiService } from '../shared/services/auth.api.service';
import { ApplicationMessageCenterService } from '../../core/services/ApplicationMessageCenter.service';
import { StorageService } from '../../core/services/storage.service';
import { Router } from '@angular/router';
import { CryptoService } from '../shared/services/crypto.service';
import { AuthRequestModel } from '../shared/models/auth-request.model';
import { AuthResponseModel } from '../shared/models/auth-response.model';
import { RoleNameByCode } from '../../core/role-handlers/RoleNameByCode';
import { StudentsApiService } from '../../pages/students/shared/services/students.api.service';
import { EducatorsApiService } from '../../pages/educators/shared/services/educators.api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  component: AuthComponent;
  constructor(
    private studentsService: StudentsApiService,
    private educatorsService: EducatorsApiService,
    private appMessageService: ApplicationMessageCenterService,
    private storage: StorageService,
    private router: Router,
    private cryptoService: CryptoService,
  ) {}

  checkRememberMe() {
    var authReq = this.storage.getObject('authRequest');
    if (authReq) {
      if (!authReq.remember) {
        this.clearStorage();
      }
    }
  }

  clearStorage() {
    this.storage.removeObject('role');
    this.storage.removeObject('authResponse');
    this.storage.removeObject('authRequest');
    this.storage.removeObject('userInfo');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  }

  SignInAsStudent(req: AuthRequestModel) {
    this.component.signinLoading = true;
    this.component.requestSent = true;
    this.studentsService.SignIn(req).subscribe((resp: any) => {
      this.component.signinLoading = false;
      this.component.requestSent = false;
      if (!resp.succeeded) {
        this.appMessageService.showTranslatedErrorMessage(resp.error);
      } else {
        this.setToStorage(resp.data, req);
        if (this.component.id) {
          this.router.navigate(['/courses', this.component.id]);
        } else {
          this.navigateByRole(resp.data);
        }
      }
    });
  }

  SignInAsLecturer(req: AuthRequestModel) {
    this.component.signinLoading = true;
    this.component.requestSent = true;
    this.educatorsService.SignIn(req).subscribe((resp: any) => {
      this.component.signinLoading = false;
      this.component.requestSent = false;
      if (!resp.succeeded) {
        this.appMessageService.showTranslatedErrorMessage(resp.error);
      } else {
        this.setToStorage(resp.data, req);
        this.navigateByRole(resp.data);
      }
    });
  }

  setToStorage(resp: AuthResponseModel, req: AuthRequestModel) {
    this.storage.saveObject('authResponse', resp);
    this.storage.saveObject('authRequest', req);
    localStorage.setItem('userId', resp.id);
    this.storage.saveObject('role', this.cryptoService.encrypt(resp.role, 3));
  }

  async navigateByRole(resp: AuthResponseModel) {
    await this.router
      .navigateByUrl(
        'main/' + RoleNameByCode[resp.role as keyof typeof RoleNameByCode],
      )
      .then(() => {});
  }

  logout() {
    this.storage.removeObject('AuthRequest');
    this.storage.removeObject('AuthResult');
    this.storage.removeObject('authRequest');
    this.storage.removeObject('authResponse');
    this.storage.removeObject('role');
    this.storage.removeObject('token');
    this.clearStorage();
  }

  continueAsStudent(req: any) {
    this.studentsService.SignUpWithGoogle(req).subscribe((resp: any) => {
      if (!resp.succeeded) {
        this.appMessageService.showTranslatedErrorMessage(
          'The username or password is incorrect!',
        );
      } else {
        this.storage.saveObject('authResponse', resp.data);
        localStorage.setItem('userId', resp.data.id);
        this.storage.saveObject(
          'role',
          this.cryptoService.encrypt(resp.data.role, 3),
        );
        this.navigateByRole(resp.data);
      }
    });
  }

  continueAsEducator(req: any) {
    this.educatorsService.SignUpWithGoogle(req).subscribe((resp: any) => {
      if (!resp.succeeded) {
        this.appMessageService.showTranslatedErrorMessage(
          'The username or password is incorrect!',
        );
      } else {
        this.storage.saveObject('authResponse', resp.data);
        localStorage.setItem('userId', resp.data.id);
        this.storage.saveObject(
          'role',
          this.cryptoService.encrypt(resp.data.role, 3),
        );
        this.navigateByRole(resp.data);
      }
    });
  }
}
