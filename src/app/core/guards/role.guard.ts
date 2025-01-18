import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import {StorageService} from '../services/storage.service';
import {CryptoService} from '../../auth/shared/services/crypto.service';
import {AuthResponseModel} from '../../auth/shared/models/auth-response.model';
@Injectable({
  providedIn: 'root'
})
export class RoleGuard  {
  constructor(
    private router: Router,
    private storage: StorageService,
    private cryptoService:CryptoService
    ) { }
  canActivate(
    route: ActivatedRouteSnapshot): any {
    let result: boolean = false;
    let SignInResult = this.storage.getObject('authResponse') as AuthResponseModel;
    let token = SignInResult.accessToken;
    let userRole = SignInResult.role;
    let encryptedRole = this.storage.getObject('role') as string;
    let allowedPermission = route.data['permissionTypes'] as string;

    if (!token || !encryptedRole) {
      this.navigateToHome()
      result = false;
    }
    else {
      if(this.cryptoService.encrypt(userRole, 3) !== encryptedRole){
        this.navigateToHome()
        result = false;
      }
      else if(userRole !== allowedPermission) {
        this.navigateToHome()
        result = false;
      }
      else{
        result = true
      }
      return result;
    }
    return result;
  }
  navigateToHome(){
    this.router.navigate(['/auth']);
  }
}
