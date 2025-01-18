import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';

import {Observable} from 'rxjs';
import {StorageService} from '../services/storage.service';
import {AuthResponseModel} from '../../auth/shared/models/auth-response.model';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  token: string;

  constructor(private storage: StorageService) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    var sResult = this.storage.getObject('authResponse') as AuthResponseModel;
    if (sResult) {
      this.token = sResult.accessToken;
      const req1 = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.token}`,
          Realm: 'Force',
        },
      });
      return next.handle(req1);
    } else {
      return next.handle(req);
    }
  }
}
