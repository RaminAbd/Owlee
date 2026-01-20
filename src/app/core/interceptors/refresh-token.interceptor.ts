import { Injectable } from '@angular/core';
import {
  throwError as observableThrowError,
  Observable,
  catchError,
} from 'rxjs';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../../auth/sign-in/auth.service';
import { AuthApiService } from '../../auth/shared/services/auth.api.service';
import { AuthRequestModel } from '../../auth/shared/models/auth-request.model';
import { StudentsApiService } from '../../pages/students/shared/services/students.api.service';
import { EducatorsApiService } from '../../pages/educators/shared/services/educators.api.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  constructor(
    private storage: StorageService,
    private router: Router,
    private studentsService: StudentsApiService,
    private educatorsService: EducatorsApiService,
    private signInService: AuthService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === 401) {
          var req: AuthRequestModel = this.storage.getObject(
            'authRequest',
          ) as AuthRequestModel;
          if (req && req.remember) {
            if (req.selectedTab === 1) {
              this.SignInAsStudent(req);
            } else {
              this.SignInAsLecturer(req);
            }
          } else {
            this.navigateToSignIn().then(() => {});
          }
        }
        if (errorResponse.status === 403) {
          this.navigateToSignIn().then(() => {});
        }
        return observableThrowError(errorResponse);
      }),
    );
  }

  SignInAsStudent(req: AuthRequestModel) {
    this.studentsService.SignIn(req).subscribe((resp: any) => {
      if (resp.succeeded) {
        this.signInService.setToStorage(resp.data, req);
        this.signInService.navigateByRole(resp.data);
      }
    });
  }

  SignInAsLecturer(req: AuthRequestModel) {
    this.educatorsService.SignIn(req).subscribe((resp: any) => {
      if (resp.succeeded) {
        this.signInService.setToStorage(resp.data, req);
        this.signInService.navigateByRole(resp.data);
      }
    });
  }

  async navigateToSignIn() {
    await this.router.navigate(['/auth']).then();
  }
}
