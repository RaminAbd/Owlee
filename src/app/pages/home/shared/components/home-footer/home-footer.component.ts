import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-home-footer',
    imports: [
        RouterLink,
        TranslatePipe
    ],
  templateUrl: './home-footer.component.html',
  styleUrl: './home-footer.component.scss'
})
export class HomeFooterComponent {

}
