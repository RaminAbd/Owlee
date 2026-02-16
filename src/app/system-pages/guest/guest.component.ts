import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HomeHeaderComponent} from '../../pages/home/shared/components/home-header/home-header.component';
import {HomeFooterComponent} from '../../pages/home/shared/components/home-footer/home-footer.component';

@Component({
  selector: 'app-guest',
  imports: [
    RouterOutlet,
    HomeHeaderComponent,
    HomeFooterComponent
  ],
  templateUrl: './guest.component.html',
  styleUrl: './guest.component.scss'
})
export class GuestComponent {

}
