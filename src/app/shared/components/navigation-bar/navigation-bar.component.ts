import {Component, Input} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../../auth/sign-in/auth.service';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-navigation-bar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, NgForOf],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',
})
export class NavigationBarComponent {
  @Input() links: any[] = [];
  constructor(
    private sanitizer: DomSanitizer,
    private signInService: AuthService,
    private router: Router,
  ) {}

  sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  logout() {
    this.signInService.logout();
    this.router.navigate(['/']);
  }
}
