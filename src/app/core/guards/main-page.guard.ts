import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {AuthResponseModel} from '../../auth/shared/models/auth-response.model';
import {StorageService} from '../services/storage.service';
@Injectable({
  providedIn: 'root',
})
export class MainPageGuard  {
  constructor(
    private router: Router,
    private storage: StorageService,
  ) {}
  canActivate(): any {
    let result: boolean = false;
    let SignInResult = this.storage.getObject('authResponse') as AuthResponseModel;
    if (!SignInResult) {
      this.router.navigate(['/auth']).then();
      result = false;
    } else {
      let token = SignInResult.accessToken;
      if (!token) {
        this.router.navigate(['/auth']).then();
        result = false;
      } else {
        result = true;
        return result;
      }
      return result;
    }

    return result;
  }
}
