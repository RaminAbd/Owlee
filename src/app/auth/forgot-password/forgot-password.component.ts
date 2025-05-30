import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { EducatorSignupRequestModel } from '../sign-up/shared/models/educator-signup-request.model';
import { ForgotPasswordService } from './forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, NgIf, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private service: ForgotPasswordService = inject(ForgotPasswordService);
  private fb: FormBuilder = inject(FormBuilder);
  firstStepForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]],
    code: ['', [Validators.required, Validators.pattern(/^.{4,}$/)]],
  });
  request: EducatorSignupRequestModel = new EducatorSignupRequestModel();
  firstStepSubmitted = false;
  loading = false;
  firstStepPassed: boolean = false;
  secondStepForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.pattern(/^.{6,}$/)]],
    confirmPassword: ['', [Validators.required, Validators.pattern(/^.{6,}$/)]],
  });
  secondStepSubmitted = false;
  passVisible: boolean = false;
  repeatVisible: boolean = false;

  constructor() {
    this.service.component = this;
  }
  sendCode() {
    if (!this.request.email) {
      this.service.message.showTranslatedWarningMessage('Mail is not valid');
    } else {
      this.service.checkMail();
    }
  }

  Action() {
    this.firstStepSubmitted = true;
    if (this.firstStepForm.valid) {
      this.firstStepPassed = true;
    } else {
      this.firstStepPassed = false;
      this.service.message.showTranslatedWarningMessage('Form is not valid');
    }
  }

  secondAction() {
    this.secondStepSubmitted = true;
    if (this.secondStepForm.valid) {
      if (
        this.request.password !==
        this.request.confirmPassword
      ) {
        this.service.message.showTranslatedWarningMessage('Password mismatch');
      } else {
        this.loading = true;
        this.service.forgotPassword()
      }
    }
    else {
      this.service.message.showTranslatedWarningMessage('Form is not valid');
    }
  }
}
