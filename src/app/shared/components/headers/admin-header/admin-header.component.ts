import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { AdminNavigationBarComponent } from '../../navigation-bars/admin-navigation-bar/admin-navigation-bar.component';

@Component({
  selector: 'app-admin-header',
  imports: [HeaderComponent],
  template: ` <app-header [links]="links" [showNotifications]="false"></app-header> `,
  styles: ``,
})
export class AdminHeaderComponent extends AdminNavigationBarComponent {}
