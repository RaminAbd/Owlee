import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-student-help',
    imports: [
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
        TranslatePipe
    ],
  templateUrl: './student-help.component.html',
  styleUrl: './student-help.component.scss'
})
export class StudentHelpComponent {

}
