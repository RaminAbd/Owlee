import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from './auth.service';
import {AuthRequestModel} from '../shared/models/auth-request.model';
import {NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [
    ReactiveFormsModule,
    NgIf,
    TranslatePipe,
    RouterLink,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  isSubmitted: boolean = false;
  passVisible: boolean = false;
  requestSent: boolean = false;
  signinLoading: boolean = false;
  private fb: FormBuilder = inject(FormBuilder)
  private service: AuthService = inject(AuthService);

  constructor() {
    this.service.component = this;
    this.service.checkRememberMe();
  }

  requestForm = this.fb.group({
    username: ['', Validators.required],
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
