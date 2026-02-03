import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-educator-plans',
  imports: [
    RouterLink,
    RouterOutlet,
    TranslatePipe,
    RouterLinkActive
  ],
  templateUrl: './educator-plans.component.html',
  styleUrl: './educator-plans.component.scss'
})
export class EducatorPlansComponent {

}
