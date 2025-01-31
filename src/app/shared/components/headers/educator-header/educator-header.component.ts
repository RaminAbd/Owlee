import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-educator-header',
  imports: [HeaderComponent],
  template: `
    <app-header [personalInfoURL]="'/main/educator/personal-info'"></app-header>
  `,
  styles: ``,
})
export class EducatorHeaderComponent {}
