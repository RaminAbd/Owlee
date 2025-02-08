import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { StudentNavigationBarComponent } from '../../navigation-bars/student-navigation-bar/student-navigation-bar.component';

@Component({
  selector: 'app-student-header',
  imports: [HeaderComponent],
  template: `<app-header
    [personalInfoURL]="'/main/student/personal-info'"
    [links]="links"
  ></app-header>`,
  styles: ``,
})
export class StudentHeaderComponent extends StudentNavigationBarComponent {}
