import { Component } from '@angular/core';
import { NavigationBarComponent } from '../../navigation-bar/navigation-bar.component';

@Component({
  selector: 'app-educator-navigation-bar',
  imports: [NavigationBarComponent],
  template: ` <app-navigation-bar [links]="links"></app-navigation-bar> `,
  styles: ``,
})
export class EducatorNavigationBarComponent {
  links: any[] = [
    {
      name: 'Dashboard',
      url: 'educator/dashboard',
      icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.83333 5.5V0.5H15.5V5.5H8.83333ZM0.5 8.83333V0.5H7.16667V8.83333H0.5ZM8.83333 15.5V7.16667H15.5V15.5H8.83333ZM0.5 15.5V10.5H7.16667V15.5H0.5Z" fill="#656668"/>
</svg>

`,
      activeIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.83333 5.5V0.5H15.5V5.5H8.83333ZM0.5 8.83333V0.5H7.16667V8.83333H0.5ZM8.83333 15.5V7.16667H15.5V15.5H8.83333ZM0.5 15.5V10.5H7.16667V15.5H0.5Z" fill="white"/>
</svg>

`,
    },
  ];
}
