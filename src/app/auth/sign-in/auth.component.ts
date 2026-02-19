import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { AuthRequestModel } from '../shared/models/auth-request.model';
import { NgClass, NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../core/environments/environment';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, NgIf, TranslatePipe, RouterLink, NgClass],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  selectedTab: number = 1;
  isSubmitted: boolean = false;
  passVisible: boolean = false;
  requestSent: boolean = false;
  signinLoading: boolean = false;
  private fb: FormBuilder = inject(FormBuilder);
  private service: AuthService = inject(AuthService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  id: string = this.route.snapshot.paramMap.get('id') as string;
  constructor() {
    this.service.component = this;
    this.service.checkRememberMe();
  }

  requestForm = this.fb.group({
    userName: ['', Validators.required],
    password: ['', Validators.required],
    remember: [false],
  });

  validateField(field: string) {
    return (
      this.requestForm.get(field)?.invalid &&
      (this.requestForm.get(field)?.dirty ||
        this.requestForm.get(field)?.touched ||
        this.isSubmitted)
    );
  }

  signInGoogle() {
    const role = this.selectedTab === 1 ? 'student' : 'educator';
    const clientId =
      '572911678890-0s7ks10um64d2e6heb7e2ibra51r2i2j.apps.googleusercontent.com';
    const redirectUri = environment.webUrl + 'auth/callback';
    const scope = 'openid email profile';
    const nonce = crypto.randomUUID(); // or Math.random().toString(36).substring(2)
    const statePayload = {
      role,
      courseId: this.id ?? null
    };
    const authUrl =
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token id_token` +
      `&scope=${encodeURIComponent(scope)}` +
      `&nonce=${nonce}` +
      `&include_granted_scopes=true` +
      `&state=${encodeURIComponent(JSON.stringify(statePayload))}`;
    window.location.href = authUrl;
  }

  Action() {
    this.isSubmitted = true;
    if (this.requestForm.valid) {
      var req: AuthRequestModel = this.requestForm.value as AuthRequestModel;
      req.selectedTab = this.selectedTab;
      if (this.selectedTab === 1) {
        this.service.SignInAsStudent(req);
      } else {
        this.service.SignInAsLecturer(req);
      }
    }
  }
}
