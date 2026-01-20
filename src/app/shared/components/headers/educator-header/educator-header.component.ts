import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { EducatorNavigationBarComponent } from '../../navigation-bars/educator-navigation-bar/educator-navigation-bar.component';

@Component({
  selector: 'app-educator-header',
  imports: [HeaderComponent],
  template: `
    <app-header
      [personalInfoURL]="'/main/educator/personal-info'"
      [links]="links"
    ></app-header>
  `,
  styles: ``,
})
export class EducatorHeaderComponent extends EducatorNavigationBarComponent {}
