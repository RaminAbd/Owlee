import {Injectable} from '@angular/core';
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
import {Router} from '@angular/router';
import {StorageService} from '../services/storage.service';
import {AuthService} from '../../auth/auth.service';
import {AuthApiService} from '../../auth/shared/services/auth.api.service';
import {AuthRequestModel} from '../../auth/shared/models/auth-request.model';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  constructor(
    private storage: StorageService,
    private router: Router,
    private apiService: AuthApiService,
    private signInService: AuthService,
  ) {
  }

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
            this.signInService.SignIn(req);
          } else {
            this.navigateToSignIn().then(() => {
            });
          }
        }
        if (errorResponse.status === 403) {
          this.navigateToSignIn().then(() => {
          });
        }
        return observableThrowError(errorResponse);
      }),
    );
  }

  async navigateToSignIn() {
    await this.router.navigate(['/auth']).then();
  }
}
