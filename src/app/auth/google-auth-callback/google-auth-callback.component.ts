import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ApplicationMessageCenterService } from '../../core/services/ApplicationMessageCenter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { AuthService } from '../sign-in/auth.service';

@Component({
  selector: 'app-google-auth-callback',
  standalone: true,
  imports: [NgIf],
  templateUrl: './google-auth-callback.component.html',
  styleUrl: './google-auth-callback.component.scss',
})
export class GoogleAuthCallbackComponent implements OnInit {
  private signInService: AuthService = inject(AuthService);
  private message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  loading: boolean = true;
  role: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  ngOnInit(): void {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.slice(1));
    const token = params.get('id_token');
    this.role = params.get('state');
    if (token) {
      console.log('Google Access Token:', token);
      this.handleCredentialResponse(token);
    } else {
      console.error('Google login failed or cancelled');
      this.message.showTranslatedErrorMessage(
        'Google login failed or cancelled',
      );
      this.router.navigate(['/sign-in']);
    }
  }

  handleCredentialResponse(token: any) {
    if (token) {
      const req = {
        idToken: token,
      };
      this.role === 'student'
        ? this.signInService.continueAsStudent(req)
        : this.signInService.continueAsEducator(req);
    } else {
      this.message.showTranslatedWarningMessage('Something went wrong!');
    }
  }

  private animationItem: AnimationItem | undefined;

  options: AnimationOptions = {
    path: 'lottie.json',
    loop: true,
    autoplay: false,
  };

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
    if (this.animationItem) {
      this.animationItem.play();
    }
  }
}
