import { Component } from '@angular/core';
import {HeaderComponent} from '../../header/header.component';

@Component({
  selector: 'app-admin-header',
  imports: [
    HeaderComponent
  ],
  template: `
    <app-header></app-header>
  `,
  styles: ``
})
export class AdminHeaderComponent {

}
