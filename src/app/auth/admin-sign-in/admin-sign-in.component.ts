import {Component, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../sign-in/auth.service';
import {AuthRequestModel} from '../shared/models/auth-request.model';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {AdminSignInService} from './admin-sign-in.service';

@Component({
  selector: 'app-admin-sign-in',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './admin-sign-in.component.html',
  styleUrl: './admin-sign-in.component.scss'
})
export class AdminSignInComponent {
  isSubmitted: boolean = false;
  passVisible: boolean = false;
  requestSent: boolean = false;
  signinLoading: boolean = false;
  private fb: FormBuilder = inject(FormBuilder)
  private service: AdminSignInService = inject(AdminSignInService);

  constructor() {
    this.service.component = this;
    this.service.checkRememberMe();
  }

  requestForm = this.fb.group({
    userName: ['', Validators.required],
    password: ['', Validators.required],
    remember: [false]
  });

  validateField(field: string) {
    return (
      this.requestForm.get(field)?.invalid &&
      (this.requestForm.get(field)?.dirty ||
        this.requestForm.get(field)?.touched ||
        this.isSubmitted)
    );
  }

  Action() {
    this.isSubmitted = true;
    if (this.requestForm.valid) {
      var req: AuthRequestModel = this.requestForm.value as AuthRequestModel;
      this.service.SignIn(req);
    }
  }
}
