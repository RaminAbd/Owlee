import { Component } from '@angular/core';
import {HeaderComponent} from '../../header/header.component';

@Component({
  selector: 'app-student-header',
  imports: [
    HeaderComponent
  ],
  template: `<app-header [personalInfoURL]="'/main/student/personal-info'"></app-header>`,
  styles: ``,
})
export class StudentHeaderComponent {}
