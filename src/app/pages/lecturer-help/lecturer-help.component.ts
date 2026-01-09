import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-lecturer-help',
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    RouterOutlet
  ],
  templateUrl: './lecturer-help.component.html',
  styleUrl: './lecturer-help.component.scss'
})
export class LecturerHelpComponent {

}
