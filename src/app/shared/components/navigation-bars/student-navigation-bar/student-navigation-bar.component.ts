import { Component } from '@angular/core';
import {NavigationBarComponent} from '../../navigation-bar/navigation-bar.component';

@Component({
  selector: 'app-student-navigation-bar',
  imports: [NavigationBarComponent],
  template: ` <app-navigation-bar [links]="links"></app-navigation-bar> `,
  styles: ``,
})
export class StudentNavigationBarComponent {
  links: any[] = [
    {
      name: 'Dashboard',
      url: 'student/dashboard',
      icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.83333 5.5V0.5H15.5V5.5H8.83333ZM0.5 8.83333V0.5H7.16667V8.83333H0.5ZM8.83333 15.5V7.16667H15.5V15.5H8.83333ZM0.5 15.5V10.5H7.16667V15.5H0.5Z" fill="#656668"/>
</svg>

`,
      activeIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.83333 5.5V0.5H15.5V5.5H8.83333ZM0.5 8.83333V0.5H7.16667V8.83333H0.5ZM8.83333 15.5V7.16667H15.5V15.5H8.83333ZM0.5 15.5V10.5H7.16667V15.5H0.5Z" fill="white"/>
</svg>

`,
    },
    {
      name: 'Calendar',
      url: 'student/calendar',
      icon: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.666992 14.8333C0.666992 16.25 1.75033 17.3333 3.16699 17.3333H14.8337C16.2503 17.3333 17.3337 16.25 17.3337 14.8333V8.16662H0.666992V14.8333ZM14.8337 2.33329H13.167V1.49996C13.167 0.999959 12.8337 0.666626 12.3337 0.666626C11.8337 0.666626 11.5003 0.999959 11.5003 1.49996V2.33329H6.50032V1.49996C6.50032 0.999959 6.16699 0.666626 5.66699 0.666626C5.16699 0.666626 4.83366 0.999959 4.83366 1.49996V2.33329H3.16699C1.75033 2.33329 0.666992 3.41663 0.666992 4.83329V6.49996H17.3337V4.83329C17.3337 3.41663 16.2503 2.33329 14.8337 2.33329Z" fill="#656668"/>
</svg>


`,
      activeIcon: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.666992 14.8333C0.666992 16.25 1.75033 17.3333 3.16699 17.3333H14.8337C16.2503 17.3333 17.3337 16.25 17.3337 14.8333V8.16662H0.666992V14.8333ZM14.8337 2.33329H13.167V1.49996C13.167 0.999959 12.8337 0.666626 12.3337 0.666626C11.8337 0.666626 11.5003 0.999959 11.5003 1.49996V2.33329H6.50032V1.49996C6.50032 0.999959 6.16699 0.666626 5.66699 0.666626C5.16699 0.666626 4.83366 0.999959 4.83366 1.49996V2.33329H3.16699C1.75033 2.33329 0.666992 3.41663 0.666992 4.83329V6.49996H17.3337V4.83329C17.3337 3.41663 16.2503 2.33329 14.8337 2.33329Z" fill="white"/>
</svg>

`,
    },
  ];
}
