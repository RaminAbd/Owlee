import { inject, Injectable } from '@angular/core';
import { SignUpComponent } from './sign-up.component';
import { ApplicationMessageCenterService } from '../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  component: SignUpComponent;
  public message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  constructor() {}

  validateFirstStep() {
    if (
      !this.component.request.firstName ||
      !this.component.request.lastName ||
      !this.component.request.phoneNumber ||
      !this.component.request.email ||
      !this.component.request.password ||
      !this.component.request.confirmPassword
    ) {
      this.message.showTranslatedWarningMessage('Fill all fields');
    }
    else{
      this.component.firstStepPassed = true;
      this.component.toggleExpander(1)
    }
  }
}
